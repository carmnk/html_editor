import { cloneDeep } from "lodash";
import {
  CSSProperties,
  ChangeEvent,
  useState,
  useCallback,
  useMemo,
} from "react";
import { muiLightSiteTheme, muiDarkSiteTheme } from "../theme/muiTheme";
import {
  toBase64,
  createAndDownloadFileWithText,
  dataURLtoFile,
} from "../utils/file";
import {
  EditorStateLeftMenuTabs,
  EditorStateType,
  HtmlEditorElementType,
  defaultEditorState,
} from "./EditorState";
import { findElementById, getStylesFromClasses } from "./renderElements";
import { baseHtmlDocument } from "./defs/baseHtmlElements";
import { v4 as uuid } from "uuid";
import {
  getInitialStyles,
  makeImageSourcesForExport,
  replaceImageSources,
} from "./utils";
import { useEditorControllerHtmlElementActions } from "./editorControllerHtmlElement";
import { useEditorControllerCssSelectorActions } from "./editorControllerCssSelector";

export type EditorControllerType = {
  editorState: EditorStateType;
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
    };
    htmlElement: {
      handleDeleteHtmlElement: (newValue: string) => void;
      handleAddHtmlChild: (newValue: string) => void;
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
    };
    cssSelector: {
      removeRule: (ruleName: string) => void;
      addNewRule: () => void;
      toggleEditRule: (ruleName: keyof CSSProperties) => void;
      handleChangeEditRuleValue: (newValue: string) => void;
      handleChangeClassName: (newClassName: string) => void;
      handleChangeAddClassRuleName: (newValue: string) => void;
      handleChangeAddClassRuleValue: (newValue: string) => void;
      handleDeleteCssSelector: (name: string) => void;
      handleAddCssSelector: (newVal: string) => void;
    };
    assets: {
      handleProvidedImageFile: (files: File[]) => void;
      handleDeleteImageFile: (imageId: string) => void;
      handleChangeImageFilename: (newFileName: string) => void;
    };
    ui: {
      toggleEditorTheme: () => void;
      handleSelectHtmlPage: (newValue: string) => void;
      handleSelectHtmlElement: (newValue: string) => void;
      handleSelectCssClass: (newValue: string) => void;
      handleSelectImage: (newValue: string) => void;
      navigationMenu: {
        handleSwitchNavigationTab: (newValue: string) => void;
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

export const useEditorController = (): EditorControllerType => {
  const [editorState, setEditorState] = useState(defaultEditorState());

  /* eslint-disable react-hooks/exhaustive-deps */
  const selectedHtmlElement = useMemo(() => {
    const id = editorState?.selectedHtmlElementName;
    const selectedPage = editorState?.selectedPage;
    const pageHtmlElements = editorState?.htmlPages?.[selectedPage ?? ""] ?? [];
    return findElementById(id ?? "", pageHtmlElements ?? [])?.[0] ?? null;
  }, [
    editorState?.selectedHtmlElementName,
    editorState?.selectedPage,
    editorState?.htmlPages?.[editorState?.selectedPage ?? ""],
  ]);
  const selectedPageHtmlElements = useMemo(() => {
    const selectedPage = editorState?.selectedPage;
    const pageHtmlElements = editorState?.htmlPages?.[selectedPage ?? ""] ?? [];
    return pageHtmlElements;
  }, [
    editorState?.selectedPage,
    editorState?.htmlPages?.[editorState?.selectedPage ?? ""],
  ]);
  /* eslint-enable react-hooks/exhaustive-deps */

  const selectedHtmlElementStyleAttributes = useMemo(() => {
    const className = selectedHtmlElement?.attributes?.className;
    return {
      ...getInitialStyles(),
      ...getStylesFromClasses(className ?? "", editorState?.cssWorkspaces),
      ...(selectedHtmlElement?.attributes?.style ?? {}),
    };
  }, [selectedHtmlElement, editorState.cssWorkspaces]);

  const htmlElementActions = useEditorControllerHtmlElementActions({
    editorState,
    setEditorState,
    selectedHtmlElement,
    selectedHtmlElementStyleAttributes,
    selectedPageHtmlElements,
  });
  const cssSelectorActions = useEditorControllerCssSelectorActions({
    editorState,
    setEditorState,
  });

  const getSelectedCssClass = useCallback(
    (className?: string) => {
      const selectedClass = className ?? editorState?.selectedCssClass ?? "";
      const commonWorkspace = editorState?.cssWorkspaces?.common;
      const selectedClassStyle = commonWorkspace?.[selectedClass] ?? {};
      return selectedClassStyle;
    },
    [editorState?.cssWorkspaces, editorState?.selectedCssClass]
  );
  const getSelectedImage = useCallback(
    (imageId?: string) => {
      const selectedImageId = imageId ?? editorState?.selectedImage;
      const commonWorkspace = editorState?.imageWorkspaces?.common;
      const selectedImage = commonWorkspace?.[selectedImageId ?? ""] ?? null;
      return { ...selectedImage, imageSrcId: imageId ?? "" };
    },
    [editorState?.imageWorkspaces, editorState?.selectedImage]
  );

  const toggleEditorTheme = useCallback(() => {
    setEditorState((current) => ({
      ...current,
      theme:
        current.theme === muiLightSiteTheme
          ? muiDarkSiteTheme
          : muiLightSiteTheme,
    }));
  }, []);

  const saveProject = useCallback(async () => {
    const { cssWorkspaces, imageWorkspaces } = editorState;
    const htmlPages = makeImageSourcesForExport(editorState);
    const assetLessEditorState = cloneDeep({ htmlPages, cssWorkspaces });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const convertedImageWorkspaces: any = {};
    for (const wsName of Object.keys(imageWorkspaces)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const convertedImageWorkspace: any = {};
      const imageWorkspace = imageWorkspaces[wsName];
      for (const imageId of Object.keys(imageWorkspace)) {
        convertedImageWorkspace[imageId] = {
          ...(imageWorkspaces[wsName][imageId] ?? {}),
          image: await toBase64(
            imageWorkspace[imageId].image as unknown as File
          ),
          src: `${wsName}/${imageWorkspaces[wsName][imageId].fileName}`,
        };
      }
      convertedImageWorkspaces[wsName] = convertedImageWorkspace;
    }
    const saveState = {
      ...assetLessEditorState,
      localImageWorkspaces: convertedImageWorkspaces,
    };
    const saveStateStr = JSON.stringify(saveState, null, 2);
    createAndDownloadFileWithText("website_builder_project.json", saveStateStr);
  }, [editorState]);

  const handleLoadProject = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      const files: File[] = Array.from(e.target.files ?? []);
      const file = files?.[0];
      if (!file) return;
      const fileText = await file.text();
      const json = JSON.parse(fileText) as Pick<
        EditorStateType,
        "cssWorkspaces" | "htmlPages" | "imageWorkspaces"
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      > & { localImageWorkspaces: any };

      const { htmlPages, cssWorkspaces, localImageWorkspaces } = json;

      const convertedImageWorkspaces: {
        [key: string]: {
          [key: string]: { image: File; src: string; filename: string };
        };
      } = {};
      for (const wsName of Object.keys(localImageWorkspaces)) {
        const convertedImageWorkspace: {
          [key: string]: { image: File; src: string; filename: string };
        } = {};
        const imageWorkspace = localImageWorkspaces[wsName];
        for (const imageId of Object.keys(imageWorkspace)) {
          const imageData = imageWorkspace[imageId];
          const fileStr = imageData.image as unknown as string;
          const file = dataURLtoFile(fileStr, imageData.fileName);
          convertedImageWorkspace[imageId] = {
            ...(localImageWorkspaces[wsName][imageId] ?? {}),
            image: file,
            src: URL.createObjectURL(file),
            filename: imageData.fileName,
          };
        }
        convertedImageWorkspaces[wsName] = convertedImageWorkspace;
      }

      const loadState = {
        htmlPages,
        cssWorkspaces,
        imageWorkspaces:
          convertedImageWorkspaces as unknown as EditorStateType["imageWorkspaces"],
      };
      const newHtmlPages = replaceImageSources(loadState as EditorStateType);

      setEditorState((current) => ({
        ...current,
        ...loadState,
        htmlPages: newHtmlPages,
        selectedCssClass: null,
        selectedImage: null,
        selectedHtmlElementName: null,
        selectedPage: "index",
      }));
    },
    []
  );

  const handleChangeImageFilename = useCallback(
    (newFileName: string) => {
      if (!newFileName) return;
      const selectedFileId = editorState.selectedImage;
      if (!selectedFileId) return;

      setEditorState((current) => ({
        ...current,
        imageWorkspaces: {
          ...(current?.imageWorkspaces ?? {}),
          common: {
            ...(current?.imageWorkspaces?.common ?? {}),
            [selectedFileId]: {
              ...current?.imageWorkspaces?.common?.[selectedFileId],
              fileName: newFileName,
            },
          },
        },
      }));
    },
    [editorState.selectedImage, setEditorState]
  );


  const handleChangeTab = useCallback(
    (newValue: string) => {
      const newValueTyped = newValue as "layout" | "shape" | "typography";
      setEditorState((current) => ({
        ...current,
        ui: {
          ...current.ui,
          detailsMenu: {
            ...current.ui.detailsMenu,
            htmlElement: {
              ...current.ui.detailsMenu.htmlElement,
              activeStylesTab: newValueTyped,
            },
          },
        },
      }));
    },
    [setEditorState]
  );

  const handleSelectHtmlElementCssPropertiesListFilter = useCallback(
    (newValueRaw: string) => {
      const newValue = newValueRaw as "all" | "styles" | "classes";
      setEditorState((current) => ({
        ...current,
        ui: {
          ...current.ui,
          detailsMenu: {
            ...current.ui.detailsMenu,
            htmlElement: {
              ...current.ui.detailsMenu.htmlElement,
              cssRulesFilter: newValue,
            },
          },
        },
      }));
    },
    [setEditorState]
  );

  const handleAddHtmlPage = useCallback(() => {
    setEditorState((current) => {
      const newPageName =
        `newPage` +
        (Object.keys(current.htmlPages).includes("newPage")
          ? Object.keys(current.htmlPages)
              .map((pageName) => pageName.includes("newPage"))
              ?.filter((x) => x)?.length ?? 1
          : ""
        )?.toString();
      return {
        ...current,
        htmlPages: {
          ...current.htmlPages,
          [newPageName]: cloneDeep(baseHtmlDocument),
        },
      };
    });
  }, [setEditorState]);

  const handleSelectHtmlPage = useCallback(
    (newValue: string) => {
      setEditorState((current) => ({
        ...current,
        ui: {
          ...current.ui,
          navigationMenu: {
            ...current.ui.navigationMenu,
            activeTab: EditorStateLeftMenuTabs.PAGE,
          },
        },
        selectedPage: newValue,
        selectedHtmlElementName: null,
      }));
    },
    [setEditorState]
  );

  const handleSelectCssClass = useCallback((newValue: string) => {
    setEditorState((current) => ({
      ...current,
      selectedCssClass: newValue,
    }));
  }, []);

  const handleSelectImage = useCallback((newValue: string) => {
    setEditorState((current) => ({
      ...current,
      selectedImage: newValue,
    }));
  }, []);

  const handleDeleteImageFile = useCallback(
    (imageId: string) => {
      setEditorState((current) => {
        const imagesCommonWorkspace = current.imageWorkspaces?.common;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [imageId]: _nOut, ...imagesCommonWorkspaceExDeleteItem } =
          imagesCommonWorkspace;
        return {
          ...current,
          imageWorkspaces: {
            ...current?.cssWorkspaces,
            common: imagesCommonWorkspaceExDeleteItem,
          },
        };
      });
    },
    [setEditorState]
  );

  const handleProvidedImageFile = useCallback(
    (files: File[]) => {
      const newImages = files?.reduce(
        (
          acc: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            [key: string]: { image: any; fileName: string; src: string };
          },
          file
        ) => {
          const id = uuid();
          acc[id] = {
            image: file,
            fileName: file.name,
            src: URL.createObjectURL(file),
          };
          return acc;
        },
        {}
      );

      setEditorState((current) => ({
        ...current,
        imageWorkspaces: {
          ...current.imageWorkspaces,
          common: {
            ...current.imageWorkspaces.common,
            ...newImages,
          },
        },
      }));
    },
    [setEditorState]
  );

  const handleSwitchNavigationTab = useCallback((newValue: string) => {
    setEditorState((current) => ({
      ...current,
      ui: {
        ...current.ui,
        navigationMenu: {
          ...current.ui.navigationMenu,
          activeTab: newValue as EditorStateLeftMenuTabs,
        },
      },
    }));
  }, []);

  const handleSelectHtmlElement = useCallback(
    (value: string) => {
      setEditorState((current) => ({
        ...current,
        selectedHtmlElementName: value,
        expandedTreeItems: current?.expandedTreeItems?.includes(value)
          ? current?.expandedTreeItems?.filter((item) => item !== value)
          : [...(current?.expandedTreeItems ?? []), value],
      }));
    },
    [setEditorState]
  );

  return {
    editorState,
    setEditorState,
    getSelectedCssClass,
    getSelectedImage,
    selectedHtmlElement,
    selectedPageHtmlElements,
    selectedHtmlElementStyleAttributes,
    actions: {
      project: {
        saveProject,
        handleLoadProject,
        addHtmlPage: handleAddHtmlPage,
      },
      htmlElement: htmlElementActions,
      cssSelector: cssSelectorActions,
      assets: {
        handleProvidedImageFile,
        handleDeleteImageFile,
        handleChangeImageFilename,
      },
      ui: {
        toggleEditorTheme,
        handleSelectHtmlPage,
        handleSelectHtmlElement,
        handleSelectCssClass,
        handleSelectImage,
        navigationMenu: {
          handleSwitchNavigationTab,
        },
        detailsMenu: {
          handleSelectHtmlElementCssPropertiesListFilter,
          handleChangeHtmlElementStyleTab: handleChangeTab,
        },
      },
    },
  };
};
