import * as fs from 'fs'

import ts from 'typescript'
import * as TJS from './tsToJson'
import { propertiesToFilter } from './commonPropertys'
// import * as crypto from 'crypto'
// import * as path from 'path'

export type LoadOrGenerateArgs = {
  /**
   * List of files with exported types and interfaces.
   * Recommended use is relative paths, ex ".\model\everything.d.ts";
   */
  SourceFilePaths: string[]
  /**
   * Use a custom validator. See the simplevalidator.ts for information about the
   * functions that needs to be implemented.
   */
  CustomValidatorFilePath?: string | undefined
  /**
   * The processed files will generate a schema (used in runtime).
   */
  SchemaFilePath: string
  /**
   * Set to true to disable hash checks.
   */
  ForceGenerate?: boolean | undefined
  /**
   * Generated files will be named as ${prefix}${sourceFileName}${suffix}${extension}
   */
  Prefix?: string | undefined
  /**
   * Generated files will be named as ${prefix}${sourceFileName}${suffix}${extension}
   */
  Suffix?: string | undefined
}

export function GenerateSchemaFile(
  args: LoadOrGenerateArgs,
  compilerOptionsIn: TJS.CompilerOptions,
  doExperimentalFilter?: boolean
) {
  // const schemaFile: ISchemaFile = fs.existsSync(args.SchemaFilePath)
  //   ? JSON.parse(fs.readFileSync(args.SchemaFilePath, 'utf-8'))
  //   : { SuperHash: '', Schema: undefined }
  // const newSuperHash = CalculateFilesSuperHash(args.SourceFilePaths)

  if (
    args.CustomValidatorFilePath &&
    !fs.existsSync(args.CustomValidatorFilePath)
  )
    return {
      Success: false,
      Error: `Could not find validator. Path=${args.CustomValidatorFilePath}`,
    }

  // run always
  //   if (args.ForceGenerate || schemaFile.SuperHash !== newSuperHash) {

  //  Start tsc
  const compilerOptions: TJS.CompilerOptions = {
    ...(compilerOptionsIn ?? {}),
    strictNullChecks: true,
    jsx: ts.JsxEmit.React,
  }

  // use the ts compiler directly and pass the program to TJS (TJS seems not to accept compilerOptions)
  const program = ts.createProgram(args.SourceFilePaths, {
    strictNullChecks: true,
    jsx: ts.JsxEmit.ReactJSX,
    module: ts.ModuleKind.NodeNext,
    target: ts.ScriptTarget.ESNext,
    strict: true,
    esModuleInterop: true,
    skipLibCheck: true,
    forceConsistentCasingInFileNames: true,
    moduleResolution: ts.ModuleResolutionKind.NodeNext,
  })

  const program2 = TJS.getProgramFromFiles(
    args.SourceFilePaths,
    compilerOptions
    // basePath
  )

  const sourceFiles = program.getSourceFiles()
  const sourceFile = sourceFiles.find(
    (f) => f.fileName === args.SourceFilePaths[0]
  )

  const settings: TJS.PartialArgs = { required: true }

  // Generate schema
  const schema = TJS.generateSchema(
    program2 as any,
    'CButtonProps',
    {
      esModuleInterop: true,
      strictNullChecks: true,
      skipLibCheck: true,
      ignoreErrors: true,
      titles: true,
      defaultProps: true,
      required: true,
      // ref: false,
      // topRef: true,
      aliasRef: true,
      constAsEnum: true,
    }
    //   args.SourceFilePaths
  )

  const mergedSchema = schema?.allOf?.reduce((acc, item) => {
    const referencedDefName = (item as any)?.['$ref']
      ? (item as any)?.['$ref'].split('/').pop()
      : ''
    const referencedDef = schema?.definitions?.[referencedDefName as string]
    return typeof acc === 'object' && typeof item === 'object'
      ? {
          ...acc,
          ...item,
          ...((referencedDef as any) ?? {}),
          properties: {
            ...(acc?.properties ?? {}),
            ...(item?.properties ?? {}),
            ...((referencedDef as any)?.properties ?? {}),
          },
        }
      : acc
  }, {})

  const adjProperties = Object.keys(
    (mergedSchema as any)?.properties ?? {}
  ).reduce((acc, key) => {
    const propDef = (mergedSchema as any)?.properties?.[key]

    return {
      ...acc,
      [key]: {
        ...(propDef ?? {}),
        _key: key,
      },
    }
  }, {})

  const adjSchema = {
    ...((mergedSchema as any) ?? {}),
    properties: adjProperties,
  }

  if (doExperimentalFilter) {
    const adjProperties = Object.keys((mergedSchema as any)?.properties ?? {})
      .filter((prop) => !propertiesToFilter.includes(prop))
      .reduce((acc, key) => {
        const propDef = (mergedSchema as any)?.properties?.[key]
        return {
          ...acc,
          [key]: {
            ...(propDef ?? {}),
            _key: key,
          },
        }
      }, {})
    const adjSchema2 = { ...adjSchema, properties: adjProperties as any }
    return { adjSchema: adjSchema2, schema }
  }

  console.log('-END-')
  return { adjSchema, schema } as any
}
