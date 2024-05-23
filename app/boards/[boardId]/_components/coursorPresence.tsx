"use client";

import { connectionIdToColor } from "@/lib/utils";
import { useOthersConnectionIds, useOthersMapped } from "@/liveblocks.config";
import { shallow } from "@liveblocks/client";
import { memo } from "react";
import { Cursor } from "./coursor";


const Cursors = () => {
    // const otherUsers = useOthersMapped();
    const otherUsersConnectionIds = useOthersConnectionIds();
    return (
      <>
        {otherUsersConnectionIds.map((connectionId) => (
            <Cursor
            key={connectionId}
            connectionId={connectionId}
            />
          
        ))}
      </>
    );
  };

export const CursorPresence = memo(() => {
    return (
      <>
        {/* <Draft /> */}
        <Cursors />
        {/* <p>Cursor</p> */}
      </>
    );
  });
  
  CursorPresence.displayName = "CursorPresence";