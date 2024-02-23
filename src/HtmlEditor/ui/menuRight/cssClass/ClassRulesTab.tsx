import { Stack, Typography, Box, useTheme } from '@mui/material'
import { CSSProperties, useMemo } from 'react'
import { CAutoComplete } from '../../../../components/inputs/CAutoComplete'
import {
  CSS_RULES_VALUES_OPTIONS,
  CSS_RULE_NAMES_OPTIONS,
} from '../../../defs/CssRuleNamesDict'
import { CGrid } from '../../../../components/basics/CGrid'
import {
  CssSelectorType,
  CssWorkspaceType,
} from '../../../editorController/editorState'
import { mdiPlus } from '@mdi/js'
import { Button } from '../../../../components/buttons/Button/Button'
import { ClickTextField } from '../../../../components/inputs/ClickTextField'
import { EditorControllerType } from '../../../editorController/editorControllerTypes'
import { Flex } from '../../../../components/basics/Flex'

export type RightMenuContentTabProps = {
  editorController: EditorControllerType
}

export const ClassRulesTab = (props: RightMenuContentTabProps) => {
  const { editorController } = props
  const { editorState, actions } = editorController
  const {
    removeRule,
    addNewRule,
    toggleEditRule,
    changeEditRuleValue,
    changeAddClassRuleName,
    changeAddClassRuleValue,
  } = actions.cssSelector

  const theme = useTheme()

  const selectedSelector = useMemo(() => {
    return (
      ((editorState.ui.selected.cssSelector &&
        editorState?.cssSelectors.find(
          (sel) => sel._id === editorState.ui.selected.cssSelector
        )) ??
        {}) ||
      {}
    )
  }, [editorState.ui.selected.cssSelector, editorState?.cssSelectors])
  const selectedSelectorCssRules = useMemo(() => {
    const selected = selectedSelector as CssSelectorType
    const ruleKeys = Object.keys(selected).filter((key) => !key.startsWith('_'))
    const rules = ruleKeys.map((ruleName) => ({
      ruleName,
      ruleValue: (selected as any)[ruleName],
    }))
    return rules
  }, [selectedSelector])

  const ruleValueOptions = useMemo(() => {
    return (
      (editorState.ui.detailsMenu.addRuleName &&
        editorState.ui.detailsMenu.addRuleName in CSS_RULES_VALUES_OPTIONS &&
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (CSS_RULES_VALUES_OPTIONS as any)?.[
          editorState.ui.detailsMenu.addRuleName
        ]) ||
      []
    )
  }, [editorState.ui.detailsMenu.addRuleName])

  const ruleValueEditOptions = useMemo(() => {
    return (
      (editorState.ui.detailsMenu.ruleName &&
        editorState.ui.detailsMenu.ruleName in CSS_RULES_VALUES_OPTIONS &&
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (CSS_RULES_VALUES_OPTIONS as any)?.[
          editorState.ui.detailsMenu.ruleName
        ]) ||
      []
    )
  }, [editorState.ui.detailsMenu.ruleName])

  return (
    <>
      {/* Rules */}
      <Stack gap={2} borderLeft={'1px solid ' + theme.palette.divider} p={1}>
        <Typography fontWeight={700} color="text.primary">
          Rules
        </Typography>
        <Box position="relative">
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
            {editorState.ui.selected.cssSelector &&
              selectedSelectorCssRules?.map((rule) => {
                // const selectedCssSelectorName =
                //   editorState.ui.selected.cssSelector;
                // const selectedSelectorName =
                //   editorState.ui.selected.cssSelector;
                // const ruleValue = selector?.[ruleName];
                // const ruleValue = (editorState as any)?.cssWorkspaces?.common?.[
                //   editorState.ui.selected.cssSelector ?? ""
                // ]?.[ruleName];

                return (
                  <>
                    <Typography variant="body2" height="16px" mt={1}>
                      {rule.ruleName}
                    </Typography>

                    <ClickTextField
                      variant="autocomplete"
                      value={(rule.ruleValue as any) ?? ''}
                      options={ruleValueEditOptions}
                      onChange={changeEditRuleValue}
                      typographyProps={{
                        variant: 'body2',
                        height: '16px',
                        fontWeight: 400,
                        color: 'text.secondary',
                      }}
                      onToggle={() =>
                        toggleEditRule(rule.ruleName as keyof CSSProperties)
                      }
                      handleRemoveItem={() => removeRule(rule.ruleName)}
                    />
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
          <Box>
            <Box mt={2}>
              <Typography fontWeight={700} color="text.primary">
                Add Rule
              </Typography>
            </Box>
            <Flex gap={1} spacing={1} width="100%" mt={2} alignItems="center">
              <Box flexGrow={1}>
                <CAutoComplete
                  disableHelperText={true}
                  label="Rule"
                  name="newRule"
                  options={CSS_RULE_NAMES_OPTIONS}
                  value={editorState.ui.detailsMenu.addRuleName}
                  onChange={changeAddClassRuleName}
                  sx={{ width: '140px' }}
                />
              </Box>
              <Box flexGrow={1}>
                <CAutoComplete
                  disableHelperText={true}
                  label="Value"
                  disabled={!editorState.ui.detailsMenu.addRuleName}
                  name="newRuleValue"
                  options={ruleValueOptions}
                  value={editorState.ui.detailsMenu.addRuleValue}
                  onChange={changeAddClassRuleValue}
                  sx={{ width: '140px' }}
                />
              </Box>
              <Box pt={2}>
                <Button
                  iconButton={true}
                  icon={mdiPlus}
                  disabled={
                    !editorState.ui.detailsMenu.addRuleName ||
                    !editorState.ui.detailsMenu.addRuleValue
                  }
                  tooltip={
                    !editorState.ui.detailsMenu.addRuleName ||
                    !editorState.ui.detailsMenu.addRuleValue
                      ? 'Please provide a rule name and value'
                      : 'Add Rule'
                  }
                  onClick={addNewRule}
                />
              </Box>
            </Flex>
          </Box>
        </Box>
      </Stack>
    </>
  )
}
