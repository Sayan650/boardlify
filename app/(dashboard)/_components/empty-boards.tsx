"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import Image from "next/image";
import { toast } from "sonner";
import { useOrganization } from "@clerk/nextjs";
import { useApiMutation } from "@/hooks/use-api-mutations";

export function EmptyBoards() {
  const {organization} = useOrganization();
  const {mutate, pending} = useApiMutation(api.board.create);

  const onCLick = () => {
    if (!organization){
      return;
    }

    mutate({ orgId: organization.id, title: "Untitled" }).then((id) => {
      toast.success("Board created successfully")
    })
    .catch(() => toast.error("Board creation failed"))
  }

  return (
    <div className="h-full flex flex-col items-center justify-center">
      <Image src="/note.svg" alt="Empty" height={140} width={140} />
      <h2 className="text-2xl font-semibold mt-6">Create your first board!</h2>
      <p className="text-muted-foreground text-sm mt-2">
        Start by creating a board for your organization
      </p>
      <div className="mt-6">
        <Button disabled={pending} onClick={onCLick} size="lg">
          Create a new board
        </Button>
      </div>
    </div>
  );
}