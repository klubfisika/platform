# Favicon & PWA Icons Setup untuk KF13

## 📋 Yang Sudah Dibuat:

### 1. **PWA Manifest** (`/public/manifest.json`)
- App name: "KF13 - Klub Fisika Indonesia"
- Theme color: `#a78bfa` (primary purple)
- Background: `#fef3c7` (surface cream)
- Standalone display mode
- Portrait orientation

### 2. **Updated BaseHead.astro**
- Simplified favicon links
- PWA manifest integration
- KF13 theme colors

## 🎯 Icons yang Dibutuhkan:

Untuk menggunakan logo KF13 dari `https://avatars.githubusercontent.com/u/214426482?v=4`, Anda perlu:

### **Manual Steps:**
1. **Download logo** dari GitHub
2. **Resize ke berbagai ukuran:**
   - `favicon-16x16.png` (16x16px)
   - `favicon-32x32.png` (32x32px) 
   - `apple-touch-icon.png` (180x180px)
   - `icon-192x192.png` (192x192px)
   - `icon-512x512.png` (512x512px)

3. **Replace files** di `/public/` folder

### **Tools Rekomendasi:**
- **Online**: [Favicon.io](https://favicon.io/) - Upload logo, auto generate semua ukuran
- **CLI**: `sharp-cli` untuk batch resize
- **Design**: Figma/Canva untuk manual editing

## 🚀 PWA Benefits (Future):

Meskipun tidak urgent sekarang, PWA memberikan:
- **Install prompt** - Users bisa "install" website
- **Offline capability** - Dengan service worker
- **Native app feel** - Fullscreen, splash screen
- **Better engagement** - Push notifications
- **App store distribution** - Via TWA (Trusted Web Activity)

## 📱 Current Status:

✅ **Manifest ready** - PWA structure siap  
⏳ **Icons needed** - Perlu replace dengan logo KF13  
⏳ **Service Worker** - Optional untuk offline support  

Untuk sekarang, favicon basic sudah cukup. PWA bisa ditambahkan nanti saat traffic meningkat!
