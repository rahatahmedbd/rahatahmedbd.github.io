import { NextRequest } from "next/server";

import { requireAuthenticatedAccount } from "@/lib/backend/auth";
import { apiError, apiJson, getClientIp } from "@/lib/backend/http";
import { logPlatformError } from "@/lib/backend/logger";
import { checkRateLimit, pruneRateLimitBuckets } from "@/lib/backend/rate-limit";
import { prepareWebsiteOrder, storeWebsiteOrder } from "@/lib/backend/orders";
import { websiteOrderSubmissionSchema } from "@/lib/order-validation";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  pruneRateLimitBuckets();
  const ip = getClientIp(request);
  const limit = checkRateLimit(`order:${ip}`, 8, 60 * 60 * 1000);

  if (!limit.allowed) {
    return apiJson(
      {
        error: "Too many order attempts. Please wait before submitting another order.",
      },
      {
        status: 429,
        headers: {
          "Retry-After": Math.ceil((limit.resetAt - Date.now()) / 1000).toString(),
        },
      },
    );
  }

  try {
    const submission = websiteOrderSubmissionSchema.parse(await request.json());
    const preparedOrder = prepareWebsiteOrder(submission);

    let userId: string | null = null;
    try {
      const account = await requireAuthenticatedAccount(request);
      userId = account.user.id;
    } catch {
      userId = null;
    }

    try {
      const storedOrder = await storeWebsiteOrder(preparedOrder, userId);
      return apiJson({
        ok: true,
        stored: true,
        order: storedOrder,
      });
    } catch (error) {
      await logPlatformError("orders.store", error, { orderNumber: preparedOrder.orderNumber });

      if (process.env.NODE_ENV !== "production") {
        return apiJson({
          ok: true,
          stored: false,
          order: {
            id: preparedOrder.orderNumber,
            orderNumber: preparedOrder.orderNumber,
            status: "new",
            progressPercent: 5,
          },
          warning:
            "Order validated successfully, but Supabase storage is unavailable in this environment.",
        });
      }

      throw error;
    }
  } catch (error) {
    return apiError(error);
  }
}
