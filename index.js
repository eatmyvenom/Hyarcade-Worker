addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});

/**
 * Respond with hello worker text
 *
 * @param {Request} request
 * @returns {Response}
 */
async function handleRequest (request) {
  return new Response("Hello worker!", {
    headers: { "content-type": "text/plain" },
  });
}
