import React, { PropsWithChildren } from 'react'
import NoResults from './NoResults'
import {
  useTheme,
  Tooltip,
  Skeleton,
  Box,
  Stack,
  Checkbox,
  useMediaQuery,
  lighten,
  BoxProps,
} from '@mui/material'
import {
  DrmFilteredTableHeaderCellProps,
  FilteredTableHeaderCell,
} from './FilteredColumns'
import { EllipsisTextWithTooltip } from '../EllipsisTooltip'
import { Button } from '../buttons/Button/Button'
import { mdiArrowDownThin, mdiArrowUpThin, mdiMinus } from '@mdi/js'
import { FullGestureState, useDrag, useGesture } from '@use-gesture/react'
import { Flex } from '../basics/Flex'

const Thead = (props: BoxProps) => <Box component="thead" {...props} />
const Tr = (props: BoxProps) => <Box component="tr" {...props} />
const Td = (props: BoxProps) => <Box component="td" {...props} />

const RowComponent = (
  props: PropsWithChildren<{
    bind: any
    trProps: any
    onClick: any
    row: any
    getRowColor: any
    rIdx: number
    isDragged?: boolean
    enableDrag?: boolean
  }>
) => {
  const {
    trProps,
    getRowColor,
    onClick,
    row,
    bind,
    rIdx,
    children,
    isDragged,
    enableDrag,
  } = props
  const theme = useTheme()

  return (
    <Tr
      {...trProps?.(row)}
      onClick={onClick}
      sx={{
        borderLeft: getRowColor
          ? `5px solid ${getRowColor?.(row)}`
          : '0px solid',
        // backgroundColor: isDragged
        //   ? theme.palette.primary.light + ' !important'
        //   : undefined,
        ...(trProps?.(row)?.sx ?? {}),
        userSelect: enableDrag ? 'none' : undefined,
        ...(isDragged
          ? {
              '& td': {
                backgroundColor: theme.palette.primary.light,
              },
              '& td:first-of-type': {
                borderTopLeftRadius: 8,
                borderBottomLeftRadius: 8,
              },
              '& td:last-of-type': {
                borderTopRightRadius: 8,
                borderBottomRightRadius: 8,
              },
            }
          : {}),
      }}
      {...bind({ ...row, _idx: rIdx }, rIdx)}
      // key={rIdx}
    >
      {children}
    </Tr>
  )
}

export type TableColumnType<
  TableDataType = any,
  OptionType = { [key: string]: any }
> = DrmFilteredTableHeaderCellProps<TableDataType, OptionType> & {
  isRowSelect?: boolean
  selectedFilters?: string[]
  renderRow?: (
    item: TableDataType,
    cIdx: number,
    rIdx: number
  ) => React.ReactNode
  renderFooterCell?: (footer: any, idx: number) => React.ReactNode
}

export type TableProps<TableDataType = any> = {
  loading?: boolean
  trProps?: (item: any) => { [key: string]: any } // props for TR
  disableSelection?: boolean
  rows: TableDataType[]
  columns: TableColumnType[]
  expandedRowIds?: number[]
  setExpandedRowIds?: (changeFn: (current: number[]) => number[]) => void
  setPageNumber: React.Dispatch<React.SetStateAction<number>>
  headerBackground?: string
  noResultsLabel?: string
  clearFilersLabel?: string
  renderExpandedRows?: (item: TableDataType, idx: number) => React.ReactNode
  // filters
  allFilters: { value: any; filterKey: string }[]
  clearFilters: (newValue?: any) => void
  setAllFilters: React.Dispatch<
    React.SetStateAction<{ value: string; filterKey: string }[]>
  >
  onSetAllFilters?: (allValues: { value: string; filterKey: string }[]) => void
  disableClearFilters?: boolean
  // selecting rows
  selectedRows?: any[]
  onClearSelected?: () => void
  onSelectAll?: () => void
  renderSelectedItem?: (item: TableDataType, idx: number) => any
  onSelectRow?: (item: TableDataType, idx: number) => void
  footer?: any
  getRowColor?: (item: TableDataType) => string
  onExpandedRow?: (item: TableDataType) => void
  disableNoResults?: boolean
  disableTableHeader?: boolean
  useNewSortingMethod?: boolean
  onReorder?: (itemFrom: any, itemTo: any) => void // row index is exposed by _idx
  userSortingIdFieldKey?: string
} & (
  | {
      renderRows: (item: TableDataType, idx: number) => React.ReactNode
      isColRenderMode?: boolean
    }
  | { isColRenderMode: true }
)

