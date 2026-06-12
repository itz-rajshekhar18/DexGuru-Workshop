# 🎓 DexGuru - AI for Teachers Workshop

A highly animated and engaging landing page for teacher AI training workshop. Features professional design with blue, yellow, and black color scheme, focusing on lesson planning, homework creation, slide making, and timetable management using AI.

## ✨ Features

### 🎨 Design & Animations
- **Color Scheme**: Blue (#3b82f6), Yellow (#fbbf24), Black (#000000)
- **20+ Custom Animations**: Gradient shifts, floating elements, fade-ins, slides, scales
- **Confetti Effect**: Celebration animation on form submission
- **Smooth Transitions**: All interactive elements with hover effects
- **Responsive Design**: Mobile-first, works on all devices
- **Animated Background**: Pulsing gradient orbs creating depth

### 📋 Content Sections

1. **Hero Section**
   - Eye-catching animated headline
   - Workshop info cards (Date, Time, Duration, Platform)
   - Price display with strike-through original price
   - Prominent CTA button

2. **Challenges Section**
   - 8 common teaching problems
   - Animated cards with icons
   - Hover effects on each challenge

3. **What You'll Learn**
   - 6 key learning modules
   - Animated feature cards
   - Icon-based visual hierarchy

4. **Target Audience**
   - 4 teacher personas
   - Circular icon design
   - Centered card layout

5. **Registration Form**
   - Full Name (required)
   - Email Address (required)
   - Phone Number (required)
   - School/Institution (optional)
   - City (optional)
   - Subject Taught (optional)
   - Teaching Experience (dropdown)
   - Loading state on submit
   - Success feedback with confetti

### 🎯 Workshop Focus

**Core Topics:**
- 📚 AI Lesson Planning
- 📝 Homework Generation
- 🎨 Professional Slide Creation
- 📅 Smart Timetable Management
- 📊 Assessment Creation
- ✨ AI Teaching Prompts

**Benefits:**
- Save hours of prep time
- Generate professional content instantly
- Personalize learning materials
- Streamline administrative tasks
- Master 50+ AI prompts for teachers

## 🚀 Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Build

```bash
npm run build
npm start
```

## 🎨 Animation List

### Entry Animations
- `animate-fade-in` - Fade in effect
- `animate-fade-in-up` - Fade in with upward movement
- `animate-slide-down` - Slide down from top
- `animate-slide-up` - Slide up from bottom
- `animate-slide-right` - Slide from left to right
- `animate-scale-in` - Scale up entrance

### Continuous Animations
- `animate-gradient-x` - Horizontal gradient animation
- `animate-pulse-slow` - Slow pulsing effect
- `animate-float` - Floating movement
- `animate-bounce-subtle` - Gentle bounce
- `animate-pulse-border` - Pulsing border/shadow

### Interaction Animations
- `hover:scale-105` - Scale on hover
- `hover:shadow-2xl` - Shadow on hover
- `focus:scale-[1.01]` - Subtle scale on focus
- Smooth color transitions on all elements

### Special Effects
- `animate-confetti-fall` - Confetti celebration
- Custom scrollbar (yellow themed)
- Smooth scroll behavior

## 📱 Responsive Breakpoints

```css
Mobile:  < 768px
Tablet:  768px - 1024px
Desktop: > 1024px
```

## 🎨 Color Palette

```css
/* Primary Colors */
Blue:    #3b82f6 (rgb(59, 130, 246))
Yellow:  #fbbf24 (rgb(251, 191, 36))
Black:   #000000 (rgb(0, 0, 0))

/* Secondary Colors */
Gray-900: #111827
Gray-700: #374151
Gray-400: #9ca3af

/* Accent Colors */
Red:   #ef4444 (for challenges)
Green: #10b981 (for success states)
```

## 🛠️ Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React (20+ education-focused icons)
- **Fonts**: Geist Sans & Geist Mono

## 📂 Project Structure

```
dexguru-workshop/
├── app/
│   ├── page.tsx          # Main animated landing page
│   ├── layout.tsx        # Root layout with metadata
│   ├── globals.css       # Custom animations & styles
│   └── favicon.ico       # Site icon
├── public/               # Static assets
├── package.json          # Dependencies
└── README.md            # This file
```

## 🎓 Target Audience

1. **School Teachers** - K-12 educators
2. **College Professors** - Higher education faculty
3. **Private Tutors** - Independent educators
4. **Education Leaders** - Principals, coordinators

## 💰 Pricing

- Regular Price: ~~₹1,487~~
- Workshop Price: **₹99**
- Duration: 3+ Hours
- Platform: Zoom (Online)
- Includes: Certificate, AI Prompts, Templates

## 🎯 Learning Outcomes

After this workshop, teachers will be able to:

1. ✅ Create lesson plans in minutes using AI
2. ✅ Generate custom homework assignments
3. ✅ Design professional presentations quickly
4. ✅ Optimize timetables with AI tools
5. ✅ Build quizzes and assessments automatically
6. ✅ Use 50+ AI prompts for daily teaching tasks

## 🔧 Customization

### Update Content
Edit `app/page.tsx` to modify:
- Workshop details (date, time, pricing)
- Challenge list
- Learning modules
- Form fields

### Modify Animations
Edit `app/globals.css` to adjust:
- Animation durations
- Easing functions
- Delay timings
- Colors and effects

### Add Features
Potential enhancements:
- Backend API integration
- Payment gateway
- Email notifications
- Admin dashboard
- Attendance tracking
- Recording access

## 🚀 Deployment

### Vercel (Recommended)
```bash
vercel
```

### Environment Variables (if needed)
```env
NEXT_PUBLIC_API_URL=your-api-url
NEXT_PUBLIC_PAYMENT_KEY=your-payment-key
```

## 📈 Performance

- **Fast Loading**: Optimized images and code splitting
- **SEO Friendly**: Proper metadata and semantic HTML
- **Accessibility**: Keyboard navigation and ARIA labels
- **Smooth Animations**: GPU-accelerated transforms

## 🎬 Animation Performance Tips

1. Use `transform` and `opacity` for animations (GPU-accelerated)
2. Avoid animating `width`, `height`, `left`, `right`
3. Use `will-change` sparingly
4. Implement intersection observers for scroll animations
5. Reduce motion for users with `prefers-reduced-motion`

## 📝 Form Handling

Currently uses client-side submission. To connect to backend:

```typescript
// In handleSubmit function
const response = await fetch('/api/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(formData)
});
```

## 🎯 Best Practices Implemented

- ✅ TypeScript for type safety
- ✅ Responsive design principles
- ✅ Accessible form labels and inputs
- ✅ Loading states for better UX
- ✅ Error handling
- ✅ Success feedback (confetti!)
- ✅ Smooth scroll to sections
- ✅ Optimized animations
- ✅ SEO-friendly metadata

## 📧 Support & Documentation

For questions or issues:
1. Check this README
2. Review animation CSS in `globals.css`
3. Inspect component structure in `page.tsx`

## 📄 License

This project is part of the DexGuru educational platform.

---

**Built for teachers, powered by AI** 🎓✨

Transform your teaching workflow with cutting-edge AI tools!
