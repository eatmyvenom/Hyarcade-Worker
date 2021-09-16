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
  // eslint-disable-next-line no-undef
  const realPass = await CONFIG.get("pass");
  const uuids = request.headers.get("accs").split(",");
  const key = request.headers.get("apikey");
  const url = new URL(request.url);
  const pass = url.searchParams.get("pass");
  
  // eslint-disable-next-line no-undef
  if(pass != realPass) {
    return new Response(JSON.stringify({ error: "INVALID-AUTH", sent: pass }));
  }

  const accs = {};

  const init = {
    headers: {
      "content-type": "application/json;charset=UTF-8",
    },
  };

  for(const uuid of uuids) {
    const acc = await fetch(`https://api.hypixel.net/player?key=${key}&uuid=${uuid.trim()}`, init);
    accs[uuid.trim()] = (await acc.json());
  }

  return new Response(JSON.stringify(accs), {
    headers: { "content-type": "application/json" },
  });
}
