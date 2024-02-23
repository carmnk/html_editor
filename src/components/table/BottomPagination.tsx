import React from 'react'
import { Box, Stack, Typography, useMediaQuery, useTheme } from '@mui/material'
import { SecondaryText } from '../basics/Typography'
import { mdiArrowLeft, mdiArrowRight } from '@mdi/js'
import { Button } from '../buttons/Button/Button'

export type BottomPaginationType = {
  number: number
  pageNumber: number
  changePage: any
  changeSize: any
  itemPerPage: number | 'ALL'
  selectedElement?: any
  disableContainer?: boolean
  disablePaginationSizeInLocalStorage?: boolean
  itemsPerPageStorageKey: string
}

const BottomPagination = (props: BottomPaginationType) => {
  const {
    number,
    pageNumber,
    changePage,
    changeSize,
    itemPerPage,
    selectedElement,
    // disableContainer,
    disablePaginationSizeInLocalStorage,
    itemsPerPageStorageKey,
  } = props
  const theme = useTheme()
  const isDesktopViewport = useMediaQuery(theme.breakpoints.up('xl'))
  const itemsPerPageAdj = itemPerPage === 'ALL' ? number : itemPerPage

  const calculatePagesCount = (pageSize: number, totalCount: number) => {
    // we suppose that if we have 0 items we want 1 empty page
    return totalCount < pageSize ? 1 : Math.ceil(totalCount / pageSize)
  }

  const handleChangePage = (size: number) => {
    if (!disablePaginationSizeInLocalStorage) {
      const current =
        JSON?.parse?.(localStorage?.getItem?.('userSettings') || '{}') || {}
      const newPrefs = {
        paginationSize: {
          ...current?.paginationSize,
          [itemsPerPageStorageKey]: size === number ? 100 : size,
        },
      }
      localStorage.setItem('userSettings', JSON.stringify(newPrefs))
    }
    changeSize(size)
    changePage(1)
  }

  return (
    <div>
      <div>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'auto auto auto',
            justifyItems: 'center',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: '100%',
            mr: 'auto',
            ml: 'auto',
            pt: 1,
          }}
        >
          <Stack direction="row" gap={1} alignItems="center">
            <Typography>Einträge pro Seite:</Typography>

            <Stack direction="row" gap={1} alignItems="center">
              {
                /*process?.env?.REACT_APP_ENV === 'dev' && a*/ <Button
                  onClick={() => handleChangePage(2)}
                  type={itemsPerPageAdj === 2 ? 'primary' : 'secondary'}
                >
                  2 (DEV)
                </Button>
              }
              <Button
                onClick={() => handleChangePage(20)}
                type={itemsPerPageAdj === 20 ? 'primary' : 'secondary'}
              >
                20
              </Button>

              <Button
                onClick={() => handleChangePage(50)}
                type={itemsPerPageAdj === 50 ? 'primary' : 'secondary'}
              >
                50
              </Button>
              <Button
                onClick={() => handleChangePage(100)}
                type={itemsPerPageAdj === 100 ? 'primary' : 'secondary'}
              >
                100
              </Button>
              {isDesktopViewport && (
                <Button
                  onClick={() => handleChangePage(99999)}
                  type={itemsPerPageAdj === 99999 ? 'primary' : 'secondary'}
                >
                  Alle
                </Button>
              )}
            </Stack>
          </Stack>
          <Stack direction="row" gap={1} alignItems="center">
            <Button
              type="text"
              iconButton={true}
              icon={mdiArrowLeft}
              onClick={() => changePage(pageNumber - 1)}
              disabled={pageNumber === 1}
              sx={{ border: theme.palette.mode === 'light' ? '1px solid #21252933' :  '1px solid #cccccc66' }}
              color={
                pageNumber === 1
                  ? theme.palette.action.disabled
                  : theme.palette.primary.main
              }
            />

            <Typography>
              Seite {pageNumber} /{' '}
              {calculatePagesCount(itemsPerPageAdj, number)}{' '}
            </Typography>

            <Button
              type="text"
              iconButton={true}
              icon={mdiArrowRight}
              onClick={() => changePage(pageNumber + 1)}
              disabled={
                pageNumber === calculatePagesCount(itemsPerPageAdj, number)
              }
              sx={{ border: theme.palette.mode === 'light' ? '1px solid #21252933' :  '1px solid #cccccc66' }}
              color={
                pageNumber === calculatePagesCount(itemsPerPageAdj, number)
                  ? theme.palette.action.disabled
                  : theme.palette.primary.main
              }
            />
          </Stack>
          <Stack direction="row"> {selectedElement}</Stack>
        </Box>
      </div>
    </div>
  )
}

export default BottomPagination
