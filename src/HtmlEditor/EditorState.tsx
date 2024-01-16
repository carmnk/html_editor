import { CSSProperties, HTMLProps } from "react";
import { baseHtmlDocument } from "./defs/baseHtmlElements";
import { muiLightSiteTheme } from "../theme/muiTheme";
import { Theme } from "@mui/material";
import { cloneDeep } from "lodash";
// import { HtmlEditorElementType } from "./HtmlEditorElement";

export type HtmlEditorElementType<
  T extends keyof HTMLElementTagNameMap = keyof HTMLElementTagNameMap
> = {
  id?: string;
  type: T;
  attributes?: HTMLProps<HTMLElementTagNameMap[T]>;
  children?: HtmlEditorElementType<keyof HTMLElementTagNameMap>[];
  content?: string;
  imageSrcId?: string;
};

export enum EditorStateLeftMenuTabs {
  PROJECT = "project",
  PAGE = "page",
  CSS = "css",
  ASSETS = "assets",
  Image = "image",
  Localization = "localization",
}

export type CssWorkspaceType = {
  [classes: string]: CSSProperties;
};

export type EditorStateType = {
  htmlPages: { [key: string]: HtmlEditorElementType[] };
  // htmlElements: HtmlEditorElementType[];
  selectedHtmlElementName: string | null;
  expandedTreeItems: string[];
  // selectedItem: HtmlEditorElementType | null;
  theme: Theme;
  selectedCssClass: string | null;
  selectedImage: string | null;
  selectedPage: string;
  cssWorkspaces: {
    common: CssWorkspaceType;
    [key: string]: CssWorkspaceType;
  };
  imageWorkspaces: {
    common: {
      [id: string]: {
        image: typeof Image;
        src: string;
        fileName: string;
      };
    };
    [key: string]: {
      [id: string]: {
        image: typeof Image;
        src: string;
        fileName: string;
      };
    };
  };
  ui: {
    detailsMenu: {
      ruleName: string;
      ruleValue: string;
      addRuleName: string;
      addRuleValue: string;
      htmlElement: {
        editCssRuleName: string | null;
        editCssRuleValue: string | null;
        cssRulesFilter: "all" | "classes" | "styles";
        activeStylesTab: "layout" | "shape" | "typography" | "content";
        classEditMode: boolean;
      };
    };
    navigationMenu: {
      activeTab: EditorStateLeftMenuTabs;
    };
  };
  // selected?: {
  //   page: string | null;
  //   element: string | null;
  //   cssRule: string | null;
  //   cssWorkspace: string | null;
  // };
};

export const defaultEditorState = (): EditorStateType => {
  const defaultHtmlPageElements = cloneDeep(baseHtmlDocument);
  return {
    htmlPages: {
      index: defaultHtmlPageElements,
    },
    cssWorkspaces: {
      common: {
        // body: {
        //   boxSizing: "border-box",
        // },
      },
    },
    imageWorkspaces: {
      common: {},
    },
    selectedCssClass: null,
    // htmlElements: defaultHtmlPageElements, // -> included in htmlPages
    selectedHtmlElementName: null,
    expandedTreeItems: [],
    // selectedItem: null, // -> included in htmlPages
    theme: muiLightSiteTheme,
    selectedPage: "index",
    selectedImage: null,
    ui: {
      detailsMenu: {
        ruleName: "",
        ruleValue: "",
        addRuleName: "",
        addRuleValue: "",
        htmlElement: {
          editCssRuleName: null,
          editCssRuleValue: null,
          cssRulesFilter: "all",
          activeStylesTab: "layout",
          classEditMode: false,
        },
      },
      navigationMenu: {
        activeTab: EditorStateLeftMenuTabs.PAGE,
      },
    },
  };
};
