# TDC Squarespace Plugins

Reusable Squarespace plugins built and maintained by TDC Marketing. Served via [jsDelivr CDN](https://www.jsdelivr.com/) for fast, free delivery to client sites.

## Available Plugins

| Plugin | Description | Version |
|--------|-------------|---------|
| [Portfolio](./portfolio/) | Hero carousel, list, and grid layouts for portfolio pages | v1 |

## How It Works

Each plugin lives in its own folder with versioned subfolders (`v1/`, `v2/`, etc.). Client sites load the CSS and JS directly from jsDelivr using URLs like:

```
https://cdn.jsdelivr.net/gh/tdcmarketing-git/tdc-squarespace-plugins@main/portfolio/v1/tdc-portfolio.css
https://cdn.jsdelivr.net/gh/tdcmarketing-git/tdc-squarespace-plugins@main/portfolio/v1/tdc-portfolio.js
```

## Client Install (General Steps)

1. Go to **Settings → Advanced → Code Injection → Header** in the Squarespace site
2. Add the `<link>` and `<script>` tags for the plugin
3. Add a **Code Block** on the desired page with the plugin's HTML markup
4. See each plugin's README for specific instructions

## Repo Structure

```
tdc-squarespace-plugins/
├── README.md
└── portfolio/
    ├── README.md
    └── v1/
        ├── tdc-portfolio.css
        └── tdc-portfolio.js
```
