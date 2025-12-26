# LOS — Installation and Editing Documentation (Shopify / Liquid)

This repository is intended to be used as a Shopify theme (Liquid, CSS, JavaScript). Below you will find how to install and run the project locally, plus examples of important (and editable) code fragments (Liquid / CSS / JS) you should know about.

---

## Prerequisites

- Node.js (recommended: 18.x or the version used in your environment).
- npm or yarn.
- Shopify CLI (v3+ recommended). Install from [https://shopify.dev/docs/cli](https://shopify.dev/docs)
- A Shopify development store (e.g. my-store.myshopify.com).
- Git access to the repository.

Optional:
- Tools for processing CSS/JS (esbuild, webpack, Vite, Tailwind) if you use an asset pipeline.

---

## Installation (quick steps)

1. Log in to Shopify using Shopify CLI:
   `shopify login --store=your-store.myshopify.com`

2. Install dependencies:
   npm install
   or
   yarn install

3. Clone the repository:
   `shopify theme pull [flags]`

4. Start the theme in development mode (depending on your Shopify CLI version):
   shopify theme dev --store=your-store.myshopify.com
   # If your CLI is older:
   shopify theme serve --store=your-store.myshopify.com

   This will open a local URL and sync changes instantly with your development store preview.

5. To push changes to a remote theme (manual deploy):
   shopify theme push --store=your-store.myshopify.com --themeid=THEME_ID
   # To publish directly:
   shopify theme push --store=your-store.myshopify.com --themeid=THEME_ID --publish

---

## Recommended npm scripts (examples)

If you'd like to add scripts in package.json, here are useful examples:

```json
{
  "scripts": {
    "dev": "npm run watch:assets & shopify theme dev --store=$SHOPIFY_STORE",
    "build": "npm run build:assets",
    "watch:assets": "esbuild src/js/* --outdir=assets/js --watch",
    "build:assets": "esbuild src/js/* --outdir=assets/js --minify"
  }
}
```

Adjust commands based on the bundler you use (webpack, vite, parcel, esbuild, etc.).

---

## Important files and structure (general)

- layout/
  - theme.liquid — main template; entry point for the theme HTML.
- templates/
  - index.liquid, product.liquid, collection.liquid, page.liquid, etc.
- sections/
  - header.liquid, footer.liquid, featured-product.liquid — editable sections available in the theme editor.
- snippets/
  - product-card.liquid, icon-cart.liquid — reusable fragments.
- assets/
  - styles.css (or .scss), scripts.js, images, fonts.
- locales/
  - en.default.json — translations.

---

## Important and editable code fragments

Below are examples with explanations about what to edit and how they work.

1) Section (sections/header.liquid)
```liquid
<!-- sections/header.liquid -->
<header class="site-header">
  <div class="wrap">
    <a href="{{ routes.root_url }}" class="logo">
      {% if settings.logo %}
        <img src="{{ settings.logo | image_url: width: 300 }}" alt="{{ shop.name }}">
      {% else %}
        {{ shop.name }}
      {% endif %}
    </a>

    <nav class="main-nav">
      {% for link in linklists.main-menu.links %}
        <a href="{{ link.url }}" class="nav-link">{{ link.title }}</a>
      {% endfor %}
    </nav>

    <button class="cart-toggle" data-action="toggle-cart">Cart ({{ cart.item_count }})</button>
  </div>
</header>

{% schema %}
{
  "name": "Header",
  "settings": [
    {
      "type": "image_picker",
      "id": "logo",
      "label": "Logo"
    }
  ],
  "blocks": [],
  "presets": [{"name":"Header"}]
}
{% endschema %}
```
- What to edit: `settings.logo` (upload from the theme editor). Customize CSS classes or HTML structure if you need search, social icons, or other elements.
- Notes: The section includes a schema so it appears in the Shopify Theme Editor.

2) Product card snippet (snippets/product-card.liquid)
```liquid
<article class="product-card">
  <a href="{{ product.url }}">
    <img src="{{ product.featured_image | img_url: '400x' }}" alt="{{ product.title }}">
    <h3>{{ product.title }}</h3>
    {% if product.compare_at_price > product.price %}
      <span class="price sale">{{ product.price | money }}</span>
      <span class="compare">{{ product.compare_at_price | money }}</span>
    {% else %}
      <span class="price">{{ product.price | money }}</span>
    {% endif %}
  </a>
</article>
```
- What to edit: image sizes ('400x'), CSS classes, price formatting.
- Tip: For performance, use image size filters and consider lazy-loading images (see JS example).

3) Using filters and variables (looping products)
```liquid
{% for product in collection.products %}
  {% include 'product-card' with product %}
{% endfor %}
```
- This iterates products of a collection. Use `paginate collection.products by 12` if you want pagination.

4) CSS: variables and main edit point (assets/styles.css)
```css
:root{
  --brand-color: #0a6;
  --accent-color: #ff6f61;
  --base-font: 'Inter', sans-serif;
}

/* header */
.site-header { background: var(--brand-color); color: #fff; }

/* Edit variables here to customize fonts and colors globally */
```
- What to edit: The variables in :root to customize global colors and typography without touching every rule.

5) JavaScript: behaviors and lazy-loading (assets/scripts.js)
```javascript
document.addEventListener('DOMContentLoaded', function () {
  // Toggle cart drawer
  document.querySelectorAll('[data-action="toggle-cart"]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelector('.drawer--cart').classList.toggle('is-open');
    });
  });

  // Simple lazy-load for images
  document.querySelectorAll('img[data-src]').forEach(img => {
    const src = img.getAttribute('data-src');
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            img.src = src;
            img.removeAttribute('data-src');
            io.unobserve(img);
          }
        });
      });
      io.observe(img);
    } else {
      img.src = src;
      img.removeAttribute('data-src');
    }
  });
});
```
- What to edit: Selectors and class names. Use data-attributes to bind behavior without coupling to styling classes.

---

## Best practices for editing Liquid and assets

- Make changes in a separate git branch before deploying to production.
- Use the Theme Editor to preview sections and settings visually.
- Avoid heavy logic in Liquid templates; offload to JavaScript when possible.
- Optimize images and use size filters: `img_url: '800x'` or `image_url`.
- Add translations in /locales/*.json to support multiple languages.
- Keep snippets small and reusable.

---

## Deployment

- For local testing: use `shopify theme dev`.
- To upload changes to Shopify:
  shopify theme push --store=your-store.myshopify.com --themeid=THEME_ID
- Consider CI/CD (GitHub Actions) to automate builds and pushes.

---

## Common issues

- "I don't see my changes": ensure you're using `theme dev` or `theme push` with the correct store and themeId, and clear your browser cache.
- Liquid errors: check Shopify’s error output (the theme editor often shows helpful information) and rollback custom changes until you find the issue.
- Uncompiled assets: if you use a bundler, run `npm run build` before `theme push`, or run a watch script while developing.

---

## Next steps and suggestions

If you want, I can:
- Add exact build scripts for your bundler (webpack / vite / esbuild / parcel).
- Create a `.env.example` with variables like SHOPIFY_STORE and THEME_ID.
- Generate additional section templates (featured product, hero, FAQ).

---

Acknowledgements and resources
- Shopify documentation: https://shopify.dev
- If you'd like, tell me which asset pipeline (webpack, vite, esbuild, etc.) you use and I will add concrete scripts or open a PR with this README in the repository.

---
View the proyect in [LordsOfFun](https://lordsofsun.com).

