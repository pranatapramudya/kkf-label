export const config = {
  db: {
    url: process.env.DATABASE_URL?.trim(),
  },
  midtrans: {
    serverKey: process.env.MIDTRANS_SERVER_KEY?.trim(),
    clientKey: process.env.MIDTRANS_CLIENT_KEY?.trim(),
  },
  mayar: {
    apiKey: process.env.MAYAR_API_KEY?.trim(),
    webhookSecret: process.env.MAYAR_WEBHOOK_SECRET?.trim(),
  },
  app: {
    url: process.env.NEXT_PUBLIC_APP_URL || "https://kkflabel.com",
  }
};

export function validateEnv() {
  if (!config.db.url) {
    console.error("❌ FATAL: DATABASE_URL is missing in .env");
  }
}

// Auto-validate
validateEnv();
