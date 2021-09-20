import ts from 'rollup-plugin-ts'

const pkg = require("./package.json")

export default [{
    input: 'src/index.ts',
    output: [{
        file: pkg.main,
        format: 'cjs',
        sourcemap: 'inline'
    }, {
        file: pkg.module,
        format: 'esm',
        sourcemap: 'inline'
    }],
    plugins: [
        ts(),
    ],
}]