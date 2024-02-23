import React from 'react'
import { useLocation } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import {
  updateSubscriptionTableSearchValue,
  updateTableSearchValue,
} from '../../store/reducers/userStore'
// import { useReactiveInfo2 } from '../../utils/react'
import { FilterType } from './Types'

export type TableUiType = {
  searchValue: string
  searchParam: string
  pageNumber: number
  itemsPerPage: number
  allFilters: FilterType[]
}

type GenericFilterType = { filterKey: string; value: any }

export type TableHookProps = {
  onStartLoading?: () => void
  onFetch: (url: string, srcUrl?: string) => void
  url: string
  externalFilters?: { filterKey: string; value: any }[]
  initial?: {
    allFilters?: { filterKey: string; value: any }[]
    searchParam?: string
    pageNumber?: number
    itemsPerPage?: number
  }
  onUpdateTableParams?: (newValue: {
    allFilters: { filterKey: string; value: any }[]
    searchParam: string
    pageNumber: number
    itemsPerPage: number
    // externalFilters: { filterKey: string; value: any }[]
  }) => void
  onChangeItemsPerPage?: (newvalue: number) => void
  itemsPerPageStorageKey?: string
  preprocessFilters?: (
    filtersIn: { filterKey: string; value: any }[]
  ) => { filterKey: string; value: any }[]
  postprocessFilters?: (
    filtersIn: { filterKey: string; value: any }[]
  ) => { filterKey: string; value: any }[]
  searchValue?: string
  isUnpaginated?: boolean
  disablePagination?: boolean
  scrollContainer?: any
}

