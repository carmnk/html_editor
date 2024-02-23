import React from 'react'
import {
  Box,
  IconButton,
  Popover,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material'
import { MenuItem } from '@mui/material'
import ListItemIcon from '@mui/material/ListItemIcon'
import { Button } from '../buttons/Button/Button'
import { FilterType } from './Types'
import {
  mdiArrowDownThin,
  mdiArrowUpThin,
  mdiCheck,
  mdiFilter,
  mdiLock,
  mdiMinus,
} from '@mdi/js'
import Icon from '@mdi/react'
import CTextField from '../inputs/CTextField'

export interface DrmTableSelectHeaderCellProps {
  className?: string
  isRowSelect?: boolean
}

export interface DrmUnfilteredHeaderCellProps {
  className?: string
  header?: React.ReactNode
  headerToolTip?: string
  headerClass?: string
  sortKey?: string
}

export interface DrmFilteredTableHeaderCellProps<
  TableDataType = any,
  OptionType = { [key: string]: any }
> extends DrmUnfilteredHeaderCellProps {
  filterOptions?: OptionType[]
  isFilterLocked?: boolean
  sortKey?: string
  getFilterValue?: (item: OptionType) => string
  renderFilterKey?: (key: any, value: any) => any
  additionalFilterKeys?: string[]
  getIcon?: (item: TableDataType) => React.ReactNode
  getItemLabel?: (item: OptionType) => string
  filterKey?: string
}

export interface FilteredTableHeaderCellProps
  extends DrmFilteredTableHeaderCellProps {
  // dynmic props
  onOpen: () => void
  onClose: () => void
  open: boolean
  selectedFilter?: string[]
  allFilters: FilterType[]
  onSetAllFilters?: (allValues: { value: string; filterKey: string }[]) => void
  changeSorting: (filterKey: string) => void
  setAllFilters: React.Dispatch<React.SetStateAction<FilterType[]>>
  setPageNumber: any
  // misc
  injectAddFilterOnActiveFilter?: FilterType // not used anymore
  disableTableHeader?: boolean // not required anymore?
}

export const FilteredTableHeaderCell = React.forwardRef(
  (props: FilteredTableHeaderCellProps, ref: any) => {
    const {
      onOpen,
      onClose,
      open,
      selectedFilter,
      filterOptions = [],
      header = '',
      getIcon,
      getItemLabel,
      getFilterValue,
      renderFilterKey,
      className,
      setAllFilters,
      filterKey,
      additionalFilterKeys,
      allFilters,
      isFilterLocked,
      setPageNumber,
      sortKey,
      injectAddFilterOnActiveFilter,
      headerClass,
      headerToolTip,
      onSetAllFilters,
      changeSorting,
      disableTableHeader,
    } = props

    const [searchValue, setSearchValue] = React.useState('')
    const initialFilters = React.useRef(selectedFilter)
    const initialAllFilters = React.useRef(allFilters)
    const filteredOptions = React.useMemo(() => {
      return !searchValue
        ? filterOptions
        : filterOptions?.filter((opt) =>
            (getItemLabel?.(opt)?.toLowerCase() || '').includes(
              searchValue.toLowerCase()
            )
          )
    }, [searchValue, filterOptions, getItemLabel])

    const handleOnFilter = React.useCallback(
      (val: any, key: any) => {
        const value = getFilterValue?.(val)
        if (value === undefined) return
        const keyAdj = renderFilterKey ? renderFilterKey(key, value) : key
        if (
          selectedFilter &&
          selectedFilter.length > 0 &&
          selectedFilter.includes(value)
        ) {
          const filteredAllFilters = allFilters.filter(
            (item) => item.value !== value
          )
          const adjFilteredAllFilters = !injectAddFilterOnActiveFilter
            ? filteredAllFilters
            : filteredAllFilters?.filter(
                (filter) =>
                  filter.filterKey !==
                    injectAddFilterOnActiveFilter?.filterKey &&
                  filter?.value === injectAddFilterOnActiveFilter?.value
              )
          setAllFilters(adjFilteredAllFilters)
          onSetAllFilters?.(adjFilteredAllFilters)
          setPageNumber(1)
        } else {
          if (!injectAddFilterOnActiveFilter) {
            setAllFilters((current) => [
              ...current,
              { value, filterKey: keyAdj },
            ])
            onSetAllFilters?.([...allFilters, { value, filterKey: keyAdj }])
          } else {
            setAllFilters((current) => [
              ...(current?.filter?.(
                (filter) =>
                  filter.filterKey !==
                    injectAddFilterOnActiveFilter?.filterKey &&
                  filter?.value === injectAddFilterOnActiveFilter?.value
              ) ?? []),
              { value, filterKey: keyAdj },
              {
                value: injectAddFilterOnActiveFilter?.value,
                filterKey: injectAddFilterOnActiveFilter?.filterKey,
              },
            ])
            onSetAllFilters?.([
              ...(allFilters?.filter?.(
                (filter) =>
                  filter.filterKey !==
                    injectAddFilterOnActiveFilter?.filterKey &&
                  filter?.value === injectAddFilterOnActiveFilter?.value
              ) ?? []),
              { value, filterKey: keyAdj },
              {
                value: injectAddFilterOnActiveFilter?.value,
                filterKey: injectAddFilterOnActiveFilter?.filterKey,
              },
            ])
          }
          setPageNumber(1)
        }
      },
      [
        setPageNumber,
        getFilterValue,
        selectedFilter,
        setAllFilters,
        allFilters,
        renderFilterKey,
        injectAddFilterOnActiveFilter,
        onSetAllFilters,
      ]
    )

    const handleSearchValueChange = React.useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value as any
        if (!value && value !== '' && value !== 0) return
        setSearchValue(value)
      },
      []
    )

    React.useEffect(() => {
      if (!open) {
        setSearchValue('')
        return
      }
      initialFilters.current = selectedFilter
      initialAllFilters.current = allFilters
    }, [open]) // only when open changes!

    const anchor = React.useRef(null)

    const handleToggleOpen = React.useCallback(() => {
      if (isFilterLocked) return
      if (open) onClose?.()
      else onOpen?.()
    }, [open, onOpen, onClose, isFilterLocked])

    const clearFilter = React.useCallback(() => {
      setAllFilters((current) =>
        current.filter(
          (filter) =>
            ![filterKey, ...(additionalFilterKeys ?? [])]?.includes?.(
              filter?.filterKey
            )
        )
      )
      onSetAllFilters?.(
        allFilters.filter(
          (filter) =>
            ![filterKey, ...(additionalFilterKeys ?? [])]?.includes?.(
              filter?.filterKey
            )
        )
      )
    }, [
      setAllFilters,
      filterKey,
      additionalFilterKeys,
      allFilters,
      onSetAllFilters,
    ])

    const selectAll = React.useCallback(() => {
      if (!filterKey) return
      //  const keyAdj = renderFilterKey ? renderFilterKey(key) : key
      setAllFilters((current) => [
        ...current.filter(
          (filter) =>
            ![filterKey, ...(additionalFilterKeys ?? [])]?.includes?.(
              filter?.filterKey
            )
        ),
        ...(filterOptions?.map((opt) => ({
          value: getFilterValue?.(opt) ?? '',
          filterKey: renderFilterKey
            ? renderFilterKey(filterKey, getFilterValue?.(opt))
            : filterKey,
        })) ?? []),
      ])
      onSetAllFilters?.([
        ...allFilters.filter(
          (filter) =>
            ![filterKey, ...(additionalFilterKeys ?? [])]?.includes?.(
              filter?.filterKey
            )
        ),
        ...(filterOptions?.map((opt) => ({
          value: getFilterValue?.(opt) ?? '',
          filterKey: renderFilterKey
            ? renderFilterKey(filterKey, getFilterValue?.(opt))
            : filterKey,
        })) ?? []),
      ])
    }, [
      filterOptions,
      filterKey,
      getFilterValue,
      setAllFilters,
      additionalFilterKeys,
      renderFilterKey,
      allFilters,
      onSetAllFilters,
    ])

    const handleResetFilter = React.useCallback(() => {
      setAllFilters?.(initialAllFilters.current)
      onSetAllFilters?.(initialAllFilters.current)
      onClose?.()
    }, [onClose, onSetAllFilters])

    const handleKeyUpMenuItem = React.useCallback(
      (e: React.KeyboardEvent, item: any) => {
        if (e?.type !== 'keyup' || e?.key !== 'Enter') return
        handleOnFilter?.(item, filterKey)
      },
      [handleOnFilter, filterKey]
    )
    const handleClickMenuItem = React.useCallback(
      (e: React.MouseEvent, item: any) => {
        if (e?.type === 'keydown') return
        handleOnFilter?.(item, filterKey)
        // onClose?.()
      },
      [handleOnFilter, filterKey]
    )

    const handleKeyUpSearchField = React.useCallback(
      (e: React.KeyboardEvent & { sourceEvent?: 'onClear' }) => {
        if (e?.sourceEvent === 'onClear') {
          setSearchValue('')
        }
        if (
          e?.type !== 'keyup' ||
          e?.key !== 'Enter' ||
          filteredOptions?.length > 1 ||
          e?.sourceEvent === 'onClear'
        )
          return
        handleOnFilter?.(filteredOptions?.[0], filterKey)
        // onClose?.()
      },
      [filteredOptions, handleOnFilter, filterKey]
    )
    const sortings = React.useMemo(
      () =>
        allFilters?.filter((filter) => filter?.filterKey?.includes('sorting')),

      [allFilters]
    )
    const colSorting = sortings?.find((sorting) =>
      sorting?.value?.includes(sortKey ?? '')
    )

    const handleChangeSorting = React.useCallback(
      (
        e: React.MouseEvent<HTMLButtonElement> & { target: { name: string } }
      ) => {
        e?.stopPropagation?.()
        if (!sortKey) return
        changeSorting(sortKey)
      },
      [changeSorting, sortKey]
    )

    return (
      <>
        <Tooltip
          arrow
          title={!disableTableHeader && headerToolTip ? headerToolTip : ''}
          placement="top"
        >
          <td
            style={
              !isFilterLocked && selectedFilter && selectedFilter.length > 0
                ? { background: '#E5E5E5' }
                : {}
            }
            // className={
            //   (!isFilterLocked
            //     ? `relative p-2 text-left hover:bg-[#e5e5e5] cursor-pointer `
            //     : `relative p-2 text-left `) + className
            // }
            onClick={handleToggleOpen}
            ref={anchor}
            data-testid={`filter-${filterKey}`}
          >
            {!disableTableHeader && (
              <Stack
                alignItems="center"
                height="24px"
                mt="-3px"
                direction="row"
                gap={1}
                pr={1}
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  flexGrow={
                    header || !(!isFilterLocked && !selectedFilter?.length)
                      ? 1
                      : 0
                  }
                  minWidth={0}
                  flexBasis={0}
                  pl={header ? 0 : 0.5}
                >
                  {/* {isFilterLocked ? (
              <div className="mr-2">
                <Locked />
              </div>
            ) : ( */}
                  {!isFilterLocked &&
                    selectedFilter &&
                    selectedFilter.length > 0 && (
                      <Icon path={mdiFilter} size={1} color="#000" />
                    )}
                  {/* )} */}
                  {header && (
                    <Typography
                      fontWeight={
                        !isFilterLocked &&
                        selectedFilter &&
                        selectedFilter.length > 0
                          ? 700
                          : undefined
                      }
                    >
                      {/* <div
                        className={`ellipsis ${
                          !isFilterLocked &&
                          selectedFilter &&
                          selectedFilter.length > 0 &&
                          `font-bold`
                        }${headerClass || ''}`}
                      > */}
                      {header}
                      {/* </div> */}
                    </Typography>
                  )}
                </Stack>

                {!!sortKey && (
                  <Button
                    type="secondary"
                    iconButton={true}
                    // color="primary"

                    name={sortKey}
                    // size="small"
                    data-testid={`sort-${sortKey}`}
                    onClick={handleChangeSorting}
                    // sx={{
                    //   p: '2px',
                    //   border: '1px solid rgba(51, 51, 51, 0.5)',
                    //   borderRadius: '6px',
                    //   width: 18,
                    //   height: 18,
                    //   ml: '2px',
                    // }}
                    icon={
                      colSorting?.value.includes('asc')
                        ? mdiArrowDownThin
                        : colSorting?.value.includes('desc')
                        ? mdiArrowUpThin
                        : mdiMinus
                    }
                  />
                )}
                {/* <div style={{ pointerEvents: 'none' }}>
                      {colSorting?.value.includes('asc') ? (
                        <CIconButton mdiIconPath={mdiArrowDownThin} />
                      ) : colSorting?.value.includes('desc') ? (
                        <CIconButton mdiIconPath={mdiArrowUpThin} />
                      ) : (
                        <CIconButton mdiIconPath={mdiMinus} />
                      )}
                    </div> */}
                {/* </CIconButton> */}
                {!!isFilterLocked && (
                  <IconButton
                    // color="primary"
                    size="small"
                    disabled
                    sx={{
                      p: '2px',
                      // border: '1px solid rgba(51, 51, 51, 0.5)',
                      borderRadius: '6px',
                      width: 18,
                      height: 18,
                      ml: '2px',
                    }}
                  >
                    <div style={{ pointerEvents: 'none' }}>
                      <Icon path={mdiLock} size={1} color="#000" />
                    </div>
                  </IconButton>
                )}

                {!isFilterLocked && !selectedFilter?.length && (
                  <Button
                    type="secondary"
                    iconButton={true}
                    data-testid={`filter-btn-${filterKey}`}
                    // size="small"
                    name={filterKey}
                    // onClick={handleChangeSorting}

                    icon={mdiFilter}
                  />
                )}
              </Stack>
            )}
          </td>
        </Tooltip>
        {open && !isFilterLocked && (
          <Popover
            data-testid={`filter-${filterKey}-popover`}
            anchorEl={anchor.current}
            open={!!open}
            onClose={onClose}
            sx={{
              height: 380,
              minWidth: 270,
              // maxWidth: 320,
              // position: 'relative',
            }}
            PaperProps={{ sx: { minWidth: 270, minHeight: 415 } }}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <div className="relative">
              <Box
                sx={{ p: 2 }}
                className="top-0 z-10 p-4 pt-4 bg-[#fff] h-[120px]"
              >
                <Stack direction="row" gap={2}>
                  <Button
                    type="text"
                    spanSx={{ fontWeight: 400, textDecoration: 'underline' }}
                    onClick={selectAll}
                  >
                    Alle auswählen
                  </Button>
                  <Button
                    type="text"
                    spanSx={{ fontWeight: 400, textDecoration: 'underline' }}
                    onClick={clearFilter}
                  >
                    Filter entfernen
                  </Button>
                </Stack>
                <div className="pt-4 pb-4">
                  <CTextField
                    fullWidth={true}
                    value={searchValue}
                    onChange={handleSearchValueChange}
                    InputProps={{ sx: { background: '#fafafa' } }}
                    autoFocus={true}
                    onKeyUp={handleKeyUpSearchField}
                  />
                </div>
              </Box>
              <div
                style={{
                  height: 220,
                  overflowY: 'auto',
                  overflowX: 'hidden',
                }}
              >
                {filteredOptions &&
                  filteredOptions.length > 0 &&
                  filteredOptions.map((item, idx) => (
                    <MenuItem
                      tabIndex={0}
                      onClick={(e) => handleClickMenuItem?.(e, item)}
                      onKeyUp={(e) => handleKeyUpMenuItem(e, item)}
                      key={idx}
                      sx={{
                        borderBottom: '1px solid #efefef',
                        height: 55,
                      }}
                    >
                      <ListItemIcon>
                        <div className="flex items-center">
                          {selectedFilter &&
                            selectedFilter.length > 0 &&
                            // ![undefined, null].includes(getFilterValue?.(item) as any) &&
                            selectedFilter.includes(getFilterValue!(item)) && (
                              <Icon path={mdiCheck} size={1} color="#5FC086" />
                            )}
                          <div className="pr-2">
                            {getIcon && getIcon?.(item)}
                          </div>
                        </div>
                      </ListItemIcon>

                      <Typography>
                        {getItemLabel && (
                          <div
                            className={
                              selectedFilter &&
                              selectedFilter.length > 0 &&
                              getFilterValue?.(item) &&
                              selectedFilter.includes(getFilterValue?.(item))
                                ? 'font-bold'
                                : ''
                            }
                          >
                            {getItemLabel(item)}
                          </div>
                        )}
                      </Typography>
                    </MenuItem>
                  ))}
              </div>
            </div>
            <Stack
              direction="row"
              position="absolute"
              width="100%"
              px={2}
              bottom={0}
              right={0}
              alignItems="center"
              justifyContent="flex-end"
              // className="absolute bottom-0 flex items-center justify-end w-full px-4"
              style={{ height: 75, gap: 24 }}
            >
              <Button
                type="text"
                sx={{ height: 33 }}
                onClick={() => {
                  handleResetFilter?.()
                  onClose?.()
                }}
              >
                Abbrechen
              </Button>{' '}
              <Button
                sx={{ pl: 1, pr: 2 }}
                spanSx={{ ml: 1 }}
                onClick={() => {
                  onClose?.()
                }}
              >
                Fertig
              </Button>
            </Stack>
          </Popover>
        )}
      </>
    )
  }
)
FilteredTableHeaderCell.displayName = 'FilteredTableHeaderCell'
