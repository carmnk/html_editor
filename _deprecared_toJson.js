import { resolve } from 'path'

import * as TJS from 'typescript-json-schema'

// optionally pass argument to schema generator
const settings = {
  // : TJS.PartialArgs
  required: true,
  // refs: false,
  // ref: false,
  // aliasRef: false,
  // topRef: false,
  esModuleInterop: true,
}

// optionally pass ts compiler options
const compilerOptions = {
  strictNullChecks: true,
  // esModuleInterop: true,
  jsx: 'react',
}

// optionally pass a base path
const basePath = './src/components/_models'

const program = TJS.getProgramFromFiles(
  [resolve('./src/components/buttons/Button/Button.tsx')],
  compilerOptions,
  basePath
)

// We can either get the schema for one file and one type...
const schema = TJS.generateSchema(program, 'CButtonProps', settings)

// const config = {
//   path: "src/components/_models/Item.tsx",
//   tsconfig: "./tsconfig.json",
//   type: "*", // "*", // Or <type-name> if you want to generate schema for that one type only
// };
// // const output_path = "path/to/output/file";
// const schema = tsj.createGenerator(config).createSchema(config.type);
const schemaString = JSON.stringify(
  schema,
  (t, value) => (value === '\n' ? '' : value === `\\"` ? '"' : value),
  0
)
