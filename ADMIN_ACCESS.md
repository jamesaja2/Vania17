# 🔐 Cara Akses Halaman Admin - Karla's Sweet 17

## 📱 Cara Akses Admin Panel

### Method 1: Melalui URL Parameter (Recommended)

Tambahkan `?admin=true` di akhir URL website Anda:

**Development (Local):**
```
http://localhost:5173?admin=true
```

**Production (Setelah Deploy):**
```
https://your-domain.com?admin=true
```

### Method 2: Dengan Guest Parameter

Jika menggunakan link undangan dengan parameter guest:
```
http://localhost:5173?to=Admin&pax=1&admin=true
```

---

## 🔑 Login Admin

Setelah membuka URL dengan `?admin=true`:

1. **Modal Admin Login akan muncul otomatis**
2. **Masukkan Password:** `vania17`
3. **Klik Login**

### Password Admin
Default password: **`vania17`**

Untuk mengubah password, edit file `src/App.jsx` baris ke-11:
```javascript
const ADMIN_PASSWORD = 'vania17'; // ← Ubah ini
```

---

## 📊 Fitur Admin Panel

Setelah login, Anda bisa melihat:

### 1. **Statistik RSVP**
- Total yang akan hadir
- Total yang tidak hadir
- Total jumlah tamu

### 2. **Daftar RSVP Lengkap**
- Nama tamu
- Status kehadiran (Hadir/Tidak Hadir)
- Jumlah tamu yang akan datang
- Waktu konfirmasi

---

## 🔗 URL Templates untuk Share

### URL Undangan Biasa:
```
https://your-domain.com?to=John%20Doe&pax=2
```
**Parameter:**
- `to` = Nama tamu (gunakan %20 untuk spasi)
- `pax` = Jumlah orang yang diundang

### URL Admin:
```
https://your-domain.com?admin=true
```

### Contoh URL Lengkap:
```
# Undangan untuk John Doe (2 orang)
https://your-domain.com?to=John%20Doe&pax=2

# Undangan untuk Jane Smith (1 orang)
https://your-domain.com?to=Jane%20Smith&pax=1

# Admin panel
https://your-domain.com?admin=true
```

---

## 🛡️ Keamanan Admin

### Password Protection
- Admin panel dilindungi password
- Password disimpan di frontend (untuk demo)
- Untuk security lebih baik, gunakan Supabase Auth

### Saran Keamanan:
1. **Jangan share URL admin** ke sembarang orang
2. **Ganti password default** sebelum production
3. **Gunakan password yang kuat** (minimal 12 karakter)
4. **Pertimbangkan Supabase Auth** untuk security lebih baik

---

## 🎨 Cara Customize Password

Edit file: `src/App.jsx`

```javascript
// Baris 11
const ADMIN_PASSWORD = 'vania17'; // ← Ganti dengan password Anda
```

**Contoh password yang kuat:**
```javascript
const ADMIN_PASSWORD = 'Vania@Sweet17#2026';
const ADMIN_PASSWORD = 'BdayVan!a2026SecurE';
const ADMIN_PASSWORD = 'MyP@ssw0rd17!Strong';
```

---

## 📱 Screenshot Flow

```
1. Buka: https://your-domain.com?admin=true
   ↓
2. Modal login muncul dengan input password
   ↓
3. Masukkan password: vania17
   ↓
4. Klik "Login"
   ↓
5. Admin panel terbuka dengan:
   - Statistik RSVP (cards di atas)
   - Daftar RSVP detail (list di bawah)
```

---

## 🔧 Troubleshooting

### Modal tidak muncul?
**Solusi:** Pastikan URL ada parameter `?admin=true`

### Password salah terus?
**Cek:** File `src/App.jsx` baris 11, pastikan ADMIN_PASSWORD sesuai

### Data RSVP tidak muncul?
**Cek:**
1. Supabase URL & Key sudah benar
2. Database sudah dibuat (jalankan `database-setup.sql`)
3. Ada data RSVP di database

### Error "Failed to fetch"?
**Solusi:** Setup Supabase belum selesai, ikuti `SUPABASE_SETUP_GUIDE.md`

---

## 💡 Tips & Tricks

### 1. Bookmark Admin URL
Simpan URL admin di bookmark browser untuk akses cepat:
```
https://your-domain.com?admin=true
```

### 2. Private Browser untuk Test
Gunakan incognito/private mode untuk test admin tanpa logout:
- `Ctrl + Shift + N` (Chrome)
- `Ctrl + Shift + P` (Firefox)

### 3. Export Data RSVP
Dari Supabase Dashboard:
1. Buka **Table Editor** → `rsvp`
2. Klik **Export** (icon download)
3. Pilih format: CSV atau Excel

### 4. Share Admin Access
Jika perlu share akses admin:
- Share: URL + Password
- Gunakan: Secure messaging (WhatsApp, Telegram)
- Jangan post di social media!

---

## 🚀 Advanced: Multiple Admin Levels

Jika ingin multiple admin dengan password berbeda:

```javascript
// src/App.jsx
const ADMIN_PASSWORDS = {
  'vania17': 'full-access',
  'guest123': 'view-only'
};

const handleAdminLogin = () => {
  const accessLevel = ADMIN_PASSWORDS[adminPassword];
  
  if (accessLevel) {
    setIsAdminAuth(true);
    setAdminAccessLevel(accessLevel);
    loadRSVPList();
  } else {
    alert('Incorrect password!');
  }
};
```

---

## 📞 Need Help?

**Developer:** James Timothy
**Website:** https://byjames.my.id
**Project:** Karla's Sweet 17 Invitation

---

**Last Updated:** February 3, 2026
