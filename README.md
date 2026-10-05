# Boardroomlist.com browser extension

The newest executive roles at America's Fortune 500, from the toolbar. Four tabs: Open, New today, New this week and Just filled. Click a card to open the role, or open the full list on Boardroomlist.com.

Works in Chrome, Microsoft Edge and Firefox. This is the full source of the extension published for Boardroomlist.com.

## What is a browser extension?

A browser extension is a small add-on that lives in your browser toolbar. Click its icon and a popup opens, so you can use a service without opening its website first. This one is a popup only: it shows a short list and every item opens the real page on Boardroomlist.com.

## About Boardroomlist.com

Boardroomlist.com is a job board for senior roles, Manager to C-suite, at the 500 largest US companies, taken from each company career site and checked every day. Visit it at https://boardroomlist.com.

## Install

1. Open `chrome://extensions` (Chrome), `edge://extensions` (Edge) or `about:debugging` (Firefox).
2. Turn on Developer mode, then choose Load unpacked (Firefox: Load Temporary Add-on and pick `manifest.json`).
3. Select this folder.
4. Click the toolbar icon.

## Privacy and permissions

It asks for one permission, `storage`, to remember which tab you had open. It has no background worker, no content script, no host permissions and no sign-in.

It reads one public, read-only endpoint on boardroomlist.com that returns a small sample of roles per tab.

The extension collects nothing and stores no credentials. Privacy policy: https://boardroomlist.com/privacy.

## Build

- Edge: `node scripts/build-edge-extension.mjs` writes `boardroomlist-extension-edge.zip`.
- Firefox: `node scripts/build-firefox-extension.mjs` writes `boardroomlist-extension-firefox.zip`. It adds the Firefox-only manifest block (add-on id and the "collects no data" declaration).
- Chrome: zip `manifest.json`, `popup.html`, `popup.js` and `icons/` with forward-slash paths (for example `tar -a -cf ../ext.zip manifest.json popup.html popup.js icons`).

## More from Boardroomlist.com

- Website: https://boardroomlist.com
- Developer docs for Claude: https://boardroomlist.com/developers/claude
- Developer docs for ChatGPT: https://boardroomlist.com/developers
- ChatGPT plugin: https://github.com/ExpatsListORG/boardroomlist-chatgpt-plugin
- Claude connector: https://github.com/ExpatsListORG/boardroomlist-claude-connector
- Privacy policy: https://boardroomlist.com/privacy
- Terms of service: https://boardroomlist.com/terms
- Contact: https://boardroomlist.com/contact

## License

MIT. See `LICENSE`.
