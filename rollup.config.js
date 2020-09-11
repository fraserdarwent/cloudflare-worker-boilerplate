import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import replace from '@rollup/plugin-replace'
import { terser } from 'rollup-plugin-terser'
import fs from 'fs'

const env = process.env.NODE_ENV

const envConfig = JSON.parse(fs.readFileSync(`${env}.json`))

export default {
  input: 'src/main.js',
  output: {
    file: 'dist/bundle.js',
    format: 'iife',
    compact: true,
  },
  plugins: [
    nodeResolve(),
    commonjs(),
    replace({
      env: JSON.stringify(env),
    }),
    terser(),
  ],
}
