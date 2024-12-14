/**Outward-facing endpoint for creating a URL */

import { api } from "@/trpc/server";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({ href: z.string(), apiKey: z.string() });

export async function POST(request: NextRequest) {
  try {
    const params = schema.parse(await request.json());
    const path = await api.link.create(params);
    if (path) return new NextResponse(path, { status: 200 });
    return new NextResponse("Invalid auth!", { status: 401 });
  } catch (e: any) {
    return new NextResponse(e.toString(), { status: 400 });
  }
}
