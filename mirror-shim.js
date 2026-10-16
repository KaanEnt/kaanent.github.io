(() => {
  const live = "https://www.traction.it.com";
  const native = window.fetch.bind(window);
  window.fetch = (input, init) => {
    const url = new URL(typeof input === "string" || input instanceof URL ? input : input.url, location.href);
    if (url.origin !== location.origin || !url.pathname.startsWith("/api/") || url.pathname.startsWith("/api/summary")) {
      return native(input, init);
    }
    const method = (init?.method ?? (input instanceof Request ? input.method : "GET")).toUpperCase();
    if (method !== "GET") {
      location.href = live + location.pathname + (location.pathname === "/" ? "#call" : "");
      return new Promise(() => {});
    }
    return Promise.resolve(new Response('{"ok":false}', { status: 404, headers: { "Content-Type": "application/json" } }));
  };
})();
