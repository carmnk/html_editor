import { EditorStateType } from './editorController/editorState'

export const getSizeMode = (
  value: string | number | undefined,
  defaultValue = 'auto'
) => {
  return typeof value === 'number'
    ? 'px'
    : typeof value === 'string'
    ? value.includes('%')
      ? '%'
      : value.includes('vh')
      ? 'vh'
      : value.includes('vw')
      ? 'vw'
      : 'px'
    : defaultValue
}

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
    display: 'block',
    position: 'static',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    color: 'rgba(0, 0, 0, 1)',
    backgroundColor: 'rgba(255, 255, 255, 1)',
  }
}

export const makeImageSourcesForExport = (editorState: EditorStateType) => {
  // const newHtmlPages = cloneDeep(editorState.htmlPages); // will be mutated
  // const allPagesElements = Object.keys(newHtmlPages)
  //   .map((pageName) => newHtmlPages[pageName])
  //   ?.flat();
  // const imageWorkspace = editorState?.imageWorkspaces?.common ?? {};
  // const flatElements = getFlatHtmlElements(allPagesElements);
  // flatElements.forEach((element) => {
  //   if (element.type === "img") {
  //     const image = imageWorkspace?.[element?.imageSrcId ?? ""];
  //     if (image) {
  //       const src = element.imageSrcId;
  //       const imageData = editorState?.imageWorkspaces?.common?.[src ?? ""];
  //       if (imageData) {
  //         if (!element?.attributes) {
  //           element.attributes = {};
  //         }
  //         (element.attributes as any).src = `/common/${imageData.fileName}`;
  //       }
  //     }
  //   }
  // });
  // return newHtmlPages;
  // const imageWorkspace = editorState?.imageWorkspaces?.common ?? {};
  // const flatElements = getFlatHtmlElements(allPagesElements);
  // const flatElements = editorState?.elements;
  // flatElements.map((element) => {
  //   const image = imageWorkspace?.[element?._imageSrcId ?? ""];
  //   const src = image ? `/common/${image.fileName}` : null;
  //   const injectSrc = src ? { src } : {};
  //   return {
  //     ...element,
  //     attributes: { ...((element as any).attributes ?? {}), ...injectSrc },
  //   };
  // });
  // return flatElements;
}

// export const replaceImageSources = (editorState: EditorStateType) => {
//   // const newHtmlPages = cloneDeep(editorState.htmlPages); // will be mutated
//   // const allPagesElements = Object.keys(newHtmlPages)
//   //   .map((pageName) => newHtmlPages[pageName])
//   //   ?.flat();
//   const imageWorkspace = editorState?.imageWorkspaces?.common ?? {};
//   // const flatElements = getFlatHtmlElements(allPagesElements);
//   const flatElements = editorState?.elements;

//   flatElements.map((element) => {
//     const image = imageWorkspace?.[element?._imageSrcId ?? ""];
//     const src = image
//       ? URL.createObjectURL(image.image as unknown as File)
//       : null;
//     const injectSrc = src ? { src } : {};
//     return {
//       ...element,
//       attributes: { ...((element as any).attributes ?? {}), ...injectSrc },
//     };
//     // if (element._type === "img") {
//     //   const image = imageWorkspace?.[element?._imageSrcId ?? ""];
//     //   if (image) {
//     //     const src = URL.createObjectURL(image.image as unknown as File);
//     //     if (!element?.attributes) {
//     //       element.attributes = {};
//     //     }
//     //     (element.attributes as any).src = src;
//     //   }
//     // }
//   });
//   return flatElements;
// };
