import { Drawer } from "@mui/material";
import { useMemo } from "react";
import { EditorControllerType } from "../../editorController";
import { HtmlElementMenu } from "./htmlElement/HtmlElementMenu";
import { CssClassMenu } from "./cssClass/CssClassMenu";
import { ImageMenu } from "./image/ImagesMenu";
import { FallbackTab } from "./FallbackTab";

export type RightMenuProps = {
  editorController: EditorControllerType;
};

export const RightMenu = (props: RightMenuProps) => {
  const { editorController } = props;
  const { editorState, selectedHtmlElement } = editorController;

  const selectedValidClass = useMemo(() => {
    return (
      editorState?.selectedCssClass &&
      (editorState?.selectedCssClass ?? "") in
        (editorState?.cssWorkspaces?.common ?? {})
    );
  }, [editorState?.selectedCssClass, editorState?.cssWorkspaces]);

  const selectedValidImage = useMemo(() => {
    return (
      editorState?.selectedImage &&
      (editorState?.selectedImage ?? "") in
        (editorState?.imageWorkspaces?.common ?? {})
    );
  }, [editorState?.selectedImage, editorState?.imageWorkspaces]);


  const activeNavigationTab = editorState.ui.navigationMenu.activeTab;

  return (
    <Drawer
      variant="permanent"
      anchor="right"
      disablePortal={true}
      open={true}
      PaperProps={{ sx: { position: "static", pr: 2, minWidth: 280 } }}
    >
      {["project", "page"].includes(activeNavigationTab) ? (
        !selectedHtmlElement ? (
          <FallbackTab />
        ) : (
          <HtmlElementMenu editorController={editorController} />
        )
      ) : ["css"].includes(activeNavigationTab) ? (
        !editorState?.selectedCssClass || !selectedValidClass ? (
          <FallbackTab />
        ) : (
          <CssClassMenu editorController={editorController} />
        )
      ) : ["assets"].includes(activeNavigationTab) ? (
        !editorState?.selectedImage || !selectedValidImage ? (
          <FallbackTab />
        ) : (
          <ImageMenu editorController={editorController} />
        )
      ) : null}
    </Drawer>
  );
};