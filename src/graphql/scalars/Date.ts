import { asNexusMethod } from "nexus";
import { GraphQLDateTime } from "graphql-scalars";

export const GQLDate = asNexusMethod(GraphQLDateTime, "dateTime");  // expose custom scalar as Nexus type