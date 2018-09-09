/**
 * This is for running as a content script:
 * <https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Content_scripts>
 * 
 * It's purpose is to discover RSS/Atom feeds, ActivityPub feeds, sitemaps, and any
 * other standard format that it might be able to help the user view, follow, or query.
 */

Array.from( document.querySelectorAll("[rel='alternate' i][href]") ).forEach(el => {
    // do something
})