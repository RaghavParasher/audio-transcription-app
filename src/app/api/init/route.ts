import { auth } from "@/lib/auth";
import { db } from "@/db";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  const adminEmail = "admin@example.com";
  const adminUsername = "admin";
  const adminPassword = "AdminTranscribe2026!";

  try {
    const existingAdmin = await db.query.user.findFirst({
      where: eq(user.email, adminEmail),
    });

    if (existingAdmin) {
      return NextResponse.json({ message: "Admin already exists" });
    }

    await auth.api.signUpEmail({
      body: {
        email: adminEmail,
        password: adminPassword,
        name: "System Admin",
        username: adminUsername,
      },
    });

    return NextResponse.json({ message: "Admin created successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
