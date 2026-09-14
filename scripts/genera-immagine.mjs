// Image generator — SoftAir Milano
// Generates hero/section imagery via the Gemini image API, applying the
// project's "house style" automatically so callers pass only the scene.
//
// Requires: GOOGLE_AI_STUDIO_SOFTAIRMILANO_PROJECT in .env (the AIza… API key;
// billing must be enabled on the Google project — image models are not free-tier).
//
// Usage:
//   node scripts/genera-immagine.mjs --name hero-mira --ratio 16:9 --scene "A lone airsoft player ..."
//   node scripts/genera-immagine.mjs --name hero-mira --ratio 16:9           (uses a stored SCENE by name)
//   node scripts/genera-immagine.mjs --name hero-mira-mobile --ratio 9:16 --from public/uploads/hero-mira.jpeg
//   flags: --draft (cheaper model), --model <id>, --out <dir>

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, extname } from 'node:path';

const PROJECT = resolve(import.meta.dirname, '..');

// --- House style: appended to every text-to-image scene ---------------------
const LOOK =
  'Look: shot on 35mm film with an anamorphic lens, ARRI Alexa cinematography, naturalistic ' +
  'motivated lighting with soft falloff, muted desaturated filmic color grade, gentle teal shadows, ' +
  'filmic highlight rolloff, subtle halation, visible 35mm film grain, realistic textures — scuffed ' +
  'gear, worn fabric, sweat, dust, small imperfections. Grounded, gritty, realistic tactical war-film ' +
  'cinematography. Shallow depth of field.';
const AVOID =
  'Absolutely avoid: CGI, 3D render, video-game look, Unreal Engine, digital art, illustration, glossy ' +
  'plastic surfaces, over-saturation, HDR bloom, cartoon. No text, logos, watermarks, readable faces, ' +
  'or distorted hands.';
const OPENER =
  'Photographic film still from a modern tactical action movie — a real photograph, not a render, not a game.';

// --- Reusable scenes (the site is dark-tactical; amber is the only accent) ---
const SCENES = {
  'hero-mira':
    'A lone airsoft player in worn tactical gear and a protective full-face mask, three-quarter rear angle, ' +
    'near-silhouette, shouldering his replica rifle and aiming down the red-dot sight, cheek to the stock, ' +
    'advancing toward a shaft of warm amber light (#f5a524) breaking through thick haze inside a large indoor ' +
    'military-village CQB arena — raw concrete, scuffed plywood barricades, dust in the air. Subject roughly centered.',
  'hero-breach':
    'Two airsoft players in worn tactical gear and protective full-face masks breaching a doorway inside a large ' +
    'indoor military-village CQB arena — one crouched low covering the angle, the other standing and aiming his ' +
    'replica rifle. Thick warm amber light (#f5a524) and haze pour through the doorway behind them with realistic ' +
    'volumetric god-rays; raw concrete, scuffed plywood barricades, dust kicked up. Centered composition, subjects framed by darkness.',
  'hero-run':
    'A lone airsoft player in worn tactical gear and a protective full-face mask sprinting across an indoor ' +
    'military-village CQB arena, replica rifle gripped in both hands, caught mid-stride with natural motion blur on ' +
    'legs and arms, dust kicking up underfoot. A shaft of warm amber light (#f5a524) rakes across the scene through ' +
    'thick haze; raw concrete corridor, plywood barricades, industrial columns. Dynamic slightly low camera angle, subject roughly centered.',
  'hero-prone':
    'Extreme low-angle frontal close-up of a lone airsoft player lying prone on the floor of an indoor military-village ' +
    'CQB arena, behind his replica rifle, aiming down the optical red-dot sight — the camera is low and directly in front ' +
    'of him, the rifle barrel and optic foreshortened toward the lens, one focused eye visible behind the protective mask. ' +
    'Warm amber light (#f5a524) rakes low across the concrete floor through thick haze, catching floating dust. Very shallow ' +
    'depth of field, eye and optic in sharp focus, background falling into soft darkness.',
};

// --- Args -------------------------------------------------------------------
const args = {};
const argv = process.argv.slice(2);
for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  if (a === '--draft') args.draft = true;
  else if (a.startsWith('--')) args[a.slice(2)] = argv[++i];
}
if (!args.name) { console.error('Manca --name'); process.exit(1); }
const ratio = args.ratio || '16:9';
const outDir = args.out || 'public/uploads';
const model = args.model || (args.draft ? 'gemini-2.5-flash-image' : 'gemini-3-pro-image');

// --- Key (never printed) ----------------------------------------------------
const envLine = readFileSync(`${PROJECT}/.env`, 'utf8')
  .split('\n')
  .find((l) => l.startsWith('GOOGLE_AI_STUDIO_SOFTAIRMILANO_PROJECT='));
if (!envLine) { console.error('API key non trovata in .env'); process.exit(1); }
const key = envLine.slice(envLine.indexOf('=') + 1).trim().replace(/^["']|["']$/g, '');

// --- Build request ----------------------------------------------------------
const parts = [];
if (args.from) {
  // Image-to-image reframe (e.g. desktop 16:9 -> mobile 9:16), same shot.
  const src = readFileSync(resolve(PROJECT, args.from));
  const mime = extname(args.from).toLowerCase() === '.png' ? 'image/png' : 'image/jpeg';
  parts.push({ inlineData: { mimeType: mime, data: src.toString('base64') } });
  parts.push({
    text:
      `Create a vertical ${ratio} CLOSE-UP crop of this exact photograph, focused tightly on the airsoft player ` +
      `in the FOREGROUND — the upper body, head, protective mask and raised replica rifle fill the frame. Keep the ` +
      `SAME subject, gear, lighting, colors and film look as the source. The arena/background must stay minimal and ` +
      `softly out of focus with shallow depth of field — do NOT reveal the whole environment (no wide view of ceiling, ` +
      `floor or full room, which looks unreal). Fill the vertical frame with the player. A slightly darker area at the ` +
      `very bottom is fine (text will sit there). Do not distort or stretch the subject. ${AVOID}`,
  });
} else {
  const scene = args.scene || SCENES[args.name];
  if (!scene) { console.error(`Nessuna --scene passata e nessuna scena salvata per "${args.name}"`); process.exit(1); }
  parts.push({ text: `${OPENER} ${scene} ${LOOK} ${AVOID}` });
}

const body = {
  contents: [{ parts }],
  generationConfig: { responseModalities: ['IMAGE'], imageConfig: { aspectRatio: ratio } },
};

const t0 = Date.now();
const res = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(key)}`,
  { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }
);
const secs = ((Date.now() - t0) / 1000).toFixed(1);
if (!res.ok) {
  console.error(`❌ HTTP ${res.status} — ${(await res.text()).replaceAll(key, '***').slice(0, 300)}`);
  process.exit(1);
}
const data = await res.json();
const img = (data?.candidates?.[0]?.content?.parts || []).find((p) => p.inlineData?.data);
if (!img) { console.error('❌ Nessuna immagine nella risposta'); process.exit(1); }
const ext = (img.inlineData.mimeType || 'image/jpeg').split('/')[1];
const buf = Buffer.from(img.inlineData.data, 'base64');
const out = `${outDir}/${args.name}.${ext}`;
writeFileSync(resolve(PROJECT, out), buf);
console.log(`✅ ${args.name} — ${model} — ${ratio} — ${secs}s — ${(buf.length / 1024).toFixed(0)} KB — ${out}`);
