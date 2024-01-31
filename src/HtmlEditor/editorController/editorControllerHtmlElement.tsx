import { cloneDeep } from "lodash";
import { CSSProperties, useCallback, Dispatch, SetStateAction } from "react";
import {
  EditorStateType,
  HtmlEditorComponentElementTypes,
  HtmlEditorElementType,
} from "../EditorState";
import { unmutatedCopy } from "../../utils/react";
import { findElementById } from "../renderElements";
import { v4 as uuid } from "uuid";
import { baseComponents } from "../defs/baseComponents";
import {
  EditorControllerAppStateReturnType,
  EditorControllerHtmlElementActionsType,
} from "./editorControllerTypes";

export type EditorControllerHtmlElementActionsParams = {
  editorState: EditorStateType;
  setEditorState: Dispatch<SetStateAction<EditorStateType>>;
  selectedPageHtmlElements: HtmlEditorElementType[];
  selectedHtmlElement: HtmlEditorElementType | null;
  selectedHtmlElementStyleAttributes: CSSProperties | null;
  appState: EditorControllerAppStateReturnType;
};

export const useEditorControllerHtmlElementActions = (
  params: EditorControllerHtmlElementActionsParams
): EditorControllerHtmlElementActionsType => {
  const {
    editorState,
    setEditorState,
    selectedPageHtmlElements,
    selectedHtmlElement,
    selectedHtmlElementStyleAttributes,
    appState,
  } = params;
  const handleChangeCurrentHtmlElement = useCallback(
    (
      newHtmlElementIn:
        | HtmlEditorElementType
        | ((current: HtmlEditorElementType) => HtmlEditorElementType)
    ) => {
      if (!selectedHtmlElement) return;
      const newHtmlElement =
        typeof newHtmlElementIn === "function"
          ? newHtmlElementIn(selectedHtmlElement)
          : newHtmlElementIn;
      setEditorState((current) => {
        const newHtmnlPages = cloneDeep(current.htmlPages);
        const pageHtmlElements =
          newHtmnlPages?.[current.selectedPage ?? ""] ?? [];
        let [foundSelectedHtmlElement] =
          findElementById(selectedHtmlElement?.id ?? "", pageHtmlElements) ??
          [];
        if (!foundSelectedHtmlElement) {
          console.warn("No selected element !! DEV ");
          return current;
        }
        foundSelectedHtmlElement = unmutatedCopy(
          foundSelectedHtmlElement,
          newHtmlElement
        ) as unknown as HtmlEditorElementType<"button">;

        return {
          ...current,
          htmlPages: newHtmnlPages,
        };
      });
    },
    [setEditorState, selectedHtmlElement]
  );

  const handleSwapHtmlElements = useCallback(
    (elementId: string, targetElementId: string) => {
      setEditorState((current) => {
        const newPages = cloneDeep(current.htmlPages);
        const newPageHtmlElements =
          newPages?.[current.selectedPage ?? ""] ?? [];
        const [srcHtmlElement] =
          findElementById(elementId, newPageHtmlElements) ?? [];
        const [targetHtmlElement] =
          findElementById(targetElementId, newPageHtmlElements) ?? [];
        if (!srcHtmlElement || !targetHtmlElement) {
          console.warn("No selected element !! DEV ");
          return current;
        }
        const srcElementCopy = cloneDeep(srcHtmlElement);
        unmutatedCopy(srcHtmlElement, targetHtmlElement);
        unmutatedCopy(targetHtmlElement, srcElementCopy);

        return {
          ...current,
          htmlPages: newPages,
        };
      });
    },
    [setEditorState]
  );

  const handleDeleteHtmlElement = useCallback(
    (id: string | number) => {
      const newHmlElements = cloneDeep(selectedPageHtmlElements);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [foundItem, path] =
        findElementById(id as string, newHmlElements) ?? [];
      const parent = path?.length ? path?.[path?.length - 1] : null;
      if (!parent) return;
      const [parentEl] = findElementById(parent, newHmlElements) ?? [];
      if (!parentEl) return;
      const newParentChildrenElement = parentEl.children?.filter(
        (child) => child.id !== id
      );
      parentEl.children = newParentChildrenElement;
      setEditorState((current) => ({
        ...current,
        htmlPages: {
          ...current.htmlPages,
          [current.selectedPage]: newHmlElements,
        },
      }));
    },
    [selectedPageHtmlElements, setEditorState]
  );

  const handleInsertElementIntoElement = useCallback(
    (elementId: string, targetElementId: string) => {
      setEditorState((current) => {
        const newPages = cloneDeep(current.htmlPages);
        const newPageHtmlElements =
          newPages?.[current.selectedPage ?? ""] ?? [];
        const [srcHtmlElement, srcPath] =
          findElementById(elementId, newPageHtmlElements) ?? [];
        const [targetHtmlElement, targetPath] =
          findElementById(targetElementId, newPageHtmlElements) ?? [];
        if (!srcHtmlElement || !targetHtmlElement) {
          console.warn("No selected element !! DEV ");
          return current;
        }
        const srcElementCopy = cloneDeep(srcHtmlElement);
        // const newParentTarget =

        if (!targetHtmlElement.children) {
          targetHtmlElement.children = [];
        }

        // remove original
        const parentId = srcPath?.length
          ? srcPath?.[srcPath?.length - 1]
          : null;
        if (!parentId) return current;
        const [parentEl] = findElementById(parentId, newPageHtmlElements) ?? [];
        if (!parentEl) return current;
        const newParentChildrenElement = parentEl.children?.filter(
          (child) => child.id !== elementId
        );
        parentEl.children = newParentChildrenElement;

        // insert coppy
        targetHtmlElement.children = [
          ...(targetHtmlElement?.children ?? []),
          srcElementCopy,
        ];

        return {
          ...current,
          htmlPages: newPages,
        };
      });
    },
    [setEditorState]
  );

  const handleChangeCurrentHtmlElementStyleAttribute = useCallback(
    (ruleValue: string, ruleName: string) => {
      if (!selectedHtmlElement) return;

      handleChangeCurrentHtmlElement((current) => {
        const currentAttributes =
          "attributes" in current ? current.attributes : {};
        const newAttributes = {
          ...currentAttributes,
          style: {
            ...(currentAttributes?.style ?? {}),
            [ruleName]: ruleValue,
          },
        };
        return {
          ...current,
          attributes: newAttributes as any,
        };
      });
    },
    [handleChangeCurrentHtmlElement, selectedHtmlElement]
  );

  const handleRemoveCurrentHtmlElementStyleAttribute = useCallback(
    (ruleName: string) => {
      if (!selectedHtmlElement) return;
      handleChangeCurrentHtmlElement((current) => {
        const currentAttributes =
          "attributes" in current ? current.attributes : {};
        const {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          [ruleName as keyof CSSProperties]: rOut,
          ...attributesExRemoved
        } = currentAttributes?.style ?? {};
        return {
          ...current,
          attributes: {
            ...(currentAttributes as any),
            style: attributesExRemoved,
          },
        };
      });
    },
    [handleChangeCurrentHtmlElement, selectedHtmlElement]
  );

  const handleChangeCurrentHtmlElementAttribute = useCallback(
    (attributeName: string, attributeValue: string) => {
      handleChangeCurrentHtmlElement((current) => {
        const currentAttributes =
          "attributes" in current ? current.attributes : {};
        const newAttributes = {
          ...currentAttributes,
          [attributeName]: attributeValue,
        };
        return {
          ...current,
          attributes: newAttributes as any,
        };
      });
    },
    [handleChangeCurrentHtmlElement]
  );

  const handleChangeCurrentHtmlElementProp = useCallback(
    (propName: "id" | "type" | "content" | "imageSrcId", propValue: string) => {
      handleChangeCurrentHtmlElement((current) => {
        return {
          ...current,
          [propName]: propValue,
        };
      });
    },
    [handleChangeCurrentHtmlElement]
  );

  const handleToggleHtmlElementEditCssRule = useCallback(
    (attributeName: string) => {
      setEditorState((current) => ({
        ...current,
        ui: {
          ...current.ui,
          detailsMenu: {
            ...current.ui.detailsMenu,
            htmlElement: {
              ...current.ui.detailsMenu.htmlElement,
              editCssRuleName: current.ui.detailsMenu.htmlElement
                ?.editCssRuleName
                ? null
                : attributeName,
              editCssRuleValue: current.ui.detailsMenu.htmlElement
                ?.editCssRuleName
                ? null
                : // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  (selectedHtmlElementStyleAttributes as any)?.[
                    attributeName
                  ] ?? "",
            },
          },
        },
      }));
    },
    [selectedHtmlElementStyleAttributes, setEditorState]
  );

  const handleChangeHtmlElementEditedCssRuleValue = useCallback(
    (newValue: string, activeEditRule: string) => {
      handleChangeCurrentHtmlElementStyleAttribute(
        newValue,
        activeEditRule ?? ""
      );
      setEditorState((current) => ({
        ...current,
        ui: {
          ...current.ui,
          detailsMenu: {
            ...current.ui.detailsMenu,
            htmlElement: {
              ...current.ui.detailsMenu.htmlElement,
              editCssRuleName: null,
              editCssRuleValue: null,
            },
          },
        },
      }));
    },
    [handleChangeCurrentHtmlElementStyleAttribute, setEditorState]
  );

  const handleAddHtmlChild = useCallback(
    (currentElementId: string, newElementType?: string) => {
      const newElement: HtmlEditorElementType = {
        id: uuid(),
        type: (newElementType as any) ?? "div",
        children: [],
        attributes: {},
      };
      const newHmlElements = cloneDeep(selectedPageHtmlElements);
      const [foundItem] =
        findElementById(currentElementId, newHmlElements) ?? [];
      foundItem?.children?.push(newElement as any);
      setEditorState((current) => ({
        ...current,
        htmlPages: {
          ...current.htmlPages,
          [current.selectedPage]: newHmlElements,
        },
        expandedTreeItems: current?.expandedTreeItems?.includes(
          currentElementId
        )
          ? current.expandedTreeItems
          : [...(current.expandedTreeItems ?? []), currentElementId],
      }));
    },
    [setEditorState, selectedPageHtmlElements]
  );
  const handleAddComponentChild = useCallback(
    (newValue: string, type: HtmlEditorComponentElementTypes) => {
      const defaultComponentProps = baseComponents.find(
        (comp) => comp.type === type
      );
      const id = uuid();
      // const state = defaultComponentProps?.state
      //   ? { [id]: defaultComponentProps?.state }
      //   : {};

      const newElement: HtmlEditorElementType<HtmlEditorComponentElementTypes> =
        {
          children: [],
          props: {},
          ...defaultComponentProps,
          type,
          id,
          userID: "",
        };
      const newHmlElements = cloneDeep(selectedPageHtmlElements);
      const [foundItem] = findElementById(newValue, newHmlElements) ?? [];
      foundItem?.children?.push(newElement as any);
      setEditorState((current) => ({
        ...current,
        htmlPages: {
          ...current.htmlPages,
          [current.selectedPage]: newHmlElements,
        },
        expandedTreeItems: current?.expandedTreeItems?.includes(newValue)
          ? current.expandedTreeItems
          : [...(current.expandedTreeItems ?? []), newValue],
      }));
      appState.actions.addProperty(id, defaultComponentProps?.state ?? "");
      // appState.setStateValues((current) => ({
      //   ...current,
      //   [id]: defaultComponentProps?.state ? [defaultComponentProps.state] : [],
      // }));
    },
    [setEditorState, selectedPageHtmlElements, appState]
  );

  const handleChangeComponentProp = useCallback(
    (key: string, value: any) => {
      if (!selectedHtmlElement) return;
      // TODO: Generic approad
      if (key === "items") {
        const newTabNames = value
          .map((tab: any) => tab.value)
          ?.sort((a: string, b: string) => (a > b ? 1 : a < b ? -1 : 0));

        const currentTabNames =
          (selectedHtmlElement as any)?.props?.items?.map?.(
            (tab: any) => tab.value
          ) || [];
        // const currentTabNames = appState.values?.[selectedHtmlElement.id]?.sort(
        //   (a: string, b: string) => (a > b ? 1 : a < b ? -1 : 0)
        // );

        // Tabs are different!
        if (newTabNames?.join("") !== currentTabNames?.join("")) {
          // change state value in NavContainers
          // console.log("CurrentTab -> GET NAV CONTAINERSE!");
          console.log("CHANGE NavContainer, too and current tab if needed!");
        }
      }
      handleChangeCurrentHtmlElement((current) => {
        return {
          ...current,
          props: {
            ...((current as any).props ?? {}),
            [key]: value,
          },
        };
      });
    },
    [handleChangeCurrentHtmlElement, selectedHtmlElement]
  );

  return {
    changeHtmlElementEditedCssRuleValue:
      handleChangeHtmlElementEditedCssRuleValue,
    changeCurrentHtmlElement: handleChangeCurrentHtmlElement,
    changeCurrentHtmlElementStyleAttribute:
      handleChangeCurrentHtmlElementStyleAttribute,
    changeCurrentHtmlElementAttribute: handleChangeCurrentHtmlElementAttribute,
    changeCurrentHtmlElementProp: handleChangeCurrentHtmlElementProp,
    handleDeleteHtmlElement,
    handleAddHtmlChild,
    handleToggleHtmlElementEditCssRule,
    handleRemoveCurrentHtmlElementStyleAttribute,
    handleAddComponentChild,
    handleChangeComponentProp,
    handleSwapHtmlElements,
    handleInsertElementIntoElement,
  };
};
