import React from 'react'
import {
  GenericInputField,
  GenericInputFieldProps,
} from '../inputs/GenericInputField'
import { Box, Divider, Grid, Stack, Typography } from '@mui/material'
import { getDynamicFields } from './utils'
import { Button } from '../buttons/Button/Button'
import { StringArrayField } from '../inputs/StringArrayField'
import moment from 'moment'
import { mdiDeleteOutline, mdiPlus } from '@mdi/js'
import { ButtonType } from '../buttons/Button/Types'

export type GenericFormParams<F extends { [key: string]: any }> = Omit<
  GenericFormProps<F>,
  'formData' | 'onChangeFormData'
>

type InputFieldLayoutProps = {
  width12?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
  fillWidth?: boolean
}

export type CustomInputFieldComponentProps<F, P = { [key: string]: any }> = {
  formData: F
  onChangeFormData: (
    newFormData: F,
    changedPropertyName: keyof F & string,
    changedPropertyValue: any,
    prevFormData: F
  ) => void
  onBeforeChange: (
    newFormData: F,
    changedPropertyName: keyof F & string,
    changedPropertyValue: any,
    prevFormData: F
  ) => void
  params?: P
  rootFormData?: any
  onChangeFormDataRoot?: (newFormData: any) => void
  _path?: (string | number)[]
}
type CustomInputFieldInjectionProps<F> = {
  type: 'inject'
  name?: string
  component: React.FC<CustomInputFieldComponentProps<any>>
  params?: { [key: string]: any }
}
type ArrayInputFieldProps<
  F extends { [key: string]: any } = { [key: string]: any }
> = {
  type: 'array'
  name: string
  enableDeleteFirst?: boolean
}
type ObjectInputFieldProps<
  F extends { [key: string]: any } = { [key: string]: any }
> = {
  type: 'object'
  name: string
}

type StringArrayInputFieldProps = {
  type: 'string-array'
  name: string
  label: string
  enableDeleteFirst?: boolean
}

export type StaticFieldType =
  | (Omit<
      GenericInputFieldProps,
      | 'required'
      | 'disabled'
      | 'options'
      | 'value'
      | 'sx'
      | 'onChange'
      | 'maxLength'
      | 'placeholder'
    > &
      InputFieldLayoutProps)
  | (CustomInputFieldInjectionProps<any> & InputFieldLayoutProps)
  | (ArrayInputFieldProps & InputFieldLayoutProps)
  | (ObjectInputFieldProps & InputFieldLayoutProps)
  | (StringArrayInputFieldProps & InputFieldLayoutProps)

export type StaticGenericFormProps = Pick<
  GenericFormProps,
  'fields' | 'injections' | 'subforms' | 'settings'
>
export type GenericFormProps<
  F extends { [key: string]: any } = { [key: string]: any }
> = {
  addArrayItemLabel?: string
  useAlwaysArraysInFormData?: boolean
  fields: StaticFieldType[] | ((formData: F) => StaticFieldType[])
  injections?: {
    initialFormData?:
      | F
      | ((formData: F, rootFormData: any, arraxIdx?: number) => F)
    options?: {
      [key in keyof F as string]:
        | any[]
        | ((formData: F, rootFormData: any) => any[])
    }
    disabled?: {
      [key in keyof F as string]: ((formData: F) => boolean) | boolean
    }
    required?: {
      [key in keyof F as string]: ((formData: F) => boolean) | boolean
    }
    error?: {
      [key in keyof F as string]: ((formData: F) => boolean) | boolean
    }
    // visible?: { [key in keyof F]: ((formData: F) => boolean) | boolean }
    // displayed?: { [key in keyof F]: ((formData: F) => boolean )| boolean }
    onBeforeChange?: (
      newFormData: F,
      prevFormData: F,
      changedPropertyName: keyof F & string,
      changedPropertyValue: any
    ) => F
    onBeforeRemoveArrayItem?: (
      newFormData: F,
      prevFormData: F,
      changedPropertyName: keyof F & string,
      deletedIndex: number
    ) => F
    // onBeforeSubmit?: (formData: F) => F
    // onSubmitted?: (request: F, response: F) => F
  }
  subforms?: {
    [key in keyof F as string]: Omit<
      GenericFormProps<F>,
      'formData' | 'onChangeFormData'
    >
  }
  settings?: {
    gap?: number
    gridWidth?: number | string
  }
  formData: F
  onChangeFormData: (
    newFormData: F,
    changedPropertyName: keyof F & string,
    changedPropertyValue: any,
    prevFormData: F,
    subformName?: string // better path?
  ) => void
  rootFormData?: any
  onChangeFormDataRoot?: (newFormData: any) => void
  showError?: boolean
  _path?: (string | number)[]
  _removeFormFromArray?: () => void
  disableTopSpacing?: boolean
  files?: { [key: string]: { file: File; filename: string }[] }
  onFileChange?: (name: string, files: File[]) => void
}

