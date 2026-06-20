import { NextRequest, NextResponse } from "next/server";
import { authenticateUser } from "@/lib/auth-server";

export async function POST(req: NextRequest) {
  const contentType = req.headers.get("content-type") || "";

  let email: string, password: string;

  if (contentType.includes("application/json")) {
    const body = await req.json().catch(() => ({}));
    email = body.email || "";
    password = body.password || "";
  } else {
    const form = await req.formData().catch(() => new FormData());
    email = (form.get("email") as string) || "";
    password = (form.get("password") as string) || "";
  }

  try {
    const result = await authenticateUser(email, password, "");

    if (!result) {
      if (!contentType.includes("json")) {
        return new NextResponse(null, {
          status: 302,
          headers: { location: "/login?error=Invalid email or password" },
        });
      }
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const cookie = `token=${result.token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=3600`;

    if (!contentType.includes("json")) {
      return new NextResponse(null, {
        status: 302,
        headers: { location: "/overview", "set-cookie": cookie },
      });
    }

    const response = NextResponse.json(result, { status: 200 });
    response.headers.set("set-cookie", cookie);
    return response;
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Login failed" }, { status: 401 });
  }
}
