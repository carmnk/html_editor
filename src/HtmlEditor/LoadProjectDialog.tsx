import React from 'react'
import {
  Dialog,
  DialogTitle,
  Box,
  DialogContent,
  DialogActions,
} from '@mui/material'
import { Flex } from '../components/basics/Flex'
import { Button } from '../components/buttons/Button/Button'
import { useCallback, useMemo, useState } from 'react'
import { Table } from '../components/table/Table'
import moment from 'moment'
import { EllipsisTextWithTooltip } from '../components/EllipsisTooltip'
import { ProjectType } from './editorController/editorState'
import { ButtonType } from '../components/buttons/Button/Types'
import { mdiDelete } from '@mdi/js'

export type LoadProjectDialogProps = {
  open: boolean
  onClose?: () => void
  loadProject: (project_id: string) => void
  deleteProject: (project_id: string) => void
  projects: any[]
  updateProjects: () => void
}

export const LoadProjectDialog = (props: LoadProjectDialogProps) => {
  const {
    open,
    onClose,
    loadProject,
    projects,
    deleteProject,
    updateProjects,
  } = props

  const [ui, setUi] = useState({
    selectedItems: [] as any[],
  })

  const handleLoadProject = useCallback(() => {
    const selectedItems = ui.selectedItems
    if (selectedItems?.length === 1 && selectedItems[0]) {
      loadProject(selectedItems[0])
    }
  }, [loadProject, ui.selectedItems])

  const handleSelectRow = useCallback((row: any) => {
    setUi((prev) => ({
      ...prev,
      selectedItems: [row.project_id],
    }))
  }, [])

  const columns = useMemo(() => {
    return [
      {
        isRowSelect: true,
        style: { width: 80, paddingLeft: '13px' },
      },
      {
        // className: 'p-2 w-[11%] ellipsis',
        header: 'Name',
        // sortKey: 'last_name',
        renderRow: (row: any) => <Box component="td">{row.project_name}</Box>,
      },
      {
        // className: 'p-2 w-[11%] ellipsis',
        header: 'Description',
        // sortKey: 'last_name',
        renderRow: (row: any) => (
          <Box component="td">
            <EllipsisTextWithTooltip
              label={row.project_description}
            ></EllipsisTextWithTooltip>
          </Box>
        ),
      },
      {
        // className: 'p-2 w-[11%] ellipsis',
        header: 'Created Datetime',
        // sortKey: 'last_name',
        renderRow: (row: any) => (
          <Box component="td">
            {moment(row.created_datetime).format(`DD.MM.YYYY HH:mm`)}
          </Box>
        ),
        style: { width: 160 },
      },
      {
        header: 'Edited Datetime',
        // sortKey: 'last_name',
        renderRow: (row: any) => (
          <Box component="td">
            {moment(row.edited_datetime).format(`DD.MM.YYYY HH:mm`)}
          </Box>
        ),
        style: { width: 160 },
      },
      {
        header: '',
        // sortKey: 'last_name',
        renderRow: (row: any) => (
          <Box component="td">
            <Button
              type={ButtonType.primary}
              iconButton
              color={'secondary'}
              icon={mdiDelete}
              onClick={async () => {
                await deleteProject(row.project_id)
                await updateProjects()
              }}
            />
          </Box>
        ),
        style: { width: 40 },
      },
    ]
  }, [])

  const enableClickOnRow = useCallback(() => {
    return null
  }, [])

  const handleClickOnRow = useCallback(
    (project: ProjectType) => {
      handleSelectRow(project)
    },
    [handleSelectRow]
  )

  const sortedProjects = useMemo(() => {
    return (
      projects?.sort?.((a, b) => {
        return (
          moment(b.edited_datetime).valueOf() -
          moment(a.edited_datetime).valueOf()
        )
      }) || []
    )
  }, [projects])

  return (
    <Dialog open={open} fullWidth={true} maxWidth="md" onClose={onClose}>
      <DialogTitle>
        <Flex alignItems="center" justifyContent="space-between">
          <Box>Load Project</Box>
          {/* <Box>
              <Typography variant="body2">
                last saved: {editorState.project.edited_datetime}
              </Typography>
            </Box> */}
        </Flex>
      </DialogTitle>
      <DialogContent>
        <Box fontSize="14px" color="#fff">
          <Table
            //   setPageNumber={changePageNumber}

            //   allFilters={tableUi?.allFilters}
            //   loading={loading && !accounts.length}
            rows={sortedProjects}
            //   clearFilters={clearFilters}
            columns={columns}
            //   setAllFilters={setAllFilters}
            isColRenderMode={true}
            selectedRows={ui.selectedItems}
            // onSelectAll={handleSelectAll}
            // onClearSelected={handleUnselect}
            renderSelectedItem={(item) => item?.project_id}
            onSelectRow={handleSelectRow}
            //   disableSelection={loadingSelection}
            // disableSelection={true}
            onExpandedRow={handleClickOnRow}
            renderExpandedRows={enableClickOnRow}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button type="primary" onClick={handleLoadProject}>
          Load Project
        </Button>
      </DialogActions>
    </Dialog>
  )
}
