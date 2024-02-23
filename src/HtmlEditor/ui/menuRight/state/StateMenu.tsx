import { EditorControllerType } from "../../../editorController/editorControllerTypes";
import { ElementType } from "../../../editorController/editorState";
import { ComponentMenu } from "../component/ComponentMenu";
import { HtmlElementMenu } from "../htmlElement";

export type HtmlElementMenuProps = {
  editorController: EditorControllerType;
};

export const StateMenu = (props: HtmlElementMenuProps) => {
  const { editorController } = props;
  const { editorState, actions } = editorController;

  const selectedComponent = editorState.elements.find(
    (el) => el._id === editorState.ui.selected.state
  ) as unknown as ElementType<"Button">;

  return (
    editorState.ui.selected.state &&
    selectedComponent && (
      <ComponentMenu
        editorController={editorController}
        selectedComponent={selectedComponent}
      />
    )
  );
};
