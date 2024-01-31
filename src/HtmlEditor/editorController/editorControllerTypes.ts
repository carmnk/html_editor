import { Theme } from "@mui/material";
import { CSSProperties, ChangeEvent } from "react";
import {
  EditorStateType,
  HtmlEditorComponentElementTypes,
  HtmlEditorElementType,
} from "../EditorState";

export type EditorControllerType = {
  editorState: EditorStateType;
  appState: EditorControllerAppStateReturnType;
  setEditorState: React.Dispatch<React.SetStateAction<EditorStateType>>;
  getSelectedCssClass: (className?: string) => CSSProperties;
  getSelectedImage: (imageId?: string) => {
    image: typeof Image;
    fileName: string;
    src: string;
    imageSrcId: string;
  } | null;
  selectedHtmlElement: HtmlEditorElementType | null;
  selectedPageHtmlElements: HtmlEditorElementType[];
  selectedHtmlElementStyleAttributes: React.CSSProperties;
  actions: {
    project: {
      saveProject: () => void;
      handleLoadProject: (e: ChangeEvent<HTMLInputElement>) => void;
      addHtmlPage: () => void;
      removeHtmlPage: (pageName: string) => void;
    };
    htmlElement: EditorControllerHtmlElementActionsType;
    cssSelector: EditorControllerCssSelectorActionsType;
    assets: {
      handleProvidedImageFile: (files: File[]) => void;
      handleDeleteImageFile: (imageId: string) => void;
      handleChangeImageFilename: (newFileName: string) => void;
    };
    ui: {
      handleChangeThemePaletteColor: (params: {
        themeName: string;
        colorKey: keyof Theme["palette"];
        subKey?: string;
        newValue: string;
      }) => void;
      toggleEditorTheme: (currentThemeName: string) => void;
      handleSelectHtmlPage: (newValue: string) => void;
      handleSelectHtmlElement: (newValue: string) => void;
      handleSelectCssClass: (newValue: string) => void;
      handleSelectImage: (newValue: string) => void;
      navigationMenu: {
        handleSwitchNavigationTab: (newValue: string) => void;
        toggleElementAddComponentMode: (nodeId: string | null) => void;
        handleExpandHtmlElementTreeItem: (newValue: string) => void;
        handleSelectTheme: (newValue: string) => void;
      };
      detailsMenu: {
        handleSelectHtmlElementCssPropertiesListFilter: (
          newValue: string
        ) => void;
        handleChangeHtmlElementStyleTab: (newValue: string) => void;
      };
    };
  };
};

export type EditorControllerAppStateType = { [key: string]: any };
export type EditorControllerAppStateReturnType = {
  state: EditorControllerAppStateType;
  // values: { [key: string]: string[] };
  actions: {
    addProperty: (key: string, value: any) => void;
    removeProperty: (key: string) => void;
    updateProperty: (key: string, value: any) => void;
  };
  // setStateValues: Dispatch<SetStateAction<{ [key: string]: string[] }>>;
};

export type EditorControllerCssSelectorActionsType = {
  removeRule: (ruleName: string) => void;
  addNewRule: () => void;
  toggleEditRule: (ruleName: keyof CSSProperties) => void;
  handleChangeEditRuleValue: (newValue: string) => void;
  handleChangeClassName: (newClassName: string) => void;
  handleChangeAddClassRuleName: (newValue: string) => void;
  handleChangeAddClassRuleValue: (newValue: string) => void;
  handleDeleteCssSelector: (name: string) => void;
  handleAddCssSelector: (newVal: string | number) => void;
};

export type EditorControllerHtmlElementActionsType = {
  handleDeleteHtmlElement: (newValue: string | number) => void;
  handleAddHtmlChild: (newValue: string, newElementType?: string) => void;
  handleToggleHtmlElementEditCssRule: (attributeName: string) => void;
  changeHtmlElementEditedCssRuleValue: (
    newValue: string,
    activeEditRule: string
  ) => void;
  changeCurrentHtmlElement: (
    newHtmlElement:
      | HtmlEditorElementType
      | ((current: HtmlEditorElementType) => HtmlEditorElementType)
  ) => void;
  changeCurrentHtmlElementStyleAttribute: (
    ruleName: string,
    ruleValue: string
  ) => void;
  changeCurrentHtmlElementAttribute: (
    attributeName: string,
    attributeValue: string
  ) => void;
  changeCurrentHtmlElementProp: (
    propName: "id" | "type" | "content" | "imageSrcId",
    propValue: string
  ) => void;
  handleRemoveCurrentHtmlElementStyleAttribute: (ruleName: string) => void;
  handleAddComponentChild: (
    newValue: string,
    type: HtmlEditorComponentElementTypes
  ) => void;
  handleChangeComponentProp: (key: string, value: any) => void;
  handleSwapHtmlElements: (elementId: string, targetElementId: string) => void;
  handleInsertElementIntoElement: (
    elementId: string,
    targetElementId: string
  ) => void;
};
