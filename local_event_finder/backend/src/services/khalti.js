import { config } from "../config.js";

// KPG-2 API base per Khalti docs
const BASE = config.khaltiSandbox ? "https://dev.khalti.com" : "https://khalti.com";

function authHeaders() {
  return {
    Authorization: `Key ${config.khaltiSecretKey}`,
    "Content-Type": "application/json",
  };
}

/**
 * Initiate a Khalti KPG-2 EPayment (server-side).
 * amount must be in PAISA (NPR amount * 100).
 * Returns { pidx, paymentUrl, expiresAt, expiresIn } on success.
 */
export async function initiateKhaltiPayment({
  amount,
  purchaseOrderId,
  purchaseOrderName,
  returnUrl,
  websiteUrl,
  customer,
}) {
  const payload = {
    return_url: returnUrl,
    website_url: websiteUrl,
    amount,
    purchase_order_id: purchaseOrderId,
    purchase_order_name: purchaseOrderName,
    ...(customer ? { customer_info: customer } : {}),
  };

  const res = await fetch(`${BASE}/api/v2/epayment/initiate/`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    console.error("[khalti] initiate failed:", data);
    const msg = data?.detail || data?.error_key || "Khalti payment initiation failed.";
    throw new Error(msg);
  }

  return {
    pidx: data.pidx,
    paymentUrl: data.payment_url,
    expiresAt: data.expires_at,
    expiresIn: data.expires_in,
  };
}

/**
 * Look up / verify a Khalti payment by pidx.
 * Only status === "Completed" is treated as success (per Khalti docs).
 */
export async function lookupKhaltiPayment(pidx) {
  const res = await fetch(`${BASE}/api/v2/epayment/lookup/`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ pidx }),
  });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    console.error("[khalti] lookup failed:", data);
    return { success: false, data };
  }
  return { success: true, data };
}
