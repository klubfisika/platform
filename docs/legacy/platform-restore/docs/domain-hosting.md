# Domain & Hosting

## Domain Strategy

KF13 menggunakan beberapa domain untuk keperluan berbeda:

| Domain | Tujuan | Status |
|--------|--------|--------|
| `klubfisika.github.io` | Demo & Development | ✅ Aktif |
| `klubfisika.or.id` | Domain Indonesia (TLD .id) | ✅ CNAME |
| `klubfisika.org` | Domain Global | 🔜 Planned |

## Penjelasan

### klubfisika.github.io
- Hosting utama di GitHub Pages
- Digunakan untuk demo dan development
- URL yang ditampilkan saat presentasi/demo ke pengguna awam

### klubfisika.or.id
- Domain dengan TLD Indonesia (.or.id)
- Subdomain dari registrar .id
- Sesuai untuk lembaga berbadan hukum yayasan/komunitas di Indonesia
- Dikelola oleh **Yayasan Keluarga Fisika**
- CNAME pointing ke GitHub Pages

### klubfisika.org
- Domain global dengan TLD .org
- Cocok untuk organisasi non-profit/komunitas
- Direncanakan untuk penggunaan internasional

## Dasar Hukum

> Lembaga ini dibangun atas dasar hukum **yayasan dan komunitas**, sehingga menggunakan TLD `.or.id` (Indonesia) dan `.org` (global) yang sesuai untuk organisasi non-profit.

**Badan Hukum:** Yayasan Keluarga Fisika

## Konfigurasi

### CNAME (public/CNAME)
```
klubfisika.or.id
```

### Penggunaan di Kode

Untuk URL yang ditampilkan ke user (share link, dll), gunakan domain sesuai environment:

```typescript
// Development/Demo
const BASE_URL = 'klubfisika.github.io';

// Production Indonesia
const BASE_URL = 'klubfisika.or.id';

// Production Global
const BASE_URL = 'klubfisika.org';
```

### Contoh Share URL

```
Demo:       klubfisika.github.io/u/username
Indonesia:  klubfisika.or.id/u/username
Global:     klubfisika.org/u/username
```

## Catatan untuk Developer

1. Saat development, selalu gunakan `klubfisika.github.io`
2. Jangan hardcode domain production di kode
3. CNAME file tidak perlu diubah kecuali ada perubahan DNS
4. Untuk demo ke pengguna awam, gunakan `klubfisika.github.io` agar tidak membingungkan
