import { EllipsisTextWithTooltip } from '../../components/EllipsisTooltip'
import { TableColumnType } from '../../components/table/Table'
import { ENTITY_DATABASE_MODEL } from 'common'
import { getEntityIdKey } from 'common/entity_model'
import { mdiPencil, mdiDelete } from '@mdi/js'
import { Box, Stack } from '@mui/material'
import { Button } from '../../components/buttons/Button'

export type AdminEntityColumsParams = {
  type: keyof typeof ENTITY_DATABASE_MODEL
  actions: {
    onEdit: (item: any) => void
    onDelete: (item: any) => void
  }
  values: {
    [key: string]: any[]
  }

  disableTooltips?: boolean
}

export const createAdminEntityColumns = (
  params: AdminEntityColumsParams
): TableColumnType[] => {
  const { actions, type, values, disableTooltips } = params
  const { onEdit, onDelete } = actions ?? {}

  const columns: TableColumnType[] = [
    ...(ENTITY_DATABASE_MODEL?.[type]?.map((field) => ({
      style: { textAlign: !field.is_id_field ? 'center' : 'left' },

      header: field.name,
      renderRow: (item: any, idx: number) => {
        const label =
          item?.[field.name] === true
            ? '✓'
            : item?.[field.name] === false
            ? '✗'
            : (field as any)?.ui_type === 'dropdown' &&
              values?.[field.name]?.find(
                (val: any) => val.value === item?.[field.name]
              )?.label
            ? values?.[field.name]?.find(
                (val: any) => val.value === item?.[field.name]
              )?.label ?? item?.[field.name]
            : Array.isArray(item?.[field.name])
            ? item?.[field.name]?.join(', ')
            : item?.[field.name]
        const tooltipLabel =
          label !== item?.[field.name]
            ? `ID: ${item?.[field.name]} - ${label}`
            : label
        return (
          <td
            className=""
            key={idx}
            style={{ textAlign: !idx ? 'left' : 'center' }}
          >
            {disableTooltips ? (
              <Box>{label}</Box>
            ) : (
              <EllipsisTextWithTooltip
                label={label}
                permanentTitle={tooltipLabel}
              />
            )}
          </td>
        )
      },
    })) ?? []),
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
        // const idKey = ENTITY_DATABASE_MODEL?.[type]?.find(
        //   (field) => field.is_id_field
        // )?.name
        // const isIdField = idKey === item.name
        return (
          <td className="p-2 text-left strabe" key={idx}>
            <Stack
              direction="row"
              justifyContent="flex-end"
              gap={1}
              width="100%"
            >
              <Button
                iconButton={true}
                icon={mdiPencil}
                onClick={() => {
                  onEdit?.(item)
                }}
              />

              <Button
                iconButton={true}
                icon={mdiDelete}
                onClick={() => {
                  const type = params?.type
                  const idKey = getEntityIdKey(type)
                  const id = item?.[idKey as any]
                  onDelete?.(id)
                }}
              />
            </Stack>
          </td>
        )
      },
    },
  ]
  return columns
}
