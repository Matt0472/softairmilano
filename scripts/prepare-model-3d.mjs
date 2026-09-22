// Prepares a glTF prop for the 3D "unboxing" section (src/components/organisms/Unboxing3D.astro):
//   1. dedup + prune (node hierarchy and names are PRESERVED: the component animates named parts
//      such as the case lid, the magazine and the bolt)
//   2. optional mesh simplification (meshoptimizer) for heavy scans
//   3. textures → WebP ≤ 1024px
//   4. meshopt compression → single .glb
// Usage: node scripts/prepare-model-3d.mjs <input.gltf|glb> <output.glb> [--simplify <ratio>] [--error <e>]
//   --simplify 0.5  target ~50% of the triangles; --error 0.0002 (default 0.001) bounds the
//   geometric deviation: tighter keeps large flat panels clean at the cost of fewer savings
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { dedup, prune, weld, simplify, textureCompress, meshopt } from '@gltf-transform/functions';
import { MeshoptEncoder, MeshoptSimplifier } from 'meshoptimizer';
import sharp from 'sharp';

const [, , input, output, ...flags] = process.argv;
if (!input || !output) { console.error('Usage: node scripts/prepare-model-3d.mjs <input> <output.glb> [--simplify <ratio>] [--error <e>]'); process.exit(1); }
const si = flags.indexOf('--simplify');
const ratio = si >= 0 ? Number(flags[si + 1]) : null;
const ei = flags.indexOf('--error');
const error = ei >= 0 ? Number(flags[ei + 1]) : 0.001;

const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.encoder': MeshoptEncoder });
const doc = await io.read(input);
const steps = [dedup(), prune()];
if (ratio) steps.push(weld(), simplify({ simplifier: MeshoptSimplifier, ratio, error }));
steps.push(textureCompress({ encoder: sharp, targetFormat: 'webp', resize: [1024, 1024] }), meshopt({ encoder: MeshoptEncoder, level: 'medium' }));
await doc.transform(...steps);
await io.write(output, doc);
const tris = doc.getRoot().listMeshes().flatMap((m) => m.listPrimitives()).reduce((n, p) => n + (p.getIndices() ? p.getIndices().getCount() : p.getAttribute('POSITION').getCount()) / 3, 0);
console.log(`written ${output} — ${Math.round(tris / 1000)}k triangles`);
