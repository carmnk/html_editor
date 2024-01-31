import { CSSProperties, HTMLProps } from "react";
import { baseHtmlDocument } from "./defs/baseHtmlElements";
import {
  ExtendedTheme,
  muiDarkSiteTheme,
  muiLightSiteTheme,
} from "../theme/muiTheme";
import { cloneDeep } from "lodash";

export enum HtmlEditorComponentElementTypes {
  Button = "Button",
  Chip = "Chip",
  Typography = "Typography",
  Tabs = "Tabs",
  NavContainer = "NavContainer",
  ListNavigation = "ListNavigation",
  BottomNavigation = "BottomNavigation",
}
type ComponentKeyType = `${HtmlEditorComponentElementTypes}`;

export type HtmlEditorElementKeyType =
  | keyof HTMLElementTagNameMap
  | ComponentKeyType;

type ComponentChildrenType = HtmlEditorElementType<HtmlEditorElementKeyType>;

export type HtmlEditorElementType<
  T extends HtmlEditorElementKeyType = HtmlEditorElementKeyType
> = T extends keyof HTMLElementTagNameMap
  ? {
      id: string; // -> should be:  _id (internal)
      type: T;
      attributes?: HTMLProps<HTMLElementTagNameMap[T]>;
      children?: HtmlEditorElementType<keyof HTMLElementTagNameMap>[];
      content?: string;
      imageSrcId?: string;
      _disableDelete?: boolean;
    }
  : {
      id: string; // -> should be:  _id (internal)
      userID: string;
      type: T;
      // attributes?: HTMLProps<HTMLElementTagNameMap[T]>;
      children?: ComponentChildrenType[];
      props?: { [key: string]: any };
    };

export type NEW_GenericHtmlEditorElementType<
  T extends HtmlEditorElementKeyType = keyof HTMLElementTagNameMap
> = {
  _id: string; // -> _
  _userID: string | null; // -> instead of attributes.id !!! (comp: -> _)
  _parentId: string | null; // -> _ was children before !!!
  _content?: string; // -> _
  _imageSrcId?: string; // -> _
  _type: T; //  -> _
  _disableDelete?: boolean;
  _page: string;
};

export type NEW_HtmlEditorElementType<
  T extends HtmlEditorElementKeyType = keyof HTMLElementTagNameMap
> = T extends keyof HTMLElementTagNameMap
  ? NEW_GenericHtmlEditorElementType<T> & {
      attributes?: HTMLProps<HTMLElementTagNameMap[T]>; // subtable
    }
  : NEW_GenericHtmlEditorElementType<T> & {
      props?: { [key: string]: any };
    };

export enum EditorStateLeftMenuTabs {
  PROJECT = "project",
  PAGE = "page",
  CSS = "css",
  ASSETS = "assets",
  Image = "image",
  Localization = "localization",
  Theme = "theme",
  Font = "font",
  State = "state",
}

type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

export type CssWorkspaceType = {
  [classes: string]: CSSProperties;
};

export type EditorStateType = {
  elements: NEW_HtmlEditorElementType[];

  htmlPages: { [key: string]: HtmlEditorElementType[] };
  // htmlElements: HtmlEditorElementType[];
  selectedHtmlElementName: string | null;
  expandedTreeItems: string[];
  // selectedItem: HtmlEditorElementType | null;
  theme: ExtendedTheme;
  themes: ExtendedTheme[];
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
  fonts: string[];

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
      elementAddComponentMode: string | null;
      selectedTheme: string | null;
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
    elements:
      defaultHtmlPageElements?.map((el) => ({
        _id: el.id,
        _parentId: null,
        _userID: null,
        _type: el.type as any,
        _page: "index",
      })) ?? [],
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
    themes: [muiLightSiteTheme, muiDarkSiteTheme] as any,
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
        elementAddComponentMode: null,
        selectedTheme: null,
      },
    },
    fonts: [
      "Arial",
      "Arial Black",
      "Tahoma",
      "Times New Roman",
      "Verdana",
      "'Roboto'",
    ],
  };
};
