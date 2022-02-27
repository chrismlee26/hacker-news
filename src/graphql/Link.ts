import { extendType, objectType } from "nexus";
import { NexusGenObjects } from "../../nexus-typegen";  

export const Link = objectType({
    name: "Link", // Define the name of the type
    definition(t) {  // Add fields to type
        t.nonNull.int("id"); // Add an 'id' field, type Int
        t.nonNull.string("description"); // Add a 'descriptions field', type String
        t.nonNull.string("url"); // Add a 'url field', type String
    },
});