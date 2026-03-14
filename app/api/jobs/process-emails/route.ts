import { NextRequest, NextResponse } from "next/server";
import { processEmailQueue } from "@/lib/email/queue";

/**
 * GET /api/jobs/process-emails
 *
 * Dequeues and sends pending emails. Intended to be called by a cron scheduler
 * (Vercel Cron, GitHub Actions, etc.) every minute.
 *
 * Protected by CRON_SECRET — the caller must send:
 *   Authorization: Bearer <CRON_SECRET>
 */
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = req.headers.get("authorization") ?? "";
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  try {
    const result = await processEmailQueue();
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    console.error("[process-emails] error:", err);
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
}
