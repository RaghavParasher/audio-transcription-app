import { auth } from "@/lib/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  const adminEmail = "admin@example.com";
  const adminUsername = "admin";
  const adminPassword = "AdminTranscribe2026!";

  try {
    const existingAdmin = await db.query.users.findFirst({
      where: eq(users.email, adminEmail),
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
    console.error("Initialization error details:", error);
    return NextResponse.json({ 
      error: error.message,
      detail: error.detail || error.hint || "Check server logs for full details" 
    }, { status: 500 });
  }
}
