/**
 * This will eventually be for supporting frontend refreshes on routes
 * at the root (e.g. m.route.prefix("/")). Unfortunately Firefox 
 * currently doesn't support WebExtensions registering their own 
 * service workers. Chrome does, and it's even got an automated way to 
 * register it (ctrl+f "service_worker_script" at 
 * <https://developer.chrome.com/extensions/manifest>), but it's not
 * really well documented.
 * 
 * It's kinda hard to google about the issue too, 'cause all the
 * results are about extensions manipulating service workers that are
 * registered for regular sites. *shrug*
 */

/*
self.addEventListener('fetch', (event) => {
    event.respondWith(fetch(event.request));
});
*/