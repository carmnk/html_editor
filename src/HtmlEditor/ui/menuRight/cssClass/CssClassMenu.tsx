import { Stack, useTheme, Chip, Tooltip } from "@mui/material";
import { ClassRulesTab } from "./ClassRulesTab";
import { EditorControllerType } from "../../../editorController/editorController";
import { ClickTextField } from "../../../../components/inputs/ClickTextField";

export type CssClassMenuProps = {
  editorController: EditorControllerType;
};

const validateClassName = (className: string) =>
  /^-?[_a-zA-Z]+[_a-zA-Z0-9-]*$/.test(className) || className === "";

export const CssClassMenu = (props: CssClassMenuProps) => {
  const { editorController } = props;
  const { editorState, actions } = editorController;
  const { handleChangeClassName } = actions.cssSelector;

  const theme = useTheme();

  const selectorTyp =
    !editorState.selectedCssClass?.startsWith?.(".") &&
    !editorState.selectedCssClass?.startsWith?.("#")
      ? "element"
      : editorState.selectedCssClass?.startsWith?.(".")
      ? "class"
      : editorState.selectedCssClass?.startsWith?.("#")
      ? "id"
      : null;

  return (
    <>
      <Stack gap={2} borderLeft={"1px solid " + theme.palette.divider} p={1}>
        <ClickTextField
          validateInput={validateClassName}
          value={editorState.selectedCssClass ?? "MISSING"}
          onChange={handleChangeClassName}
          additionalLabelComponent={
            selectorTyp ? (
              <Tooltip
                title={
                  selectorTyp === "element"
                    ? `rules are applied to all elements of given type e.g. ${editorState.selectedCssClass} selects all html ${editorState.selectedCssClass} elements`
                    : selectorTyp === "class"
                    ? `rules are applied to all elements with given class e.g. ${
                        editorState.selectedCssClass
                      } selects all elements with class ${editorState.selectedCssClass?.replace(
                        ".",
                        ""
                      )}`
                    : selectorTyp === "id"
                    ? `rules are applied to all elements with given id e.g. ${
                        editorState.selectedCssClass
                      } selects all elements with id ${editorState.selectedCssClass?.replace(
                        "#",
                        ""
                      )}`
                    : ""
                }
                placement="top"
                arrow
              >
                <Chip size="small" label={selectorTyp} />
              </Tooltip>
            ) : null
          }
        />
      </Stack>

      {/* <CTabs
        value={ui?.selectedTab}
        onChange={handleChangeTab}
        items={menuTabs}
      /> */}
      <ClassRulesTab editorController={editorController} />
    </>
  );
};
