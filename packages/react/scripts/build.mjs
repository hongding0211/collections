import * as esbuild from 'esbuild'
import babel from 'esbuild-plugin-babel';
import { nodeExternalsPlugin } from 'esbuild-node-externals'

await esbuild.build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  outdir: 'dist',
  format: 'esm',
  drop: ['debugger'],
  plugins: [babel(), nodeExternalsPlugin()],
  tsconfig: 'tsconfig.json',
})