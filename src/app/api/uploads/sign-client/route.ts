import { NextResponse, type NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import {
  isCloudinarySigningReady,
  signUploadParams,
} from "@/lib/cloudinary/server";

export async function POST(request: NextRequest) {
  // Any authenticated user (client, admin, etc) can request a signed upload
  try {
    const { user, profile } = await getCurrentUser();
    if (!user || !profile) {
      return NextResponse.json({ error: "Unauthorized: login required" }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unauthorized" },
      { status: 401 }
    );
  }

  if (!isCloudinarySigningReady()) {
    return NextResponse.json(
      { error: "Cloudinary signing is not configured. Please contact admin or send files via email." },
      { status: 503 }
    );
  }

  try {
    const body = (await request.json().catch(() => ({}))) as Record<
      string,
      string | number | boolean | undefined | null
    >;

    // Security: only allow client_uploads folder for clients, media folder for admin uploads handled elsewhere
    // We accept folder but enforce prefix
    const folder = typeof body.folder === "string" ? body.folder : "";
    if (folder && !folder.startsWith("client_uploads") && !folder.startsWith("media") && folder !== "") {
      // Default to client_uploads if invalid
      body.folder = `client_uploads/${folder}`;
    }

    const signed = signUploadParams(body);
    return NextResponse.json(signed);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to sign upload params",
      },
      { status: 400 }
    );
  }
}
