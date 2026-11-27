// Generates src/lib/api/schema.d.ts from the backend's API contract (openapi.yaml).
// Run with `pnpm api:generate` after the backend changed its API. Expects the backend repo
// next to this one (../dabubble-backend).
import { writeFile } from "node:fs/promises";

import openapiTS, { astToString } from "openapi-typescript";
import ts from "typescript";

const SOURCE = new URL("../../dabubble-backend/openapi.yaml", import.meta.url);
const TARGET = new URL("../src/lib/api/schema.d.ts", import.meta.url);

const BLOB = ts.factory.createTypeReferenceNode("Blob");
const NULL = ts.factory.createLiteralTypeNode(ts.factory.createNull());

const ast = await openapiTS(SOURCE, {
  // File uploads (`format: binary`) are files in the browser, not strings.
  transform(schema) {
    if (schema.format === "binary") {
      return schema.nullable ? ts.factory.createUnionTypeNode([BLOB, NULL]) : BLOB;
    }
  },
});

const header = [
  "// GENERATED from dabubble-backend/openapi.yaml by `pnpm api:generate`. Do not edit by hand.",
  "",
].join("\n");
await writeFile(TARGET, header + astToString(ast));
console.log(`API types written to ${TARGET.pathname}`);
