import ts from 'rollup-plugin-ts'
import dts from 'rollup-plugin-dts'
import { dirname } from 'path'
import fs from 'fs/promises'

const pkg = JSON.parse(await fs.readFile("./package.json"))

const baseConfig = {
  input: 'src/index.ts',
}
export default [{
  ...baseConfig,
  output: [{
    dir: dirname(dirname(pkg.main)),
    format: 'cjs',
    sourcemap: 'inline',
    preserveModules: true,
  }, {
    dir: dirname(dirname(pkg.module)),
    format: 'esm',
    sourcemap: 'inline',
    preserveModules: true,
  }],
  plugins: [ts()],
}, {
  ...baseConfig,
  output: {
    dir: dirname(pkg.types),
    format: 'esm',
  },
  plugins: [dts()],
}]