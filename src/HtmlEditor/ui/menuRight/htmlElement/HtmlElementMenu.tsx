import { Stack, Typography, Box, useTheme, Chip } from "@mui/material";
import { CSelect } from "../../../../components/inputs/CSelect";
import { CTabs } from "../../../../components/tabs/CTabs";
import { RightMenuContentTab } from "./ContentTab";
import { RightMenuLayoutTab } from "./LayoutTab";
import { RightMenuShapeTab } from "./ShapeTab";
import { RightMenuTypographyTab } from "./TypographyTab";
import React, { useEffect, useMemo } from "react";
import { HTML_TAG_NAMES_BASIC_OPTIONS } from "../../../defs/HTMLTagNamesDict";
import { CAutoComplete } from "../../../../components/inputs/CAutoComplete";
import { EditorControllerType } from "../../../editorController";
import { RightMenuCssRuleTab } from "./CssRulesTab";
import CTextField from "../../../../components/inputs/CTextField";
import { makeHtmlElementMenuTabs } from "./_defHtmlElementMenuTabs";
import { ClickTextField } from "../../../../components/inputs/ClickTextField";
import { HtmlEditorElementType } from "../../../EditorState";

export type HtmlElementMenuProps = {
  editorController: EditorControllerType;
};

const autoCompleteWidthStyle = { width: 220 };

const filteredHtmlElementOptions = HTML_TAG_NAMES_BASIC_OPTIONS.filter(
  (opt) => !["html", "head", "body"].includes(opt.value)
);

