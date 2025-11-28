import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { plan: true },
  });

  return NextResponse.json({
    userId: session.user.id,
    email: session.user.email,
    name: session.user.name,
    image: session.user.image,
    plan: user?.plan || 'FREE',
  });
}
