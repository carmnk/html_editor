import React, { useCallback, useMemo, useState } from 'react'
import {
  Stack,
  Typography,
  useTheme,
  Theme,
  Palette,
  Box,
  TextField,
} from '@mui/material'
import { ThemeColorSelector } from './themeColorSelector'
import { ThemeOtherColorSelector } from './themeOtherColorSelector'
import { EditorControllerType } from '../../../editorController/editorControllerTypes'
import { CTabs } from '../../../../components/navigation/CTabs'
import Icon from '@mdi/react'
import { mdiFormatText, mdiPalette } from '@mdi/js'
import { CssTypographySelector } from '../htmlElement/CssTypographySelector'
import { Flex } from '../../../../components/basics/Flex'

export type ThemeMenuProps = {
  editorController: EditorControllerType
}

const muiPaletteColors = [
  'primary',
  'secondary',
  'error',
  'warning',
  'info',
  'success',
  'text',
]

export const ThemeMenu = (props: ThemeMenuProps) => {
  const { editorController } = props
  const { editorState, actions } = editorController
  // const { selectTheme } = actions.ui.navigationMenu;
  const { changeThemePaletteColor, changeTypographyStyle } = actions.themes

  const [localUi, setLocalUi] = useState<{
    activeTab: 'palette' | 'typography'
  }>({
    activeTab: 'palette',
  })

  const handleChangeActiveTab = useCallback(
    (value: 'palette' | 'typography') => {
      setLocalUi((prev) => ({ ...prev, activeTab: value }))
    },
    []
  )

  const changeColor = useCallback(
    (
      colorKey: keyof Palette,
      newValue: string,
      variant: 'light' | 'main' | 'dark'
    ) => {
      const themeName = editorState?.ui?.navigationMenu?.selectedTheme ?? ''

      if (!themeName) return
      changeThemePaletteColor({
        themeName,
        colorKey,
        subKey: variant,
        newValue: newValue,
      })
    },
    [editorState?.ui?.navigationMenu?.selectedTheme, changeThemePaletteColor]
  )

  const handleChangeColor: {
    [key in keyof Theme['palette']]: (
      newValue: string,
      variant: 'light' | 'main' | 'dark'
    ) => void
  } = useMemo(
    () =>
      muiPaletteColors.reduce((acc, col) => {
        return {
          ...acc,
          [col]: (newValue: string, variant: 'light' | 'main' | 'dark') => {
            changeColor(col as keyof Palette, newValue, variant)
          },
        }
      }, {}) as any,

    [changeColor]
  )

  const websiteTheme = editorState?.theme

  const {
    activatedOpacity,
    selectedOpacity,
    hoverOpacity,
    focusOpacity,
    disabledOpacity,
    ...actionColors
  } = websiteTheme?.palette?.action || {}

  const tabs = useMemo(() => {
    return [
      {
        value: 'palette',
        label: <Icon path={mdiPalette} size={1} />,
      },
      {
        value: 'typography',
        label: <Icon path={mdiFormatText} size={1} />,
      },
    ]
  }, [])

  const typographyVariants = useMemo(() => {
    const {
      fontFamily,
      fontSize,
      fontWeightBold,
      fontWeightLight,
      fontWeightMedium,
      fontWeightRegular,
      htmlFontSize,
      pxToRem,
      inherit,
      ...typographyVariants
    } = websiteTheme.typography
    return Object.keys(typographyVariants)
  }, [websiteTheme.typography])

  const handleChangeTypographyStyles = useMemo(() => {
    return typographyVariants.reduce((acc, variant) => {
      return {
        ...acc,
        [variant]: (newValue: string, styleKey: string) => {
          const currentTypography = websiteTheme.typography[variant]
          changeTypographyStyle({
            variantKey: variant as any,
            newVariantStyles: {
              ...(currentTypography ?? {}),
              [styleKey]: newValue,
            },
          })
        },
      }
    }, {})
  }, [typographyVariants, changeTypographyStyle, websiteTheme.typography])

  const handleChangeTypographySize = useMemo(() => {
    return typographyVariants.reduce((acc, variant) => {
      const currentTypography = websiteTheme.typography[variant]
      return {
        ...acc,
        [variant]: (e: any, newValue: string) => {
          const value = e?.target?.value
          const currentTypographyExMediaQuerys = Object.keys(currentTypography)
            .filter((key) => !key.includes('@media'))
            .reduce((acc, key) => {
              return {
                ...acc,
                [key]: currentTypography[key],
              }
            }, {})
          changeTypographyStyle({
            variantKey: variant as any,
            newVariantStyles: {
              ...(currentTypographyExMediaQuerys ?? {}),
              fontSize: value + 'rem',
            },
          })
        },
      }
    }, {})
  }, [changeTypographyStyle, typographyVariants, websiteTheme.typography])

  return (
    <>
      <Stack
        gap={2}
        borderLeft={'1px solid ' + websiteTheme.palette.divider}
        p={1}
      >
        {/* <ClickTextField
          value={editorState?.ui?.navigationMenu?.selectedTheme ?? ""}
          onChange={() => {}}
        /> */}
        <Typography
          color="text.primary"
          textOverflow="ellipsis"
          overflow="hidden"
          whiteSpace="nowrap"
          variant="h5"
        >
          {editorState?.ui?.navigationMenu?.selectedTheme ?? ''}
        </Typography>
        <CTabs
          value={localUi.activeTab}
          onChange={handleChangeActiveTab as any}
          items={tabs}
        />

        {/* Palette */}
        {localUi.activeTab === 'palette' ? (
          <Stack gap={2}>
            <ThemeColorSelector
              colorName="primary"
              {...websiteTheme.palette.primary}
              onChange={handleChangeColor.primary}
            />
            <ThemeColorSelector
              colorName="secondary"
              {...websiteTheme.palette.secondary}
              onChange={handleChangeColor.secondary}
            />
            <ThemeColorSelector
              colorName="success"
              {...websiteTheme.palette.success}
              onChange={handleChangeColor.success}
            />
            <ThemeColorSelector
              colorName="warning"
              {...websiteTheme.palette.warning}
              onChange={handleChangeColor.warning}
            />
            <ThemeColorSelector
              colorName="error"
              {...websiteTheme.palette.error}
              onChange={handleChangeColor.error}
            />
            <ThemeColorSelector
              colorName="info"
              {...websiteTheme.palette.info}
              onChange={handleChangeColor.info}
            />
            <ThemeOtherColorSelector
              colorName="text"
              color={websiteTheme.palette.text as any}
              // {...websiteTheme.palette.text}
              onChange={handleChangeColor.text as any}
            />
            <ThemeOtherColorSelector
              colorName="background"
              color={websiteTheme.palette.background as any}
              // {...websiteTheme.palette.text}
              onChange={handleChangeColor.background as any}
            />
            <ThemeOtherColorSelector
              colorName="action"
              color={actionColors as any}
              // {...websiteTheme.palette.text}
              onChange={handleChangeColor.action as any}
            />
          </Stack>
        ) : (
          typographyVariants.map((variant) => {
            const typographySize =
              (
                websiteTheme.typography[variant]?.['@media (min-width:1200px)']
                  ?.fontSize || websiteTheme.typography[variant]?.fontSize
              )
                ?.toString?.()
                ?.replace(/[^0-9.]/g, '') ?? ''

            return (
              <>
                <Typography fontWeight={700} color="text.primary">
                  {variant}
                </Typography>
                <Flex justifyContent="space-between">
                  <Box width={200}>FontSize</Box>
                  <Flex alignItems="center" gap={1}>
                    <TextField
                      size="small"
                      inputProps={{ sx: { p: 0.5, px: 1, width: 96 } }}
                      onChange={handleChangeTypographySize[variant]}
                      value={typographySize}
                      // placeholder="0"
                    />
                    <Typography>rem</Typography>
                  </Flex>
                </Flex>
                <CssTypographySelector
                  editorController={editorController}
                  styles={websiteTheme.typography[variant]}
                  changeStyle={handleChangeTypographyStyles[variant]}
                  disableSizeSelector={true}
                />
              </>
            )
          })
        )}
      </Stack>

      {/* <CTabs
        value={ui?.selectedTab}
        onChange={handleChangeTab}
        items={menuTabs}
      /> */}
    </>
  )
}
