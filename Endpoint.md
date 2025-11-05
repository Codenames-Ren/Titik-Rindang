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

Endpoint ini digunakan untuk **pengelolaan dan pemilihan meja** baik oleh pelanggan umum maupun user internal.  
Endpoint **tanpa middleware** bersifat **public** dan digunakan untuk **melihat daftar meja yang tersedia** serta **memilih nomor meja** pada saat reservasi atau dine-in.  
Sementara endpoint dengan middleware hanya dapat diakses oleh **user internal** yang sudah login sesuai rolenya.

---

#### 🔹 `GET /table/`

**Deskripsi:**  
Menampilkan semua data meja yang tersedia (termasuk yang sedang digunakan).  
Digunakan oleh frontend untuk menampilkan daftar meja kepada pelanggan saat melakukan pemesanan (reservasi/dine-in).

**Akses:** Public (tanpa login)

---

#### 🔹 `GET /table/:id`

**Deskripsi:**  
Mengambil detail satu meja berdasarkan ID-nya (misalnya nomor meja atau kode meja tertentu).  
Digunakan untuk menampilkan informasi spesifik meja yang dipilih customer.

**Akses:** Public (tanpa login)

---

#### 🔹 `POST /table/`

**Deskripsi:**  
Menambahkan data meja baru ke dalam sistem.  
Biasanya dilakukan oleh **user internal** (staff/admin) untuk menambah daftar meja di sistem.

**Akses:** Login Required (`AuthMiddleware()`)  
**Role:** Admin, Staff

---

#### 🔹 `PUT /table/:id`

**Deskripsi:**  
Memperbarui data meja, seperti status meja (tersedia, terisi, dibersihkan, dsb).  
Biasanya dilakukan oleh **kasir** atau staff yang bertanggung jawab terhadap meja.

**Akses:** Login Required (`AuthMiddleware()`, `CashierMiddleware()`)  
**Role:** Cashier only

---

#### 🔹 `DELETE /table/:id`

**Deskripsi:**  
Menghapus (soft delete) data meja dari sistem.  
Biasanya digunakan oleh **admin** untuk manajemen data meja yang sudah tidak aktif digunakan.

**Akses:** Login Required (`AuthMiddleware()`, `AdminMiddleware()`)  
**Role:** Admin only

---

### 📋 /menu

**Method:** `POST`, `GET`

Endpoint ini digunakan untuk **pengelolaan menu makanan dan minuman** di sistem.  
Endpoint **tanpa middleware** bersifat **public**, karena customer perlu bisa **melihat daftar menu yang tersedia** dan **memilih menu** saat melakukan pemesanan (dine-in via website).  
Endpoint dengan middleware hanya dapat diakses oleh **user internal dengan role admin**, karena hanya admin yang berwenang untuk menambah, mengubah, atau menghapus menu.

---

#### 🔹 `GET /menu/`

**Deskripsi:**  
Menampilkan semua menu yang tersedia di database.  
Digunakan oleh frontend agar pelanggan bisa melihat daftar makanan dan minuman yang tersedia di restoran.

**Akses:** Public (tanpa login)

---

#### 🔹 `GET /menu/:id`

**Deskripsi:**  
Mengambil detail satu menu berdasarkan ID-nya.  
Digunakan untuk menampilkan detail menu tertentu (misalnya deskripsi, harga, gambar, kategori, dll).

**Akses:** Public (tanpa login)

---

#### 🔹 `POST /menu/`

**Deskripsi:**  
Menambahkan menu baru ke dalam sistem.  
Hanya **admin** yang dapat menambah menu, karena menu baru biasanya dibuat lewat dashboard admin.

**Akses:** Login Required (`AuthMiddleware()`, `AdminMiddleware()`)  
**Role:** Admin only

---

#### 🔹 `PUT /menu/:id`

**Deskripsi:**  
Memperbarui data menu (seperti harga, stok, kategori, atau deskripsi).  
Biasanya digunakan untuk update menu yang sudah ada.

**Akses:** Login Required (`AuthMiddleware()`, `AdminMiddleware()`)  
**Role:** Admin only

---

#### 🔹 `DELETE /menu/:id`

**Deskripsi:**  
Menghapus (soft delete) menu dari sistem.  
Digunakan oleh **admin** jika ada menu yang sudah tidak dijual atau perlu diarsipkan.

**Akses:** Login Required (`AuthMiddleware()`, `AdminMiddleware()`)  
**Role:** Admin only

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

> 📘 **Tips:**  
> Buka langsung di GitHub biar baca dokumentasi ini lebih enak.
