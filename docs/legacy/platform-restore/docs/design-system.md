# KF13 Design System - Pastel Brutalist Fun

## Overview
Design system untuk KF13 (Klub Fisika Indonesia) yang menggabungkan **Pastel Colors**, **Brutalist Academic Typography**, dan **Fun Interactive Elements** untuk menciptakan identitas visual yang unik, memorable, dan sesuai dengan karakter komunitas fisika yang ilmiah namun approachable.

---

## Color Palette

### Primary Colors
```css
--primary: #a78bfa     /* Pastel Purple */
--secondary: #fbbf24   /* Pastel Yellow */
--accent: #34d399      /* Pastel Green */
--surface: #fef3c7     /* Cream */
--dark: #1f2937        /* Charcoal */
--pink: #f472b6        /* Pastel Pink */
--blue: #60a5fa        /* Pastel Blue */
```

### Usage Guidelines
- **Primary**: Hero sections, main CTAs
- **Secondary**: Highlights, important info boxes
- **Accent**: Success states, positive actions
- **Surface**: Background sections
- **Dark**: Text, borders, shadows
- **Pink/Blue**: Cards, secondary elements

---

## Typography - Brutalist Academic

### Font Stack
```css
font-family: 'Space Grotesk', 'Inter', sans-serif
```

### Hierarchy
```css
/* Headers - Bold & Uppercase */
h1: 3.5rem (56px) font-black uppercase tracking-tight
h2: 2.25rem (36px) font-black uppercase tracking-tight  
h3: 1.5rem (24px) font-bold uppercase

/* Body Text */
body: 1rem (16px) font-semibold
small: 0.875rem (14px) font-medium
```

### Characteristics
- **Weight**: 700-900 (bold to black)
- **Transform**: UPPERCASE for headers
- **Spacing**: Tight letter-spacing (-0.02em)
- **Style**: Academic, authoritative, playful

---

## Fun Brutalist Elements

### Geometric Shapes
```css
/* Hard Edges */
border-radius: 0px

/* Thick Borders */
border: 4px solid #1f2937

/* Hard Shadows */
box-shadow: 8px 8px 0px #1f2937
```

### Playful Transforms
```css
/* Tilted Elements */
transform: rotate(-2deg)   /* Left tilt */
transform: rotate(1deg)    /* Right tilt */
transform: rotate(2deg)    /* More dramatic */

/* Hover Effects */
hover:rotate-0             /* Straighten on hover */
hover:shadow-[2px_2px_0px_#1f2937]  /* Reduce shadow */
hover:translate-x-1 hover:translate-y-1  /* Move effect */
```

---

## Component Library

### Hero Section
```astro
<section class="bg-gradient-to-br from-purple-200 via-yellow-100 to-green-200 min-h-screen flex items-center">
  <div class="max-w-6xl mx-auto px-6">
    <h1 class="text-6xl font-black uppercase tracking-tight text-gray-900 transform -rotate-1">
      RUANG BERTUMBUH<br/>
      <span class="text-purple-500">FISIKA</span> INDONESIA
    </h1>
    <div class="bg-yellow-300 border-4 border-gray-900 p-6 transform rotate-1 shadow-[8px_8px_0px_#1f2937] mt-8">
      <p class="text-xl font-bold text-gray-900">
        Belajar • Eksperimen • Kolaborasi • Fun! 🧪⚡
      </p>
    </div>
  </div>
</section>
```

### Program Cards
```astro
<div class="bg-pink-200 border-4 border-gray-900 p-6 transform -rotate-2 hover:rotate-0 transition-transform shadow-[6px_6px_0px_#1f2937]">
  <div class="text-4xl mb-4">🔬</div>
  <h3 class="text-2xl font-black uppercase text-gray-900">EKSPERIMEN</h3>
  <p class="text-gray-700 font-semibold">Praktikum fisika yang seru dan aplikatif</p>
</div>
```

### Button Styles
```css
/* Primary CTA */
.btn-primary {
  @apply bg-green-300 border-4 border-gray-900 px-8 py-4 font-black uppercase text-gray-900 shadow-[4px_4px_0px_#1f2937] hover:shadow-[2px_2px_0px_#1f2937] hover:translate-x-1 hover:translate-y-1 transition-all;
}

/* Secondary Button */
.btn-secondary {
  @apply bg-blue-200 border-4 border-gray-900 px-6 py-3 font-bold uppercase text-gray-900 transform rotate-1 hover:rotate-0;
}
```

