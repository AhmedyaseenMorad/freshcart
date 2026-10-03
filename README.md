# FreshCart 🛒

متجر إلكتروني متكامل مبني بـ **Next.js 16** و **React 19**.

## 🔗 الديمو
https://freshcart-dun-nine.vercel.app


## ✨ المميزات

| الميزة | الوصف |
|---|---|
| 🌙 **الوضع الداكن** | زرار تبديل (لايت/دارك) بيتحفظ في `localStorage`، بيشتغل قبل رسم الصفحة من غير وميض أبيض (No FOUC) |
| 🔎 **سيرش ذكي** | بحث في اسم المنتج أو الماركة أو الكاتيجوري — شغال client-side لأن الـ API الرسمي بيرجع صفر نتايج للبحث |
| 🛒 **سلة تسوق** | مربوطة بالـ API: إضافة/تعديل/حذف + كوبون خصم + حساب الإجمالي |
| ❤️ **المفضلة** | إضافة وحذف المنتجات من قائمة المفضلة |
| 💳 **الدفع أونلاين** | Stripe checkout session + الدفع كاش عند الاستلام |
| 🖼️ **معرض صور** | `react-image-gallery` مع صور مصغّرة وملء الشاشة |
| 🎠 **سلايدر** | `swiper` للبانر الرئيسي مع pagination |
| 📄 **19 صفحة** | الرئيسية، المنتجات، التصنيفات، البراندز، العروض، السلة، الدفع، الحساب، الطلبات، التواصل… |
| 🔐 **مصادقة** | تسجيل / دخول / استعادة كلمة المرور + حماية صفحات |
| 📱 **متجاوب** | من غير أي media query — تصميم Mobile-first كامل |

---

## 🛠️ التقنيات

```
Next.js 16 (App Router + Turbopack)
React 19
TypeScript
Tailwind CSS v4
React Hot Toast        ← التنبيهات
Swiper                ← السلايدر
React Image Gallery   ← معرض الصور
FontAwesome 7         ← الأيقونات
```

---

## 🚀 التشغيل

### المتطلبات
- **Node.js 20** أو أحدث
- **npm**

### الخطوات

```bash
# 1. تنزيل الحزم
npm install

# 2. تشغيل سيرفر التطوير
npm run dev
```

### أوامر تانية

```bash
npm run build      # نسخة الإنتاج
npm run start      # تشغيل نسخة الإنتاج
npm run lint       # فحص الكود
npx tsc --noEmit   # فحص الأنواع
```

---

## 🗂️ هيكل المشروع

```
src/
├── app/
│   ├── page.tsx           # الرئيسية
│   ├── products/          # المنتجات + صفحة المنتج
│   ├── categories/        # التصنيفات
│   ├── brands/            # البراندز
│   ├── deals/             # العروض
│   ├── cart/              # السلة
│   ├── checkout/          # الدفع
│   ├── login/ register/   # المصادقة
│   ├── profile/           # الحساب + الطلبات
│   └── globals.css        # الألوان والتايبزينج
├── components/            # الهيدر، الفوتر،等产品، إلخ
└── lib/
    ├── api.ts             # طبقة الاتصال بالـ API
    ├── store.tsx          # الحالة العامة + التنبيهات
    └── types.ts           # أنواع TypeScript
```

---

## 👤 المؤلف

**AhmedyaseenMorad** — [github.com/AhmedyaseenMorad](https://github.com/AhmedyaseenMorad)
