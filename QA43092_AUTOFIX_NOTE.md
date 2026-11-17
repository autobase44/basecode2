# QA43092 auto-fix note

## Symptom
After merging `main` into `qa43092-c4-sync-autofix`, `GET /` returned **HTTP 500**
with `label.toUpperCase is not a function`, so the preview showed an error page.
`GET /health` stayed 200.

## Cause
The merge combined both sides of `qa43092-config.js`, so the config now carries:

- `displayLabel: "Branch label"` (this branch, a string)
- `displayLabelV2: { text: "Main label" }` (from `main`, an object)

`server.js` preferred `displayLabelV2` when present and called `.toUpperCase()`
on it. Main's V2 value is an object, not a string, so the call threw. The page
handler's existing guard turned that into an HTTP 500 while `/health` kept
answering, which is why only the page was broken.

## Fix
`renderPage()` in `server.js` now uses `displayLabelV2` only when it is a usable
label string, and otherwise falls back to `displayLabel`:

```js
const v2 = config.displayLabelV2;
const label = typeof v2 === 'string' ? v2 : config.displayLabel;
const heading = label.toUpperCase();
```

- The `displayLabel` feature is preserved: the homepage still renders
  `config.displayLabel.toUpperCase()` -> **BRANCH LABEL**.
- The V2 preference is preserved for string values of `displayLabelV2`.
- A non-string `displayLabelV2` no longer takes the page down.
- The `try`/`catch` guard around the page handler is unchanged, so an
  unformattable label still yields HTTP 500 with the error message while
  `/health` stays available.

`qa43092-config.js` was not changed by this fix; both sides' config data is kept.

## Verification
- `node --check server.js` and `node --check qa43092-config.js` - pass.
- `GET /` -> **200**, `<h1 data-testid="e2e-marker">BRANCH LABEL</h1>`.
- `GET /health` -> **200** `{"status":"ok"}`; container reports `healthy`.
- No test suite or linter exists in this repository (no `test` script, no
  test directory, no eslint/prettier config), so none could be run.
