import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import pathmodify from "rollup-plugin-pathmodify";

export default [{
  input: 'compiled/lib/index.js',
  output: {
    file: 'bundled/backend.js',
    format: 'iife',
    name: 'backend'
  },

  plugins: [
    resolve({
      jsnext: false,
      main: false,
      browser: true
    }),

    commonjs({
      include: ['node_modules/**', 'compiled/**'],
      sourceMap: false,
    })
  ]
}, {
  input: 'compiled/gui/index.js',
  output: {
    file: 'bundled/frontend.js',
    format: 'iife',
    name: 'frontend'
  },

  plugins: [
    resolve({
      jsnext: false,
      main: false,
      browser: true
    }),

    commonjs({
      include: ['node_modules/**', 'compiled/**'],
      sourceMap: false,
    }),

    pathmodify({
      aliases: [
        {
          id: "mithril",
          resolveTo: "node_modules/mithril/mithril.js"
        },
        {
          id: "mithril/stream",
          resolveTo: "node_modules/mithril/stream.js"
        }
      ]
    }),
  ]
}, {
  input: 'compiled/gui/options.js',
  output: {
    file: 'bundled/options.js',
    format: 'iife',
    name: 'options'
  },

  plugins: [
    resolve({
      jsnext: false,
      main: false,
      browser: true
    }),

    commonjs({
      include: ['node_modules/**', 'compiled/**'],
      sourceMap: false,
    })
  ]
}, {
  input: 'compiled/directory/builtin_sources.js',
  output: {
    file: 'bundled/builtin_sources.js',
    format: 'cjs'
  },

  plugins: []
}, {
  input: 'compiled/directory/sources.js',
  output: {
    file: 'bundled/sources.js',
    format: 'cjs'
  },

  plugins: []
}];