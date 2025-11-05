# 🧭 Dokumentasi Endpoint Backend

> Semua endpoint ditulis **tanpa awalan domain** seperti `localhost:8080`, contoh penulisannya:  
> `/reservation`  
> Jadi bagian frontend dapat langsung menggunakan endpoint dengan menuliskannya seperti contoh tersebut.

---

## 📚 List Endpoint

---

### 🧾 /reservation

**Method:** `POST`, `GET`

Endpoint ini digunakan untuk sistem **reservasi pelanggan umum** maupun **akses internal** oleh staff/cashier/admin.  
Endpoint **tanpa middleware** bersifat **public** (tidak perlu login) dan digunakan oleh **customer** untuk membuat reservasi.  
Endpoint dengan middleware hanya bisa diakses oleh **user internal** (login required).

---

#### 🔹 `POST /reservation`

**Deskripsi:**  
Digunakan oleh pelanggan umum untuk **membuat reservasi baru** tanpa perlu login.  
Saat data dikirim, sistem otomatis menyimpan data ke database dengan status awal **`unpaid`**.  
Setelah submit, frontend akan menampilkan **QR code dummy** untuk simulasi pembayaran.

**Flow:**

1. Customer isi form reservasi (nama, email, tanggal, jumlah tamu, dll).
2. Data dikirim → otomatis tersimpan di database dengan status `unpaid`.
3. Frontend menampilkan QR dummy untuk pembayaran.
4. Setelah klik tombol “Konfirmasi Pembayaran”, frontend memanggil endpoint `POST /reservation/confirm/:id`.

**Akses:** Public (tanpa login)

---

#### 🔹 `POST /reservation/confirm/:id`

**Deskripsi:**  
Digunakan untuk **mengonfirmasi pembayaran reservasi** setelah customer menekan tombol “Konfirmasi Pembayaran”.  
Endpoint ini akan mengubah status reservasi dari `unpaid` menjadi **`paid`** dan mengirimkan **invoice (dummy)** ke email customer yang diinput di form reservasi.

**Akses:** Public (tanpa login)

---

#### 🔹 `GET /reservation/`

**Deskripsi:**  
Mengambil semua data reservasi dari database.  
Hanya bisa diakses oleh **user internal yang login**.

**Akses:** Login Required (`AuthMiddleware()`)  
**Role:** Admin, Staff, Cashier

---

#### 🔹 `GET /reservation/:id`

**Deskripsi:**  
Mengambil detail reservasi berdasarkan ID tertentu.

**Akses:** Login Required (`AuthMiddleware()`)  
**Role:** Admin, Staff, Cashier

---

#### 🔹 `PUT /reservation/:id`

**Deskripsi:**  
Mengubah atau memperbarui data reservasi tertentu.  
Biasanya digunakan oleh **kasir** untuk mengubah status atau detail tambahan.

**Akses:** Login Required (`AuthMiddleware()`, `CashierMiddleware()`)  
**Role:** Cashier only

---

#### 🔹 `DELETE /reservation/:id`

**Deskripsi:**  
Menghapus (soft delete) data reservasi.  
Hanya bisa diakses oleh **admin**.

**Akses:** Login Required (`AuthMiddleware()`, `AdminMiddleware()`)  
**Role:** Admin only

---

### 🍽️ /table

**Method:** `POST`, `GET`

---

### 📋 /menu

**Method:** `POST`, `GET`

---

### 🔐 /auth

Endpoint ini punya sub-endpoint berikut:

- `/auth/login` → **POST** — buat login
- `/auth/profile` → **GET** — buat halaman profil user (gak dipake gak masalah)
- `/auth/check-login` → **GET** — buat cek siapa user yang sedang login
- `/auth/logout` → **POST** — buat logout

---

### 🧑‍💼 /admin

Endpoint ini khusus untuk **Admin**.  
Untuk mengakses endpoint ini, role yang login **wajib admin**.

**Sub-endpoint:**

- `/admin/register` → **POST** — buat create akun baru dari halaman dashboard admin.  
  Role yang bisa dipilih: `staff` & `cashier`.
- `/admin/users` → **GET** — buat cek list user yang terdaftar di database.
- `/admin/users/:id` → **GET** — buat cek user berdasarkan ID (contoh: `/admin/users/CAS-001`).
- `/admin/users/:id` → **PUT** — buat update password user.
- `/admin/users/:id` → **DELETE** — buat soft delete akun user.
- `/admin/dashboard` → **GET** — buat cek username admin (opsional).

---

> 🧩 **Catatan:**  
> Dokumentasi ini akan terus dilengkapi seiring berjalannya pengembangan project.

> Buka langsung di github biar baca dokumentasi ini lebih enak.
