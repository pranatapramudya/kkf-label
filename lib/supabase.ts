import { createClient } from "@supabase/supabase-js";

// Ambil kunci rahasia dari file .env
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function uploadFotoProduk(file: File) {
  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

  const { error } = await supabase.storage
    .from("produk")
    .upload(fileName, file);

  if (error) {
    console.error("Error upload supabase:", error);
    throw new Error("Gagal upload gambar ke Supabase");
  }

  const { data: publicUrlData } = supabase.storage
    .from("produk")
    .getPublicUrl(fileName);
  return publicUrlData.publicUrl;
}

// FUNGSI BARU KHUSUS VIDEO
export async function uploadVideoProduk(file: File) {
  const fileExt = file.name.split(".").pop();
  const fileName = `vid-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

  const { error } = await supabase.storage
    .from("produk")
    .upload(fileName, file);

  if (error) {
    console.error("Error upload video supabase:", error);
    throw new Error("Gagal upload video ke Supabase");
  }

  const { data: publicUrlData } = supabase.storage
    .from("produk")
    .getPublicUrl(fileName);
  return publicUrlData.publicUrl;
}
