import { cloneDeep } from "lodash";
import { HtmlEditorElementType, EditorStateType } from "./EditorState";

export const getSizeMode = (
  value: string | number | undefined,
  defaultValue = "auto"
) => {
  return typeof value === "number"
    ? "px"
    : typeof value === "string"
    ? value.includes("%")
      ? "%"
      : value.includes("vh")
      ? "vh"
      : value.includes("vw")
      ? "vw"
      : "px"
    : defaultValue;
};

// const getSizeModes = (width: number, height: number, borderRadius: string) => ({
//   //   widthMode: getSizeMode(width, "auto"),
//   //   heightMode: getSizeMode(height, "auto"),
//   //   borderWidthMode: "px",
//   //   editId: null as null | string,
//   //   fontSizeMode: "px",
//   borderRadiusCornerMode: borderRadius?.toString?.()?.split?.(" ")?.length,
//   borderRadiusCornerSizeMode: "px", //
//   //   classEditMode: false,
//   //   preselectedClass: null as string | null,
// });

export const getInitialStyles = (): React.CSSProperties => {
  return {
    display: "block",
    position: "static",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    color: "rgba(0, 0, 0, 1)",
    backgroundColor: "rgba(255, 255, 255, 1)",
  };
};

export const getFlatHtmlElements = (elements: HtmlEditorElementType[]) => {
  const flatElements: HtmlEditorElementType[] = [];
  elements.forEach((element) => {
    flatElements.push(element);
    if (element?.children?.length) {
      flatElements.push(...getFlatHtmlElements(element.children));
    }
  });
  return flatElements;
};

export const makeImageSourcesForExport = (
  editorState: EditorStateType
): EditorStateType["htmlPages"] => {
  const newHtmlPages = cloneDeep(editorState.htmlPages); // will be mutated
  const allPagesElements = Object.keys(newHtmlPages)
    .map((pageName) => newHtmlPages[pageName])
    ?.flat();
  const imageWorkspace = editorState?.imageWorkspaces?.common ?? {};
  const flatElements = getFlatHtmlElements(allPagesElements);

  flatElements.forEach((element) => {
    if (element.type === "img") {
      const image = imageWorkspace?.[element?.imageSrcId ?? ""];
      if (image) {
        const src = element.imageSrcId;
        const imageData = editorState?.imageWorkspaces?.common?.[src ?? ""];
        if (imageData) {
          if (!element?.attributes) {
            element.attributes = {};
          }
          (element.attributes as any).src = `/common/${imageData.fileName}`;
        }
      }
    }
  });
  return newHtmlPages;
};

export const replaceImageSources = (editorState: EditorStateType) => {
  const newHtmlPages = cloneDeep(editorState.htmlPages); // will be mutated
  const allPagesElements = Object.keys(newHtmlPages)
    .map((pageName) => newHtmlPages[pageName])
    ?.flat();
  const imageWorkspace = editorState?.imageWorkspaces?.common ?? {};
  const flatElements = getFlatHtmlElements(allPagesElements);

  flatElements.forEach((element) => {
    if (element.type === "img") {
      const image = imageWorkspace?.[element?.imageSrcId ?? ""];
      if (image) {
        const src = URL.createObjectURL(image.image as unknown as File);
        if (!element?.attributes) {
          element.attributes = {};
        }
        (element.attributes as any).src = src;
      }
    }
  });
  return newHtmlPages;
};
