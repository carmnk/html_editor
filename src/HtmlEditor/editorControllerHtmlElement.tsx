import { cloneDeep } from "lodash";
import {
  CSSProperties,
  useCallback,
  useMemo,
  Dispatch,
  SetStateAction,
} from "react";
import { EditorStateType, HtmlEditorElementType } from "./EditorState";
import { unmutatedCopy } from "../utils/react";
import { findElementById } from "./renderElements";
import { v4 as uuid } from "uuid";

export type EditorControllerHtmlElementActionsType = {
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

export type EditorControllerHtmlElementActionsParams = {
  editorState: EditorStateType;
  setEditorState: Dispatch<SetStateAction<EditorStateType>>;
  selectedPageHtmlElements: HtmlEditorElementType[];
  selectedHtmlElement: HtmlEditorElementType | null;
  selectedHtmlElementStyleAttributes: CSSProperties | null;
};

export const useEditorControllerHtmlElementActions = (
  params: EditorControllerHtmlElementActionsParams
): EditorControllerHtmlElementActionsType => {
  const {
    setEditorState,
    selectedPageHtmlElements,
    selectedHtmlElement,
    selectedHtmlElementStyleAttributes,
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
        );

        return {
          ...current,
          htmlPages: newHtmnlPages,
        };
      });
    },
    [setEditorState, selectedHtmlElement]
  );

  const handleChangeCurrentHtmlElementStyleAttribute = useCallback(
    (ruleValue: string, ruleName: string) => {
      if (!selectedHtmlElement) return;

      handleChangeCurrentHtmlElement((current) => {
        const newAttributes = {
          ...current.attributes,
          style: {
            ...current.attributes?.style,
            [ruleName]: ruleValue,
          },
        };
        return {
          ...current,
          attributes: newAttributes,
        };
      });
    },
    [handleChangeCurrentHtmlElement, selectedHtmlElement]
  );

  const handleRemoveCurrentHtmlElementStyleAttribute = useCallback(
    (ruleName: string) => {
      if (!selectedHtmlElement) return;
      handleChangeCurrentHtmlElement((current) => {
        const {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          [ruleName as keyof CSSProperties]: rOut,
          ...attributesExRemoved
        } = current.attributes?.style ?? {};
        return {
          ...current,
          attributes: {
            ...current.attributes,
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
        const newAttributes = {
          ...current.attributes,
          [attributeName]: attributeValue,
        };
        return {
          ...current,
          attributes: newAttributes,
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
    (newValue: string) => {
      const newElement: HtmlEditorElementType = {
        id: "new_element_" + uuid(),
        type: "div",
        children: [],
        attributes: {},
      };
      const newHmlElements = cloneDeep(selectedPageHtmlElements);
      const [foundItem] = findElementById(newValue, newHmlElements) ?? [];
      foundItem?.children?.push(newElement);
      setEditorState((current) => ({
        ...current,
        htmlPages: {
          ...current.htmlPages,
          [current.selectedPage]: newHmlElements,
        },
      }));
    },
    [setEditorState, selectedPageHtmlElements]
  );

  const handleDeleteHtmlElement = useCallback(
    (newValue: string) => {
      const newHmlElements = cloneDeep(selectedPageHtmlElements);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [foundItem, path] = findElementById(newValue, newHmlElements) ?? [];
      const parent = path?.length ? path?.[path?.length - 1] : null;
      if (!parent) return;
      const [parentEl] = findElementById(parent, newHmlElements) ?? [];
      if (!parentEl) return;
      const newParentChildrenElement = parentEl.children?.filter(
        (child) => child.id !== newValue
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
  };
};
