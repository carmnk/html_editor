import {
  mdiPageLayoutHeaderFooter,
  mdiRoundedCorner,
  mdiBrush,
  mdiFormatText,
  mdiTextBox,
  mdiCodeBraces,
} from "@mdi/js";
import Icon, { Stack as IconStack } from "@mdi/react";
import { Theme } from "@mui/material";
import { HtmlEditorElementType } from "../../../EditorState";

export type HtmlElementMenuTabParams = {
  selectedHtmlElement: HtmlEditorElementType | null;
  theme: Theme;
};

export const makeHtmlElementMenuTabs = (params: HtmlElementMenuTabParams) => {
  const { selectedHtmlElement, theme } = params;
  return [
    {
      value: "layout",
      label: <Icon path={mdiPageLayoutHeaderFooter} size={1} />,
      tooltip: "Layout",
    },
    {
      value: "shape",
      label: (
        <IconStack size={1}>
          <Icon path={mdiRoundedCorner} size={1} />
          <Icon
            path={mdiBrush}
            size={1.1}
            color={theme.palette.text.primary}
            style={{ translate: "-3px 5px" }}
            rotate={170}
          />
        </IconStack>
      ),
      tooltip: "Shape and Color",
    },
    {
      value: "typography",
      label: <Icon path={mdiFormatText} size={1} />,
      tooltip: "Typography",
    },
    {
      value: "content",
      label: <Icon path={mdiTextBox} size={1} />,
      tooltip: selectedHtmlElement?.children?.length
        ? "Content currently not supported when Element has children"
        : "Content",
      disabled: !!selectedHtmlElement?.children?.length,
    },
    {
      value: "css_rules",
      label: <Icon path={mdiCodeBraces} size={1} />,
      tooltip: "CSS Rules",
      // disabled: !!selectedHtmlElement?.children?.length,
    },
  ];
};
