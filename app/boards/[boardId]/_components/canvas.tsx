"use client"

import React, {useCallback, useState} from 'react'
import { Camera, CanvasMode, CanvasState } from '@/types/canvas'
import { Info } from './info'
import { Participants } from './participants'
import { Toolbar } from './toolbar'
import { useHistory, useCanUndo, useCanRedo, useMutation } from '@/liveblocks.config'
import { CursorPresence } from './coursorPresence'
import { pointerEventToCanvasPoint } from '@/lib/utils'

interface CanvasProps {
  boardId: string;
}

export const Canvas = ({
  boardId,
}: CanvasProps) => {
  const [canvasState, setCanvasState] = useState<CanvasState>({
    mode: CanvasMode.None,
  });

  const [camera, setcamera] = useState<Camera>({x: 0, y: 0});

  const onWheel = useCallback((e: React.WheelEvent) => {

    setcamera((camera) => ({
      x: camera.x- e.deltaX,
      y: camera.y- e.deltaY,
    }));
  }, [])

  const history = useHistory();
  const canUndo = useCanUndo();
  const canRedo = useCanRedo();

  const onPoiterMove = useMutation(({setMyPresence}, e: React.PointerEvent) => {
    e.preventDefault();

    const current = pointerEventToCanvasPoint(e, camera);

    setMyPresence({cursor: current});
  },[] );

  const onPointerDown = useMutation(({setMyPresence}) => {
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
        <svg className='h-[100vh] w-[100vw]' onWheel={onWheel} onPointerMove={onPoiterMove} onPointerLeave={onPointerDown}>
          <g>
            <CursorPresence/>
          </g>
        </svg>
    </div>
  )
}