export const HtmlElementMenu = (props: HtmlElementMenuProps) => {
  const { editorController } = props;
  const { editorState, getSelectedImage, actions, selectedHtmlElement } =
    editorController;
  const {
    changeCurrentHtmlElement,
    changeCurrentHtmlElementAttribute,
    changeCurrentHtmlElementProp,
  } = actions.htmlElement;
  const { handleChangeHtmlElementStyleTab } = actions.ui.detailsMenu;

  const selectedHtmlElementStyleIntersection =
    selectedHtmlElement as HtmlEditorElementType<"img">;

  const theme = useTheme();

  const isOverheadHtmlElement = ["html", "head", "body"].includes(
    selectedHtmlElement?.type ?? ""
  );

  const menuTabs = React.useMemo(() => {
    if (!selectedHtmlElement) return [];
    return makeHtmlElementMenuTabs({ theme, selectedHtmlElement });
  }, [theme, selectedHtmlElement]);

  const trimmedClassName = selectedHtmlElement?.attributes?.className?.trim();
  const classNames: string[] | null = useMemo(
    () => (trimmedClassName ? trimmedClassName?.split?.(" ") || null : null),
    [trimmedClassName]
  );
  const classNameOptions = useMemo(
    () =>
      Object.keys(editorState?.cssWorkspaces?.common ?? {})
        ?.map?.((opt) => ({
          value: opt,
          label: opt,
        }))
        ?.filter((opt) => !classNames?.includes(opt.value)),
    [classNames, editorState?.cssWorkspaces?.common]
  );
  const imageSrcOptions = React.useMemo(() => {
    const commonWorkspace = editorState?.imageWorkspaces?.common;
    return Object.keys(commonWorkspace)?.map((value) => ({
      value,
      label: commonWorkspace[value]?.fileName ?? "",
      src: commonWorkspace[value]?.src,
    }));
  }, [editorState?.imageWorkspaces?.common]);

  // HANDLERS
  const handleChangeElementType = React.useCallback(
    (newValue: string) => {
      const propName = "type";
      changeCurrentHtmlElementProp(propName, newValue);
    },
    [changeCurrentHtmlElementProp]
  );

  const handleChangeElementId = React.useCallback(
    (value: string) => {
      const propName = "id";
      changeCurrentHtmlElementProp(propName, value);
    },
    [changeCurrentHtmlElementProp]
  );

  const handleChangeElementClasses = React.useCallback(
    (attributeValue: string) => {
      const attributeName = "className";
      changeCurrentHtmlElementAttribute(attributeName, attributeValue);
    },
    [changeCurrentHtmlElementAttribute]
  );

  const handleAddClass = React.useCallback(
    (newValue: string) => {
      const classToAdd = newValue?.trim() ?? "";
      if (!classToAdd) return;

      const newClassNames = classNames?.length
        ? classNames?.join(" ") + " " + classToAdd
        : "" + classToAdd;
      handleChangeElementClasses(newClassNames);
    },
    [classNames, handleChangeElementClasses]
  );

  const handleRemoveClass = React.useCallback(
    (classname: string) => {
      const newClassNames = classNames?.filter((cn) => cn !== classname);
      const newClassName = newClassNames?.join(" ") ?? "";
      handleChangeElementClasses(newClassName);
    },
    [classNames, handleChangeElementClasses]
  );
  console.log(classNames);

  const handleChangeImageSource = React.useCallback(
    (newValue: string) => {
      const { imageSrcId, ...selectedImage } =
        getSelectedImage?.(newValue) ?? {};
      if (!("src" in selectedImage) || !imageSrcId) return;
      const src = selectedImage?.src;
      changeCurrentHtmlElement((current) => ({
        ...current,
        imageSrcId,
        attributes: { ...current.attributes, src },
      }));
    },
    [getSelectedImage, changeCurrentHtmlElement]
  );

  const handleChangeLinkHref = React.useCallback(
    (newValue: string | number) => {
      const attributeValue = newValue.toString(); // e?.target?.value;
      const attributeName = "href";
      changeCurrentHtmlElementAttribute(attributeName, attributeValue);
    },
    [changeCurrentHtmlElementAttribute]
  );

  // EFFECTS
  // switch tab if children have been added
  const activeStylesTab =
    editorState?.ui?.detailsMenu?.htmlElement?.activeStylesTab;
  useEffect(() => {
    if (
      selectedHtmlElement?.children?.length &&
      activeStylesTab === "content"
    ) {
      handleChangeHtmlElementStyleTab("layout");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedHtmlElement]);

  return (
    <>
      <Stack
        gap={2}
        borderLeft={"1px solid " + theme.palette.divider}
        // height="100%"
        p={1}
      >
        <ClickTextField
          value={selectedHtmlElement?.id ?? ""}
          onChange={handleChangeElementId}
        />
        {isOverheadHtmlElement ? (
          <Typography>type: {selectedHtmlElement?.type ?? ""}</Typography>
        ) : (
          <Box>
            <CSelect
              label="type"
              value={selectedHtmlElement?.type ?? ""}
              onChange={handleChangeElementType}
              options={filteredHtmlElementOptions}
            />
          </Box>
        )}
        {selectedHtmlElement?.type === "img" && (
          <Box>
            <CAutoComplete
              label="src"
              name="img_src"
              options={imageSrcOptions}
              value={
                imageSrcOptions?.find(
                  (opt) => opt.src === selectedHtmlElement?.attributes?.src
                )?.value ?? ""
              }
              onChange={handleChangeImageSource}
              freeSolo={false}
              sx={autoCompleteWidthStyle}
            />
          </Box>
        )}
        {selectedHtmlElement?.type === "a" && (
          <Box>
            <CTextField
              label="href"
              name="a_href"
              value={selectedHtmlElementStyleIntersection?.attributes?.href}
              onChange={handleChangeLinkHref}
            />
          </Box>
        )}
        <Stack
          direction="row"
          alignItems="center"
          gap={"0 16px"}
          maxWidth={220}
          flexWrap="wrap"
        >
          <Typography>Classes</Typography>
          <Stack direction="row" alignItems="center" gap={1} flexWrap="wrap">
            {classNames?.map?.((className) => (
              <Chip
                label={className}
                size="small"
                onDelete={() => handleRemoveClass(className)}
              />
            )) || <Chip label="No classes" color="default" size="small" />}
            <Box>
              <ClickTextField
                value={""}
                onChange={handleAddClass}
                variant="autocomplete"
                options={classNameOptions}
              />
            </Box>
          </Stack>
        </Stack>
      </Stack>

      <CTabs
        value={activeStylesTab}
        onChange={handleChangeHtmlElementStyleTab}
        tabs={menuTabs}
      />

      {/* Layout */}
      {activeStylesTab === "layout" ? (
        <RightMenuLayoutTab editorController={editorController} />
      ) : activeStylesTab === "shape" ? (
        <RightMenuShapeTab editorController={editorController} />
      ) : activeStylesTab === "typography" ? (
        <RightMenuTypographyTab editorController={editorController} />
      ) : activeStylesTab === "content" ? (
        <RightMenuContentTab editorController={editorController} />
      ) : activeStylesTab === "css_rules" ? (
        <RightMenuCssRuleTab editorController={editorController} />
      ) : null}
    </>
  );
};