### Section Headers
```astro
<div class="bg-yellow-200 border-4 border-gray-900 p-4 transform -rotate-1 inline-block shadow-[6px_6px_0px_#1f2937]">
  <h2 class="text-3xl font-black uppercase text-gray-900 m-0">TENTANG KF13</h2>
</div>
```

---

## Animations & Interactions

### Wobble Effect
```css
@keyframes wobble {
  0%, 100% { transform: rotate(-2deg); }
  50% { transform: rotate(2deg); }
}

.wobble:hover {
  animation: wobble 0.5s ease-in-out;
}
```

### Bounce CTA
```css
@keyframes bounce-fun {
  0%, 100% { transform: translateY(0px) rotate(-1deg); }
  50% { transform: translateY(-10px) rotate(1deg); }
}
```

### Hover Transitions
```css
/* Standard hover */
transition: all 0.3s ease

/* Transform hover */
hover:scale-105
hover:rotate-0
hover:-translate-y-1
```

---

## Scientific Fun Icons

### Emoji Set
```
🧪 ⚡ 🔬 🧬 ⚛️ 🚀 💡 🎯 📊 🔭 ⚗️ 🧮
```

### Icon Containers
```astro
<div class="w-16 h-16 bg-purple-300 border-4 border-gray-900 flex items-center justify-center text-2xl transform rotate-12">
  🧪
</div>
```

---

## Design Philosophy

### Core Philosophy: "Serious Fun Science"
KF13 design system dibangun atas filosofi bahwa **sains itu serius tapi tidak kaku**, **akademik tapi tidak menakutkan**, dan **profesional tapi tetap menyenangkan**.

### Design Principles

#### 1. **Asymmetrical Balance** - "Chaos in Order"
- Elemen tidak selalu center-aligned
- Mencerminkan sifat eksperimen: terstruktur tapi fleksibel
- Rotasi dan positioning yang tidak predictable
- Balance melalui visual weight, bukan symmetry

#### 2. **Layered Depth** - "Scientific Stratification" 
- Multiple shadows & borders untuk dimensi
- Seperti lapisan dalam penelitian: surface → analysis → insight
- Hard shadows = definitive conclusions
- Soft backgrounds = hypothesis space

#### 3. **Playful Hierarchy** - "Eureka Moments"
- Size + rotation untuk emphasis
- Bigger = more important (seperti breakthrough discoveries)
- Tilted elements = "aha!" moments yang unexpected
- Typography weight = confidence level

#### 4. **Color Blocking** - "Lab Safety Meets Creativity"
- Pastel backgrounds dengan dark borders
- Soft colors = safe learning environment  
- Hard borders = clear boundaries & structure
- Scientific precision with creative freedom

#### 5. **Academic Brutalism** - "Bold Knowledge"
- Bold typography + geometric shapes
- Knowledge should be stated clearly, not whispered
- Academic authority with approachable delivery
- Brutalist = uncompromising pursuit of truth

### Extended Philosophy

#### 6. **Imperfect Perfection** - "Human Science"
- Slight rotations = human touch in scientific precision
- Not everything needs to be pixel-perfect
- Embracing the "messy" part of learning
- Perfection through iteration, not initial attempt

#### 7. **Emotional Accessibility** - "Science for Everyone"
- Pastel colors reduce intimidation factor
- Fun elements lower barriers to entry
- Academic rigor without academic elitism
- Making complex concepts feel approachable

#### 8. **Progressive Disclosure** - "Layer by Layer Discovery"
- Information revealed through interaction
- Hover states = deeper investigation
- Cards = individual experiments/concepts
- Journey from curiosity → understanding → mastery

#### 9. **Kinetic Learning** - "Physics in Motion"
- Animations reflect physics principles
- Hover effects = action/reaction
- Transforms = energy states
- Transitions = momentum and inertia

#### 10. **Collaborative Geometry** - "Shapes Working Together"
- Different rotations = different perspectives
- Grid system = structured collaboration
- Overlapping elements = knowledge intersection
- Geometric diversity = team diversity

