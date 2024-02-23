import {
  ENTITY_TYPE_MODEL_FIELDNAME_TYPE,
  ENTITY_TYPE_TYPE,
} from 'common/entity_model/entity_types'
import {
  GenericFormProps,
  StaticFieldType,
} from '../../components/forms/GenericForm'
import {
  ENTITY_FIELD_MODEL_FIELD_DEFS_TYPE,
  ENTITY_LIST_FIELD_MODEL_FIELD_DEFS_TYPE,
  ENTITY_LIST_MODEL_FIELD_DEFS_TYPE,
  BASIC_ENTITY_MODEL_TYPE,
  ENTITY_MODEL_FIELD_DEFS_TYPE,
  ENTITY_VALUES_FIELD_DEFS_TYPE,
  getStructuredEntityJoinings,
  ENTITY_TYPE,
  ENTITY_JOINING_TYPE,
  ENTITY_FIELD_TYPE,
} from 'common/entity_model'

type GenericAdminFormParams<T extends keyof BASIC_ENTITY_MODEL_TYPE> = {
  type: T
  fields: T extends 'entities'
    ? ENTITY_MODEL_FIELD_DEFS_TYPE
    : T extends 'entity_fields'
    ? ENTITY_FIELD_MODEL_FIELD_DEFS_TYPE
    : T extends 'entity_lists'
    ? ENTITY_LIST_MODEL_FIELD_DEFS_TYPE[]
    : T extends 'entity_list_fields'
    ? ENTITY_LIST_FIELD_MODEL_FIELD_DEFS_TYPE
    : T extends 'entity_values'
    ? ENTITY_VALUES_FIELD_DEFS_TYPE[]
    : T extends 'entity_types'
    ? ENTITY_TYPE_MODEL_FIELDNAME_TYPE[]
    : null
  isEdit?: boolean
  options: {
    entity_id: any[]
    ui_type: any[]
    data_type: any[]
    base_entity_id: any[]
    entity_list_id: any[]
    src_entity_field_id: any[]
    list_field_type: any[]
    type: any[]
    options_values_id: any[]
    entity_type: any[]
    list_type: any[]
    required_list_field_type: any[]
  }
  entity_fields: ENTITY_FIELD_TYPE[]
  entity_joinings: ENTITY_JOINING_TYPE[]
}

// const getDefaultFormData = (initialFormData: Partial<TemplateFormType>) => ({
//   // year: moment().year(),
//   ...(initialFormData ?? {}),
// })

const fieldsFactory = <T extends keyof BASIC_ENTITY_MODEL_TYPE>(
  params: GenericAdminFormParams<T>
): StaticFieldType[] => {
  return (
    params?.fields?.map((fieldIn) => {
      const field = fieldIn as any
      const type =
        (field as any)?.ui_type === 'dropdown'
          ? 'select'
          : !('data_type' in (field as any))
          ? 'text'
          : field.data_type.includes('decimal')
          ? 'number'
          : field.data_type.includes('integer') ||
            field.data_type.includes('reference')
          ? 'int'
          : field.data_type.includes('references')
          ? 'multiselect'
          : field.data_type.replace(/ /g, '') === 'varchar[]'
          ? 'string-array'
          : field.data_type.includes('bool')
          ? 'bool'
          : 'text'
      return {
        type,
        label: 'name' in field ? field.name : '',
        name: 'name' in field ? field.name : '',
        width12: 'width12' in field ? field.width12 : undefined,
      }
    }) || []
  )
}

const getInjections = <T extends keyof BASIC_ENTITY_MODEL_TYPE>(
  params: GenericAdminFormParams<T>
): Omit<
  GenericFormProps<any>,
  'formData' | 'onChangeFormData'
