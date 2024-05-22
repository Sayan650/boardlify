"use client"

import React from 'react'
import { Info } from './info'
import { Participants } from './participants'
import { Toolbar } from './toolbar'

interface CanvasProps {
  boardId: string;
}

export const Canvas = ({
  boardId,
}: CanvasProps) => {
  return (
    <div className='h-screen w-screen relative bg-slate-100 touch-none'>
        
        <Info/>
        <Participants/>
        <Toolbar/>
    </div>
  )
}