### Psychological Design Intent

#### **Cognitive Load Management**
- Bold typography = easy scanning
- Color coding = quick categorization  
- Spacing = mental breathing room
- Hierarchy = clear information flow

#### **Motivation Psychology**
- Bright colors = positive association with learning
- Playful elements = intrinsic motivation
- Achievement indicators = progress feedback
- Social proof through community elements

#### **Learning Theory Application**
- Visual variety = multiple learning styles
- Interactive elements = active learning
- Progressive complexity = scaffolded learning
- Immediate feedback through hover states

### Cultural Philosophy

#### **Indonesian Academic Culture**
- Respectful but not rigid (slight tilts vs perfect alignment)
- Community-oriented (overlapping elements)
- Innovation within tradition (brutalist + pastel)
- Accessible excellence (academic + fun)

#### **Generation Z Design Language**
- Bold, unapologetic statements
- Authentic imperfection over sterile perfection
- Interactive and engaging
- Visually rich but meaningful

### Technical Philosophy

#### **Performance-First Fun**
- CSS-only animations (no heavy JS)
- Semantic HTML structure
- Accessible color contrasts
- Mobile-first responsive design

#### **Maintainable Creativity**
- Systematic approach to "random" rotations
- Consistent inconsistency rules
- Scalable component architecture
- Design token-based implementation

### Grid System
```css
/* 8px Base Unit */
gap: 0.5rem (8px)
gap: 1rem (16px)
gap: 1.5rem (24px)
gap: 2rem (32px)

/* Responsive Grid */
grid-cols-1 md:grid-cols-2 lg:grid-cols-3
```

### Spacing Scale
```css
xs: 0.5rem (8px)
sm: 1rem (16px)
md: 1.5rem (24px)
lg: 2rem (32px)
xl: 3rem (48px)
2xl: 4rem (64px)
```

---

## Implementation Guidelines

### Tailwind Config
```js
theme: {
  extend: {
    colors: {
      primary: '#a78bfa',
      secondary: '#fbbf24',
      accent: '#34d399',
      surface: '#fef3c7',
      dark: '#1f2937'
    },
    fontFamily: {
      sans: ['Space Grotesk', 'Inter', 'system-ui']
    },
    boxShadow: {
      'brutal': '8px 8px 0px #1f2937',
      'brutal-sm': '4px 4px 0px #1f2937',
      'brutal-hover': '2px 2px 0px #1f2937'
    }
  }
}
```

### Component Structure
```astro
---
// Component-based approach
import Hero from '../components/Hero.astro'
import ProgramGrid from '../components/ProgramGrid.astro'
import CTASection from '../components/CTASection.astro'
---

<Layout>
  <Hero />
  <ProgramGrid />
  <CTASection />
</Layout>
```

---

## Brand Consistency

### Do's
✅ Use bold, uppercase typography for headers  
✅ Apply tilted transforms to create playfulness  
✅ Combine pastel backgrounds with dark borders  
✅ Use scientific emojis for visual interest  
✅ Maintain 4px border thickness  
✅ Apply hard shadows consistently  

### Don'ts
❌ Use rounded corners (keep brutalist edges)  
❌ Mix too many rotation angles  
❌ Use thin or light typography  
❌ Apply subtle or soft shadows  
❌ Overcrowd with too many colors  
❌ Use generic stock imagery  

---

## Accessibility Notes

- **Contrast**: Dark text on pastel backgrounds ensures readability
- **Focus States**: Maintain visible focus indicators
- **Motion**: Provide reduced motion alternatives
- **Text Size**: Minimum 16px for body text
- **Color**: Don't rely solely on color for information

---

---

## Micro-Interaction Philosophy

### **Physics-Inspired Interactions**
```css
/* Gravity Effect */
.card:hover {
  transform: translateY(-8px) rotate(0deg);
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* Momentum Conservation */
.button:active {
  transform: scale(0.95) translateX(2px) translateY(2px);
  box-shadow: 2px 2px 0px #1f2937;
}

/* Wave Propagation */
@keyframes ripple {
  0% { transform: scale(0) rotate(0deg); opacity: 1; }
  100% { transform: scale(4) rotate(180deg); opacity: 0; }
}
```

