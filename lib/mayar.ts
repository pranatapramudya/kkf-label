import { config } from "./env";

export interface MayarPaymentParams {
  orderId: string;
  amount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  description?: string;
}

export async function createMayarPaymentLink(params: MayarPaymentParams) {
  const apiKey = config.mayar.apiKey;
  if (!apiKey) {
    throw new Error("MAYAR_API_KEY belum dikonfigurasi.");
  }

  // Menggunakan API standar Mayar v1 untuk membuat Single Payment Link / Transaction
  const payload = {
    name: params.customerName,
    email: params.customerEmail,
    mobile: params.customerPhone,
    amount: params.amount,
    description: params.description || `Pembayaran Pesanan ${params.orderId}`,
    external_id: params.orderId,
    redirect_url: `${config.app.url}/lacak-pesanan?invoice=${params.orderId}`,
  };

  try {
    const res = await fetch("https://api.mayar.id/v1/payment/create", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("[Mayar] Error creating payment link:", errorText);
      throw new Error("Gagal membuat link pembayaran Mayar");
    }

    const data = await res.json();
    // Data balikan biasanya memiliki link pembayaran di data.link atau data.url
    return data;
  } catch (error) {
    console.error("[Mayar] Fetch error:", error);
    throw error;
  }
}
