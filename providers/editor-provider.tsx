"use client";
import { EditorActions, EditorNode } from "@/lib/types";
import {
  Dispatch,
  createContext,
  useContext,
  useReducer,
  useEffect,
} from "react";

export type Editor = {
  elements: EditorNode[];
  edges: {
    id: string;
    source: string;
    target: string;
  }[];
  selectedNode: EditorNode;
};

export type HistoryState = {
  history: Editor[];
  currentIndex: number;
};

export type EditorState = {
  editor: Editor;
  history: HistoryState;
};

const initialEditorState: EditorState["editor"] = {
  elements: [],
  edges: [],
  selectedNode: {
    id: "",
    position: {
      x: 0,
      y: 0,
    },
    type: "Trigger",
    data: {
      title: "",
      completed: false,
      current: false,
      metadata: {},
      description: "",
      type: "Trigger",
    },
  },
};

const inititalHistoryState: HistoryState = {
  history: [initialEditorState],
  currentIndex: 0,
};

const initialState: EditorState = {
  history: inititalHistoryState,
  editor: initialEditorState,
};

const editorReducer = (
  state: EditorState = initialState,
  action: EditorActions
): EditorState => {
  switch (action.type) {
    case "REDO":
      if (state.history.currentIndex < state.history.history.length - 1) {
        const nextIndex = state.history.currentIndex + 1;
        const nextEditorState = { ...state.history.history[nextIndex] };
        const redoState = {
          ...state,
          editor: nextEditorState,
          history: {
            ...state.history,
            currentIndex: nextIndex,
          },
        };

        return redoState;
      }
      return state;

    case "UNDO":
      if (state.history.currentIndex > 0) {
        const nextIndex = state.history.currentIndex - 1;
        const nextEditorState = { ...state.history.history[nextIndex] };
        const undoState = {
          ...state,
          editor: nextEditorState,
          history: {
            ...state.history,
            currentIndex: nextIndex,
          },
        };

        return undoState;
      }
      return state;

    case "LOAD_DATA":
      return {
        ...state,
        editor: {
          ...state.editor,
          elements: action.payload.elements || initialEditorState.elements,
          edges: action.payload.edges,
        },
      };

    case "SELECTED_ELEMENT":
      return {
        ...state,
        editor: {
          ...state.editor,
          selectedNode:
            action.payload.element || initialEditorState.selectedNode,
        },
      };

    default:
      return state;
  }
};

export type EditorContextdata = {
  previewMode: boolean;
  setPreviewMode: (value: boolean) => void;
};

export const EditorContext = createContext<{
  state: EditorState;
  dispatch: Dispatch<EditorActions>;
}>({
  state: initialState,
  dispatch: () => undefined,
});

type EditorWithChildren = {
  children: React.ReactNode;
};

const EditorProvider = ({ children }: EditorWithChildren) => {
  const [state, dispatch] = useReducer(editorReducer, initialState);

  return (
    <EditorContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
};

export const useEditor = () => {
  const context = useContext(EditorContext);

  if (!context) {
    throw new Error("useEditor must be used within an EditorProvider");
  }

  return context;
};

export default EditorProvider;
