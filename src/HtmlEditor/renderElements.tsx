import {
  HtmlEditorComponentElementTypes,
  HtmlEditorElementKeyType,
  HtmlEditorElementType,
} from "./EditorState";
import { StyledTreeItemProps } from "../components/treeview/CTreeItem";
import { v4 as uuid } from "uuid";
import { ElementBox } from "./ElementBox";
import { EditorStateType } from "./EditorState";
import { Button } from "../components/buttons/Button";
import { Box, Chip, Typography } from "@mui/material";
import { mdiCodeBlockTags, mdiReact } from "@mdi/js";
import Icon from "@mdi/react";
import { CTabs } from "../components/navigation/CTabs";
import { EditorControllerType } from "./editorController/editorController";
import { baseComponents } from "./defs/baseComponents";
import { CBottomNavigation } from "../components/navigation/CBottomNavigation";
import { CListNavigation } from "../components/navigation/CListNavigation";

export const isStringLowerCase = (str: string): boolean => {
  return str === str.toLowerCase();
};

export const isComponentType = (
  type: HtmlEditorElementKeyType
): type is HtmlEditorComponentElementTypes =>
  !isStringLowerCase(type.slice(0, 1));

export const renderHtmlElements = (
  elements: HtmlEditorElementType[],
  editorController: EditorControllerType,
  onSelectElement: (
    element: HtmlEditorElementType,
    isHovering: boolean
  ) => void,
  isProduction?: boolean,
  icons?: { [key: string]: string }
): React.ReactNode => {
  const { editorState, actions, appState } = editorController;
  const rawElements = elements.map((element, eIdx) => {
    const typeFirstLetter = element.type.slice(0, 1);
    const isHtmlElement = isStringLowerCase(typeFirstLetter);
    const iconKey = ((element as any)?.props?.icon as string) ?? "";
    const elementAdj = iconKey
      ? {
          ...element,
          props: {
            ...(((element as any)?.props as any) ?? {}),
            icon: icons?.[iconKey],
          },
        }
      : element;

    const navValueState = (appState as any)?.state?.[element?.id] ?? {};
    // if (element?.type === "Tabs") {
    //   console.log("navValueState", navValueState, appState);
    // }
    const onTabChange = (tabValue: string) => {
      console.log("CLICKED TAB", tabValue);
      appState.actions.updateProperty(element?.id, tabValue);
    };

    const tabChildren =
      element?.type === "NavContainer"
        ? (() => {
            const sourceControlElementId = element?.props?.navigationElementId;

            if (!sourceControlElementId) return [];
            const activeTab = appState?.state?.[sourceControlElementId];
            const activeId = element?.props?.items?.find(
              (item: any) => item.value === activeTab
            )?.childId;
            const activeChild = element?.children?.find?.(
              (child) => child.id === activeId
            );
            const children = activeChild ? [activeChild] : [];
            return children;
          })()
        : [];

    return isHtmlElement ? (
      <ElementBox
        element={element}
        onSelectElement={onSelectElement}
        editorState={editorState}
        key={element.id}
        isProduction={isProduction}
      >
        {!!element?.children?.length &&
          renderHtmlElements(
            element.children,
            editorController,
            onSelectElement,
            isProduction,
            icons
          )}
      </ElementBox>
    ) : isComponentType(element.type) ? (
      element?.type === "Button" ? (
        <Button {...((elementAdj as any)?.props ?? {})}>TEST</Button>
      ) : element?.type === "Chip" ? (
        <Chip {...(element?.props ?? {})} />
      ) : element?.type === "Typography" ? (
        <Typography {...(element?.props ?? {})} />
      ) : //  NAVIGATION ELEMENTS (slightly different interface)
      element?.type === "Tabs" ? (
        <CTabs
          {...((element?.props as any) ?? {})}
          onChange={onTabChange}
          value={navValueState}
        />
      ) : element?.type === "BottomNavigation" ? (
        <CBottomNavigation
          {...((element?.props as any) ?? {})}
          onChange={onTabChange}
          value={navValueState}
        />
      ) : element?.type === "ListNavigation" ? (
        <CListNavigation
          {...((element?.props as any) ?? {})}
          onChange={onTabChange}
          value={navValueState}
        />
      ) : // Navigation Container -> specific render case (but could be component, too)
      element?.type === "NavContainer" ? (
        (() => {
          const { children, ...childLessProps } = element?.props ?? {};
          return (
            <Box {...(childLessProps ?? {})}>
              {!!tabChildren?.length &&
                renderHtmlElements(
                  tabChildren,
                  editorController,
                  onSelectElement,
                  isProduction,
                  icons
                )}
            </Box>
          );
        })()
      ) : null
    ) : null;
  });
  return rawElements;
};

export const mapHtmlElementsToTreeItems = (
  elements: HtmlEditorElementType[],
  isDraggable: boolean,
  rootElements?: HtmlEditorElementType[],
  parentNavContainerId?: string
): StyledTreeItemProps[] => {
  const treeItems = elements.map((element, eIdx) => {
    const id = element?.id ?? uuid();

    const parentNavContainer = parentNavContainerId
      ? findElementById(parentNavContainerId, rootElements ?? [])?.[0]
      : null;
    const parentNavContainerItems =
      (parentNavContainer as any)?.props?.items ?? [];
    const caseName = parentNavContainerItems?.find(
      (item: any) => item.childId === id
    )?.value;

    console.log(parentNavContainer, parentNavContainerItems, caseName);

    return {
      key: id,
      type: element.type,
      parentNavContainerId,
      nodeId: id,
      element,
      labelIcon: (
        <Icon
          path={
            isComponentType(element.type)
              ? baseComponents?.find((com) => com.type === element?.type)
                  ?.icon ?? mdiReact
              : mdiCodeBlockTags
          }
          size={1}
        />
      ),
      labelText:
        (parentNavContainerId ? (caseName ? "↦" + caseName + ":" : "⚠:") : "") +
        (element.type +
          ((element as any).attributes?.id ?? (element as any)?.userID
            ? `#${(element as any).attributes?.id ?? (element as any)?.userID}`
            : "")),
      children: element?.children?.length
        ? mapHtmlElementsToTreeItems(
            element.children,
            isDraggable,
            rootElements ?? elements,
            element?.type === "NavContainer" ? element?.id : undefined
          )
        : [],
      useDraggable: isDraggable,
    } as StyledTreeItemProps;
  }) as StyledTreeItemProps[];
  return treeItems as any;
};

export const getStylesFromClasses = (
  className: string,
  cssWorkspaces: EditorStateType["cssWorkspaces"]
): React.CSSProperties => {
  const classNames = className?.trim?.()?.split?.(" ");
  const classStyles = classNames?.map(
    (className) => cssWorkspaces?.common?.[className] ?? {}
  );
  const stylesFromClasses = classStyles?.reduce?.((acc, curr) => {
    return {
      ...acc,
      ...curr,
    };
  }, {});
  return stylesFromClasses;
};

export const findElementById = <
  T extends keyof HTMLElementTagNameMap = keyof HTMLElementTagNameMap
>(
  id: string,
  root: any[],
  path?: string[]
): [HtmlEditorElementType<T>, string[]] | null => {
  for (let i = 0; i < root.length; i++) {
    const element = root[i];
    if (element.id === id) {
      return [element, path ?? []];
    }
    if (element.children?.length) {
      const newPath = [...(path ?? []), element.id];
      const [foundEl, pathBack] =
        findElementById(id, element.children, newPath) ?? [];
      if (foundEl) {
        return [foundEl as any, pathBack ?? []];
      }
    }
  }
  return null;
};
