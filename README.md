# FreshCart 🛒

متجر إلكتروني متكامل مبني بـ **Next.js 16** و **React 19**، متصل مباشرة بــ [Route E-commerce API](https://ecommerce.routemisr.com).

المشروع بياخد تصميمه من الديمو الأصلي [freshcart-route.vercel.app](https://freshcart-route.vercel.app)، مع دعم كامل للغة الإنجليزية (LTR) والوضع الداكن.

---

## 🔗 الديمو

> **TODO:** حط هنا لينك الديمو بعد النشر
>
> ```text
> https://freshcart-xxxx.vercel.app
> ```

---

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

## 🔌 الـ API

المشروع كله معتمد على [Route Academy E-commerce API](https://ecommerce.routemisr.com/api/v1) — مافيش backend خاص.

| الميزة | الـ Endpoint |
|---|---|
| المنتجات | `GET /api/v1/products` |
| التصنيفات | `GET /api/v1/categories` |
| البراندز | `GET /api/v1/brands` |
| تسجيل / دخول | `POST /api/v1/auth/signup` · `POST /api/v1/auth/signin` |
| السلة | `/api/v2/cart` |
| الدفع أونلاين | `POST /api/v1/orders/checkout-session/:cartId` |
| الدفع كاش | `POST /api/v2/orders/:cartId` |

> **ملحوظة مهمة:** التوكن بيخزن في `localStorage` تحت المفتاح `fc_token` — مش في أي متغيرات بيئة، فمفيش حاجة تعملها `.env`.

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
├── components/            # الهيدر، الفوتر،等产品، الفوتر، إلخ
└── lib/
    ├── api.ts             # طبقة الاتصال بالـ API
    ├── store.tsx          # الحالة العامة + التنبيهات
    └── types.ts           # أنواع TypeScript
```

---

## 🚀 النشر

الأسهل عن طريق [Vercel](https://vercel.com/new):

1. افتح <https://vercel.com/new>
2. اضغط **Continue with GitHub**
3. اختار الريبو `AhmedyaseenMorad/freshcart`
4. اضغط **Deploy**

✅ مفيش أي إعدادات تانية — Vercel بي autodetect Next.js، وكل `git push` جديد بينشر لوحده.

> ⚠️ **مش متاح على GitHub Pages** — الموقع فيه صفحات SSR، وPages بيخدم ملفات ثابتة بس.

---

## 👤 المؤلف

**AhmedyaseenMorad** — [github.com/AhmedyaseenMorad](https://github.com/AhmedyaseenMorad)