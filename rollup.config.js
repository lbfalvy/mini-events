import ts from 'rollup-plugin-ts'
import dts from 'rollup-plugin-dts'
import { dirname } from 'path'

const pkg = require("./package.json")

const baseConfig = {
    input: 'src/index.ts',
    preserveModules: true,
}
export default [{
    ...baseConfig,
    output: [{
        dir: "build/cjs",
        format: 'cjs',
        sourcemap: 'inline'
    }, {
        dir: "build/esm",
        format: 'esm',
        sourcemap: 'inline'
    }],
    plugins: [ts()]
}, {
    ...baseConfig,
    output: {
        dir: dirname(pkg.types),
        format: 'esm'
    },
    plugins: [dts()]
}]