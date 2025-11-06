# 🧭 Dokumentasi Endpoint Backend

> Semua endpoint ditulis **tanpa awalan domain** seperti `localhost:8080`, contoh penulisannya:  
> `/reservation`  
> Jadi bagian frontend dapat langsung menggunakan endpoint dengan menuliskannya seperti contoh tersebut.

---

## 📚 List Endpoint

---

### 🧾 /reservation

**Method:** `POST`, `GET`  
Digunakan untuk sistem **reservasi pelanggan** (public) dan **akses internal** (admin/staff/cashier).

---

#### 🔹 `POST /reservation`

Membuat reservasi baru tanpa login.  
Status awal: `unpaid`.

**Akses:** Public

---

#### 🔹 `POST /reservation/confirm/:id`

Konfirmasi pembayaran → status berubah menjadi `paid`.  
Mengirim invoice dummy ke email.

**Akses:** Public

---

#### 🔹 `GET /reservation/`

Mengambil semua reservasi.

**Akses:** Login Required  
**Role:** Admin, Staff, Cashier

---

#### 🔹 `GET /reservation/:id`

Detail reservasi.

**Akses:** Login Required  
**Role:** Admin, Staff, Cashier

---

#### 🔹 `PUT /reservation/:id`

Update reservasi (status/pindah meja).

**Akses:** Login Required  
**Role:** Cashier only

---

#### 🔹 `DELETE /reservation/:id`

Hapus reservasi.

**Akses:** Login Required  
**Role:** Admin only

---

---

### 🍽️ /table

Digunakan untuk pengelolaan meja.

---

#### 🔹 `GET /table/`

Semua data meja.

**Akses:** Public

---

#### 🔹 `GET /table/:id`

Detail meja.

**Akses:** Public

---

#### 🔹 `POST /table/`

Tambah meja baru.

**Akses:** Login Required  
**Role:** Admin, Staff

---

#### 🔹 `PUT /table/:id`

Update status meja.

**Akses:** Login Required  
**Role:** Cashier only

---

#### 🔹 `DELETE /table/:id`

Hapus meja.

**Akses:** Login Required  
**Role:** Admin only

---

---

### 📋 /menu

Digunakan untuk menampilkan & mengelola menu.

---

#### 🔹 `GET /menu/`

Semua menu.

**Akses:** Public

---

#### 🔹 `GET /menu/:id`

Detail menu.

**Akses:** Public

---

#### 🔹 `POST /menu/`

Tambah menu baru.

**Akses:** Login Required  
**Role:** Admin only

---

#### 🔹 `PUT /menu/:id`

Update menu.

**Akses:** Login Required  
**Role:** Admin only

---

#### 🔹 `DELETE /menu/:id`

Hapus menu.

**Akses:** Login Required  
**Role:** Admin only

---

---

### 🔐 /auth

- `POST /auth/login`
- `GET /auth/profile`
- `GET /auth/check-login`
- `POST /auth/logout`

---

---

### 🧑‍💼 /admin

Endpoint khusus admin.

**Sub-endpoint:**

- `POST /admin/register`
- `GET /admin/users`
- `GET /admin/users/:id`
- `PUT /admin/users/:id`
- `DELETE /admin/users/:id`
- `GET /admin/dashboard`

---

---

### 🍱 /order

Endpoint untuk sistem **pemesanan menu dine-in**.  
Public endpoint digunakan oleh customer, endpoint lain hanya untuk user internal.

---

## ✅ Public Endpoint (Tanpa Login)

#### 🔹 `POST /order/`

Customer membuat order dine-in.

**Contoh body:**

```json
{
  "table_id": 2,
  "customer": "Kisaki",
  "items": [
    { "menu_id": 1, "qty": 2 },
    { "menu_id": 3, "qty": 1 }
  ]
}
```

**Akses:** Public

---

#### 🔹 `PUT /order/:id/confirm`

Customer mengonfirmasi pembayaran order.  
Status berubah dari `unpaid` → `paid`.

**Akses:** Public

---

## 🔐 Endpoint Internal (Login Required)

#### 🔹 `GET /order/`

Semua order beserta item & menu.

**Akses:** Login Required  
**Role:** Admin, Staff, Cashier

---

#### 🔹 `GET /order/:id`

Detail order lengkap.

**Akses:** Login Required  
**Role:** Admin, Staff, Cashier

---

#### 🔹 `GET /order/:id/receipt`

Generate PDF struk pembelian.  
File disimpan otomatis ke:

```
src/uploads/receipts/receipt_{id}.pdf
```

**Akses:** Login Required  
**Role:** Admin, Staff, Cashier

---

## 🗑️ Admin Only

#### 🔹 `DELETE /order/:id`

Menghapus order + semua itemnya.

**Akses:** Login Required  
**Role:** Admin only

---

---

## 🧩 Catatan

Dokumentasi ini akan diperbarui seiring pengembangan project.

## 📘 Tips

Buka langsung di GitHub agar lebih mudah dibaca.
