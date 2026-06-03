# 🔘 Panduan Tombol Landing Page KF13

## **Navigation Buttons (Header)**

### Desktop Menu:
- **"Tentang"** → Scroll smooth ke section About (#tentang)
- **"Program"** → Scroll smooth ke section Programs (#program)  
- **"Galeri"** → Scroll smooth ke section Gallery (#galeri)
- **"FAQ"** → Scroll smooth ke section FAQ (#faq)
- **"Gabung"** → Scroll smooth ke section CTA (#gabung)

### Mobile Menu:
- **☰ (Hamburger)** → Toggle show/hide mobile navigation
- Same menu items as desktop

---

## **Hero Section Buttons**

- **"🚀 GABUNG KF13"** 
  - Action: Scroll ke CTA section (#gabung)
  - Animation: bounce-fun
  
- **"📚 LIHAT PROGRAM"**
  - Action: Scroll ke Programs section (#program)
  - Animation: rotate on hover

---

## **CTA Section Buttons**

- **"🚀 DAFTAR SEKARANG"** (Primary CTA)
  - Action: External link ke `http://47.84.35.77/wp/portal/?fcom_action=auth`
  - Purpose: Registration portal
  - Animation: bounce-fun
  
- **"💬 HUBUNGI KAMI"** (Secondary CTA)
  - Action: Scroll ke Footer/Contact section (#kontak)
  - Purpose: Contact information

---

## **Utility Buttons**

- **🌙/☀️ Dark Mode Toggle** (Fixed top-right)
  - Action: Toggle between light/dark theme
  - Persistence: Saves to localStorage
  - Respects: System preference on first visit

---

## **Interactive Elements**

### Cards (Hover Effects):
- **Program Cards** → Rotate to 0° on hover
- **FAQ Cards** → Rotate to 0° on hover  
- **Gallery Cards** → Rotate to 0° on hover
- **Value Cards** → Rotate to 0° on hover

### Floating Elements:
- **⚛️ Atom Icon** → Wobble animation
- **🔭 Telescope Icon** → Wobble animation

---

## **🔧 Troubleshooting**

### Jika tombol tidak berfungsi:

1. **Navigation tidak scroll smooth:**
   - Check console untuk JavaScript errors
   - Pastikan section IDs match dengan href

2. **Mobile menu tidak toggle:**
   - Check JavaScript console
   - Pastikan DOM loaded

3. **Dark mode tidak persist:**
   - Check localStorage support
   - Clear browser cache

4. **External link tidak buka:**
   - Check network connection
   - Pastikan URL accessible

---

## **📱 Expected Behavior**

### Desktop:
- Smooth scroll dengan offset untuk fixed nav
- Hover effects pada semua interactive elements
- Dark mode toggle works instantly

### Mobile:
- Touch-friendly button sizes (44x44px minimum)
- Mobile menu collapses after navigation
- Smooth scroll dengan proper offset

---

## **🎯 Button States**

### Normal State:
- Brutalist borders (4px solid)
- Bold typography
- Proper contrast ratios

### Hover State:
- Transform effects (translate, rotate)
- Shadow changes
- Color transitions

### Focus State:
- Visible outline (3px solid accent)
- Keyboard navigation support
- Screen reader friendly

### Active State:
- Scale down (0.95)
- Shadow reduction
- Immediate feedback

---

**Status**: All buttons should be functional
**Last Updated**: December 24, 2025