>['injections'] => ({
  required: {
    entity_name: ['entities'].includes(params?.type),

    name: ['entity_fields'].includes(params?.type),
    data_type: ['entity_fields'].includes(params?.type),
    entity_id: ['entity_fields'].includes(params?.type),
    list_label: ['entity_lists'].includes(params?.type),
    type: ['entity_values'].includes(params?.type),
    base_entity_id: [
      'entity_lists',
      'entity_values',
      'entity_joinings',
    ].includes(params?.type),
    linked_entity_id: ['entity_joinings'].includes(params?.type),
    base_entity_field_id: ['entity_joinings'].includes(params?.type),
    linked_entity_field_id: ['entity_joinings'].includes(params?.type),
    list_field_type: ['entity_lists'].includes(params?.type),
    label: ['entity_lists', 'entity_list_fields'].includes(params?.type),
    src_entity_field_id: ['entity_lists', 'entity_list_fields'].includes(
      params?.type
    ),
    reference_entity_field_id: (f: any) =>
      ['entity_fields'].includes(params?.type) &&
      ['reference', 'references'].includes(f.data_type),
    entity_list_id: ['entity_list_fields'].includes(params?.type),
  } as any,
  options: {
    ...params?.options,
    options_values_id: params?.options?.options_values_id,
    entity_id: params?.options?.entity_id,
    type: params?.options?.type,
    data_type: params?.options?.data_type,
    ui_type: params?.options?.ui_type,
    base_entity_id: params?.options?.entity_id,
    linked_entity_id: (formData: any) =>
      params?.options?.entity_id?.filter(
        (opt) => opt.value !== formData?.base_entity_id
      ),
    entity_list_id: params?.options?.entity_list_id,
    reference_entity_field_id: params?.options?.src_entity_field_id?.map(
      (opt) => {
        return {
          ...opt,
          label: `${
            params?.options?.entity_id?.find(
              (entity) => entity.entity_id === opt.entity_id
            )?.entity_name
          } - ${opt.name}`,
        }
      }
    ),
    src_entity_field_id: (f: any) => {
      const baseEntity = params?.options?.entity_list_id?.find(
        (list) => list?.entity_list_id === f?.entity_list_id
      )
      const baseEntityId = baseEntity?.base_entity_id
      const structuredEntityJoinings = getStructuredEntityJoinings(
        baseEntityId,
        params?.entity_fields || [],
        (params?.entity_joinings as any) || []
      )
      const flatJoinings = structuredEntityJoinings?.flat()
      const linkedEntityIds = flatJoinings
        ?.map((joining) => joining.linked_entity?.entity_id)
        ?.filter((j) => j)
      const allEntityIds = [baseEntityId, ...(linkedEntityIds ?? [])]
      const getHintSuffix = (optValue: number) =>
        linkedEntityIds?.includes(optValue)
          ? ` (Subentity: ${
              flatJoinings?.find((j) => j.linked_entity_id === optValue)
                ?.linked_entity?.entity_name
            })`
          : ''
      return params?.options?.src_entity_field_id
        ?.filter?.((opt) => allEntityIds.includes(opt.entity_id))
        ?.map((opt) => ({
          ...opt,
          label: `${opt.label} ${getHintSuffix(opt.entity_id)}`,
        }))
    },
    base_entity_field_id: (f: any) => {
      return params?.options?.src_entity_field_id
        ?.filter(
          (field) => !f?.base_entity_id || field.entity_id === f?.base_entity_id
        )
        ?.filter((opt) => ['reference', 'references'].includes(opt?.data_type))
    },
    linked_entity_field_id: (f: any) => {
      return params?.options?.src_entity_field_id
        ?.filter(
          (field) =>
            !f?.linked_entity_id || field.entity_id === f?.linked_entity_id
        )
        ?.filter((opt) => opt?.is_id_field)
    },
    list_field_type: params?.options?.list_field_type,
  } as any,
  disabled: {
    entity_type_id: true,
    reference_entity_field_id: (f: any) =>
      ['entity_fields'].includes(params?.type) &&
      !['reference', 'references'].includes(f.data_type),
    entity_joining_id: ['entity_joinings'].includes(params?.type),
    entity_values_id: ['entity_values'].includes(params?.type),
    entity_id:
      ['entities'].includes(params?.type) ||
      (params?.isEdit && ['entity_fields'].includes(params?.type)),
    entity_name: ['entities'].includes(params?.type) && !!params?.isEdit,
    //
    entity_field_id: ['entity_fields'].includes(params?.type),

    entity_list_field_id: ['entity_list_fields'].includes(params?.type),
    data_type: ['entity_fields'].includes(params?.type) && !!params?.isEdit,
    sql_format_parmeter: (formData: any) =>
      ['entity_values'].includes(params?.type) && formData?.type !== 'format',
    base_entity_id: params?.isEdit,
    entity_list_id:
      (params?.isEdit && ['entity_list_fields'].includes(params?.type)) ||
      ['entity_lists'].includes(params?.type),

    base_entity_field_id: (f: any) => !f?.base_entity_id,
    linked_entity_field_id: (f: any) =>
      !f?.base_entity_id || !f?.linked_entity_id,
  } as any,
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

export const GenericAdminFormFactory = <
  T extends keyof BASIC_ENTITY_MODEL_TYPE
>(
  params: GenericAdminFormParams<T>
): Omit<GenericFormProps<any>, 'formData' | 'onChangeFormData'> => ({
  injections: getInjections(params),
  fields: fieldsFactory(params),
  // settings: { gridWidth: '100%' },
})

// export const isValidFormData = (formData: Partial<TemplateFormType>) => {
//   const fields: (keyof TemplateFormType)[] = ['file', 'filename', 'entity_id', 'entity_type', 'document_type']
//   const areFieldsValid = fields.map((fieldName) =>
//     fieldName === 'entity_id' ? typeof formData?.[fieldName] === 'number' : !!formData?.[fieldName]
//   )
//   const isFormDataValid = !areFieldsValid.includes(false)
//   return isFormDataValid
// }
