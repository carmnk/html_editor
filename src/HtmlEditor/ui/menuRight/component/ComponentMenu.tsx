import { Box, Stack, Typography, useTheme } from '@mui/material'
import React, { useCallback } from 'react'
import { ClickTextField } from '../../../../components/inputs/ClickTextField'
import { GenericForm } from '../../../../components/forms/GenericForm'
import { EditorControllerType } from '../../../editorController/editorControllerTypes'
import { ElementType } from '../../../editorController/editorState'
import { CommonDetailsHeader } from '../CommonHeader'
import { baseComponents } from '../../../editorComponents/baseComponents'
import { CTabs } from '../../../../components/navigation/CTabs'
import { mdiCogs, mdiSpeedometer } from '@mdi/js'
import Icon from '@mdi/react'
import { CSelect } from '../../../../components/inputs/CSelect'

export type HtmlElementMenuProps = {
  editorController: EditorControllerType
  selectedComponent?: ElementType<'Button'>
}

export const ComponentMenu = (props: HtmlElementMenuProps) => {
  const { editorController, selectedComponent } = props
  const {
    editorState,
    actions,
    selectedHtmlElement2,
    appState: {
      actions: { updateProperty: updateStateProperty },
      state: appState,
    },
  } = editorController
  const {
    changeCurrentElementProp,
    changeSelectedComponentProp,
    changeElementProp,
    changeComponentProp,
  } = actions.htmlElement

  const selectedElement =
    selectedComponent ?? (selectedHtmlElement2 as ElementType<'Button'>)
  const defaultComponent = baseComponents?.find(
    (comp) => comp.type === selectedElement?._type
  )

  const [localUi, setLocalUi] = React.useState<{
    activeTab: 'props' | 'state'
  }>({ activeTab: 'props' })

  const handleChangeActiveTab = React.useCallback(
    (value: 'props' | 'state') => {
      setLocalUi((prev) => ({ ...prev, activeTab: value }))
    },
    []
  )

  const theme = useTheme()

  // HANDLERS

  const handleChangeComponentState = React.useCallback(
    (value: string) => {
      updateStateProperty(selectedElement?._id ?? '', value)
    },
    [updateStateProperty, selectedElement]
  )

  const handleChangeElementId = React.useCallback(
    (value: string) => {
      const propName = '_userID'
      if (selectedComponent) {
        changeElementProp(selectedComponent._id, propName, value)
        return
      }
      changeCurrentElementProp(propName, value)
    },
    [changeElementProp, changeCurrentElementProp, selectedComponent]
  )

  const handleChangeProp = useCallback(
    (
      newFormData: any,
      key: string,
      value: any,
      prevFormData: any,
      subformName?: string
    ) => {
      if (selectedComponent) {
        if (subformName) {
          changeComponentProp(
            selectedComponent._id,
            subformName,
            newFormData?.[subformName]
          )
          return
        }
        changeComponentProp(selectedComponent._id, key, value)
        return
      }
      if (subformName) {
        changeSelectedComponentProp(subformName, newFormData?.[subformName])
        return
      }
      changeSelectedComponentProp(key, value)
    },
    [changeSelectedComponentProp, changeComponentProp, selectedComponent]
  )

  return (
    <>
      <Stack
        gap={2}
        borderLeft={'1px solid ' + theme.palette.divider}
        // height="100%"
        p={1}
      >
        <CommonDetailsHeader
          idPlaceholder={`<${selectedElement?._type}> Set ID`}
          idValue={selectedElement?._userID ?? ''}
          handleChangeElementId={handleChangeElementId}
          typeValue={selectedElement?._type}
          typeLabel={`Component`}
          typeDisabled={true}
          hideDivider={!!defaultComponent?.state}
        />
        {defaultComponent?.state && (
          <CTabs
            value={localUi.activeTab}
            onChange={handleChangeActiveTab as any}
            items={[
              {
                value: 'props',
                tooltip: 'Properties',
                label: <Icon path={mdiCogs} size={1} />,
              },
              {
                value: 'state',
                label: <Icon path={mdiSpeedometer} size={1} />,
                tooltip: 'State',
              },
            ]}
          />
        )}
        {localUi?.activeTab === 'props' ? (
          <>
            <Typography variant="body1" fontWeight="bold">
              Properties
            </Typography>
            <GenericForm
              {...(selectedElement as any)?.formGen?.(
                editorController,
                selectedElement
              )}
              formData={selectedElement?.props}
              onChangeFormData={handleChangeProp}
            />
          </>
        ) : (
          <Box>
            <Typography variant="body1" fontWeight="bold">
              State
            </Typography>
            <Stack direction="row" alignItems="center" gap={4} mt={1}>
              <Typography variant="body2">Navigation</Typography>
              <CSelect
                value={appState?.[selectedElement?._id ?? ''] ?? ''}
                options={selectedElement?.props?.items}
                onChange={handleChangeComponentState}
                disableHelperText={true}
                disableLabel
              />
            </Stack>
          </Box>
        )}
        {/* {Object.entries(selectedElement?.props ?? {}).map(([key, value]) => (
          <Box>
            {key} - {value}
          </Box>
        ))} */}
      </Stack>
    </>
  )
}
