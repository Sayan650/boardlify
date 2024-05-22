import {Liveblocks} from "@liveblocks/node"
import { auth, currentUser } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api"
import { ConvexHttpClient } from "convex/browser"

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

const liveblocks = new Liveblocks({
    secret: "sk_dev_lpdtzxYCYWnIGEfDU-v98rG1l7WKEo_apKWG2e7Rmdfj54FY2e6qv8xZnH_QEtfw",
})

export async function POST(req: Request){
    const authorization = await auth()
    const user = await currentUser()

    if (!authorization || !user) {
        return new Response("Unauthorized", { status: 403})
    }

    const {room} = await req.json();
}

