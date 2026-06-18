import { idID } from "@clerk/localizations";

export const temaKkfAdmin = {
  localization: idID,
  appearance: {
    layout: {
      // Masukin logo KKF pakai jalur resmi Clerk
      logoImageUrl: "/logo-kkf.jpeg",
    },
    variables: {
      // Warna utama tombol & aksen jadi Pink KKF
      colorPrimary: "#db2777",
      colorText: "#18181b",
      colorBackground: "#ffffff",
      fontFamily: "var(--font-geist-sans), sans-serif",
      borderRadius: "0.75rem",
    },
    // Kita kosongkan 'elements' biar Clerk merender form aslinya tanpa error!
    elements: {},
  },
};
