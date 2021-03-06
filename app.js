import compression from "compression";
import express from "express";

import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();

// app.use(compression);
app.use(express.static(join(__dirname, "build", "client"), { maxAge: "1h" }));

app.get("/", (_, response) => {
  response.sendFile(join(__dirname, "views", "index.html"));
});

app.get("/about", (_, response) => {
  response.sendFile(join(__dirname, "views", "about.html"));
});

app.get("/:actions/", (_, response) => {
  response.sendFile(join(__dirname, "views", "index.html"));
});

app.get("/:actions/images/:image", (request, response) => {
  const { action, image } = request.params;
  response.sendFile(join(__dirname, "build", "client", "images", image));
});

app.get("/:actions/sw.js", (_, response) => {
  response.sendFile(join(__dirname, "build", "client", "/sw.js"));
});

app.get("/:actions/launch", (request, response) => {
  response.redirect(request.query.url);
});

app.get("/:actions/manifest.json", (request, response) => {
  let buff = Buffer.from(request.params.actions, "base64");
  let actions = JSON.parse(buff.toString("ascii"));

  const shortcuts = actions.map(({ name, url }) => {
    return {
      name,
      url: `/${request.params.actions}/launch?url=${url}`,
      icons: [
        {
          src: "images/ic_launcher-96.png",
          sizes: "96x96",
          purpose: "any",
          type: "image/png",
        },
      ],
    };
  });

  response.json({
    name: "shortcut.cool",
    short_name: "shortcut.cool",
    background_color: "#E91E63",
    theme_color: "#E91E63",
    display: "standalone",
    icons: [
      {
        sizes: "192x192",
        src: "images/ic_launcher.png",
        type: "image/png",
        purpose: "maskable",
      },
      {
        sizes: "512x512",
        src: "images/web_hi_res_512.png",
        type: "image/png",
        purpose: "any",
      },
    ],
    shortcuts: shortcuts,
    start_url: `/${request.params.actions}/`,
  });
});

// listen for requests :)
const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Server running at on ${port}`);
});
