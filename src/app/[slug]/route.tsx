/**
 * Catch-all route for hyperlinks
 */

import { api } from "@/trpc/server";
import { redirect, RedirectType } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const slug = (await params).slug; // 'a', 'b', or 'c'
  const link = await api.link.get({ id: slug });

  if (link) redirect(link.href, RedirectType.replace);
  else redirect("/", RedirectType.replace);
}
