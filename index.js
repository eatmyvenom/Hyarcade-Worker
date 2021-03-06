/* eslint-disable unicorn/no-abusive-eslint-disable */
/* eslint-disable */
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
  const realPass = await CONFIG.get("pass");
  const uuids = request.headers.get("accs").split(",");
  const key = request.headers.get("apikey");
  const url = new URL(request.url);
  const pass = url.searchParams.get("pass");

  if(pass != realPass) {
    return new Response(JSON.stringify({ error: "INVALID-AUTH", sent: pass }));
  }

  const accs = {};

  const init = {
    headers: {
      "content-type": "application/json;charset=UTF-8",
    },
  };
  
  let acc;

  for(let i = 0;i < uuids.length;i += 1) {
    const uuid = uuids[i];
    acc = await fetch(`https://api.hypixel.net/player?key=${key}&uuid=${uuid.trim()}`, init);
    const text = await acc.text();

    try {
      accs[uuid.trim()] = JSON.parse(text);
    } catch (e) {
      console.log(text);
      console.log(acc);
      i -= 1;
    }
  }

  return new Response(JSON.stringify({ data: accs, key: { limit: acc.headers.get("ratelimit-limit"), remaining: acc.headers.get("ratelimit-remaining"), reset: acc.headers.get("ratelimit-reset") } }), {
    headers: { "content-type": "application/json" },
  });
}
