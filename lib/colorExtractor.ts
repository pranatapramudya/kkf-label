/**
 * Mengekstrak warna dominan/rata-rata dari gambar (fokus pada bagian tengah) menggunakan HTML5 Canvas.
 * @param file Objek File gambar
 * @returns String Hex Color (contoh: "#FFC0CB")
 */
export async function ekstrakWarnaGambar(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith("image/")) {
      reject(new Error("File bukan gambar"));
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        
        if (!ctx) {
          reject(new Error("Gagal membuat konteks 2D canvas"));
          return;
        }

        // Ukuran sampel gambar untuk mempercepat pemrosesan
        const MAX_SIZE = 100;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        // Ambil piksel dari area tengah (sekitar 30% dari tengah) untuk menghindari background (misal background putih)
        const startX = Math.floor(width * 0.35);
        const startY = Math.floor(height * 0.35);
        const endX = Math.floor(width * 0.65);
        const endY = Math.floor(height * 0.65);
        
        const extractWidth = endX - startX;
        const extractHeight = endY - startY;

        try {
          const imageData = ctx.getImageData(startX, startY, extractWidth, extractHeight);
          const data = imageData.data;
          
          let r = 0, g = 0, b = 0;
          let count = 0;

          // Loop warna per piksel (4 channel: R, G, B, A)
          for (let i = 0; i < data.length; i += 4) {
            // Hindari warna background yang terlalu terang (putih) atau terlalu gelap (hitam) mutlak
            const pr = data[i];
            const pg = data[i+1];
            const pb = data[i+2];
            const pa = data[i+3];

            // Abaikan pixel transparan
            if (pa < 10) continue;
            
            // Abaikan putih murni (background foto studio biasanya putih terang)
            if (pr > 245 && pg > 245 && pb > 245) continue;
            // Abaikan hitam murni
            if (pr < 10 && pg < 10 && pb < 10) continue;

            r += pr;
            g += pg;
            b += pb;
            count++;
          }

          // Jika semua pixel diabaikan (karena gambar memang full putih/hitam), ambil rata-rata semua
          if (count === 0) {
            for (let i = 0; i < data.length; i += 4) {
              r += data[i];
              g += data[i+1];
              b += data[i+2];
              count++;
            }
          }

          r = Math.floor(r / count);
          g = Math.floor(g / count);
          b = Math.floor(b / count);

          // Konversi ke HEX
          const rgbToHex = (c: number) => {
            const hex = c.toString(16);
            return hex.length == 1 ? "0" + hex : hex;
          };

          resolve(`#${rgbToHex(r)}${rgbToHex(g)}${rgbToHex(b)}`.toUpperCase());
        } catch (e) {
          reject(e);
        }
      };
      img.onerror = () => reject(new Error("Gagal memuat gambar ke Canvas"));
      img.src = event.target?.result as string;
    };
    reader.onerror = () => reject(new Error("Gagal membaca file gambar"));
    reader.readAsDataURL(file);
  });
}
