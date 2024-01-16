import { HtmlEditorElementType } from "./EditorState";
import { StyledTreeItemProps } from "../components/treeview/CTreeItem";
import { v4 as uuid } from "uuid";
import { ElementBox } from "./ElementBox";
import { EditorStateType } from "./EditorState";

export const renderHtmlElements = (
  elements: HtmlEditorElementType[],
  editorState: EditorStateType,
  onSelectElement: (
    element: HtmlEditorElementType,
    isHovering: boolean
  ) => void,
  isProduction?: boolean
): React.ReactNode => {
  const rawElements = elements.map((element, eIdx) => {
    // styles for UI editor
    // const sx = {
    //   position: "relative",
    //   ":hover": {
    //     border: "1px solid rgba(0,150,136,0.5)",
    //     borderRadius: "1px",
    //     "& >div:first-of-type": {
    //       display: "block",
    //     },
    //   },
    // };
    return (
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
            editorState,
            onSelectElement,
            isProduction
          )}
      </ElementBox>
    );
  });
  return rawElements;
};

export const mapHtmlElementsToTreeItems = (
  elements: HtmlEditorElementType[]
): StyledTreeItemProps[] => {
  const treeItems = elements.map((element, eIdx) => {
    const id = element?.id ?? uuid();
    return {
      key: id,
      disableAddAction:
        ["html", "head"].includes(element.type) || element?.content,
      disableDeleteAction: ["html", "head", "body"].includes(
        element.type ?? ""
      ),
      nodeId: id,
      labelText: element.type + (element?.id ? `#${element.id}` : ""),
      children: element?.children?.length
        ? mapHtmlElementsToTreeItems(element.children)
        : [],
    };
  });
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
