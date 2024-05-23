import { Skeleton } from "@/components/ui/skeleton";
import {
  Circle,
  MousePointer2,
  Pencil,
  Pen,
  Redo2,
  Square,
  StickyNote,
  Type,
  Undo2,
} from "lucide-react";
import { ToolButton } from "./toolButton";
import { CanvasMode, CanvasState, LayerType } from "@/types/canvas";

interface ToolbarProps {
  CanvasState: CanvasState;
  setCanvasState: (newState: CanvasState) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export const Toolbar = ({
  CanvasState,
  setCanvasState,
  undo,
  redo,
  canUndo,
  canRedo,
}: ToolbarProps) => {
  return (
    <div className="absolute bottom-6 -translate-x-[50%] left-[50%] flex flex-row gap-x-4 justify-center">
      <div className="bg-white rounded-md p-1.5 flex gap-x-1 flex-row items-center shadow-md">
      <ToolButton
          label="Select"
          icon={MousePointer2}
          onClick={() => setCanvasState({ mode: CanvasMode.None })}
          active={
            CanvasState.mode === CanvasMode.None ||
            CanvasState.mode === CanvasMode.Translating ||
            CanvasState.mode === CanvasMode.SelectionNet ||
            CanvasState.mode === CanvasMode.Pressing ||
            CanvasState.mode === CanvasMode.Resizing
          }
        />
        <ToolButton
          label="Circle"
          icon={Circle}
          onClick={() =>
            setCanvasState({
              mode: CanvasMode.Inserting,
              layerType: LayerType.Ellipse,
            })
          }
          active={
            CanvasState.mode === CanvasMode.Inserting &&
            CanvasState.layerType === LayerType.Ellipse
          }
        />
        <ToolButton
          label="Pencil"
          icon={Pencil}
          onClick={() =>
            setCanvasState({
              mode: CanvasMode.Pencil,
            })
          }
          active={CanvasState.mode === CanvasMode.Pencil}
        />
        <ToolButton
          label="Pen"
          icon={Pen}
          onClick={() =>
            setCanvasState({
              mode: CanvasMode.Pen,
            })
          }
          active={CanvasState.mode === CanvasMode.Pen}
        />
        <ToolButton
          label="Rectangle"
          icon={Square}
          onClick={() =>
            setCanvasState({
              mode: CanvasMode.Inserting,
              layerType: LayerType.Rectangle,
            })
          }
          active={
            CanvasState.mode === CanvasMode.Inserting &&
            CanvasState.layerType === LayerType.Rectangle
          }
        />
        <ToolButton
          label="Notes"
          icon={StickyNote}
          onClick={() =>
            setCanvasState({
              mode: CanvasMode.Inserting,
              layerType: LayerType.Note,
            })
          }
          active={
            CanvasState.mode === CanvasMode.Inserting &&
            CanvasState.layerType === LayerType.Note
          }
        />
        <ToolButton
          label="Text"
          icon={Type}
          onClick={() =>
            setCanvasState({
              mode: CanvasMode.Inserting,
              layerType: LayerType.Text,
            })
          }
          active={
            CanvasState.mode === CanvasMode.Inserting &&
            CanvasState.layerType === LayerType.Text
          }
        />
      </div>
      <div className="bg-white rounded-md p-1.5 flex flex-row items-center shadow-md">
        <ToolButton
          label="Undo"
          icon={Undo2}
          onClick={undo}
          disabled={!canUndo}
        />
        <ToolButton
          label="Redo"
          icon={Redo2}
          onClick={redo}
          disabled={!canRedo}
        />
      </div>
    </div>
  );
};

export const ToolbarSkeleton = () => {
  return (
    <div className="absolute bottom-6 -translate-x-[50%] left-[50%] flex flex-row gap-x-4 justify-center bg-white h-[60px] w-[360px] shadow-md rounded-md" />
  );
}
