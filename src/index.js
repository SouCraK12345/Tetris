import indexHtml from "../index.html";

export default {
  async fetch(request) {
    return new Response(indexHtml, {
      headers: {
        "content-type": "text/html; charset=UTF-8",
      },
    });
  },
};
