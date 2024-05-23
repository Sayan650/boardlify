"use client"

import React, {useCallback, useMemo, useState} from 'react';
import { nanoid } from 'nanoid';
import type { Side, XYWH } from "@/types/canvas";
import {
  Camera,
  CanvasMode,
  CanvasState,
  Color,
  LayerType,
  Point,
} from "@/types/canvas";
import { Info } from './info'
import { Participants } from './participants'
import { Toolbar } from './toolbar'
import { useHistory, useCanUndo, useCanRedo, useMutation, useStorage, useOthersMapped } from '@/liveblocks.config'
import { CursorPresence } from './coursorPresence'
import {
  colorToCss,
  connectionIdToColor,
  findIntersectingLayersWithRectangle,
  penPointsToPathLayer,
  pointerEventToCanvasPoint,
  resizeBounds,
} from "@/lib/utils";
import { LiveObject } from '@liveblocks/client';
import { LayerPreview } from './layerPreview';
import { SelectionBox } from './selectionBox';
import { SelectionTools } from './selectionTools';

const MAX_LAYERS = 100;

interface CanvasProps {
  boardId: string;
}

export const Canvas = ({
  boardId,
}: CanvasProps) => {

  const layerIds = useStorage((root) => root.layerIds)

  const [canvasState, setCanvasState] = useState<CanvasState>({
    mode: CanvasMode.None,
  });

  const [camera, setcamera] = useState<Camera>({x: 0, y: 0});
  const [lastUsedColor, setLastUsedColor] = useState<Color>({
    r: 0,
    g: 0,
    b: 0,
  });

  const onWheel = useCallback((e: React.WheelEvent) => {

    setcamera((camera) => ({
      x: camera.x- e.deltaX,
      y: camera.y- e.deltaY,
    }));
  }, [])

  const history = useHistory();
  const canUndo = useCanUndo();
  const canRedo = useCanRedo();

  const insertLayer = useMutation(
    (
      { storage, setMyPresence },
      layerType:
        | LayerType.Ellipse
        | LayerType.Rectangle
        | LayerType.Text
        | LayerType.Note,
      position: Point
    ) => {
      const liveLayers = storage.get("layers");
      if (liveLayers.size >= MAX_LAYERS) {
        return;
      }

      const liveLayerIds = storage.get("layerIds");

      const layerId = nanoid();

      const layer = new LiveObject({
        type: layerType,
        x: position.x,
        y: position.y,
        width: 100,
        height: 100,
        fill: lastUsedColor,
      });

      liveLayerIds.push(layerId);
      liveLayers.set(layerId, layer);

      setMyPresence({ selection: [layerId] }, { addToHistory: true });
      setCanvasState({
        mode: CanvasMode.None,
      });
    },
    [lastUsedColor]
  );

  const onResizeHandlePointerDown = useCallback((
    corner: Side,
    initialBounds: XYWH
  ) => {
    history.pause();
    setCanvasState({
      mode: CanvasMode.Resizing,
      initialBounds,
      corner,
    });
  }, [history])

  const translateSelectedLayer = useMutation(
    ({ storage, self }, point: Point) => {
      if (canvasState.mode !== CanvasMode.Translating) return;

      const offset = {
        x: point.x - canvasState.current.x,
        y: point.y - canvasState.current.y,
      };

      const liveLayers = storage.get("layers");

      for (const id of self.presence.selection) {
        const layer = liveLayers.get(id);
        if (layer) {
          layer.update({
            x: layer.get("x") + offset.x,
            y: layer.get("y") + offset.y,
          });
        }
      }

      setCanvasState({
        mode: CanvasMode.Translating,
        current: point,
      });
    },
    [canvasState]
  );

  const unselectLayer = useMutation(({ self, setMyPresence }) => {
    if (self.presence.selection.length > 0) {
      setMyPresence({ selection: [] }, { addToHistory: true });
    }
  }, []);

  const resizeSelectedLayer = useMutation(
    ({ self, storage }, point: Point) => {
      if (canvasState.mode !== CanvasMode.Resizing) {
        return;
      }

      const bounds = resizeBounds(
        canvasState.initialBounds,
        canvasState.corner,
        point
      );
      const liveLayers = storage.get("layers");
      const layer = liveLayers.get(self.presence.selection[0]);

      if (layer) {
        layer.update(bounds);
      }
    },
    [canvasState]
  );

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      const point = pointerEventToCanvasPoint(e, camera);

      if (canvasState.mode === CanvasMode.Inserting) {
        return null;
      }

      setCanvasState({ origin: point, mode: CanvasMode.Pressing})
    },[
      camera,
      canvasState.mode,
      setCanvasState,
    ])

  const onPointerUp = useMutation((
    {},
    e
  ) => {
    
    const point = pointerEventToCanvasPoint(e, camera);

    if(
      canvasState.mode === CanvasMode.Pressing ||
      canvasState.mode === CanvasMode.None
    ){
      unselectLayer();
      setCanvasState({
        mode: CanvasMode.None,
      })
    }else if (canvasState.mode === CanvasMode.Inserting) {
      insertLayer(canvasState.layerType, point)
    }else{
      setCanvasState({
        mode: CanvasMode.None,
      })
    }

    history.resume();

  }, [camera, canvasState, history, insertLayer])

  const onPoiterMove = useMutation(({setMyPresence}, e: React.PointerEvent) => {
    e.preventDefault();

    const current = pointerEventToCanvasPoint(e, camera);

    if(canvasState.mode === CanvasMode.Translating){
      translateSelectedLayer(current);
    }else if (canvasState.mode === CanvasMode.Resizing) {
      resizeSelectedLayer(current)
    }

    setMyPresence({cursor: current});
  },[
    camera,
    canvasState,
    resizeSelectedLayer,
    translateSelectedLayer,
    unselectLayer,
  ] );

  const onPointerLeave = useMutation(({setMyPresence}) => {
    setMyPresence({cursor: null})
  }, [] );

  const selections = useOthersMapped((other) => other.presence.selection);

  const onLayerPointerDown = useMutation(({setMyPresence, self}, e:React.PointerEvent, layerId: string,) => {
    if(
      canvasState.mode === CanvasMode.Pencil || canvasState.mode === CanvasMode.Inserting
    ){
      return;
    }

    history.pause();
    e.stopPropagation();

    const point = pointerEventToCanvasPoint(e, camera);

    if(!self.presence.selection.includes(layerId)){
      setMyPresence({selection: [layerId]}, {addToHistory: true});
    }

    setCanvasState({mode: CanvasMode.Translating, current: point});
  }, [
    setCanvasState, camera, history
  ]);

  const layerIdsToColorSelection = useMemo(() => {
    const layerIdsToColorSelection: Record<string, string> = {};

    for (const user of selections) {
      const [connectionId, selection] = user;

      for (const layerId of selection) {
        layerIdsToColorSelection[layerId] = connectionIdToColor(connectionId);
      }
    }

    return layerIdsToColorSelection;
  }, [selections])

  return (
    <div className='h-screen w-screen relative bg-neutral-200 touch-none'>
        
        <Info boardId={boardId}/>
        <Participants/>
        <Toolbar
        CanvasState={canvasState}
        setCanvasState={setCanvasState}
        canRedo={canRedo}
        canUndo={canUndo}
        undo={history.undo}
        redo={history.redo}
        />
        <SelectionTools camera={camera} setLastUsedColor={setLastUsedColor} />
        <svg className='h-[100vh] w-[100vw]' onWheel={onWheel} onPointerMove={onPoiterMove} onPointerLeave={onPointerLeave} onPointerUp={onPointerUp} onPointerDown={onPointerDown}>
          <g
            style={{
              transform: `translateX(${camera.x}px) translateY(${camera.y}px)`,
            }}
          >
            {layerIds.map(layerId =>(
              <LayerPreview
              key={layerId}
              id={layerId}
              onLayerPointerDown={onLayerPointerDown}
              selectionColor={layerIdsToColorSelection[layerId]}
              />
            ))}
            <SelectionBox
            onResizeHandlePointerDown={onResizeHandlePointerDown}
          />
            <CursorPresence/>
          </g>
        </svg>
    </div>
  )
}