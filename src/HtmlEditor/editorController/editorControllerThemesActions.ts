import { Dispatch, SetStateAction, useCallback } from 'react'
import { EditorStateType } from './editorState'
import { EditorControllerThemesActionsType } from './editorControllerTypes'
import { Theme, createTheme, responsiveFontSizes } from '@mui/material'
import { createMuiTheme } from '../../theme/createTheme'

export type EditorControllerThemesActionsParams = {
  editorState: EditorStateType
  setEditorState: Dispatch<SetStateAction<EditorStateType>>
}

export const useEditorControllerThemesActions = (
  params: EditorControllerThemesActionsParams
): EditorControllerThemesActionsType => {
  const { editorState, setEditorState } = params

  const changeThemePaletteColor = useCallback(
    ({
      themeName,
      colorKey,
      newValue,
      subKey,
    }: {
      themeName: string
      colorKey: keyof Theme['palette']
      subKey?: string
      newValue: string
    }) => {
      setEditorState((current) => {
        const themeIndex = current.themes?.findIndex(
          (t) => t.name === themeName
        )
        const currentTheme = current.themes?.[themeIndex ?? 0]
        const newTheme = createMuiTheme(
          {
            ...currentTheme,
            palette: {
              ...currentTheme?.palette,
              [colorKey]: {
                // ...currentTheme?.palette?.[colorKey],
                [subKey ?? '']: newValue,
              },
            },
          },
          true
        )

        // responsiveFontSizes(
        //   createTheme({
        //     ...currentTheme,
        //     palette: {
        //       ...currentTheme?.palette,
        //       [colorKey]: {
        //         // ...currentTheme?.palette?.[colorKey],
        //         [subKey ?? '']: newValue,
        //       },
        //     },
        //   }),
        //   { factor: 2 }
        // )
        const themes = current.themes?.map((t, i) => {
          if (i !== themeIndex) return t
          return newTheme
        })

        return {
          ...current,
          themes,
          theme: newTheme,
        } as any
      })
    },
    [setEditorState]
  )

  const changeTypographyStyle = useCallback(
    ({
      variantKey,
      newVariantStyles,
    }: {
      variantKey: keyof Theme['typography']
      //   styleKey: keyof Theme['typography']['caption']
      newVariantStyles: any
    }) => {
      setEditorState((current) => {
        const themeIndex = current.themes?.findIndex(
          (t) => t.name === current.ui.navigationMenu.selectedTheme
        )
        const currentTheme = current.themes?.[themeIndex ?? 0]
        const newThemeRaw = createMuiTheme(
          {
            ...currentTheme,
            typography: {
              ...currentTheme?.typography,
              [variantKey]: newVariantStyles,
            },
          },
          true
        )
        const themeAdjOnlyChangedTypography = {
          ...currentTheme,
          typography: {
            ...currentTheme?.typography,
            [variantKey]:
              newThemeRaw?.typography?.[variantKey] ??
              current?.theme?.typography?.[variantKey],
          },
        }

        // responsiveFontSizes(
        //   createTheme({
        //     ...currentTheme,
        //     typography: {
        //       ...currentTheme?.typography,
        //       [variantKey]: newVariantStyles,
        //     },
        //   }),
        //   { factor: 2, disableAlign: true }
        // )
        // console.log('cc ctheme before ', {
        //   ...currentTheme?.typography,
        //   [variantKey]: newVariantStyles,
        // })
        // console.log('cc ctheme after ', newTheme)

        const themes = current.themes?.map((t, i) => {
          if (i !== themeIndex) return t
          return themeAdjOnlyChangedTypography
        })

        return {
          ...current,
          themes,
          theme: themeAdjOnlyChangedTypography,
        } as any
      })
    },
    [setEditorState]
  )

  return {
    changeThemePaletteColor,
    changeTypographyStyle,
  }
}
