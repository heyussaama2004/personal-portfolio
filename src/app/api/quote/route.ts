import { NextResponse, type NextRequest } from "next/server";
import { createContactProvider, createRateLimit, isHumanSubmission, quoteSchema } from "@/lib/contact";

const provider = createContactProvider();
const limiter = createRateLimit(5, 60_000);

function clientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || request.headers.get("x-real-ip") || "unknown";
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ code: "invalid" }, { status: 400 });
  }

  const parsed = quoteSchema.safeParse(body);
  if (!parsed.success) {
    const fields = parsed.error.issues.reduce<Record<string, string>>((acc, issue) => {
      const field = issue.path[0];
      if (typeof field === "string" && !acc[field]) acc[field] = issue.code;
      return acc;
    }, {});
    return NextResponse.json({ code: "invalid", fields }, { status: 400 });
  }

  const now = Date.now();
  if (!isHumanSubmission(parsed.data, now)) {
    return NextResponse.json({ code: "invalid" }, { status: 400 });
  }
  if (!limiter.check(clientIp(request), now)) {
    return NextResponse.json({ code: "rate_limited" }, { status: 429 });
  }

  const result = await provider.send(parsed.data);
  if (!result.ok) {
    const status = result.code === "disabled" ? 503 : 502;
    return NextResponse.json({ code: result.code }, { status });
  }

  return NextResponse.json({ code: "ok" });
}
