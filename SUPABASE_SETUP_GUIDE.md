# 🔧 Panduan Setup Supabase - Karla's Sweet 17

## ⚠️ ERROR yang Terjadi
```
ERR_NAME_NOT_RESOLVED
Failed to fetch
```

**Penyebab:** URL atau Anon Key Supabase tidak valid/salah.

---

## 📋 Langkah-Langkah Setup Supabase

### 1️⃣ Buka Supabase Dashboard
- Pergi ke: https://supabase.com/dashboard
- Login dengan akun Anda
- Atau buat project baru jika belum ada

### 2️⃣ Dapatkan Project URL & API Key

#### Cara 1: Dari Settings → API
1. Di dashboard, pilih project Anda
2. Klik **Settings** (⚙️) di sidebar kiri
3. Klik **API**
4. Di halaman API, Anda akan melihat:

   **Project URL:**
   ```
   https://[PROJECT-REF].supabase.co
   ```
   
   **Project API keys:**
   - `anon` `public` ← **Gunakan yang ini!**
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

#### Cara 2: Dari Database URL
Berdasarkan `.env` file Anda:
```
DATABASE_URL="postgresql://postgres:02juni2020LENOVO@db.pzlnyxgcpmfeckzirzqe.supabase.co:5432/postgres"
```

**Project Reference ID:** `pzlnyxgcpmfeckzirzqe`

Maka **Project URL** Anda adalah:
```
https://pzlnyxgcpmfeckzirzqe.supabase.co
```

### 3️⃣ Update App.jsx

Buka file: `src/App.jsx`

Ganti baris 6-17 dengan konfigurasi yang benar:

```javascript
// ============================================
// REPLACE WITH YOUR SUPABASE CONFIG
// ============================================
const SUPABASE_URL = 'https://pzlnyxgcpmfeckzirzqe.supabase.co';
const SUPABASE_ANON_KEY = 'PASTE_YOUR_ANON_KEY_HERE';

// Admin password for RSVP page access
const ADMIN_PASSWORD = 'vania17';
```

### 4️⃣ Jalankan SQL Script

1. Di Supabase Dashboard, klik **SQL Editor** di sidebar
2. Klik **New query**
3. Copy semua isi file `database-setup.sql`
4. Paste ke SQL Editor
5. Klik **Run** (atau tekan `Ctrl + Enter`)

### 5️⃣ Verifikasi Setup

Setelah SQL dijalankan, verifikasi dengan query ini:

```sql
-- Check tables
SELECT * FROM public.rsvp LIMIT 5;
SELECT * FROM public.wishes LIMIT 5;

-- Check RLS policies
SELECT tablename, policyname, cmd 
FROM pg_policies 
WHERE tablename IN ('rsvp', 'wishes');
```

---

## 🎯 Checklist Setup

- [ ] ✅ Login ke Supabase Dashboard
- [ ] ✅ Buka Settings → API
- [ ] ✅ Copy **Project URL**
- [ ] ✅ Copy **anon public key**
- [ ] ✅ Update `SUPABASE_URL` di `src/App.jsx`
- [ ] ✅ Update `SUPABASE_ANON_KEY` di `src/App.jsx`
- [ ] ✅ Jalankan `database-setup.sql` di SQL Editor
- [ ] ✅ Verifikasi tabel berhasil dibuat
- [ ] ✅ Test aplikasi (RSVP & Wishes)

---

## 🚀 Testing

### Test RSVP:
1. Buka aplikasi: `http://localhost:5173`
2. Klik **Open Invitation**
3. Scroll ke bagian **RSVP**
4. Isi nama dan pilih attendance
5. Klik **Send RSVP**
6. Cek di Supabase Table Editor → `rsvp` table

### Test Wishes:
1. Scroll ke bagian **Send a Message**
2. Isi nama dan pesan
3. Klik **Send Message**
4. Pesan harus muncul di bawahnya
5. Cek di Supabase Table Editor → `wishes` table

### Test Admin Panel:
1. Buka: `http://localhost:5173?admin=true`
2. Masukkan password: `vania17`
3. Lihat daftar RSVP

---

## 🔍 Troubleshooting

### Error: "Failed to fetch"
**Penyebab:** URL atau Key salah
**Solusi:** 
- Cek kembali Project URL di Supabase Dashboard
- Pastikan tidak ada spasi atau karakter aneh
- Pastikan format: `https://[project-ref].supabase.co`

### Error: "Row Level Security policy violation"
**Penyebab:** RLS policies belum dijalankan
**Solusi:**
- Jalankan ulang `database-setup.sql`
- Pastikan bagian policies tereksekusi

### Error: "relation does not exist"
**Penyebab:** Tabel belum dibuat
**Solusi:**
- Jalankan `database-setup.sql` di SQL Editor
- Verifikasi dengan: `SELECT * FROM public.rsvp;`

### Error: "Invalid API key"
**Penyebab:** Anon key salah atau expired
**Solusi:**
- Ambil ulang anon key dari Settings → API
- Pastikan menggunakan key yang bertanda `anon` `public`
- JANGAN gunakan `service_role` key!

---

## 📱 Deploy ke Production

### Update untuk Production:
Setelah deploy (Vercel/Netlify), update URL di `App.jsx`:

```javascript
const SUPABASE_URL = 'https://pzlnyxgcpmfeckzirzqe.supabase.co';
const SUPABASE_ANON_KEY = 'your_production_anon_key';
```

### Environment Variables (Recommended):
Untuk keamanan lebih baik, gunakan environment variables:

**File:** `.env`
```
VITE_SUPABASE_URL=https://pzlnyxgcpmfeckzirzqe.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

**File:** `src/App.jsx`
```javascript
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
```

---

## 💡 Tips

1. **Anon Key aman dipublikasikan** - Tidak masalah jika terlihat di frontend
2. **JANGAN gunakan Service Role Key** - Ini berbahaya!
3. **RLS melindungi data** - Pastikan policies sudah benar
4. **Backup database** - Export data secara berkala
5. **Monitor usage** - Cek quota di Supabase Dashboard

---

## 📞 Butuh Bantuan?

1. Dokumentasi Supabase: https://supabase.com/docs
2. Supabase Discord: https://discord.supabase.com
3. Check status: https://status.supabase.com

---

**Setup Date:** February 3, 2026
**Project:** Karla's Sweet 17 Invitation
**Developer:** James Timothy
