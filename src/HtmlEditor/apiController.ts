import axios from "axios";
import { useCallback, useState } from "react";
import {
  getLinkFromDownloadResponse,
  openDownloadWithLink,
} from "../utils/api";
import { EditorStateType } from "./EditorState";
import { makeImageSourcesForExport } from "./utils";

export const useServerController = (editorState: EditorStateType) => {
  const [data, setData] = useState({
    loading: false,
    link: "",
    blob: null as Blob | null,
  });

  const handleRequestWebsiteZipBundle = useCallback(async () => {
    setData((current) => ({ ...current, loading: true }));

    try {
      const baseUrl = import.meta.env.VITE_WEBSITE_BUILDER_SERVER;
      const url = baseUrl + "/fe_gen/zip_export";
      /* eslint-disable @typescript-eslint/no-unused-vars */
      const {
        selectedCssClass,
        selectedHtmlElementName,
        selectedImage,
        selectedPage,
        expandedTreeItems,
        imageWorkspaces,
        htmlPages: htmlPagesIn,
        cssWorkspaces,
        ui,
        ...dataRaw
      } = editorState;
      /* eslint-enable @typescript-eslint/no-unused-vars */
      const htmlPages = makeImageSourcesForExport(editorState);
      const formData = new FormData();
      formData.append("cssWorkspaces", JSON.stringify(cssWorkspaces));
      formData.append("htmlPages", JSON.stringify(htmlPages));
      for (let f = 0; f < Object.keys(imageWorkspaces.common).length; f++) {
        const key = Object.keys(imageWorkspaces.common)[f];
        const image = imageWorkspaces.common[key];
        formData.append("image", image.image as unknown as File);
      }

      const res = await axios.post(url, formData, {
        responseType: "blob",
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const link = getLinkFromDownloadResponse(res);
      openDownloadWithLink(link);
    } catch (e) {
      console.error("error", e);
      alert("an error occurred while downloading the file");
    }
    setData((current) => ({ ...current, loading: false }));
  }, [editorState]);
  return { data, handleRequestWebsiteZipBundle };
};