export const useTableUi = (props: TableHookProps) => {
  const {
    externalFilters,
    url,
    onFetch,
    onStartLoading,
    initial,
    onUpdateTableParams,
    onChangeItemsPerPage,
    itemsPerPageStorageKey,
    preprocessFilters,
    postprocessFilters,
    searchValue,
    isUnpaginated,
    disablePagination,
    scrollContainer,
  } = props ?? {}
  const {
    allFilters: initialAllFilters,
    searchParam: initialSearchParam,
    pageNumber: initialPageNumber,
  } = initial || {}
  const { paginationSize } =
    JSON?.parse?.(localStorage?.getItem?.('userSettings') || '{}') || {}
  const specificPaginationSize =
    !!itemsPerPageStorageKey && paginationSize?.[itemsPerPageStorageKey]
  const [tableUi, setTableUi] = React.useState<TableUiType>({
    searchValue: searchValue ?? initialSearchParam ?? '',
    searchParam: searchValue ?? initialSearchParam ?? '',
    pageNumber: initialPageNumber ?? 1,
    itemsPerPage: isUnpaginated ? 999999 : specificPaginationSize || 20,
    allFilters: initialAllFilters ?? [],
  })

  const handleSeachChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      if (!value && value !== '') return
      setTableUi((current) => ({ ...current, searchValue: value }))
    },
    []
  )
  const handleSeachParamChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      if (!value && value !== '') return
      setTableUi((current) => {
        onUpdateTableParams?.({
          allFilters: current?.allFilters,
          searchParam: value,
          pageNumber: current?.pageNumber,
          itemsPerPage: current?.itemsPerPage,
        })
        return { ...current, searchParam: value }
      })
    },
    [onUpdateTableParams]
  )
  const handleSearchKeyUp = React.useCallback(
    (
      e: React.KeyboardEvent<HTMLInputElement> &
        React.ChangeEvent<HTMLInputElement>
    ) => {
      const value = e.target.value
      if (!value && value !== '') return
      if (e?.type !== 'keyup' || e?.key !== 'Enter') return
      setTableUi((current) => {
        onUpdateTableParams?.({
          allFilters: current?.allFilters,
          searchParam: value,
          pageNumber: current?.pageNumber,
          itemsPerPage: current?.itemsPerPage,
        })
        return { ...current, pageNumber: 1, searchParam: value }
      })
    },
    [onUpdateTableParams]
  )
  const clearFilters = React.useCallback(() => {
    setTableUi((current) => {
      onUpdateTableParams?.({
        allFilters: [],
        searchParam: current?.searchParam,
        pageNumber: current?.pageNumber ?? 1,
        itemsPerPage: current?.itemsPerPage,
      })
      return { ...current, allFilters: [] }
    })
  }, [onUpdateTableParams])

  const makeUrl = React.useCallback(() => {
    const searchParam = searchValue ?? tableUi?.searchParam
    const searchTerms = !searchParam
      ? ''
      : 'search_term=' +
        searchParam
          .split(' ')
          .filter((searchTerm) => searchTerm !== '')
          .join('&search_term=')

    const transformedExternalFilters =
      preprocessFilters && externalFilters
        ? preprocessFilters?.(externalFilters)
        : externalFilters
    const transformedInternalFilters = preprocessFilters
      ? preprocessFilters?.(tableUi?.allFilters)
      : tableUi?.allFilters

    const adjInternalFilters = transformedInternalFilters?.filter((uiFilter) =>
      !transformedExternalFilters?.length
        ? true
        : !transformedExternalFilters?.find(
            (externalFilter) => externalFilter.filterKey === uiFilter?.filterKey
          ) ||
          transformedExternalFilters?.find(
            (externalFilter) =>
              externalFilter.filterKey === uiFilter?.filterKey &&
              uiFilter?.value === externalFilter?.value
          )
    )
    const adjPostProcessedInternalFilters = postprocessFilters
      ? postprocessFilters(adjInternalFilters)
      : adjInternalFilters
    const filterTermArray = adjPostProcessedInternalFilters?.map(
      (filter, fIdx) =>
        `${!fIdx ? '' : '&'}${filter?.filterKey}=${filter.value}`
    )

    const filterTerms = filterTermArray?.join?.('') || ''
    const externalFilterTermArray = (
      transformedExternalFilters?.length
        ? transformedExternalFilters?.filter(
            (externalFilter) =>
              !transformedInternalFilters?.find(
                (uiFilter) => uiFilter?.filterKey === externalFilter.filterKey //&& uiFilter?.value === externalFilter?.value
              )
          )
        : []
    )
      // ? []
      // : transformedExternalFilters
      ?.map(
        (externalFilter, eIdx) =>
          `${!eIdx ? '' : '&'}${externalFilter?.filterKey}=${
            externalFilter.value
          }`
      )
    const externalFilterTerms = externalFilterTermArray?.join?.('') ?? ''

    const fullUrl = disablePagination
      ? `${url}?${searchTerms}${
          filterTerms && searchTerms ? '&' : ''
        }${filterTerms}${
          externalFilterTerms && (searchTerms || filterTerms) ? '&' : ''
        }${externalFilterTerms}`
      : `${url}?page_number=${tableUi?.pageNumber}&page_size=${
          tableUi?.itemsPerPage
        }${searchTerms ? '&' : ''}${searchTerms}${
          filterTerms ? '&' : ''
        }${filterTerms}${externalFilterTerms ? '&' : ''}${externalFilterTerms}`
    const paramsString = disablePagination
      ? `${searchTerms}${filterTerms && searchTerms ? '&' : ''}${filterTerms}${
          externalFilterTerms && (searchTerms || filterTerms) ? '&' : ''
        }${externalFilterTerms}`
      : `page_number=${tableUi?.pageNumber}&page_size=${tableUi?.itemsPerPage}${
          searchTerms ? '&' : ''
        }${searchTerms}${filterTerms ? '&' : ''}${filterTerms}${
          externalFilterTerms ? '&' : ''
        }${externalFilterTerms}`
    const unpaginatedParamsString = `${searchTerms}${
      !searchTerms ? '' : '&'
    }${filterTerms}${
      (!searchTerms && !filterTerms) || !externalFilterTerms ? '' : '&'
    }${externalFilterTerms}`

    return {
      fullUrl,
      paramsString,
      unpaginatedParamsString,
    }
  }, [
    externalFilters,
    tableUi?.allFilters,
    tableUi?.searchParam,
    tableUi?.itemsPerPage,
    tableUi?.pageNumber,
    url,
    preprocessFilters,
    searchValue,
  ])

  React.useEffect(() => {
    if (searchValue === undefined) return
    setTableUi((current) => {
      onUpdateTableParams?.({
        allFilters: current?.allFilters,
        searchParam: searchValue,
        pageNumber: current?.pageNumber,
        itemsPerPage: current?.itemsPerPage,
      })
      return { ...current, pageNumber: 1, searchParam: searchValue }
    })
  }, [searchValue])

  const handleFetchTableData = React.useCallback(async () => {
    onStartLoading?.()
    const { fullUrl: urlAdj } = makeUrl()
    return await onFetch(urlAdj, url)
  }, [onFetch, onStartLoading, makeUrl, url])

  // const info = useReactiveInfo2([
  //   externalFilters,
  //   tableUi?.allFilters,
  //   tableUi?.searchParam,
  //   tableUi?.itemsPerPage,
  //   tableUi?.pageNumber,
  //   url,
  //   onFetch,
  //   preprocessFilters,
  //   onStartLoading,
  //   makeUrl,
  //   url,
  //   handleFetchTableData,
  // ])
  // console.log('REACTIVE INFO: ', info)

  React.useEffect(() => {
    handleFetchTableData()
  }, [handleFetchTableData])

  // migration Function
  const setAllFilters = React.useCallback(
    (
      newValue:
        | ((current: GenericFilterType[]) => GenericFilterType[])
        | GenericFilterType[]
    ) => {
      setTableUi((current) => {
        const newFiltersValue =
          typeof newValue === 'function'
            ? newValue?.(current?.allFilters)
            : newValue
        onUpdateTableParams?.({
          allFilters: newFiltersValue,
          searchParam: current?.searchParam ?? '',
          pageNumber: current?.pageNumber ?? 1,
          itemsPerPage: current?.itemsPerPage,
        })
        return {
          ...current,
          allFilters: newFiltersValue,
        }
      })
    },
    [onUpdateTableParams]
  )
  const changePageNumber = React.useCallback(
    (newValue: ((current: number) => number) | number) => {
      setTableUi((current) => {
        const newPageNumber =
          typeof newValue === 'function'
            ? newValue(current?.pageNumber)
            : newValue
        onUpdateTableParams?.({
          allFilters: current?.allFilters,
          searchParam: current?.searchParam,
          pageNumber: newPageNumber,
          itemsPerPage: current?.itemsPerPage,
        })
        // Scroll to a certain element
        const scroollContainerElement = document.querySelector(
          `#${scrollContainer ?? 'scoll_container'}`
        )
        if (scroollContainerElement)
          scroollContainerElement.scrollTo({
            top: 0, // could be negative value
            left: 0,
            behavior: 'smooth',
          })

        return {
          ...current,
          pageNumber: newPageNumber,
        }
      })
    },
    [onUpdateTableParams, scrollContainer]
  )
  const changeItemsPerPage = React.useCallback(
    (newValue: ((current: number) => number) | number) => {
      setTableUi((current) => {
        const newValueAdj =
          typeof newValue === 'function'
            ? newValue(current?.itemsPerPage)
            : newValue
        onChangeItemsPerPage?.(newValueAdj)
        if (itemsPerPageStorageKey) {
          const current =
            JSON?.parse?.(localStorage?.getItem?.('userSettings') || '{}') || {}
          const newPrefs = {
            paginationSize: {
              ...current?.paginationSize,
              [itemsPerPageStorageKey]: newValueAdj || 20,
            },
          }
          localStorage.setItem('userSettings', JSON.stringify(newPrefs))
        }
        return {
          ...current,
          itemsPerPage: newValueAdj,
        }
      })
    },
    [itemsPerPageStorageKey, onChangeItemsPerPage]
  )

  const UrlParams = React.useMemo(() => makeUrl(), [makeUrl])

  return {
    tableUi,
    setTableUi,
    handleSeachChange,
    handleSeachParamChange,
    handleSearchKeyUp,
    clearFilters,
    setAllFilters,
    updateData: handleFetchTableData,
    changePageNumber,
    changeItemsPerPage,
    UrlParams,
  }
}

