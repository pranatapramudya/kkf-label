const fs = require('fs');
const path = require('path');

function processFile(filePath) {
    if (!fs.existsSync(filePath)) return;
    
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // Replace colors
    content = content.replace(/text-gray-400/g, 'text-gray-600');
    content = content.replace(/text-gray-500/g, 'text-gray-600');
    content = content.replace(/text-zinc-400/g, 'text-zinc-600');
    content = content.replace(/text-zinc-500/g, 'text-zinc-600');
    
    // Add aria-labels for known icon-only buttons
    
    // 1. Close Modals / X Buttons
    content = content.replace(/(<button[^>]*onClick={\(\) => setPesananDiedit\(null\)}[^>]*>[\s\n]*<X[^>]*>[\s\n]*<\/button>)/g, (match) => {
        if (!match.includes('aria-label')) {
            return match.replace('<button', '<button aria-label="Tutup modal pesanan"');
        }
        return match;
    });

    content = content.replace(/(<button[^>]*onClick={\(\) => setBukaKalkulator\(false\)}[^>]*>[\s\n]*<X[^>]*>[\s\n]*<\/button>)/g, (match) => {
        if (!match.includes('aria-label')) {
            return match.replace('<button', '<button aria-label="Tutup kalkulator profit"');
        }
        return match;
    });

    content = content.replace(/(<button[^>]*onClick={\(\) => setDetailPesananTerbuka\(null\)}[^>]*>[\s\n]*<X[^>]*>[\s\n]*<\/button>)/g, (match) => {
        if (!match.includes('aria-label')) {
            return match.replace('<button', '<button aria-label="Tutup detail"');
        }
        return match;
    });
    
    // 2. Mobile add product button
    content = content.replace(/(<button[^>]*onClick={\(\) => setModeTambah\(true\)}[^>]*className="sm:hidden[^>]*>[\s\n]*<Plus[^>]*>[\s\n]*<\/button>)/g, (match) => {
        if (!match.includes('aria-label')) {
            return match.replace('<button', '<button aria-label="Tambah produk"');
        }
        return match;
    });

    // 3. Logout button
    content = content.replace(/(<button[^>]*onClick=\{async \(\) => \{\s*await signOut[^>]*>[\s\n]*<LogOut[^>]*>[\s\n]*<\/button>)/g, (match) => {
        if (!match.includes('aria-label')) {
            return match.replace('<button', '<button aria-label="Keluar dari Admin"');
        }
        return match;
    });

    // 4. Mobile sidebar toggle (if any)
    content = content.replace(/(<button[^>]*onClick={\(\) => setSidebarBuka\(!sidebarBuka\)}[^>]*>[\s\n]*<Menu[^>]*>[\s\n]*<\/button>)/g, (match) => {
        if (!match.includes('aria-label')) {
            return match.replace('<button', '<button aria-label="Buka navigasi samping"');
        }
        return match;
    });
    
    // Refresh / sync
    content = content.replace(/(<button[^>]*onClick=\{tarikDataTerbaru\}[^>]*>[\s\n]*<RefreshCw[^>]*>[\s\n]*<\/button>)/g, (match) => {
        if (!match.includes('aria-label')) {
            return match.replace('<button', '<button aria-label="Muat ulang data"');
        }
        return match;
    });
    
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Processed: ${filePath}`);
}

const adminPagePath = path.join(__dirname, 'app', '(dashboard)', 'admin', 'page.tsx');
processFile(adminPagePath);

// Find all tsx in components/admin
const adminComponentsDir = path.join(__dirname, 'components', 'admin');
if (fs.existsSync(adminComponentsDir)) {
    const files = fs.readdirSync(adminComponentsDir);
    for (const file of files) {
        if (file.endsWith('.tsx')) {
            processFile(path.join(adminComponentsDir, file));
        }
    }
}
