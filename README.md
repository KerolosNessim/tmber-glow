# Timber Glow — موقع React

نسخة React من الصفحة الرئيسية لـ Timber Glow، عربي (RTL) وإنجليزي (LTR)، وكل الداتا وهمية (dummy) من غير أي API خارجي.

## التشغيل

محتاج Node 20.19 أو أحدث (أو 22.12+).

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # فحص TypeScript + build في dist/
npm run preview    # تشغيل نسخة الـ build
```

## الأدوات (أحدث إصدار وقت الإنشاء)

| الأداة | الإصدار |
|---|---|
| React / React DOM | 19.3 |
| React Router | 8.5 (الباكدج اسمها `react-router`؛ من v7 `react-router-dom` بقت جواها، وv8 مفيهاش `react-router-dom`) |
| Vite | 8.3 |
| TypeScript | 7.0 |
| Tailwind CSS | 4.3 (`@tailwindcss/vite`) |
| shadcn/ui | مكونات Button, Badge, Sheet, Separator في `src/shared/components/ui` |
| React Bits | SplitText و AnimatedContent في `src/shared/components/reactbits` (بيحتاجوا gsap) |
| Zustand | 5.0 (الشنطة + حالة الـ UI، من غير Context API) |
| axios | 1.20 مع mock adapter |
| i18next / react-i18next | 26 / 17 |
| الخط | IBM Plex Sans Arabic (عربي وإنجليزي) + IBM Plex Mono للمواصفات، محمّلين محليًا من `@fontsource` |

## الهيكل (feature-driven)

```
src/
  app/                 App, router, layouts/RootLayout
  pages/               HomePage, CollectionPage, NotFoundPage (بتجمّع الـ features)
  features/
    layout/            components (Header, Footer, NavLinks, MobileMenu, LanguageSwitch, AnnouncementBar), constants, types
    home/              components, hooks (useHomeContent, useSlideshow, useCarouselScroll, useParallax), services, types, constants
    catalog/           components (CategoryTile, ProductCard, ProductGrid), hooks, services, types, constants
    cart/              components (CartDrawer, CartButton, CartLineItem, FreeShippingBar), hooks, store (Zustand), types, constants
  shared/
    components/        ui/ (shadcn), reactbits/, BrandIcon, Logo, SectionHeader, ...
    hooks/             useAsync, useLocalized, usePrefersReducedMotion
    services/api.ts    axios instance
    store/ui.store.ts  Zustand: فتح الشنطة والمنيو
    lib/, types/
  mocks/               الداتا الوهمية + mock adapter لـ axios
  i18n/                إعداد i18next + locales/{ar,en}/{common,layout,home,catalog,cart}.json
```

## الداتا الوهمية والـ API

- كل service بيعمل `api.get('/home')`, `api.get('/products')`... عادي جدًا.
- الـ axios instance في `src/shared/services/api.ts` معاه `adapter: mockAdapter`، فالطلبات مش بتخرج للنت؛ بترد من `src/mocks/data` بعد تأخير 350ms عشان تشوف حالات التحميل.
- لما الـ backend يجهز: حط `VITE_API_URL` في `.env` واشيل سطر `adapter`. الـ services والـ components مش هتتغير.

| Endpoint | بيرجع |
|---|---|
| `GET /home` | الـ slides، المميزات، الـ intro، الطقم، الـ lookbook |
| `GET /categories?group=tops\|bottoms` | الأقسام |
| `GET /categories/:slug` | قسم واحد |
| `GET /products?category=&ids=` | المنتجات |
| `GET /products/:id` | منتج واحد |

## اللغة والاتجاه

- العربي هو الافتراضي. زرار EN / ع في الهيدر بيغيّر اللغة ويتحفظ في `localStorage` (`tg-lang`).
- `src/i18n/index.ts` بيظبط `<html lang dir>` مع كل تغيير لغة.
- نصوص الواجهة في ملفات JSON، ونصوص الداتا `{ ar, en }` وبتتقري بـ `useLocalized().l(...)`.
- استخدم classes منطقية (`ms-*`, `ps-*`, `start-*`, `end-*`) أو `rtl:` / `ltr:` بدل left/right.
- SplitText بيقسم بالكلمة مش بالحرف، عشان الحروف العربي تفضل متشبكة.

## إضافة مكونات

`components.json` جاهز: `npx shadcn@latest add dialog` بيحط المكون في `src/shared/components/ui`،
و `npx shadcn@latest add @react-bits/CountUp-TS-TW` لمكونات React Bits.

## ملاحظات

- الصور في `public/images` صور مرجعية من براندات تانية؛ لازم تتغير بتصوير Timber Glow قبل الإطلاق.
- الأسعار والـ GSM وعدد الموديلات وسياسة الاستبدال والشحن المجاني كلها قيم مؤقتة.