export type useSearchValueParams = {
  project_id?: number
  seachValueStorePathIn?: string
}

export const useSearchValue = (params: useSearchValueParams) => {
  const { project_id, seachValueStorePathIn } = {
    project_id: undefined,
    ...params,
  }
  

  const history = useLocation()
  const dispatch = useAppDispatch()

  const isChecklist = !!history?.pathname.match(
    /\/project\/[0-9]+\/checklist/
  )
  const isSubscriptionsList = !!history?.pathname.match(
    /\/project\/[0-9]+\/subscriptions/
  )
  const isDocumentsEntryList = !!history?.pathname.match(
    /\/project\/[0-9]+\/document_management/
  )
  const seachValueStorePath =
    seachValueStorePathIn ??
    (isSubscriptionsList && project_id
      ? 'subscriptions'
      : isChecklist
      ? 'project_tasks'
      : isDocumentsEntryList
      ? 'project_required_documents'
      : '')
  const searchValueDefault = useAppSelector(
    (state) =>
      state.userReducer.appState.tableParameters?.[
        seachValueStorePath ?? 'undefined'
      ]?.searchParam
  )
  const searchValueSubscriptions = useAppSelector(
    (state) =>
      state.userReducer.appState.tableParameters?.subscriptions?.[
        project_id ?? 0
      ]?.searchParam
  )

  const handleChangeSearchValueDefault = React.useCallback(
    (newValue: string, path: string) => {
      if (!path) return
      dispatch(updateTableSearchValue({ path, newValue }))
    },
    [dispatch]
  )
  const handleChangeSubscriptionSearchValue = React.useCallback(
    (newValue: string) => {
      if (!project_id) return
      dispatch(updateSubscriptionTableSearchValue({ project_id, newValue }))
    },
    [dispatch, project_id]
  )

  const handleChangeSearchValue = React.useCallback(
    (newValue: string) => {
      const isChecklist = !!history?.pathname.match(
        /\/project\/[0-9]+\/checklist/
      )
      const isSubscriptionsList = !!history?.pathname.match(
        /\/project\/[0-9]+\/subscriptions/
      )
      const isDocumentsEntryList = !!history?.pathname.match(
        /\/project\/[0-9]+\/document_management/
      )
      const seachValueStorePath =
        seachValueStorePathIn ??
        (isSubscriptionsList && project_id
          ? 'subscriptions'
          : isChecklist
          ? 'project_tasks'
          : isDocumentsEntryList
          ? 'project_required_documents'
          : '')
      if (seachValueStorePath === 'subscriptions')
        handleChangeSubscriptionSearchValue(newValue)
      else handleChangeSearchValueDefault(newValue, seachValueStorePath)
    },
    [
      handleChangeSearchValueDefault,
      handleChangeSubscriptionSearchValue,
      history?.pathname,
      project_id,
      seachValueStorePathIn,
    ]
  )

  if (isSubscriptionsList && !project_id) return ['', (newValue: string) => {}]
  return [
    isSubscriptionsList ? searchValueSubscriptions : searchValueDefault ?? '',
    handleChangeSearchValue,
  ]
}
