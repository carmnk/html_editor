import { HtmlEditorElementType } from "../EditorState";

export const baseHtmlDocument: HtmlEditorElementType[] = [
  // {
  //   id: "html_root",
  //   type: "html",
  //   attributes: {
  //     style: {
  //       height: "100%",
  //     },
  //   },
  //   children: [
  //     {
  //       id: "head_root",
  //       type: "head",
  //       // children: [
  //       // ]
  //       attributes: {
  //         // style: {
  //         //   backgroundColor: "red",
  //         // },
  //       }
  //     },
  {
    id: "app_root",
    type: "div",
    _disableDelete: true,
    children: [],
    attributes: {
      style: {
        height: "100%",
      },
    },
  },
  //   ],
  // },
];
