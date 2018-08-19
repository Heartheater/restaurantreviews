
function registerServiceWorker() {
    //return if navigator doesn't support service workers
    if (!navigator.serviceWorker)
        return;

    navigator.serviceWorker
        .register('/service-worker.js')
        .then(sw => console.log("Service Worker Registered"))
        .catch(error => console.log("Error registering service worker:", error));
}
registerServiceWorker();

