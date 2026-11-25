import { connection } from "next/server";

/** Liveness probe for Docker HEALTHCHECK and load balancers. Rendered per request, never cached. */
export async function GET() {
  await connection();
  return Response.json({ status: "ok" }, { headers: { "Cache-Control": "no-store" } });
}
