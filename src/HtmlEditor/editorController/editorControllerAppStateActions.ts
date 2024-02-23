import { Dispatch, SetStateAction, useState } from 'react'
import { EditorStateType } from './editorState'
import {
  EditorControllerAppStateReturnType,
  EditorControllerAppStateType,
} from './editorControllerTypes'

export type EditorControllerAppStateParams = {
  editorState: EditorStateType
  setEditorState: Dispatch<SetStateAction<EditorStateType>>
  // initialAppState?: EditorControllerAppStateType
}

export const useEditorControllerAppStateActions = (
  params: EditorControllerAppStateParams
): EditorControllerAppStateReturnType => {
  const { editorState, setEditorState } = params
  const [appState, setAppState] = useState<EditorControllerAppStateType>({})
  const [stateValues, setStateValues] = useState<any>({})

  const removeProperty = (key: string) => {
    setAppState((current) => {
      const { [key]: _, ...rest } = current
      return rest
    })
  }

  const updateProperty = (key: string, value: any) => {
    setAppState((current) => ({ ...current, [key]: value }))
  }

  return {
    state: appState,
    // values: stateValues,
    actions: {
      addProperty: updateProperty,
      removeProperty,
      updateProperty,
    },
    // setStateValues,
  }
}
