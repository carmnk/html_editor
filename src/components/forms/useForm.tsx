import React from 'react'
import { GenericFormParams, GenericFormProps } from './GenericForm'

export type UseFormParams<F extends { [key: string]: any }> = GenericFormParams<F>
// & {
// fields: GenericFormParams<F>['fields']
// subforms?: GenericFormParams<F>['subforms']
// showError?: boolean
// onSubmit?: (formData: F) => F
// }

export const useForm = <F extends { [key: string]: any }>(params: UseFormParams<F>): GenericFormProps<F> => {
  // const { fields, subforms, injections } = params
  const [formData, setFormData] = React.useState<F>({} as F)

  const onChangeFormData = React.useCallback(
    (newFormData: F, changedPropertyName: keyof F, changedValue: any, prevFormData: F) => {
      setFormData(newFormData)
    },
    []
  )
  // const subformFields = fields?.filter((field) => ['array', 'object', 'string-array'].includes(field.type)) // "array", "object", "string-array"
  // const [formData, setFormData] = React.useState<F>({} as F)

  return {
    ...params,
    formData,
    onChangeFormData,
  }
}
