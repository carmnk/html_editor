import { CSSProperties, useCallback, Dispatch, SetStateAction } from "react";
import { EditorStateType } from "../EditorState";
import { EditorControllerCssSelectorActionsType } from "./editorControllerTypes";

export type EditorControllerHtmlElementActionsParams = {
  editorState: EditorStateType;
  setEditorState: Dispatch<SetStateAction<EditorStateType>>;
};

export const useEditorControllerCssSelectorActions = (
  params: EditorControllerHtmlElementActionsParams
): EditorControllerCssSelectorActionsType => {
  const { editorState, setEditorState } = params;

  const getSelectedCssClass = useCallback(
    (className?: string) => {
      const selectedClass = className ?? editorState?.selectedCssClass ?? "";
      const commonWorkspace = editorState?.cssWorkspaces?.common;
      const selectedClassStyle = commonWorkspace?.[selectedClass] ?? {};
      return selectedClassStyle;
    },
    [editorState?.cssWorkspaces, editorState?.selectedCssClass]
  );

  const handleChangeClassName = useCallback(
    (newClassname: string) => {
      const newClassName = newClassname;
      if (!newClassName) return;
      const selectedClass = editorState.selectedCssClass;
      if (!selectedClass) return;
      if (!/^-?[_a-zA-Z]+[_a-zA-Z0-9-]*$/.test(selectedClass)) {
        return;
      }
      const workspace = editorState?.cssWorkspaces?.common;
      const { [selectedClass]: classToRename, ...workspaceExClass } = workspace;
      const newWorkspace = {
        ...workspaceExClass,
        [newClassName]: classToRename,
      };

      setEditorState((current) => ({
        ...current,
        selectedCssClass: newClassName,
        cssWorkspaces: {
          ...(current?.cssWorkspaces ?? {}),
          common: newWorkspace,
        },
      }));
    },
    [editorState.selectedCssClass, editorState.cssWorkspaces, setEditorState]
  );

  const handleChangeAddClassRuleName = useCallback((newValue: string) => {
    setEditorState((current) => ({
      ...current,
      ui: {
        ...current.ui,
        detailsMenu: {
          ...current.ui.detailsMenu,
          addRuleName: newValue,
        },
      },
    }));
  }, []);

  const handleChangeAddClassRuleValue = useCallback((newValue: string) => {
    setEditorState((current) => ({
      ...current,
      ui: {
        ...current.ui,
        detailsMenu: {
          ...current.ui.detailsMenu,
          addRuleValue: newValue,
        },
      },
    }));
  }, []);

  const handleRemoveRule = useCallback(
    (ruleName: string) => {
      if (!editorState?.selectedCssClass) return;

      setEditorState((current) => {
        const currentClass =
          current?.cssWorkspaces?.common?.[current?.selectedCssClass ?? ""];
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [ruleName as keyof CSSProperties]: _, ...restClassRules } =
          currentClass;

        return {
          ...current,
          cssWorkspaces: {
            ...current?.cssWorkspaces,
            common: {
              ...current?.cssWorkspaces?.common,
              [current?.selectedCssClass ?? ""]: restClassRules,
            },
          },
        };
      });
    },
    [editorState?.selectedCssClass, setEditorState]
  );

  const handleAddNewRule = useCallback(() => {
    if (!editorState?.selectedCssClass) return;
    if (
      !editorState.ui.detailsMenu.addRuleName ||
      !editorState.ui.detailsMenu.addRuleValue
    )
      return;

    setEditorState((current) => ({
      ...current,
      cssWorkspaces: {
        ...current?.cssWorkspaces,
        common: {
          ...current?.cssWorkspaces?.common,
          [current?.selectedCssClass ?? ""]: {
            ...current?.cssWorkspaces?.common?.[
              current?.selectedCssClass ?? ""
            ],
            [editorState.ui.detailsMenu.addRuleName ?? ""]:
              editorState.ui.detailsMenu.addRuleValue ?? "",
          },
        },
      },
      ui: {
        ...current.ui,
        detailsMenu: {
          ...current.ui.detailsMenu,
          addRuleName: "",
          addRuleValue: "",
        },
      },
    }));
  }, [
    editorState?.selectedCssClass,
    editorState.ui.detailsMenu.addRuleName,
    editorState.ui.detailsMenu.addRuleValue,
    setEditorState,
  ]);

  const handleToggleEditRule = useCallback(
    (ruleName: keyof CSSProperties) => {
      const cssClass = getSelectedCssClass(editorState?.selectedCssClass ?? "");
      const existingRuleValue = cssClass?.[ruleName];
      setEditorState((current) => ({
        ...current,
        ui: {
          ...current.ui,
          detailsMenu: {
            ...current.ui.detailsMenu,
            ruleName: ruleName,
            ruleValue: (existingRuleValue as string) ?? "",
          },
        },
      }));
    },
    [editorState?.selectedCssClass, setEditorState, getSelectedCssClass]
  );

  const handleChangeEditRuleValue = useCallback(
    (newValue: string) => {
      if (!editorState?.selectedCssClass) return;
      const currentEditRuleName = editorState?.ui?.detailsMenu?.ruleName;
      if (!currentEditRuleName || !newValue) return;

      setEditorState((current) => ({
        ...current,
        cssWorkspaces: {
          ...current?.cssWorkspaces,
          common: {
            ...current?.cssWorkspaces?.common,
            [current?.selectedCssClass ?? ""]: {
              ...current?.cssWorkspaces?.common?.[
                current?.selectedCssClass ?? ""
              ],
              [currentEditRuleName ?? ""]: newValue ?? "",
            },
          },
        },
      }));
    },
    [
      editorState?.ui?.detailsMenu?.ruleName,
      setEditorState,
      editorState?.selectedCssClass,
    ]
  );

  const handleAddCssSelector = useCallback(
    (newVal: string | number) => {
      const wspace = newVal;
      setEditorState((current) => ({
        ...current,
        cssWorkspaces: {
          ...current.cssWorkspaces,
          [wspace]: {
            ...(current.cssWorkspaces[wspace] ?? {}),
            newClass: {},
          },
        },
      }));
    },
    [setEditorState]
  );

  const handleDeleteCssSelector = useCallback(
    (name: string) => {
      setEditorState((current) => {
        const cssCommonWorkspace = current.cssWorkspaces?.common;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [name]: _nOut, ...cssCommonWorkspaceExDeleteItem } =
          cssCommonWorkspace;
        return {
          ...current,
          cssWorkspaces: {
            ...current?.cssWorkspaces,
            common: cssCommonWorkspaceExDeleteItem,
          },
        };
      });
    },
    [setEditorState]
  );

  return {
    removeRule: handleRemoveRule,
    addNewRule: handleAddNewRule,
    toggleEditRule: handleToggleEditRule,
    handleChangeEditRuleValue,
    handleChangeClassName,
    handleChangeAddClassRuleName,
    handleChangeAddClassRuleValue,
    handleDeleteCssSelector,
    handleAddCssSelector,
  };
};
