# Dallass Mini App

A single-file Telegram Mini App storefront for a Persian (RTL) digital-goods shop — product catalog, plan selection, and pricing, running entirely from one `index.html` with no build step and no backend.

**Live use:** this repository is the production mini app of the Dallas shop on Telegram. It is actively maintained by its owner: the catalog and pricing are updated in place as products and plans change (see the commit history — catalog expansions and repricing throughout October–November 2026).

## Why open source?

Persian-language Telegram shops are usually built from scratch, in private, with the same RTL, Persian-digit, and Telegram WebApp problems solved again every time. This project publishes a working, production-proven starting point:

- Full Persian RTL layout with Persian text rendering
- Product catalog with categories and multi-plan pricing
- Single-file deployment — host it on GitHub Pages, Cloudflare Pages, or any static host
- Telegram WebApp integration (`Telegram.WebApp` ready / expand)

## Quick start

1. Fork or clone this repository.
2. Edit the product catalog and prices inside `index.html`.
3. Deploy the file to any static host.
4. Set the hosted URL as your bot's Mini App URL in [@BotFather](https://t.me/BotFather).

No build tools, no dependencies, no server required.

## Roadmap

- Extract the catalog into a separate `catalog.json` so non-developers can edit products without touching markup
- Document the pricing-update workflow
- Add a sample catalog for demo deployments

## Contributing

Issues and pull requests are welcome — especially from other Persian / RTL Telegram shop owners. See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT — see [LICENSE](LICENSE).

---

## فارسی

مینی‌اپ تلگرامی فروشگاه دالاس — یک فایل `index.html` بدون نیاز به بیلد یا بک‌اند: کاتالوگ محصول، انتخاب پلن و قیمت‌ها، کاملاً فارسی و راست‌چین.

این ریپو نسخه‌ی زنده و در حال استفاده‌ی فروشگاه است و فعالانه نگهداری می‌شود (تاریخچه‌ی کامیت‌ها: به‌روزرسانی کاتالوگ و قیمت‌ها در مهر و آبان ۱۴۰۵). هدف از متن‌باز بودنش این است که فروشگاه‌های فارسی‌زبان تلگرام مجبور نباشند هر بار از صفر شروع کنند.

**شروع سریع:** ریپو را فورک کنید، کاتالوگ و قیمت‌ها را داخل `index.html` ویرایش کنید، روی هر هاست استاتیکی دیپلوی کنید و آدرس را در BotFather به‌عنوان Mini App بات خودتان بگذارید.
