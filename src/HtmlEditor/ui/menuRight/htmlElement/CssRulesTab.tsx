import { Stack, Typography, Box, useTheme } from '@mui/material'
import { CGrid } from '../../../../components/basics/CGrid'
import { useCallback, useMemo } from 'react'
import { getStylesFromClasses } from '../../../renderElements'
import { CSS_RULES_VALUES_OPTIONS } from '../../../defs/CssRuleNamesDict'
import { CSelect } from '../../../../components/inputs/CSelect'
import { ClickTextField } from '../../../../components/inputs/ClickTextField'
import { cssRulesFilterOptions } from './_defHtmlElementCssRulesFilterOptions'
import { EditorControllerType } from '../../../editorController/editorControllerTypes'
import { Flex } from '../../../../components/basics/Flex'

export type RightMenuCssRuldeTabProps = {
  editorController: EditorControllerType
}

export const RightMenuCssRuleTab = (props: RightMenuCssRuldeTabProps) => {
  const { editorController } = props
  const {
    editorState,
    selectedHtmlElement2: selectedHtmlElement,
    selectedHtmlElementStyleAttributes2: cssAttributes,
    actions,
  } = editorController
  const {
    toggleHtmlElementEditCssRule,
    changeHtmlElementEditedCssRuleValue,
    removeCurrentHtmlElementStyleAttribute,
  } = actions.htmlElement
  const { selectHtmlElementCssPropertiesListFilter } = actions.ui.detailsMenu

  const theme = useTheme()
  const activeEditRule =
    editorState?.ui?.detailsMenu?.htmlElement?.editCssRuleName
  const className = (selectedHtmlElement as any)?.attributes?.className

  const classAttributes = useMemo(
    () =>
      !className
        ? {}
        : getStylesFromClasses(className, editorState?.cssSelectors),
    [className, editorState?.cssSelectors]
  )

  const attributes = useMemo(() => {
    const allAttributes = {
      ...classAttributes,
      ...cssAttributes,
    }
    return Object.keys(
      editorState?.ui?.detailsMenu?.htmlElement?.cssRulesFilter === 'all'
        ? allAttributes
        : editorState?.ui?.detailsMenu?.htmlElement?.cssRulesFilter ===
          'classes'
        ? classAttributes
        : cssAttributes
    )
  }, [
    cssAttributes,
    classAttributes,
    editorState?.ui?.detailsMenu?.htmlElement?.cssRulesFilter,
  ])

  const ruleValueEditOptions =
    (activeEditRule &&
      activeEditRule in CSS_RULES_VALUES_OPTIONS &&
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (CSS_RULES_VALUES_OPTIONS as any)?.[activeEditRule]) ||
    []

  const handleToggleEditRule = useCallback(
    (attributeName: string) => {
      toggleHtmlElementEditCssRule(attributeName)
    },
    [toggleHtmlElementEditCssRule]
  )

  const handleTakeoverEditedRuleValue = useCallback(
    (newValue: string) => {
      if (!activeEditRule) return
      changeHtmlElementEditedCssRuleValue(newValue, activeEditRule)
    },
    [activeEditRule, changeHtmlElementEditedCssRuleValue]
  )

  const handleRemoveRule = useCallback(
    (attributeName: string) => {
      removeCurrentHtmlElementStyleAttribute(attributeName)
    },
    [removeCurrentHtmlElementStyleAttribute]
  )

  return (
    <>
      <Stack gap={2} borderLeft={'1px solid ' + theme.palette.divider} p={1}>
        <Box>
          <CSelect
            value={
              editorState?.ui?.detailsMenu?.htmlElement?.cssRulesFilter ?? ''
            }
            onChange={selectHtmlElementCssPropertiesListFilter}
            options={cssRulesFilterOptions}
          />
        </Box>
        <CGrid
          gridTemplateColumns="auto auto"
          alignItems="center"
          position="relative"
          // gap={"16px 0"}
        >
          <Box
            fontWeight={700}
            borderBottom={'1px solid ' + theme.palette.text.primary}
          >
            Rule
          </Box>
          <Box
            fontWeight={700}
            borderBottom={'1px solid ' + theme.palette.text.primary}
          >
            Value
          </Box>
          <Box minHeight={24} fontWeight={700}></Box>
          <Box fontWeight={700}></Box>
          {attributes?.map((attributeName) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const ruleValue = (cssAttributes as any)?.[attributeName] ?? ''
            return (
              <>
                <Typography variant="body2" height="16px" mt={1}>
                  {attributeName}
                </Typography>

                <Flex
                  mt={1}
                  justifyContent="space-between"
                  minHeight={24}
                  alignItems="center"
                >
                  <ClickTextField
                    variant="autocomplete"
                    value={
                      editorState?.ui?.detailsMenu?.htmlElement?.editCssRuleName
                        ? editorState?.ui?.detailsMenu?.htmlElement
                            ?.editCssRuleName ?? ''
                        : ruleValue
                    }
                    onToggle={(isEdit) =>
                      handleToggleEditRule(isEdit ? attributeName : '')
                    }
                    options={ruleValueEditOptions}
                    onChange={handleTakeoverEditedRuleValue}
                    typographyProps={{
                      variant: 'body2',
                      height: '16px',
                      color: 'text.secondary',
                    }}
                    handleRemoveItem={() => handleRemoveRule(attributeName)}
                  />
                </Flex>
              </>
            )
          })}
          <Box
            minHeight={24}
            fontWeight={700}
            borderBottom={'1px solid ' + theme.palette.text.primary}
          ></Box>
          <Box
            minHeight={24}
            fontWeight={700}
            borderBottom={'1px solid ' + theme.palette.text.primary}
          ></Box>
        </CGrid>
      </Stack>
    </>
  )
}
