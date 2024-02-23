import ts from 'typescript'
import path from 'path'
import { GenerateSchemaFile } from './_type_generation/generatSchemaFromTsFile'

// const parser = new TypescriptParser()
// const checker = new Typescr()

const srcPath = path.resolve('.')

const filePath = srcPath + '/src/components/buttons/Button/Button.tsx'
console.log('FP , ', filePath)

const { schema, adjSchema } =
  (GenerateSchemaFile(
    {
      SourceFilePaths: [filePath],
      // SchemaFilePath: './schema.json',
      // Prefix: 'validate',
      // Suffix: '',
      // ForceGenerate: true,
    } as any,
    {
      jsx: ts.JsxEmit.ReactJSX,
    },
    false
  ) as any) ?? {}

const mainProps = Object.keys(adjSchema?.properties)
  // ?.filter((prop) => !htmlProps.includes(prop))
  .sort()

// const a = x1
console.log()
console.log()
