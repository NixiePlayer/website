# Nixie website

Source for [nixieplayer.com](https://nixieplayer.com), the website for
[Nixie](https://github.com/NixiePlayer/NixieDesktop), a desktop client for YouTube Music.

If you are looking for the app itself, its documentation or its releases, go to the
[NixieDesktop repository](https://github.com/NixiePlayer/NixieDesktop). This repository
holds only the website.

## Develop

```bash
pnpm install
pnpm dev
```

Copy `.env.example` to `.env` if you want the optional `GITHUB_TOKEN`. The site works
without it.

## Translations

The site is in English and Italian, with [next-intl](https://next-intl.dev). English is served
unprefixed (`/faq`) and Italian under `/it` (`/it/faq`). A first visit follows the browser's
language, and the switcher in the header remembers the choice in a cookie.

All copy lives in `messages/en.json` and `messages/it.json`. English is the source of truth for
the types, and `pnpm test` fails if the Italian file is missing a key, a list item, a link tag or
an argument that the English one has.

## Licence

MIT. See [LICENSE](LICENSE).
