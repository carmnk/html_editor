// import React from 'react'
import { sortByFormSequence } from 'common/entity_model/entitiy_fields'
import {
  GenericFormProps,
  StaticFieldType,
} from '../../components/forms/GenericForm'
import {
  ENRICHED_ENTITY_JOININGS_MODEL_TYPE,
  ENTITY_DATA_MODEL_TYPE,
  ENTITY_FIELD_TYPE,
  BASIC_ENTITY_MODEL_TYPE,
} from 'common/entity_model'

type GenericEntityFormParams<T extends keyof any> = {
  // type: T
  fields: ENTITY_FIELD_TYPE[]
  isEdit?: boolean
  options: {
    [key: string]: any[]
  }
  subforms?: {
    [x: string]: Omit<GenericFormProps<any>, 'formData' | 'onChangeFormData'>
  }
  entity_joinings: ENRICHED_ENTITY_JOININGS_MODEL_TYPE[]
  baseEntityId: number
}

// const getDefaultFormData = (initialFormData: Partial<TemplateFormType>) => ({
//   // year: moment().year(),
//   ...(initialFormData ?? {}),
// })

const fieldsFactory = <T extends keyof any>(
  params: GenericEntityFormParams<T>
): StaticFieldType[] => {
  const fields = params?.fields?.map((field) => {
    const type =
      field?.ui_type === 'dropdown'
        ? 'select'
        : !('data_type' in field)
        ? 'text'
        : field.data_type.includes('document')
        ? 'file'
        : field.data_type.includes('decimal')
        ? 'number'
        : field.data_type.includes('integer')
        ? 'int'
        : field.data_type.includes('bool')
        ? 'bool'
        : field.data_type === 'reference'
        ? 'object'
        : field.data_type.includes('references')
        ? 'array'
        : 'text'

    return {
      ...field,
      refJoining: params?.entity_joinings?.find(
        (joinings) => joinings?.base_entity_field_id === field.entity_field_id
      ),
      type,
      label: field?.form_label ?? field.name ?? '',
      name: ['reference', 'references'].includes(field.data_type)
        ? params?.entity_joinings?.find(
            (joinings) =>
              joinings?.base_entity_field_id === field.entity_field_id
          )?.linked_entity?.entity_name ?? ''
        : 'name' in field
        ? field.name
        : '',
      width12: field?.layout_width12,
      hidden:
        ['reference', 'references'].includes(field.data_type) ||
        (field?.entity_id !== params?.baseEntityId && field.is_id_field),
    }
  })

  return sortByFormSequence(fields, 'form_sequence') as any
}
export { fieldsFactory as genericEntityFieldsFactory }

const getInjections = <T extends keyof { [key: string]: any }>(
  params: GenericEntityFormParams<T>
): Omit<
  GenericFormProps<any>,
  'formData' | 'onChangeFormData'
>['injections'] => ({
  options: params?.options as any,
  // required: {
  // } as any,
  // options: {
  // } as any,
  // disabled: {
  //   entity_id:
  //     ['entities'].includes(params?.type) ||
  //     (params?.isEdit && ['entity_fields'].includes(params?.type)),
  //   entity_name: ['entities'].includes(params?.type) && !!params?.isEdit,
  //   //
  //   entity_field_id: ['entity_fields'].includes(params?.type),
  //   entity_list_field_id: ['entity_list_fields'].includes(params?.type),
  //   data_type: ['entity_fields'].includes(params?.type) && !!params?.isEdit,
  //   base_entity_id: params?.isEdit,
  //   entity_list_id:
  //     (params?.isEdit && ['entity_list_fields'].includes(params?.type)) ||
  //     ['entity_lists'].includes(params?.type),
  // } as any,
  // initialFormData: params?.initialFormData && (getDefaultFormData(params?.initialFormData) as TemplateFormType),
  // onBeforeChange: (newFormData, prevFormData, changedPropertyName, changedPropertyValue) => {
  //   const adjFilename =
  //     changedPropertyName === 'file' && !params?.isEdit
  //       ? removeFileExtensionFromFilename(newFormData?.filename)
  //       : changedPropertyName === 'filename'
  //       ? newFormData?.filename?.replace(/[.!?\\/]|(?! )\s/gi, '')
  //       : prevFormData?.filename
  //   const adjFormData = { ...newFormData, filename: adjFilename }
  //   return adjFormData
  // },
})

export const GenericEntityFormFactory = <
  T extends keyof BASIC_ENTITY_MODEL_TYPE
>(
  params: GenericEntityFormParams<T>
): Omit<GenericFormProps<any>, 'formData' | 'onChangeFormData'> => ({
  injections: getInjections(params) as any,
  fields: fieldsFactory(params),
  // settings: { gridWidth: '100%' },
  subforms: params?.subforms,
})

export const GenericSubEntityFormFactory = (): Omit<
  GenericFormProps<any>,
  'formData' | 'onChangeFormData'
> => {
  return {
    injections: {
      options: {},
    },
    fields: [
      {
        type: 'text',
        label: 'Name',
        name: 'name',
      },
    ],
    subforms: {},
  }
}

// export const isValidFormData = (formData: Partial<TemplateFormType>) => {
//   const fields: (keyof TemplateFormType)[] = ['file', 'filename', 'entity_id', 'entity_type', 'document_type']
//   const areFieldsValid = fields.map((fieldName) =>
//     fieldName === 'entity_id' ? typeof formData?.[fieldName] === 'number' : !!formData?.[fieldName]
//   )
//   const isFormDataValid = !areFieldsValid.includes(false)
//   return isFormDataValid
// }
