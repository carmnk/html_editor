import React from 'react'
import { EllipsisTextWithTooltip } from '../../components/EllipsisTooltip'
import { TableColumnType } from '../../components/table/Table'
import { ENTITY_FIELD_TYPE, ENTITY_LIST_FIELD_TYPE } from 'common'
import { mdiPencil, mdiDelete, mdiClockEditOutline } from '@mdi/js'
import { Box, Stack } from '@mui/material'
import { Button } from '../../components/buttons/Button'
import { booleanOptions } from '../options/boolean'
import { ENRICHED_ENTITY_JOININGS_MODEL_TYPE } from 'common/entity_model'
import { forEach } from 'lodash'
import { AdditionalActionType } from '../../views/00_Common/TableView'
import { sortByFormSequence } from 'common/entity_model/entitiy_fields'
import { DATA_CHANGES_ROUTE } from '../../App'
import { useNavigate } from 'react-router-dom'

export const getCellLabel = (value: unknown): any =>
  value === true ? '✓' : value === false ? '✗' : value

export const getCellLabelWithOptions = (
  label: unknown,
  field: any,
  values: any
): any =>
  (field?.ui_type === 'dropdown'
    ? values?.[field?.name ?? '']?.find((opt: any) => opt.value === label)
        ?.label ?? label
    : field?.data_type === 'bool'
    ? booleanOptions?.find((opt: any) => opt.value === label)?.label ?? label
    : getCellLabel(label)) ?? getCellLabel(label)

export const createEntityLisInstancetColumns = (
  baseEntityId: number,
  entity_list_fields: (ENTITY_LIST_FIELD_TYPE & ENTITY_FIELD_TYPE)[],
  structuredEntityJoinings: ENRICHED_ENTITY_JOININGS_MODEL_TYPE[][],
  onEdit: (id: number, item: any, idFieldName: string) => void,
  onDelete: (id: number, item: any, idFieldName: string) => void,
  filters: any,
  values: any,
  navigate: any,
  additionalActions?: AdditionalActionType[]
): TableColumnType[] => {
  const entityListId = entity_list_fields?.[0]?.entity_list_id
  const columns = [
    ...(sortByFormSequence(entity_list_fields, 'list_sequence')?.map(
      (field) => {
        const filterProps = filters?.[field.name]
          ? {
              filterOptions: filters?.[field.name] ?? [],
              filterKey: field?.name,
              getFilterValue: (item: any) => item,
              getItemLabel: (item: any) => {
                return (
                  (field?.ui_type === 'dropdown'
                    ? values?.[field?.name ?? '']?.find(
                        (opt: any) => opt.value === item
                      )?.label ?? item
                    : field?.data_type === 'bool'
                    ? booleanOptions?.find((opt: any) => opt.value === item)
                        ?.label ?? item
                    : item) ?? 'NULL'
                )
              },
            }
          : {}
        const sortProps = field?.is_sortable
          ? {
              sortKey: field?.name,
            }
          : {}

        return {
          ...filterProps,
          ...sortProps,
          className: 'p-2 ellipsis',
          header: field.label,
          renderRow: (item: any, idx: number) => {
            const isSubEntityField = field?.entity_id !== baseEntityId
            const parents = []
            let values: any[] = []
            if (isSubEntityField) {
              const levelAddedStructuredJoinings =
                structuredEntityJoinings?.map((level, lIdx) =>
                  level.map((joining) => ({ ...joining, level: lIdx }))
                ) ?? [[]]
              const flatJoinings = levelAddedStructuredJoinings.flat()
              const subentityJoining = flatJoinings?.find(
                (joining) => joining.linked_entity_id === field?.entity_id
              )
              const subEntityLevel = subentityJoining?.level ?? 0

              let lastBaseEntityId = subentityJoining?.base_entity_id
              for (let l = subEntityLevel - 1; l >= 0; l--) {
                for (
                  let j = 0;
                  j < levelAddedStructuredJoinings[l].length;
                  j++
                ) {
                  const joining = levelAddedStructuredJoinings[l][j]
                  if (joining.linked_entity_id === lastBaseEntityId) {
                    parents.push(joining)
                    lastBaseEntityId = joining.base_entity_id
                    break
                  }
                }
              }
              const pathAdj0 = parents.reverse()
              const pathAdj = [...pathAdj0, subentityJoining]
              let srcs = [item]
              pathAdj?.forEach((ptJoining) => {
                const newSrc = []
                for (let s = 0; s < srcs.length; s++) {
                  const src = srcs[s]
                  const linkedEntityName = ptJoining?.linked_entity
                    ?.entity_name as string
                  newSrc.push(...(src?.[linkedEntityName] ?? []))
                }
                srcs = newSrc
              })
              values = srcs?.map?.((sr) => sr?.[field.name])
            }

            const itemRawLabel = item?.[field.name]
            const label = getCellLabel(itemRawLabel)
            const labelWithOptions = getCellLabelWithOptions(
              label,
              field,
              values
            )
            // field?.ui_type === 'dropdown' && !!values?.[field.name]?.length
            //   ? values?.[field.name]?.find(
            //       (option: any) => option?.value === label
            //     )?.label ?? label
            //   : label
            const labels = values?.length ? values : [labelWithOptions]
            return (
              <td className="p-2 text-left strabe" key={idx}>
                {labels?.map?.((lab, lIdx) => (
                  <Box key={lIdx}>
                    <EllipsisTextWithTooltip label={lab} />
                  </Box>
                ))}
              </td>
            )
          },
        }
      }
    ) ?? []),
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
        const idField = entity_list_fields?.find((field) => field.is_id_field)
        const idFieldName = idField?.name

        return (
          <td className="p-2 text-left strabe" key={idx}>
            <Stack direction="row" justifyContent="flex-end" gap={1}>
              <Button
                iconButton={true}
                icon={mdiPencil}
                onClick={() =>
                  !!idFieldName &&
                  onEdit(item?.[idFieldName], item, idFieldName)
                }
              />
              <Button
                iconButton={true}
                icon={mdiClockEditOutline}
                onClick={() => {
                  if (!idFieldName) return
                  const url = DATA_CHANGES_ROUTE(
                    entityListId,
                    item?.[idFieldName]
                  )
                  navigate(url)
                }}
              />
              <Button
                iconButton={true}
                icon={mdiDelete}
                onClick={() => {
                  !!idFieldName &&
                    onDelete(item?.[idFieldName], item, idFieldName)
                }}
              />
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
