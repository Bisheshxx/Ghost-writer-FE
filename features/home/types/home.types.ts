import z from "zod";
import { SchemaJobDescription } from "../schema/job-description.schema";

export type SchemaJobDescriptionType = z.infer<typeof SchemaJobDescription>;
