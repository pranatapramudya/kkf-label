"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import type { ItemKeranjang } from "@/types/produk";

type NilaiKeranjang = {
  itemKeranjang: ItemKeranjang[];
  jumlahItem: number;
  subtotal: number;
  tambahItem: (itemBaru: ItemKeranjang) => void;
  ubahJumlah: (idVarian: string, jumlahBaru: number) => void;
  hapusItem: (idVarian: string) => void;
  kosongkanKeranjang: () => void;
};

const KUNCI_KERANJANG = "kkf-label-keranjang";
const KeranjangContext = createContext<NilaiKeranjang | undefined>(undefined);

export function PenyediaKeranjang({ children }: { children: React.ReactNode }) {
  const [itemKeranjang, setItemKeranjang] = useState<ItemKeranjang[]>([]);

  useEffect(() => {
    const dataTersimpan = window.localStorage.getItem(KUNCI_KERANJANG);

    if (dataTersimpan) {
      setItemKeranjang(JSON.parse(dataTersimpan) as ItemKeranjang[]);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(KUNCI_KERANJANG, JSON.stringify(itemKeranjang));
  }, [itemKeranjang]);

  const tambahItem = useCallback((itemBaru: ItemKeranjang) => {
    setItemKeranjang((itemSaatIni) => {
      const itemAda = itemSaatIni.find((item) => item.idVarian === itemBaru.idVarian);

      if (!itemAda) {
        return [...itemSaatIni, itemBaru];
      }

      return itemSaatIni.map((item) =>
        item.idVarian === itemBaru.idVarian
          ? { ...item, jumlah: item.jumlah + itemBaru.jumlah }
          : item
      );
    });
  }, []);

  const ubahJumlah = useCallback((idVarian: string, jumlahBaru: number) => {
    setItemKeranjang((itemSaatIni) =>
      itemSaatIni
        .map((item) =>
          item.idVarian === idVarian ? { ...item, jumlah: Math.max(jumlahBaru, 1) } : item
        )
        .filter((item) => item.jumlah > 0)
    );
  }, []);

  const hapusItem = useCallback((idVarian: string) => {
    setItemKeranjang((itemSaatIni) =>
      itemSaatIni.filter((item) => item.idVarian !== idVarian)
    );
  }, []);

  const kosongkanKeranjang = useCallback(() => {
    setItemKeranjang([]);
  }, []);

  const nilaiKeranjang = useMemo(() => {
    const jumlahItem = itemKeranjang.reduce((total, item) => total + item.jumlah, 0);
    const subtotal = itemKeranjang.reduce(
      (total, item) => total + item.harga * item.jumlah,
      0
    );

    return {
      itemKeranjang,
      jumlahItem,
      subtotal,
      tambahItem,
      ubahJumlah,
      hapusItem,
      kosongkanKeranjang
    };
  }, [hapusItem, itemKeranjang, kosongkanKeranjang, tambahItem, ubahJumlah]);

  return (
    <KeranjangContext.Provider value={nilaiKeranjang}>
      {children}
    </KeranjangContext.Provider>
  );
}

export function useKeranjang() {
  const nilai = useContext(KeranjangContext);

  if (!nilai) {
    throw new Error("useKeranjang harus dipakai di dalam PenyediaKeranjang");
  }

  return nilai;
}
