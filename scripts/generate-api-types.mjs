import { writeFile } from "node:fs/promises";

import openapiTS, { astToString } from "openapi-typescript";
import ts from "typescript";

const SOURCE = new URL("../../dabubble-backend/openapi.yaml", import.meta.url);
const TARGET = new URL("../src/lib/api/schema.d.ts", import.meta.url);

const BLOB = ts.factory.createTypeReferenceNode("Blob");
const NULL = ts.factory.createLiteralTypeNode(ts.factory.createNull());

const ast = await openapiTS(SOURCE, { transform: typeFileUploadsAsBlobs });

function typeFileUploadsAsBlobs(schema) {
  if (schema.format !== "binary") return undefined;
  return schema.nullable ? ts.factory.createUnionTypeNode([BLOB, NULL]) : BLOB;
}

const header = [
  "// GENERATED from dabubble-backend/openapi.yaml by `pnpm api:generate`. Do not edit by hand.",
  "",
].join("\n");
await writeFile(TARGET, header + astToString(ast));
console.log(`API types written to ${TARGET.pathname}`);