### **Emotional State Mapping**
- **Curiosity**: Slight hover lift + rotation straightening
- **Discovery**: Color shift from pastel to vibrant
- **Achievement**: Bounce animation + scale increase
- **Collaboration**: Elements moving toward each other
- **Focus**: Background blur + element sharpening

---

## Content Philosophy

### **Scientific Storytelling**
- **Hypothesis**: Section introductions pose questions
- **Method**: Step-by-step program explanations  
- **Results**: Achievement showcases
- **Conclusion**: Clear call-to-actions
- **Peer Review**: Testimonials and community feedback

### **Information Architecture**
```
Curiosity (Hero) 
    ↓
Understanding (About)
    ↓  
Application (Programs)
    ↓
Community (Team/Social Proof)
    ↓
Action (CTA)
```

---

## Accessibility Philosophy

### **Inclusive Science**
- **Cognitive**: Clear hierarchy, consistent patterns
- **Visual**: High contrast, scalable text, color alternatives
- **Motor**: Large touch targets, forgiving interactions
- **Auditory**: Visual feedback for all audio cues

### **Universal Design Principles**
1. **Equitable Use**: Design works for diverse abilities
2. **Flexibility**: Multiple ways to interact
3. **Simple & Intuitive**: Clear mental models
4. **Perceptible Information**: Multi-sensory feedback
5. **Tolerance for Error**: Forgiving interactions
6. **Low Physical Effort**: Efficient interactions
7. **Size & Space**: Appropriate for all users

### **WCAG 2.1 AA Compliance**

#### **Color & Contrast**
```css
/* Minimum contrast ratios */
--contrast-normal: 4.5:1    /* Normal text */
--contrast-large: 3:1       /* Large text (18pt+) */
--contrast-ui: 3:1          /* UI components */

/* Color-blind friendly palette */
--color-primary: #a78bfa    /* Purple - safe */
--color-secondary: #fbbf24  /* Yellow - high contrast */
--color-accent: #34d399     /* Green - distinguishable */
--color-error: #ef4444      /* Red alternative */
```

#### **Typography Accessibility**
```css
/* Readable font sizes */
--text-xs: 0.75rem (12px)   /* Minimum for UI */
--text-sm: 0.875rem (14px)  /* Small text */
--text-base: 1rem (16px)    /* Body minimum */
--text-lg: 1.125rem (18px)  /* Large text threshold */

/* Line height for readability */
--leading-relaxed: 1.625    /* Body text */
--leading-loose: 2          /* Dense content */
```

#### **Interactive Elements**
```css
/* Touch targets (minimum 44x44px) */
.btn-brutal {
  min-height: 44px;
  min-width: 44px;
  padding: 12px 16px;
}

/* Focus indicators */
.btn-brutal:focus {
  outline: 3px solid var(--color-accent);
  outline-offset: 2px;
}

/* Hover states for non-touch devices */
@media (hover: hover) {
  .btn-brutal:hover {
    transform: translateX(1px) translateY(1px);
  }
}
```

#### **Motion & Animation**
```css
/* Respect reduced motion preference */
@media (prefers-reduced-motion: reduce) {
  .wobble:hover,
  .bounce-fun,
  * {
    animation: none !important;
    transition: none !important;
  }
}

/* Safe animation durations */
--duration-fast: 0.15s
--duration-normal: 0.3s
--duration-slow: 0.5s
```

---

## Dark Mode Implementation

### **CSS-First Dark Mode Setup**
```css
@import "tailwindcss";

/* Define dark mode variant */
@variant dark (&:where(.dark, .dark *));

@theme {
  /* Light mode colors */
  --color-primary: #a78bfa;
  --color-secondary: #fbbf24;
  --color-accent: #34d399;
  --color-surface: #fef3c7;
  --color-dark: #1f2937;
  
  /* Dark mode colors */
  --color-primary-dark: #c4b5fd;
  --color-secondary-dark: #fcd34d;
  --color-accent-dark: #6ee7b7;
  --color-surface-dark: #111827;
  --color-light: #f9fafb;
}

/* Dark mode styles */
.dark {
  --color-bg: var(--color-surface-dark);
  --color-text: var(--color-light);
  --color-border: #374151;
}
```

