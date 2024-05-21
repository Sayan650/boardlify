import {v} from "convex/values"
import {defineSchema, defineTable} from "convex/server"
import { title } from "process"

export default defineSchema({
    boards: defineTable({
        title: v.string(),
        orgId: v.string(),
        ownerId: v.string(),
        ownerName: v.string(),
        imageUrl: v.string(),
    })
    .index("by_org", ["orgId"])
    .searchIndex("search_title", {
        searchField: "title",
        filterFields: ["orgId"]
    }),
})