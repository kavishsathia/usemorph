// This route is for OAuth (Google, GitHub) and Magic Links only
// For email/password confirmation, use /auth/confirm instead

import { NextResponse } from "next/server";
// import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    // TODO: Exchange code for session
    // const supabase = await createClient();
    // const { error } = await supabase.auth.exchangeCodeForSession(code);
    // if (!error) {
    //   return NextResponse.redirect(`${origin}${next}`);
    // }
  }

  // TODO: Redirect to error page on failure
  return NextResponse.redirect(`${origin}${next}`);
}