export const Table = (props: TableProps) => {
  const {
    loading,
    rows,
    clearFilters,
    columns,
    renderRows,
    selectedRows,
    onClearSelected,
    onSelectAll,
    headerBackground,
    disableClearFilters,
    noResultsLabel,
    clearFilersLabel,
    allFilters,
    setPageNumber,
    setAllFilters,
    isColRenderMode,
    renderSelectedItem,
    onSelectRow,
    footer,
    renderExpandedRows,
    getRowColor,
    onExpandedRow,
    disableSelection,
    expandedRowIds,
    setExpandedRowIds,
    trProps,
    disableNoResults,
    disableTableHeader,
    onSetAllFilters,
    userSortingIdFieldKey,
    onReorder,
  } = { renderRows: null, ...props }

  const [dragging, setDragging] = React.useState<{
    startDragItem: { [key: string]: any; _idx: number }
    currentHoverItem: { [key: string]: any; _idx: number }
  }>({ startDragItem: { _idx: -1 }, currentHoverItem: { _idx: -1 } })

  const bind = useGesture(
    {
      onHover: (state) => {
        const _idx = state?.args?.[1]
        const item = rows?.[_idx]
        if (item) {
          setDragging((current) => ({
            ...current,
            currentHoverItem: !state?.active ? {} : { ...item, _idx },
          }))
        }
      },
      // onDrag: (state) => {
      //   console.log('GENERIC DRAGGING!', state)
      //   // if /
      // },
      onDragStart: (state) => {
        const item = state?.args?.[0]
        const _idx = state?.args?.[1]
        setDragging((current) => ({
          ...current,
          startDragItem: { ...item, _idx },
        }))
      },
      onDragEnd: (state) => {
        onReorder?.(dragging?.startDragItem, dragging?.currentHoverItem)
        setDragging({
          startDragItem: { _idx: -1 },
          currentHoverItem: { _idx: -1 },
        })
      },
    },
    {
      enabled: !!userSortingIdFieldKey,
      // hover :{
      //   po
      // }
      drag: { pointer: { capture: false } },
    }
  )

  const isDraggedItemId = !userSortingIdFieldKey
    ? null
    : rows?.find(
        (row) =>
          row?.[userSortingIdFieldKey] ===
          dragging?.startDragItem?.[userSortingIdFieldKey]
      )?.[userSortingIdFieldKey]
  const hoverId = !userSortingIdFieldKey
    ? null
    : rows?.find(
        (row) =>
          row?.[userSortingIdFieldKey] ===
          dragging?.currentHoverItem?.[userSortingIdFieldKey]
      )?.[userSortingIdFieldKey]

  const adjRows = React.useMemo(() => {
    if (
      !isDraggedItemId ||
      !hoverId ||
      isDraggedItemId === hoverId ||
      !userSortingIdFieldKey
    )
      return rows
    return rows?.map((row, rIdx) =>
      row?.[userSortingIdFieldKey] === isDraggedItemId
        ? dragging?.currentHoverItem
        : row?.[userSortingIdFieldKey] === hoverId
        ? dragging?.startDragItem
        : row
    )
  }, [dragging, rows, isDraggedItemId, hoverId, userSortingIdFieldKey])

  const [openFilters, setOpenFilters] = React.useState(
    () => columns?.map?.(() => false) || []
  )
  React.useEffect(() => {
    if (columns?.length === openFilters?.length) return
    setOpenFilters(columns?.map?.(() => false))
  }, [columns])

  const sortings = React.useMemo(
    () =>
      allFilters?.filter((filter) => filter?.filterKey?.includes('sorting')),
    [allFilters]
  )

  const handleChangeNewSorting = React.useCallback(
    (sortValue: string) => {
      const sortKey = 'sorting'
      const curSortFilter = allFilters?.find(
        (filter) =>
          filter?.filterKey === sortKey && filter.value.includes(sortValue)
      )
      const allFiltersExSortings = allFilters?.filter(
        (filter) => filter?.filterKey !== sortKey
      )
      if (curSortFilter) {
        if (curSortFilter?.value.slice(-3) === 'asc') {
          setAllFilters([
            ...allFiltersExSortings,
            { filterKey: sortKey, value: `${sortValue},desc` },
          ])
          onSetAllFilters?.([
            ...allFiltersExSortings,
            { filterKey: sortKey, value: `${sortValue},desc` },
          ])
        } else {
          setAllFilters(allFiltersExSortings)
          onSetAllFilters?.(allFiltersExSortings)
        }
      } else {
        setAllFilters((current) => [
          ...allFiltersExSortings,
          { filterKey: sortKey, value: `${sortValue},asc` },
        ])
        onSetAllFilters?.([
          ...allFiltersExSortings,
          { filterKey: sortKey, value: `${sortValue},asc` },
        ])
      }
    },
    [allFilters, setAllFilters, onSetAllFilters]
  )

  const handleOpenFilters = React.useMemo(() => {
    return columns.map((col, cIdx) => () => {
      setOpenFilters((current) => [
        ...current.slice(0, cIdx),
        true,
        ...current.slice(cIdx + 1),
      ])
    })
  }, [columns])
  const handleCloseFilters = React.useMemo(
    () =>
      columns.map((col, cIdx) => () => {
        setOpenFilters((current) => [
          ...current.slice(0, cIdx),
          false,
          ...current.slice(cIdx + 1),
        ])
      }),
    [columns]
  )

  const handleClickSelectAll = React.useCallback(() => {
    if (selectedRows?.length === 0) {
      onSelectAll?.()
    } else {
      //Clean it
      onClearSelected?.()
    }
  }, [selectedRows, onSelectAll, onClearSelected])
  const theme = useTheme()
  const hasFinePointer = useMediaQuery('(pointer: fine)')

  const theadStyles = disableTableHeader
    ? {
        opacity: 0,
        border: '0 none',
        height: 0,
      }
    : {}
  const trStyles = disableTableHeader
    ? {
        height: 0,
        opacity: 0,
        border: '0 none',
      }
    : { height: 53 }
  const thStyles = disableTableHeader
    ? {
        height: 0,
        opacity: 0,
        border: '0 none',
      }
    : {}

  const hoverBgColor =
    theme.palette.mode === 'light'
      ? lighten(theme.palette.primary.light, 0.66)
      : theme.palette.primary.dark
  const unevenBgColor = theme.palette.mode === 'light' ? '#fff' : '#666'
  const evenBgColor = theme.palette.mode === 'light' ? '#f7f7f8' : '#333'

  return (
    <Box
      component="table"
      width="100%"
      sx={{
        color: theme.palette.text.primary,
        borderCollapse: 'collapse',
        tableLayout: 'fixed',
        textIndent: 0,
        borderColor: 'inherit',
        borderSpacing: '0px 2px',
        '& thead': {
          ...theadStyles,
          '& tr': {
            ...trStyles,
          },
          '& td': {
            fontSize: '14px',
            color: '#383838',
            fontWeight: 400,
            ...thStyles,
          },
        },
        '& tbody': {
          '& tr': {
            height: '53px',
            background: unevenBgColor,
          },
          ...(hasFinePointer
            ? {
                '& tr:not(.expandable):hover': {
                  backgroundColor: hoverBgColor,
                  '& +tr.expandable': {
                    backgroundColor: hoverBgColor + ' !important',
                  },
                },
                '& tr:not(.expandable):hover+tr.expandable': {
                  backgroundColor: hoverBgColor + ' !important',
                },
              }
            : {}),
          '& tr:nth-of-type(even):not(.expandable)': {
            backgroundColor: evenBgColor,
            '&:hover': {
              backgroundColor: hoverBgColor,
            },
          },
          '& tr:nth-of-type(even):not(.expandable)+tr.expandable': {
            backgroundColor: evenBgColor,
            '&:hover': {
              backgroundColor: hoverBgColor,
            },
          },
        },
      }}
    >
      <Thead
        position="sticky"
        top={0}
        zIndex={20}
        bgcolor={headerBackground}
        // className="sticky z-20 bg-gray-100 -top-[1px]"
        style={headerBackground ? { background: headerBackground } : {}}
      >
        <tr
          className="border border-gray-100 border-l-[5px] h-[0px]"
          style={{ visibility: disableTableHeader ? 'hidden' : 'visible' }}
        >
          {columns?.map((col, cIdx) => {
            const colSorting = sortings?.find((sorting) =>
              sorting?.value?.includes(col?.sortKey ?? '')
            )

            const defaultSelectedFilter = allFilters
              ?.filter((aparam: any) => aparam.filterKey === col?.filterKey)
              ?.map?.((aparam: any) => aparam?.value)

            return col?.isRowSelect ? (
              <Tooltip
                key={cIdx}
                title={`Markiert alle sichtbaren Zeilen. Zum markieren aller Ergebnisse, "Einträge pro Seite" auf "Alle" stellen.`}
                placement="top"
                arrow
                disableFocusListener={!onClearSelected || !onSelectAll}
                disableHoverListener={!onClearSelected || !onSelectAll}
                disableInteractive={!onClearSelected || !onSelectAll}
                disableTouchListener={!onClearSelected || !onSelectAll}
              >
                <td
                  className={'hover:bg-gray-200 ' + col?.className || ''}
                  style={(col as any)?.style}
                >
                  {!disableTableHeader && onClearSelected && onSelectAll && (
                    <Flex
                      // className="relative flex items-center justify-center cursor-pointer "
                      position="relative"
                      alignItems="center"
                      // justifyContent="center"
                      // cursor="pointer"
                      sx={{ cursor: 'pointer' }}
                      onClick={handleClickSelectAll}
                    >
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 13 13"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M0.125 1.54167H1.54167V0.125C0.7625 0.125 0.125 0.7625 0.125 1.54167ZM0.125 7.20833H1.54167V5.79167H0.125V7.20833ZM2.95833 12.875H4.375V11.4583H2.95833V12.875ZM0.125 4.375H1.54167V2.95833H0.125V4.375ZM7.20833 0.125H5.79167V1.54167H7.20833V0.125ZM11.4583 0.125V1.54167H12.875C12.875 0.7625 12.2375 0.125 11.4583 0.125ZM1.54167 12.875V11.4583H0.125C0.125 12.2375 0.7625 12.875 1.54167 12.875ZM0.125 10.0417H1.54167V8.625H0.125V10.0417ZM4.375 0.125H2.95833V1.54167H4.375V0.125ZM5.79167 12.875H7.20833V11.4583H5.79167V12.875ZM11.4583 7.20833H12.875V5.79167H11.4583V7.20833ZM11.4583 12.875C12.2375 12.875 12.875 12.2375 12.875 11.4583H11.4583V12.875ZM11.4583 4.375H12.875V2.95833H11.4583V4.375ZM11.4583 10.0417H12.875V8.625H11.4583V10.0417ZM8.625 12.875H10.0417V11.4583H8.625V12.875ZM8.625 1.54167H10.0417V0.125H8.625V1.54167ZM2.95833 10.0417H10.0417V2.95833H2.95833V10.0417ZM4.375 4.375H8.625V8.625H4.375V4.375Z"
                          fill={
                            selectedRows?.length === 0
                              ? 'black'
                              : theme.palette.primary.main
                          }
                          //   cn({
                          //   black: selectedRows?.length === 0,
                          //   [theme.palette.primary.main]: selectedRows?.length !== 0,
                          // })}
                        />
                      </svg>
                    </Flex>
                  )}
                </td>
              </Tooltip>
            ) : col?.filterOptions && col?.filterKey && col?.getFilterValue ? (
              <FilteredTableHeaderCell
                {...col}
                key={cIdx}
                onOpen={handleOpenFilters?.[cIdx]}
                onClose={handleCloseFilters?.[cIdx]}
                open={openFilters?.[cIdx]}
                selectedFilter={col?.selectedFilters ?? defaultSelectedFilter}
                getIcon={col?.getIcon}
                setAllFilters={setAllFilters}
                onSetAllFilters={onSetAllFilters}
                allFilters={allFilters}
                setPageNumber={setPageNumber}
                changeSorting={handleChangeNewSorting}
                disableTableHeader={disableTableHeader}
              />
            ) : (
              <td
                className={col.className}
                key={cIdx}
                style={(col as any)?.style}
              >
                {!disableTableHeader && (
                  <Tooltip
                    arrow
                    title={col?.headerToolTip ?? ''}
                    placement="top"
                  >
                    <Stack direction="row" gap="2px" pr={1}>
                      <Box width="100%">
                        <EllipsisTextWithTooltip
                          label={
                            typeof col?.header === 'string' ? col?.header : ''
                          }
                          fullWidth={true}
                          useTypography={true}
                        />
                      </Box>
                      {col?.sortKey && (
                        <Stack
                          justifyContent="center"
                          width="24px"
                          height="24px"
                          mt="-3px"
                          gap={1}
                        >
                          <Button
                            type="secondary"
                            iconButton={true}
                            icon={
                              colSorting?.value.includes('asc')
                                ? mdiArrowDownThin
                                : colSorting?.value.includes('desc')
                                ? mdiArrowUpThin
                                : mdiMinus
                            }
                            name={`${col?.sortKey}`}
                            data-testid={`sort-${col?.sortKey}`}
                            onClick={() =>
                              col?.sortKey &&
                              handleChangeNewSorting(col?.sortKey)
                            }
                            // sx={{
                            //   p: '2px',
                            //   border: '1px solid rgba(51, 51, 51, 0.5)',
                            //   borderRadius: '6px',
                            //   width: 18,
                            //   height: 18,
                            //   ml: '2px',
                            // }}
                          />
                        </Stack>
                      )}
                    </Stack>
                  </Tooltip>
                )}
              </td>
            )
          })}
        </tr>
      </Thead>

      <tbody>
        {loading ? (
          new Array(10).fill(0).map((x, xIdx) => (
            <Tr key={xIdx}>
              {columns?.map((y, yIdx) => (
                <td key={`${xIdx}-${yIdx}`} style={{ height: '48px' }}>
                  <Skeleton variant="text" height="36px" />
                </td>
              ))}
            </Tr>
          ))
        ) : (
          <>
            {adjRows?.length && !isColRenderMode ? (
              adjRows.map((item, idx) => renderRows(item, idx))
            ) : adjRows?.length && isColRenderMode ? (
              adjRows.map((row, rIdx) => (
                <React.Fragment key={rIdx}>
                  <RowComponent
                    enableDrag={!!userSortingIdFieldKey}
                    isDragged={
                      row?.[userSortingIdFieldKey ?? ''] === isDraggedItemId &&
                      isDraggedItemId
                    }
                    bind={bind}
                    trProps={trProps}
                    getRowColor={getRowColor}
                    onClick={() => {
                      const id = renderSelectedItem?.(row, rIdx)
                      if (!renderExpandedRows || !id) return
                      setExpandedRowIds?.(((current: number[]) =>
                        // current?.includes(id) ? current?.filter((rowId) => rowId !== id) : [...current, id]
                        current?.includes(id) ? [] : [id]) as any) // only 1 expandable item allowed
                      onExpandedRow?.(row)
                    }}
                    row={row}
                    rIdx={rIdx}
                  >
                    {columns.map((col, cIdx) =>
                      col?.isRowSelect ? (
                        <td className="p-2" key={cIdx}>
                          <div className="flex items-center justify-center">
                            <Checkbox
                              disabled={disableSelection}
                              //sx=
                              //width={'18px'}
                              // height={18}
                              tabIndex={-1}
                              checked={
                                !!selectedRows?.includes?.(
                                  renderSelectedItem?.(row, rIdx) ?? ''
                                )
                              }
                              size="small"
                              onClick={() => {
                                !disableSelection && onSelectRow?.(row, rIdx)
                              }}
                            />
                          </div>
                        </td>
                      ) : (
                        col?.renderRow?.(row, cIdx, rIdx) || <td key={cIdx} />
                      )
                    )}
                  </RowComponent>
                  {expandedRowIds?.includes(
                    renderSelectedItem?.(row, rIdx) ?? ''
                  ) ? (
                    <>
                      {renderExpandedRows?.(row, rIdx)}
                      <tr style={{ height: 2 }} key={`filler-00-${rIdx}`} />
                    </>
                  ) : expandedRowIds ? (
                    <>
                      {/* empty row + gap placeholder to maintain sequence - even/odd*/}
                      <tr style={{ height: 0 }} key={`filler-01-${rIdx}`} />
                      <tr style={{ height: 2 }} key={`filler-02-${rIdx}`} />
                    </>
                  ) : null}
                </React.Fragment>
              ))
            ) : !disableNoResults ? (
              <tr key={'no-result'}>
                <td colSpan={columns?.length}>
                  <NoResults
                    clearFilters={clearFilters}
                    label={noResultsLabel}
                    disableClearFilters={
                      disableClearFilters || (allFilters && !allFilters?.length)
                    }
                    clearFilersLabel={clearFilersLabel}
                  />
                </td>
              </tr>
            ) : null}
          </>
        )}
      </tbody>
      {columns?.find((col) => col?.renderFooterCell) && (
        <tfoot
          className="z-20 bg-gray-100 sticky bottom-0"
          style={headerBackground ? { background: headerBackground } : {}}
        >
          <tr>
            {columns?.map((col, cIdx) => {
              const renderedFooterCell = col?.renderFooterCell?.(footer, cIdx)
              return !renderedFooterCell && renderedFooterCell !== null ? (
                <td key={cIdx} />
              ) : (
                renderedFooterCell
              )
            })}
          </tr>
        </tfoot>
      )}
    </Box>
  )
}
