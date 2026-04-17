# TDC Portfolio Plugin

Hero carousel, list, and grid layouts for Squarespace portfolio pages.

## Version History

- **v1** — Initial release: hero carousel with autoplay, list layout, grid layout with hover effects

## Quick Start

Add to **Settings → Advanced → Code Injection → Header**:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/tdcmarketing-git/tdc-squarespace-plugins@main/portfolio/v1/tdc-portfolio.css">
<script defer src="https://cdn.jsdelivr.net/gh/tdcmarketing-git/tdc-squarespace-plugins@main/portfolio/v1/tdc-portfolio.js"></script>
```

Then drop a **Code Block** on any page with one of these:

### Hero Carousel
```html
<div class="tdc-portfolio"
     data-source="/commercial"
     data-layout="hero"
     data-limit="6"
     data-sort="manual"></div>
```

### List View
```html
<div class="tdc-portfolio"
     data-source="/commercial"
     data-layout="list"
     data-limit="8"
     data-sort="newest"></div>
```

### Grid View
```html
<div class="tdc-portfolio"
     data-source="/residential"
     data-layout="grid"
     data-limit="9"
     data-sort="manual"
     data-columns="3"></div>
```

## Data Attributes

| Attribute        | Values                          | Default    |
|------------------|---------------------------------|------------|
| `data-source`    | Portfolio page URL path         | (required) |
| `data-layout`    | `hero`, `list`, `grid`          | `hero`     |
| `data-limit`     | Number of items to show         | all        |
| `data-sort`      | `manual`, `newest`, `oldest`    | `manual`   |
| `data-columns`   | Grid columns (grid layout only) | `3`        |

## Custom Theming

Override in **Design → Custom CSS**:

```css
:root {
  --tdc-accent: #2E7D32;
  --tdc-accent-hover: #1B5E20;
}
```
