import { Dispatch, SetStateAction, useState } from "react";
import { EditorStateType } from "../EditorState";
import {
  EditorControllerAppStateReturnType,
  EditorControllerAppStateType,
} from "./editorControllerTypes";

export type EditorControllerAppStateParams = {
  editorState: EditorStateType;
  setEditorState: Dispatch<SetStateAction<EditorStateType>>;
};

export const useEditorControllerAppState = (
  params: EditorControllerAppStateParams
): EditorControllerAppStateReturnType => {
  const { editorState, setEditorState } = params;
  const [appState, setAppState] = useState<EditorControllerAppStateType>({});
  const [stateValues, setStateValues] = useState<any>({});

  const removeProperty = (key: string) => {
    setAppState((current) => {
      const { [key]: _, ...rest } = current;
      return rest;
    });
  };

  const updateProperty = (key: string, value: any) => {
    setAppState((current) => ({ ...current, [key]: value }));
  };

  return {
    state: appState,
    // values: stateValues,
    actions: {
      addProperty: updateProperty,
      removeProperty,
      updateProperty,
    },
    // setStateValues,
  };
};
