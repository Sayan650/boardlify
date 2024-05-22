import { Skeleton } from "@/components/ui/skeleton"

export const Participants = () => {
    return(
        <div className="absolute h-12 top-2 right-2 bg-white rounded-md p-3 flex items-center shadow-md">
            lists of users
        </div>
    )
}

Participants.Skeleton = function ParticipantsSkeleton(){
    return(
        <div className="absolute top-2 w-[300px] left-2 bg-white rounded-md px-1.5 h-12 flex items-center shadow-md">
            {/* <Skeleton className="h-screen w-full bg-muted-400"/> */}
        </div>
    )
}