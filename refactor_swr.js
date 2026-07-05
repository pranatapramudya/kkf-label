const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'app/(dashboard)/admin/page.tsx');
let content = fs.readFileSync(filePath, 'utf-8');

// 1. Add `preload` to SWR import if not present
if (content.includes('import useSWR from "swr"')) {
    content = content.replace('import useSWR from "swr";', 'import useSWR, { preload } from "swr";');
}

// 2. Refactor TabelPesanan
content = content.replace(
    /const \[daftarPesanan, setDaftarPesanan\] = useState<any\[\]>\(\[\]\);\s*const \[sedangMemuat, setSedangMemuat\] = useState\(true\);/,
    `// SWR Refactor
  // const [daftarPesanan, setDaftarPesanan] = useState<any[]>([]);
  // const [sedangMemuat, setSedangMemuat] = useState(true);`
);

content = content.replace(
    /const fetchPesanan = async \(page = 1\) => \{[\s\S]*?finally \{\s*setSedangMemuat\(false\);\s*\}\s*\};/,
    `const fetchPesanan = (page: number) => {
    setCurrentPage(page);
  };`
);

content = content.replace(
    /useEffect\(\(\) => \{\s*fetchPesanan\(1\);\s*\}, \[bulanExport, tahunExport\]\);/,
    `const { data: pesananData, isLoading: sedangMemuat } = useSWR(
    \`/api/admin/pesanan?page=\${currentPage}&month=\${bulanExport}&year=\${tahunExport}\`,
    fetcher,
    { keepPreviousData: true, refreshInterval: 10000 }
  );
  
  const daftarPesanan = pesananData?.data || [];
  
  useEffect(() => {
    if (pesananData?.totalPages) setTotalPages(pesananData.totalPages);
    if (pesananData?.page) setCurrentPage(pesananData.page);
  }, [pesananData]);
  
  useEffect(() => {
    setCurrentPage(1);
  }, [bulanExport, tahunExport]);`
);


// 3. Refactor Produk in HalamanAdmin
content = content.replace(
    /const \[daftarProduk, setDaftarProduk\] = useState<any\[\]>\(\[\]\);\s*const \[memuatProduk, setMemuatProduk\] = useState\(false\);/,
    `// SWR Refactor Produk
  // const [daftarProduk, setDaftarProduk] = useState<any[]>([]);
  // const [memuatProduk, setMemuatProduk] = useState(false);`
);

content = content.replace(
    /const tarikProdukDariDB = async \(sembunyi = false\) => \{[\s\S]*?if \(!sembunyi\) setMemuatProduk\(false\);\s*\}\s*\};/,
    `const { data: daftarProduk = [], isLoading: memuatProduk, mutate: mutateProduk } = useSWR("/api/admin/produk", fetcher, { refreshInterval: 10000, keepPreviousData: true });
  const tarikProdukDariDB = (sembunyi = false) => mutateProduk();`
);

// 4. Refactor Analitik in HalamanAdmin
content = content.replace(
    /const \[memuatAnalitik, setMemuatAnalitik\] = useState\(true\);\s*const \[dataAnalitik, setDataAnalitik\] = useState\(\{[\s\S]*?\}\);/,
    `// SWR Refactor Analitik
  // const [memuatAnalitik, setMemuatAnalitik] = useState(true);
  // const [dataAnalitik, setDataAnalitik] = useState({...});`
);

content = content.replace(
    /const tarikDataAnalitik = async \(sembunyi = false\) => \{[\s\S]*?if \(!sembunyi\) setMemuatAnalitik\(false\);\s*\}\s*\};/,
    `const { data: dataAnalitik = {
    totalPenjualan: 0, pesananBaru: 0, produkAktif: 0, daftarKategori: [], grafikPenjualan: [], grafikProdukTerjual: [], grafikProdukDilihat: []
  }, isLoading: memuatAnalitik, mutate: mutateAnalitik } = useSWR(
    \`/api/admin/analitik?filter=\${filterWaktu}&bulan=\${filterBulan}&tahun=\${filterTahun}\`,
    fetcher,
    { refreshInterval: 10000, keepPreviousData: true }
  );
  
  const tarikDataAnalitik = (sembunyi = false) => mutateAnalitik();`
);

// Remove the manual useEffect intervals for Produk and Analitik
content = content.replace(
    /useEffect\(\(\) => \{\s*if \(tabAktif === "produk"\) \{[\s\S]*?return \(\) => clearInterval\(intervalRealtime\);\s*\}\s*\}, \[tabAktif, filterWaktu, filterBulan, filterTahun\]\);/,
    `// useEffect interval realtime removed because SWR handles refreshInterval natively.`
);

// 5. Add prefetching to navigation
content = content.replace(
    /onClick=\{\(\) => \{\s*setTabAktif\(menu\.id as any\);\s*setSidebarBuka\(false\);\s*\}\}/g,
    `onMouseEnter={() => {
                  if (menu.id === "produk") preload("/api/admin/produk", fetcher);
                  if (menu.id === "analitik") preload(\`/api/admin/analitik?filter=\${filterWaktu}&bulan=\${filterBulan}&tahun=\${filterTahun}\`, fetcher);
                  if (menu.id === "pesanan") preload(\`/api/admin/pesanan?page=1&month=semua&year=\${tahunSekarang}\`, fetcher);
                }}
                onClick={() => {
                  setTabAktif(menu.id as any);
                  setSidebarBuka(false);
                }}`
);

content = content.replace(
    /onClick=\{\(\) => \{\s*setTabAktif\(menu\.id\);\s*setModeTambah\(false\);\s*\}\}/g,
    `onMouseEnter={() => {
                  if (menu.id === "produk") preload("/api/admin/produk", fetcher);
                  if (menu.id === "analitik") preload(\`/api/admin/analitik?filter=\${filterWaktu}&bulan=\${filterBulan}&tahun=\${filterTahun}\`, fetcher);
                  if (menu.id === "pesanan") preload(\`/api/admin/pesanan?page=1&month=semua&year=\${tahunSekarang}\`, fetcher);
                }}
                onClick={() => {
                  setTabAktif(menu.id);
                  setModeTambah(false);
                }}`
);

fs.writeFileSync(filePath, content, 'utf-8');
console.log('SWR Refactoring successful.');
