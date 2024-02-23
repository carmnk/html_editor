import {
  StaticFieldType,
  StaticGenericFormProps,
} from '../../components/forms/GenericForm'
import {
  ExtendedArraySchemaType,
  ExtendedObjectSchemaType,
  PropertyType,
} from './rawSchema'
import { GenericInputFieldType } from '../../components/inputs/GenericInputField'

type OptionsDictType = {
  [key: string]: { value: any; label: string }[]
}

const convertSchemaToFormType = (
  schemaType: PropertyType
): GenericInputFieldType | 'object' | 'array' => {
  switch (schemaType) {
    case PropertyType.String:
      return 'text'
    case PropertyType.Number:
      return 'number'
    case PropertyType.Int:
      return 'number'
    case PropertyType.Boolean:
      return 'bool'
    case PropertyType.Object:
      return 'object'
    case PropertyType.Array:
      return 'array'
    default:
      return 'text'
  }
}

const convertPropertiesToFields = (
  properties: ExtendedObjectSchemaType['properties'],
  injections?: StaticGenericFormProps['injections'] // just created before fields!
): (StaticFieldType & { _prop_type: string; _enum?: any[] })[] => {
  return Object.keys(properties).map((key) => {
    const prop = properties[key]
    const doOverrideSelectType =
      ('enum' in prop && !!prop?.enum?.length) ||
      !!injections?.options?.[key]?.length
    const injectedObjectProperties =
      prop.type === PropertyType.Object
        ? {
            properties: prop.properties,
          }
        : {}
    const field: StaticFieldType & { _prop_type: string; _enum?: any[] } = {
      _prop_type: prop.type,
      type: doOverrideSelectType
        ? 'select'
        : convertSchemaToFormType(prop.type),
      name: key,
      label: prop?.form?.label ?? key,
      _enum: 'enum' in prop ? prop?.enum : undefined,
      ...injectedObjectProperties,
    }
    return field
  })
}

const extractInjectionOptionsFromProperties = (
  properties: ExtendedObjectSchemaType['properties'],
  injectionsIn?: DynamicFormInjectionsType
) => {
  return Object.keys(properties).reduce((acc, propKey) => {
    const injectedDynamicOptions = injectionsIn?.dynamicOptionsDict?.[propKey]
    const prop = properties[propKey]
    const propOptions = injectedDynamicOptions?.length
      ? {
          [propKey]: injectedDynamicOptions,
        }
      : 'enum' in prop && prop?.enum?.length
      ? {
          [propKey]: prop.enum.map((val) => ({
            value: val,
            label: val,
          })),
        }
      : {}

    return {
      ...acc,
      ...propOptions,
    }
  }, {})
}

export type DynamicFormInjectionsType = {
  dynamicOptionsDict: OptionsDictType
}

export const propertyFormFactory = (
  propObjectSchema: ExtendedObjectSchemaType,
  injectionsIn?: DynamicFormInjectionsType // ??? to be checked if suitable,
): StaticGenericFormProps => {
  const properties = propObjectSchema.properties
  const injections: StaticGenericFormProps['injections'] = {
    initialFormData: Object.keys(properties).reduce((acc, propKey) => {
      const defaultValue = properties[propKey].form?.defaultValue
      return defaultValue
        ? {
            ...acc,
            [propKey]: defaultValue,
          }
        : acc
    }, {}),
    required: Object.keys(properties).reduce((acc, propKey) => {
      const isRequired = properties[propKey].required
      return isRequired
        ? {
            ...acc,
            [propKey]: isRequired,
          }
        : acc
    }, {}),
    disabled: Object.keys(properties).reduce((acc, propKey) => {
      const isDisabled = properties[propKey].form?.disabled
      return isDisabled
        ? {
            ...acc,
            [propKey]: isDisabled,
          }
        : acc
    }, {}),
    options: extractInjectionOptionsFromProperties(properties, injectionsIn),
  }

  const fieldsRaw = convertPropertiesToFields(properties, injections)
  // filter and arrays for now
  const fields = fieldsRaw.filter(
    (field) =>
      //   field.type !== 'object' &&
      (field.type !== 'array' || field.name === 'items') &&
      (field.name !== 'children' ||
        field?._prop_type !== PropertyType.children) &&
      field._prop_type !== PropertyType.Function
  )

  const arrays = fields.filter(
    (field) => field.type === 'array' && field.name === 'items'
  )
  const objects = fields.filter((field) => field.type === 'object')
  const arrayProperties =
    (arrays?.length &&
      (
        (properties.items as ExtendedArraySchemaType)
          ?.items?.[0] as ExtendedObjectSchemaType
      )?.properties) ||
    {}
  //   const objectProperties = objects?.length
  //     ? objects.reduce((acc, obj) => {
  //         return {
  //             ...acc,
  //             a: obj.name
  //         }
  //     }
  //     : {}
  const objectSubforms = objects?.reduce((acc, obj) => {
    return {
      ...acc,
      [obj.name as string]: {
        fields: convertPropertiesToFields((obj as any).properties),
        injections: {
          //   initialFormData: injections.initialFormData?.[obj.name as string],
          required: {},
          disabled: {},
          options: extractInjectionOptionsFromProperties(
            (obj as any).properties
          ),
        },
      },
    }
  }, {})
  const arraySubforms = arrays?.length
    ? {
        items: {
          fields: convertPropertiesToFields(arrayProperties),
          injections: {
            //   initialFormData: injections.initialFormData?.items,
            required: {},
            disabled: {},
            options: extractInjectionOptionsFromProperties(arrayProperties),
          },
        },
      }
    : {}

  return {
    fields,
    injections,
    subforms: {
      ...arraySubforms,
      ...objectSubforms,
    } as any, // comes with arrays and objects
    // settings: {
    //   gap: 2,
    //   gridWidth: '100%',
    // },
  }
}
