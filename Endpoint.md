Dokumentasi endpoint backend

- Endpoint ditulis langsung tanpa awalan domain seperti localhost:8080 contoh penulisannya : /reservation
  jadi bagian frontend dapat langsung menggunakan enpoint dengan menuliskannya seperti contoh

List Endpoint :

- /reservation
  Method : Post, Get

- /table
  Method: Post, Get

- /menu
  Method: Post, Get

- /auth \*endpoint ini punya sub endpoint sbb :

  - /auth/login - Method Post buat login
  - /auth/profile - Method Get buat halaman profile user (gak dipake gak masalah)
  - /auth/check-login - Method Get buat cek user mana yang login
  - /auth/logout - Method Post buat logout

- /admin - Endpoint milik admin, buat akses endpoint ini role yang login wajib admin dan ini punya sub endpoint.
- /admin/register - Method Post buat create akun baru dari halaman dashboard admin, role yang bisa dipilih staff & cashier.
- /admin/users - buat cek list user yang terdaftar di database, Method Get.
- /admin/users/id(misal CAS-001) - buat cek user yang terdaftar berdasarkan ID, Method Get.
- /admin/users/id - Method PUT, buat update password users.
- /admin/users/id - Method Delete, buat delete akun users secara soft delete.
- /admin/dashboard - Method get, kalo gak dipake gak masalah, cuma buat cek username adminnya siapa.

\*Akan segera dilengkapi seiring berjalannya project ini.

//Ada Update di logic reservations tapi dokumentasinya nyusul ntar
