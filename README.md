# Timber Glow — المتجر والداشبورد

متجر Timber Glow بـ React، عربي (RTL) وإنجليزي (LTR)، والداشبورد على `/admin`. الداتا جاية من `timber-glow-api`.

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
  pages/               HomePage, CollectionPage, ProductPage, CheckoutPage, OrderPlacedPage, NotFoundPage
  features/
    layout/            components (Header, Footer, NavLinks, MobileMenu, LanguageSwitch, AnnouncementBar), constants, types
    home/              components, hooks (useHomeContent, useSlideshow, useCarouselScroll, useParallax), services, types, constants
    catalog/           components (CategoryTile, ProductCard, ProductGrid), hooks, services, types, constants
    cart/              components (CartDrawer, CartButton, CartLineItem, FreeShippingBar), hooks, store (Zustand), types, constants
    checkout/          services (POST /orders), constants (المحافظات)
  admin/               الداشبورد كلها: pages, components, services, lib
  shared/
    components/        ui/ (shadcn), reactbits/, BrandIcon, Logo, SectionHeader, ...
    hooks/             useAsync, useLocalized, usePrefersReducedMotion
    services/api.ts    axios instance
    store/ui.store.ts  Zustand: فتح الشنطة والمنيو
    lib/, types/
  mocks/               الداتا الوهمية + mock adapter لـ axios
  i18n/                إعداد i18next + locales/{ar,en}/{common,layout,home,catalog,cart,checkout}.json
```

## الـ API والداتا الوهمية

الباك إند في ريبو منفصل: `timber-glow-api` (Express + MongoDB + Cloudinary).

- `src/shared/services/api.ts` بيكلّم الـ API لما `VITE_API_URL` يكون موجود:
  - **محلياً** في `.env.local` (متجاهَل في git): `VITE_API_URL=http://localhost:3000`
  - **على Vercel** في `.env.production`: `VITE_API_URL=/api`، و`vercel.json` بيحوّل `/api/*` لمشروع الـ API.
- من غير `VITE_API_URL`، أو مع `VITE_USE_MOCKS=true`، الطلبات بترد من `src/mocks` (من غير حفظ أوردرات).

| Endpoint | بيرجع |
|---|---|
| `GET /home` | الـ slides، المميزات، الـ intro، الطقم، الـ lookbook |
| `GET /categories?group=tops\|bottoms` | الأقسام |
| `GET /categories/:slug` | قسم واحد |
| `GET /products?category=&ids=` | المنتجات (`soldOut` = المقاسات اللي خلصت) |
| `GET /products/:id` | منتج واحد |
| `GET /settings` | رقم الواتساب ولينكات السوشيال |
| `POST /orders` | يسجّل الأوردر ويرجّع رقمه ورابط واتساب |

## الأوردرات

الشنطة ← `/checkout` (الاسم، الموبايل، المحافظة، العنوان) ← الأوردر يتسجل ← `/order/:number` وواتساب بيفتح برسالة الطلب جاهزة.
الشحن بيتحدد على واتساب، والأدمن بيكتبه في الأوردر من الداشبورد.

## الداشبورد (`/admin`)

جوه نفس التطبيق، بس في chunk لوحده (`src/admin`) فمش بيتحمّل مع المتجر. عربي بس.

| الصفحة | فيها |
|---|---|
| نظرة عامة | مبيعات النهارده / ٧ أيام / الشهر، الأوردرات الجديدة، الأكثر مبيعاً، المقاسات اللي قربت تخلص |
| الأوردرات | فلتر بالحالة والتاريخ، بحث بالرقم/الاسم/الموبايل، تفاصيل الأوردر، تغيير الحالة، الشحن، ملاحظات |
| المنتجات / الأقسام | إضافة وتعديل وحذف، مخزون لكل مقاس، رفع صور على Cloudinary، ترتيب الأقسام |
| الصفحة الرئيسية | السلايدر، المميزات، المقدمة، الطقم، صور انستجرام |
| الإعدادات | رقم الواتساب ولينكات السوشيال |

المخزون بيتخصم لما الأدمن **يأكّد** الأوردر، وبيرجع لو الأوردر اتلغى.

## الرفع على Vercel

1. ارفع `timber-glow-api` الأول كمشروع Vercel (الخطوات في الـ README بتاعه)، وخد رابطه، مثلاً `https://timber-glow-api.vercel.app`.
2. لو الرابط مختلف، غيّره في أول rewrite في `vercel.json`.
3. ارفع الريبو ده كمشروع Vercel تاني (Vite بيتعرف لوحده)، واربط الدومين بتاعك عليه من Settings ← Domains.

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
