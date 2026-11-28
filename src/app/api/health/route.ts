import { connection } from "next/server";

const NEVER_CACHE = { "Cache-Control": "no-store" };

export async function GET() {
  await connection();
  return Response.json({ status: "ok" }, { headers: NEVER_CACHE });
}
