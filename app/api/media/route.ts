import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Authentication required" } },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search");
  const folder = searchParams.get("folder");

  let query = supabase
    .from("media_files")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (search) {
    query = query.ilike("filename", `%${search}%`);
  }
  if (folder) {
    query = query.eq("folder", folder);
  }

  const { data: files, error } = await query.limit(100);

  if (error) {
    return NextResponse.json(
      { error: { code: "FETCH_FAILED", message: error.message } },
      { status: 500 }
    );
  }

  return NextResponse.json({ files });
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Authentication required" } },
      { status: 401 }
    );
  }

  const body = await req.json();
  const { filename, url, mime_type, size_bytes, alt_text, folder } = body;

  if (!filename || !url || !mime_type) {
    return NextResponse.json(
      { error: { code: "VALIDATION", message: "filename, url, and mime_type are required" } },
      { status: 400 }
    );
  }

  const { data: file, error } = await supabase
    .from("media_files")
    .insert({
      filename,
      url,
      mime_type,
      size_bytes: size_bytes ?? 0,
      alt_text: alt_text ?? null,
      folder: folder ?? "",
      user_id: user.id,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      { error: { code: "CREATE_FAILED", message: error.message } },
      { status: 500 }
    );
  }

  return NextResponse.json({ file }, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Authentication required" } },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: { code: "VALIDATION", message: "id is required" } },
      { status: 400 }
    );
  }

  // Verify ownership
  const { data: existing } = await supabase
    .from("media_files")
    .select("id, url")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!existing) {
    return NextResponse.json(
      { error: { code: "NOT_FOUND", message: "Media file not found" } },
      { status: 404 }
    );
  }

  const { error } = await supabase
    .from("media_files")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json(
      { error: { code: "DELETE_FAILED", message: error.message } },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
