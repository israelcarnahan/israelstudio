const SQUARE_VERSION = process.env.SQUARE_VERSION || "2025-08-20";
const APP_ID = process.env.NEXT_PUBLIC_SQUARE_APP_ID!;
const TOKEN = process.env.SQUARE_ACCESS_TOKEN!;
const LOCATION_ID = process.env.SQUARE_LOCATION_ID!;
const IS_SANDBOX = APP_ID?.startsWith("sandbox-");
const BASE = IS_SANDBOX
  ? "https://connect.squareupsandbox.com"
  : "https://connect.squareup.com";

export function assertSquareEnv() {
  if (!APP_ID || !TOKEN || !LOCATION_ID) {
    throw new Error("Missing Square env vars");
  }
}

async function sq<T>(path: string, init: RequestInit & { method?: string } = {}) {
  assertSquareEnv();
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      "Authorization": `Bearer ${TOKEN}`,
      "Square-Version": SQUARE_VERSION,
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
    // Next.js: mark as dynamic fetch from server routes
    cache: "no-store",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    console.error("Square error", res.status, data);
    throw new Error(`Square ${res.status}`);
  }
  return data as T;
}

// ---- Catalog (read) ----

// Pull items (and variations/prices) for the current location.
// We keep it simple: assume each painting has 1 variation with fixed price.
export async function searchCatalogPaintings() {
  type Resp = {
    items?: unknown[];
    cursor?: string;
  };
  const body = {
    enabled_location_ids: [LOCATION_ID],
    // You can add category_ids or text_filter later; for now, fetch all
    sort_order: "ASC",
    limit: 100
  };
  const r = await sq<Resp>("/v2/catalog/search-catalog-items", {
    method: "POST",
    body: JSON.stringify(body),
  });
  return (r.items || []);
}

// Normalize Square item → storefront product
export function normalizeSquareItem(item: unknown) {
  const itemData = item as {
    id?: string;
    item_data?: {
      name?: string;
      variations?: Array<{
        id?: string;
        item_variation_data?: {
          price_money?: {
            amount?: number;
            currency?: string;
          };
        };
      }>;
      image_ids?: string[];
    };
    image_id?: string;
  };
  
  const id = itemData?.id;
  const name = itemData?.item_data?.name || "Untitled";
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const firstVar = itemData?.item_data?.variations?.[0];
  const price = firstVar?.item_variation_data?.price_money?.amount ?? 0;
  const currency = firstVar?.item_variation_data?.price_money?.currency ?? "USD";
  const variationId = firstVar?.id;
  // Square images can come from CatalogImage objects attached; we'll surface first if present
  const imageId = itemData?.image_id || itemData?.item_data?.image_ids?.[0];
  const imageUrl = imageId ? `${BASE}/v2/catalog/images/${imageId}` : undefined; // NOTE: This endpoint requires auth; we won't call it client-side.
  return {
    id,
    title: name,
    slug,
    priceCents: price,
    currency,
    variationId,
    imageUrl, // not directly usable on client; keep undefined for now
    category: "paintings", // Default to paintings for now
  };
}

// ---- Checkout (hosted payment link) ----

// Build a Square-hosted checkout link from cart lines (name/amount only).
// We intentionally do NOT require catalog_object_id so this works even if items
// aren't in Square yet. Later we can switch to catalog-based line items.
export async function createHostedCheckoutLink(lines: Array<{ name: string; amountCents: number; quantity: number; }>) {
  const order = {
    location_id: LOCATION_ID,
    line_items: lines.map((l) => ({
      name: l.name,
      quantity: String(l.quantity),
      base_price_money: { amount: l.amountCents, currency: "USD" },
    })),
  };
  const idempotency_key = crypto.randomUUID();
  const body = { idempotency_key, order };
  const r = await sq<{ payment_link?: { url?: string } }>("/v2/online-checkout/payment-links", {
    method: "POST",
    body: JSON.stringify(body),
  });
  const url = r?.payment_link?.url;
  if (!url) throw new Error("No payment link returned");
  return url;
}

export async function upsertSquareItemSimple(opts: {
  name: string;
  priceCents: number;
  currency: string;
  squareObjectId?: string | null;
}) {
  const idempotency_key = crypto.randomUUID();
  const objectId = opts.squareObjectId ?? `#temp_${idempotency_key}`;
  const variationId = `#var_${idempotency_key}`;

  const body = {
    idempotency_key,
    object: {
      id: objectId,
      type: "ITEM",
      item_data: {
        name: opts.name,
        variations: [
          {
            id: variationId,
            type: "ITEM_VARIATION",
            item_variation_data: {
              item_id: objectId,
              name: "Default",
              pricing_type: "FIXED_PRICING",
              price_money: { amount: opts.priceCents, currency: opts.currency },
            },
          },
        ],
      },
    },
  };

  const r = await sq<{ catalog_object: any; id_mappings?: { client_object_id: string; object_id: string }[] }>("/v2/catalog/object", {
    method: "POST",
    body: JSON.stringify(body),
  });

  const obj = r.catalog_object;
  const itemId = obj.id;
  const varId = obj.item_data?.variations?.[0]?.id;
  return { itemId, variationId: varId };
}
