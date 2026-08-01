import { NextResponse, type NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import {
  isCloudinarySigningReady,
  signUploadParams,
} from "@/lib/cloudinary/server";

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unauthorized: admin required",
      },
      { status: 401 }
    );
  }

  if (!isCloudinarySigningReady()) {
    return NextResponse.json(
      { error: "Cloudinary signing is not configured" },
      { status: 503 }
    );
  }

  try {
    const body = (await request.json().catch(() => ({}))) as Record<
      string,
      string | number | boolean | undefined | null
    >;
    const signed = signUploadParams(body);
    return NextResponse.json(signed);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to sign upload params",
      },
      { status: 400 }
    );
  }
}
