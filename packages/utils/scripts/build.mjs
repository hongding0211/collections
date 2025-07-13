import * as esbuild from 'esbuild'

await esbuild.build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  outdir: 'dist',
  format: 'esm',
  drop: ['debugger'],
  tsconfig: 'tsconfig.json',
  outExtension: { '.js': '.mjs' },
})

await esbuild.build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  outdir: 'dist',
  format: 'cjs',
  drop: ['debugger'],
  tsconfig: 'tsconfig.json',
  outExtension: { '.js': '.cjs' },
})