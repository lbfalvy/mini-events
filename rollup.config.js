import ts from 'rollup-plugin-ts'
import { dirname } from 'path'

const pkg = require("./package.json")

export default [{
    input: 'src/index.ts',
    preserveModules: true,
    output: [{
        dir: dirname(pkg.main),
        format: 'cjs',
        sourcemap: 'inline'
    }, {
        dir: dirname(pkg.module),
        format: 'esm',
        sourcemap: 'inline'
    }],
    plugins: [
        ts(),
    ],
}]