export const GenericForm = (props: GenericFormProps) => {
  const {
    fields,
    injections,
    settings,
    subforms,
    formData,
    onChangeFormData,
    _removeFormFromArray,
    onChangeFormDataRoot,
    rootFormData,
    _path,
    showError,
    addArrayItemLabel,
    useAlwaysArraysInFormData,
    disableTopSpacing,
    onFileChange,
    files,
  } = props
  const { onBeforeChange, onBeforeRemoveArrayItem } = injections ?? {}
  const isArray = typeof _removeFormFromArray === 'function'
  const isFirstArrayElement = _path?.slice(-1)?.[0] === 0
  const arrayIdxRaw = _path?.slice(-1)?.[0]
  const ArrayIdx = typeof arrayIdxRaw === 'number' ? arrayIdxRaw : undefined
  const dynamicFields = getDynamicFields({
    fields,
    injections,
    formData,
    rootFormData,
  })

  const handleChange = React.useCallback(
    (newValue: string, e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e?.target ?? {}
      console.log('handleChange', name, value)
      const newValueWithInjections = onBeforeChange?.(
        { ...formData, [name]: value },
        formData,
        name,
        value
      ) ?? {
        ...formData,
        [name]: value,
      }
      onChangeFormData(newValueWithInjections, name, value, formData)
    },
    [onBeforeChange, formData, onChangeFormData]
  )
  const handleCheckbox = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, value: any) => {
      const { name } = e?.target ?? {}
      const newValueWithInjections = onBeforeChange?.(
        { ...formData, [name]: value },
        formData,
        name,
        value
      ) ?? {
        ...formData,
        [name]: value,
      }

      onChangeFormData(newValueWithInjections, name, value, formData)
    },
    [onBeforeChange, formData, onChangeFormData]
  )

  const handleChangeDate = React.useCallback(
    (newvalue: string, name: string) => {
      const newValueWithInjections = onBeforeChange?.(
        { ...formData, [name]: newvalue },
        formData,
        name,
        newvalue
      ) ?? {
        ...formData,
        [name]: moment(newvalue).format('YYYY-MM-DD'),
      }
      onChangeFormData(newValueWithInjections, name, newvalue, formData)
    },
    [formData, onChangeFormData, onBeforeChange]
  )

  const handleChangeSelect = React.useCallback(
    (value: string, e: React.ChangeEvent<HTMLInputElement>) => {
      const name = e?.target?.name
      const newValueWithInjections = onBeforeChange?.(
        { ...formData, [name]: value },
        formData,
        name,
        value
      ) ?? {
        ...formData,
        [name]: value,
      }
      onChangeFormData(newValueWithInjections, name, value, formData)
    },
    [onBeforeChange, formData, onChangeFormData]
  )

  return (
    <>
      <Box position="relative">
        <Grid
          container
          spacing={settings?.gap ?? (disableTopSpacing ? '0 16px' : '16px')}
          pr={settings?.gap ?? '16px'}
          width={settings?.gridWidth ?? 'calc(100% - 64px)'}
        >
          {dynamicFields
            ?.filter(
              (field) =>
                !['array', 'object', 'string-array']?.includes(field.type)
            )
            ?.map((field, fIdx) => {
              const injectIsInt = field.type === 'int' ? { isInt: true } : {}

              const FieldComponent = (field as any)?.component
              const fieldOptions =
                typeof field?.options === 'function'
                  ? field?.options(formData, rootFormData)
                  : field?.options
              const fieldError =
                typeof field?.error === 'function'
                  ? field?.error(formData)
                  : field?.error
              const fieldRequired =
                typeof field?.required === 'function'
                  ? field?.required(formData)
                  : field?.required
              const fieldValue = formData?.[field?.name ?? '']
              return (
                <React.Fragment key={fIdx}>
                  <Grid item xs={field.width12 ?? 12}>
                    {field.type === 'inject' ? (
                      <Box>
                        <FieldComponent
                          formData={formData}
                          onChangeFormData={onChangeFormData}
                          params={field.params}
                          rootFormData={rootFormData}
                          onChangeFormDataRoot={onChangeFormDataRoot}
                          _path={_path}
                          onBeforeChange={onBeforeChange}
                          showError={showError}
                        />
                      </Box>
                    ) : field.type === 'array' ||
                      field.type === 'object' ||
                      field?.type === 'string-array' ? null : (
                      <GenericInputField
                        {...field}
                        options={fieldOptions}
                        error={
                          fieldError ??
                          (showError &&
                            fieldRequired &&
                            (([
                              'textarea',
                              'text',
                              'select',
                              'autocomplete',
                              'dropdown',
                            ].includes(field?.type) &&
                              !fieldValue &&
                              fieldValue !== false) ||
                              (['number', 'int'].includes(field?.type) &&
                                typeof fieldValue !== 'number') ||
                              (['date'].includes(field?.type) && !fieldValue)))
                        }
                        sx={{ border: '1px solid rgb(221, 226, 234)' }}
                        {...injectIsInt}
                        value={formData?.[field?.name ?? ''] ?? ''}
                        onChange={
                          ['select', 'autocomplete', 'dropdown'].includes(
                            field.type
                          )
                            ? (handleChangeSelect as any)
                            : field?.type === 'date'
                            ? handleChangeDate
                            : field?.type === 'bool'
                            ? handleCheckbox
                            : handleChange
                        }
                        onFileChange={onFileChange}
                        files={files}
                      />
                    )}
                  </Grid>
                  {field?.width12 && field?.fillWidth && (
                    <Grid item xs={12 - field.width12} />
                  )}
                </React.Fragment>
              )
            })}
          {!isFirstArrayElement && _removeFormFromArray && (
            <Stack
              direction="row"
              position="absolute"
              right={0}
              top={0}
              // pt={options?.gap ?? 16 + 25 + 'px'}
              // pb="36px"
              height="100%"
              width={64}
              alignItems="center"
            >
              <Box>
                <Button
                  type={ButtonType.text}
                  iconButton={true}
                  icon={mdiDeleteOutline}
                  onClick={() => _removeFormFromArray?.()}
                />
              </Box>
            </Stack>
          )}
        </Grid>
      </Box>
      {dynamicFields
        ?.filter((field) => ['string-array']?.includes(field.type))
        ?.map((field, fIdx) => {
          const fieldName = field?.name
          if (!fieldName) return null
          const onChangeObjectSub = (
            newValue: string,
            name: string,
            arrayIdx: any
            // prevFormData: any
          ) => {
            const transformedNewFormData = {
              ...formData,
              [fieldName]: [
                ...(formData?.[fieldName]?.slice(0, arrayIdx) ?? []),
                newValue,
                ...(formData?.[fieldName]?.slice(arrayIdx + 1) ?? []),
              ],
            }
            onChangeFormData?.(
              transformedNewFormData,
              fieldName,
              newValue,
              formData
            )
          }

          const onAddObjectSub = () => {
            const newValue = [...(formData?.[fieldName] ?? []), '']
            const transformedNewFormData = {
              ...formData,
              [fieldName]: newValue,
            }
            onChangeFormData?.(
              transformedNewFormData,
              fieldName,
              newValue,
              formData
            )
          }

          const removeItemArraySub = (name: string, arrayIndex: number) => {
            if (!field?.name) return
            const newValue = formData?.[field?.name]?.filter(
              (dat: any, dIdx: number) => dIdx !== arrayIndex
            )
            const transformedNewFormData = {
              ...formData,
              [field.name]: newValue,
            }
            const injectedFormData =
              onBeforeRemoveArrayItem?.(
                transformedNewFormData,
                formData,
                field.name,
                arrayIndex
              ) ?? transformedNewFormData
            onChangeFormData?.(injectedFormData, field.name, newValue, formData)
          }

          const requiredInjection = injections?.required?.[fieldName]
          const required =
            typeof requiredInjection === 'function'
              ? requiredInjection?.(formData)
              : requiredInjection
          // const disabledInjection = injections?.disabled?.[fieldName]
          // const disabled = typeof disabledInjection === 'function' ? disabledInjection?.(formData) : disabledInjection
          return (
            <React.Fragment key={fIdx}>
              <StringArrayField
                {...field}
                name={fieldName}
                value={formData?.[fieldName]}
                label={(field as any)?.label}
                required={!!required}
                onChangeArray={onChangeObjectSub}
                onRemoveItem={removeItemArraySub}
                enableDeleteFirst={(field as any)?.enableDeleteFirst}
                showError={showError}
                error={field?.error}
              />

              <Button
                type={ButtonType.secondary}
                label={'Hinzufügen'}
                onClick={onAddObjectSub}
                icon={mdiPlus}
              />
            </React.Fragment>
          )
        })}
      {/* {!!dynamicFields?.filter((field) =>
        ['array', 'object']?.includes(field.type)
      )?.length && (
        <Box pb={2}>
          <Divider />
        </Box>
      )} */}

      {dynamicFields
        ?.filter((field) => ['array', 'object']?.includes(field.type))
        ?.map((field, fIdx) => {
          const fieldName: string | undefined = field?.name
          const subform = subforms?.[fieldName ?? '']
          if (!fieldName || !subform) return null
          const onChangeObjectSub = (
            newFormData: any,
            changedPropertyName: any,
            changedPropertyValue: any,
            prevFormData: any
          ) => {
            const transformedNewFormData = {
              ...formData,
              [fieldName]: useAlwaysArraysInFormData
                ? [newFormData]
                : newFormData,
            }
            onChangeFormData?.(
              transformedNewFormData,
              changedPropertyName,
              changedPropertyValue,
              formData,
              fieldName
            )
          }
          const makeOnChangeArraySub =
            (arrayIndex: number) =>
            (
              newFormData: any,
              changedPropertyName: any,
              changedPropertyValue: any,
              prevFormData: any
            ) => {
              if (!fieldName) return
              const transformedNewFormData = {
                ...formData,
                [fieldName]: formData?.[fieldName]?.length
                  ? formData?.[fieldName]?.map((f: any, fIdx: number) =>
                      fIdx === arrayIndex ? newFormData : f
                    )
                  : [newFormData],
              }
              onChangeFormData?.(
                transformedNewFormData,
                changedPropertyName,
                changedPropertyValue,
                formData,
                fieldName
              )
            }
          const addnewItemArraySub = (
            changedPropertyName: any,
            prevFormData: any
          ) => {
            if (!fieldName) return
            const prevArrayFormData = prevFormData?.[fieldName]

            const injectedFormDataRaw =
              subforms?.[fieldName]?.injections?.initialFormData
            const injectedFormData =
              (typeof injectedFormDataRaw === 'function'
                ? injectedFormDataRaw(
                    formData,
                    rootFormData,
                    (ArrayIdx ?? -1) + 1
                  )
                : injectedFormDataRaw) ?? {}

            const newValue = [...(prevArrayFormData ?? []), injectedFormData]
            const transformedNewFormData = {
              ...formData,
              [fieldName]: newValue,
            }
            onChangeFormData?.(
              transformedNewFormData,
              changedPropertyName,
              newValue,
              formData
            )
          }

          if (!fieldName || !subform) return null

          return field.type === 'object' &&
            !Array.isArray(subform) &&
            subform?.fields ? (
            <>
              <Box pb={2}>
                <Divider />
              </Box>
              <Box>
                <Typography fontWeight="bold" paddingBottom={1}>
                  field: {fieldName}
                </Typography>
                <GenericForm
                  useAlwaysArraysInFormData={useAlwaysArraysInFormData}
                  key={fIdx}
                  fields={subform?.fields}
                  injections={subform?.injections}
                  settings={settings}
                  formData={
                    useAlwaysArraysInFormData
                      ? formData?.[fieldName]?.[0]
                      : formData?.[fieldName]
                  } //?? subforms?.[fieldName]?.injections?.initialFormData ?? {}}
                  onChangeFormData={onChangeObjectSub}
                  rootFormData={formData}
                  onChangeFormDataRoot={
                    onChangeFormData as (newValue: any) => void
                  }
                  _path={[...(_path ?? []), field.name]}
                  showError={showError}
                  subforms={subform?.subforms}
                />
              </Box>
            </>
          ) : field.type === 'array' ? (
            <>
              <Box>
                <Divider />
              </Box>
              <Typography fontWeight="bold">field: {fieldName}</Typography>
              <Box mb={4} key={fIdx}>
                {(formData?.[fieldName]?.length
                  ? formData?.[fieldName]
                  : [{}]
                )?.map?.((f: any, fIdx2: number) => {
                  const removeItemArraySub = () => {
                    if (!field?.name) return
                    const newValue = formData?.[field?.name]?.filter(
                      (dat: any, dIdx: number) => dIdx !== fIdx
                    )
                    const transformedNewFormData = {
                      ...formData,
                      [field.name]: newValue,
                    }

                    const injectedFormData =
                      (
                        subforms?.[fieldName] as any
                      )?.injections?.onBeforeRemoveArrayItem?.(
                        transformedNewFormData,
                        formData,
                        field.name,
                        fIdx
                      ) ?? transformedNewFormData
                    onChangeFormData?.(
                      injectedFormData,
                      field.name,
                      newValue,
                      formData
                    )
                  }
                  const sub = subforms?.[field?.name ?? '']
                  const injectedFormDataRaw = sub.injections?.initialFormData
                  const injectedFormData =
                    (typeof injectedFormDataRaw === 'function'
                      ? injectedFormDataRaw(formData, rootFormData, ArrayIdx)
                      : injectedFormDataRaw) ?? {}
                  return (
                    <Box key={fIdx + '_' + fIdx2}>
                      {fIdx2 ? (
                        <Box mb={2} paddingX={4}>
                          <Divider variant="middle" />
                        </Box>
                      ) : null}
                      <GenericForm
                        useAlwaysArraysInFormData={useAlwaysArraysInFormData}
                        fields={sub?.fields}
                        injections={sub?.injections}
                        settings={settings}
                        onChangeFormData={makeOnChangeArraySub(fIdx2)}
                        onChangeFormDataRoot={
                          onChangeFormData as (newValue: any) => void
                        }
                        formData={
                          formData?.[fieldName]?.[fIdx2] ?? injectedFormData
                        }
                        rootFormData={formData}
                        _removeFormFromArray={removeItemArraySub}
                        _path={[...(_path ?? []), field.name, fIdx2]}
                        showError={showError}
                        disableTopSpacing={true}
                      />
                    </Box>
                  )
                })}

                <Button
                  type={ButtonType.secondary}
                  label={
                    subforms?.[field?.name]?.addArrayItemLabel ?? 'Hinzufügen'
                  }
                  onClick={() => addnewItemArraySub(field.name, formData)}
                  icon={mdiPlus}
                />
              </Box>
            </>
          ) : null
        })}
    </>
  )
}

