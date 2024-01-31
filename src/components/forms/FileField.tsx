import React from "react";
// import { FileUploader } from '../inputs/FileUploader'

// export type FileFieldProps<F> = {
//   formData: F
//   onChangeFormData: (
//     newFormData: F,
//     changedPropertyName: keyof F & string,
//     changedPropertyValue: any,
//     prevFormData: F
//   ) => void
//   onBeforeChange: (
//     newFormData: F,
//     prevFormData: F,
//     changedPropertyName: keyof F & string,
//     changedPropertyValue: any
//   ) => F
//   accept?: string
// }

// export const FileField = <F extends { [key: string]: any } = { [key: string]: any }>(props: FileFieldProps<F>) => {
//   const { formData, onChangeFormData, onBeforeChange, accept } = props
//   const [loading, setLoading] = React.useState(false)
//   return (
//     <FileUploader
//       accept={accept ?? '*'}
//       required={true}
//       label={'Datei hochladen'}
//       isLoading={loading}
//       inputId="file"
//       handleUpload={(file) => {

//         setLoading(true)
//         const adjFormData = { ...(formData ?? {}), file: file[0], filename: file?.[0]?.filename ?? file?.[0]?.name }
//         const injectedFormData = onBeforeChange?.(adjFormData, formData, 'file', file[0]) ?? adjFormData

//         onChangeFormData?.(injectedFormData, 'file', file[0], formData)
//         setLoading(false)
//       }}
//       resetFile={() => {
//         setLoading(true)
//         onChangeFormData?.({ ...(formData ?? {}), file: null, filename: '' }, 'file', null, formData)
//         setLoading(false)
//       }}
//       files={
//         formData?.file ? [{ file: formData?.file, filename: formData?.file?.filename ?? formData?.file?.name }] : []
//       }
//       enableMultipleFiles={false}
//     />
//   )
// }