### **Dark Mode Component Examples**
```astro
<!-- Hero Section with Dark Mode -->
<section class="bg-gradient-to-br from-purple-200 via-yellow-100 to-green-200 
                dark:from-purple-900 dark:via-yellow-900 dark:to-green-900">
  <h1 class="text-dark dark:text-light">RUANG BERTUMBUH FISIKA</h1>
</section>

<!-- Cards with Dark Mode -->
<div class="bg-pink border-4 border-dark 
            dark:bg-purple-800 dark:border-light">
  <h3 class="text-dark dark:text-light">EKSPERIMEN</h3>
</div>

<!-- Buttons with Dark Mode -->
<button class="bg-accent text-dark 
               dark:bg-accent-dark dark:text-surface-dark">
  GABUNG KF13
</button>
```

### **Dark Mode Toggle Component**
```astro
---
// src/components/ui/DarkModeToggle.astro
---
<button id="theme-toggle" class="btn-brutal bg-secondary text-dark p-3" aria-label="Toggle dark mode">
  <!-- Sun icon (light mode) -->
  <svg class="h-6 w-6 dark:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
  </svg>
  
  <!-- Moon icon (dark mode) -->
  <svg class="hidden h-6 w-6 dark:inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
          d="M20.354 15.354A9 9 0 018.646 3.646 5.001 5.001 0 0117 12a5.001 5.001 0 013.354 3.354z"/>
  </svg>
</button>

<script>
document.getElementById('theme-toggle')?.addEventListener('click', () => {
  const html = document.documentElement;
  const isDark = html.classList.contains('dark');
  
  if (isDark) {
    html.classList.remove('dark');
    localStorage.theme = 'light';
  } else {
    html.classList.add('dark');
    localStorage.theme = 'dark';
  }
});

// Initialize theme on page load
const initTheme = () => {
  if (localStorage.theme === 'dark' || 
      (!localStorage.theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
  }
};

initTheme();
</script>
```

### **Layout with Dark Mode Support**
```astro
---
// src/layouts/Layout.astro
import '../styles/design-system.css';
---
<html lang="id">
  <head>
    <script is:inline>
      // Prevent FOUC (Flash of Unstyled Content)
      if (localStorage.theme === 'dark' || 
          (!localStorage.theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
      }
    </script>
  </head>
  <body class="bg-surface dark:bg-surface-dark text-dark dark:text-light transition-colors">
    <slot />
  </body>
</html>
```

---

## WCAG Testing Checklist

### **Level A Requirements**
- [ ] All images have alt text
- [ ] Headings are properly structured (H1→H2→H3)
- [ ] Links have descriptive text
- [ ] Color is not the only way to convey information

### **Level AA Requirements**
- [ ] Contrast ratio ≥ 4.5:1 for normal text
- [ ] Contrast ratio ≥ 3:1 for large text
- [ ] Text can be resized up to 200% without loss of functionality
- [ ] Focus indicators are visible
- [ ] Touch targets are at least 44x44px

### **Testing Tools**
- **axe-core** - Automated accessibility testing
- **WAVE** - Web accessibility evaluation
- **Lighthouse** - Built-in Chrome accessibility audit
- **Color Oracle** - Color blindness simulator

---

## Responsive Dark Mode Tokens

### **System Preference Integration**
```css
@media (prefers-color-scheme: dark) {
  :root:not(.light) {
    --color-bg: var(--color-surface-dark);
    --color-text: var(--color-light);
  }
}

@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### **High Contrast Mode Support**
```css
@media (prefers-contrast: high) {
  :root {
    --color-primary: #000000;
    --color-secondary: #ffffff;
    --shadow-brutal: 4px 4px 0px #000000;
  }
}
```

---

## Future Evolution Philosophy

### **Adaptive Design System**
- Components evolve based on user feedback
- A/B testing for interaction patterns
- Seasonal color palette variations
- Community-contributed component library

### **Scalability Mindset**
- Design tokens for easy theme switching
- Component composition over customization
- Progressive enhancement approach
- Mobile-first, desktop-enhanced

---

**Philosophy Summary**: 
*"KF13 design system embodies the spirit of scientific inquiry - bold enough to make statements, flexible enough to adapt, and human enough to inspire."*