// export const useGenericForm = (params: GenericFormProps) => {
//   const { fields, injections } = params
//   const { onBeforeChange } = injections ?? {}
//   const [formData, setFormData] = React.useState(() => getInitialFieldValues(fields))

//   const handleChangeDefault = React.useCallback(
//     (e: React.ChangeEvent<HTMLInputElement>) => {
//       const { name, value } = e?.target ?? {}
//       setFormData((current) => {
//         const newValueRaw = { ...current, [name]: value }
//         const newValueWithInjections = onBeforeChange?.(newValueRaw, current, name, value)
//         // params.injections.interdependencies(newValueRaw, current, [name])
//         return newValueWithInjections
//       })
//     },
//     [onBeforeChange]
//   )

//   const handleChangeSelect = React.useCallback(
//     (value: string, e: React.ChangeEvent<HTMLInputElement>) => {
//       const name = e?.target?.name
//
//       setFormData((current) => {
//         const newValueRaw = { ...current, [name]: value }
//         const newValueWithInjections = onBeforeChange?.(newValueRaw, current, name, value)
//         return newValueWithInjections
//       })
//     },
//     [onBeforeChange]
//   )

//   // const handleChange = React.useCallback((p1: any, e2?: React.ChangeEvent<HTMLInputElement>) => {
//   //   if (p1?.target?.name) handleChangeDefault(p1)
//   //   else

//   // }, [])

//   return { formData, setFormData }
// }
