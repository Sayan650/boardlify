"use client"

import React, {useCallback, useState} from 'react';
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
import { useHistory, useCanUndo, useCanRedo, useMutation, useStorage } from '@/liveblocks.config'
import { CursorPresence } from './coursorPresence'
import { pointerEventToCanvasPoint } from '@/lib/utils'
import { LiveObject } from '@liveblocks/client';
import { LayerPreview } from './layerPreview';

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

  const onPointerUp = useMutation((
    {},
    e
  ) => {
    
    const point = pointerEventToCanvasPoint(e, camera);

    if (canvasState.mode === CanvasMode.Inserting) {
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

    setMyPresence({cursor: current});
  },[] );

  const onPointerLeave = useMutation(({setMyPresence}) => {
    setMyPresence({cursor: null})
  }, [] );

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
        <svg className='h-[100vh] w-[100vw]' onWheel={onWheel} onPointerMove={onPoiterMove} onPointerLeave={onPointerLeave} onPointerUp={onPointerUp}>
          <g
            style={{
              transform: `translateX(${camera.x}px) translateY(${camera.y}px)`,
            }}
          >
            {layerIds.map(layerId =>(
              <LayerPreview
              key={layerId}
              id={layerId}
              onLayerPointerDown={() =>{}}
              selectionColor="#000000"
              />
            ))}
            <CursorPresence/>
          </g>
        </svg>
    </div>
  )
}