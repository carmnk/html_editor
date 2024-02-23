import React from 'react'
import { EllipsisTextWithTooltip } from '../../components/EllipsisTooltip'
import { TableColumnType } from '../../components/table/Table'
import { ENTITY_FIELD_TYPE, ENTITY_LIST_FIELD_TYPE } from 'common'
import { mdiPencil, mdiDelete } from '@mdi/js'
import { Box, Stack } from '@mui/material'
import { Button } from '../../components/buttons/Button'
import { booleanOptions } from '../options/boolean'
import { ENRICHED_ENTITY_JOININGS_MODEL_TYPE } from 'common/entity_model'
import { forEach } from 'lodash'
import { AdditionalActionType } from '../../views/00_Common/TableView'
import { sortByFormSequence } from 'common/entity_model/entitiy_fields'
import moment from 'moment'

export const getCellLabel = (value: unknown): any =>
  value === true ? '✓' : value === false ? '✗' : value

export const getCellLabelWithOptions = ({
  label,
  field,
  values,
}: {
  label: unknown
  field: any
  values: any
}): any =>
  (field?.ui_type === 'dropdown'
    ? values?.[field?.name ?? '']?.find((opt: any) => opt.value === label)
        ?.label ?? label
    : field?.data_type === 'bool'
    ? booleanOptions?.find((opt: any) => opt.value === label)?.label ?? label
    : getCellLabel(label)) ?? getCellLabel(label)

export const createLisInstancetColumnsByEntityDef = (
  // baseEntityId: number,
  entityFieldDefs: {
    name: string
    data_type: string
    required?: boolean
    ui_type?: string
    is_sortable?: boolean
    label?: string
    is_id_field?: boolean
  }[],
  // structuredEntityJoinings: ENRICHED_ENTITY_JOININGS_MODEL_TYPE[][],
  // onEdit: (id: number, item: any, idFieldName: string) => void,
  // onDelete: (id: number, item: any, idFieldName: string) => void,
  filters: any,
  values: any,
  additionalActions?: AdditionalActionType[]
): TableColumnType[] => {
  const columns = [
    ...(entityFieldDefs?.map((field) => {
      // const filterProps = filters?.[field.name]
      //   ? {
      //       filterOptions: filters?.[field.name] ?? [],
      //       filterKey: field?.name,
      //       getFilterValue: (item: any) => item,
      //       getItemLabel: (item: any) => {
      //         return (
      //           (field?.ui_type === 'dropdown'
      //             ? values?.[field?.name ?? '']?.find(
      //                 (opt: any) => opt.value === item
      //               )?.label ?? item
      //             : field?.data_type === 'bool'
      //             ? booleanOptions?.find((opt: any) => opt.value === item)
      //                 ?.label ?? item
      //             : item) ?? 'NULL'
      //         )
      //       },
      //     }
      //   : {}
      const sortProps = field?.is_sortable
        ? {
            sortKey: field?.name,
          }
        : {}

      return {
        // ...filterProps,
        ...sortProps,
        className: 'p-2 ellipsis',
        header: field.name,
        renderRow: (item: any, idx: number) => {
          if (field?.name === 'change_datetime') {
            return <td>{moment(item?.[field.name]).format("DD.MM.YYYY HH:mm")}</td>
          }
          return <td>{item?.[field.name]}</td>
        },
      }
    }) ?? []),
    {
      className: 'p-2 ellipsis',
      header: '',
      renderRow: (item: any, idx: number) => {
        // const label =
        //   item?.[field.name] === true
        //     ? '✓'
        //     : item?.[field.name] === false
        //     ? '✗'
        //     : item?.[field.name]
        const idField = entityFieldDefs?.find((field) => field.is_id_field)
        const idFieldName = idField?.name

        return (
          <td className="p-2 text-left strabe" key={idx}>
            <Stack direction="row" justifyContent="flex-end" gap={1}>
              {/* <Button
                iconButton={true}
                icon={mdiPencil}
                onClick={() =>
                  !!idFieldName &&
                  // onEdit(item?.[idFieldName], item, idFieldName)
                }
              />
              <Button
                iconButton={true}
                icon={mdiDelete}
                onClick={() => {
                  !!idFieldName &&
                    // onDelete(item?.[idFieldName], item, idFieldName)
                }}
              /> */}
              {additionalActions?.map((action, aIdx) => (
                <Button
                  key={aIdx}
                  iconButton={true}
                  icon={action.icon}
                  onClick={() => {
                    !!idFieldName && action?.action?.(item, idFieldName)
                  }}
                />
              ))}
            </Stack>
          </td>
        )
      },
    },
  ]
  return columns
}
