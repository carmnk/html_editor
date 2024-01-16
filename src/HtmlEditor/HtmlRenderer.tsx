import { Box } from "@mui/material";
import React from "react";
import { EditorStateType } from "./EditorState.tsx";
import { renderHtmlElements } from "./renderElements.tsx";
import siteProps from "../site_props.json";
import { Route, Routes } from "react-router-dom";

export const HtmlRenderer = () => {
  const handleSelectElement = React.useCallback(() => {}, []);

  const initialState = React.useMemo(() => {
    return {
      // ...defaultEditorState(),
      ...siteProps,
    };
  }, []);

  const [editorState] = React.useState(
    initialState as unknown as EditorStateType
  );

  const renderPage = React.useCallback(
    (page: string) => {
      return renderHtmlElements(
        editorState.htmlPages[page],
        editorState,
        handleSelectElement,
        true
      );
    },
    [editorState, handleSelectElement]
  );

  const remainingPages = React.useMemo(() => {
    return Object.keys(editorState.htmlPages).filter(
      (page) => page !== "index"
    );
  }, [editorState]);

  return (
    <Routes>
      <Route path="/" element={<Box>{renderPage("index")}</Box>} />
      {remainingPages?.map((pageName) => (
        <Route
          key={pageName}
          path={`/${pageName}`}
          element={renderPage(pageName)}
        />
      ))}
    </Routes>
  );
};
