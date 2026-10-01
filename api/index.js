const express = require("express");
const { addonBuilder, getRouter } = require("stremio-addon-sdk");

// 1. Função auxiliar para formatar os nomes dos canais
function formatName(slug) {
  return slug
    .split("-")
    .map((word) => word.toUpperCase())
    .join(" ");
}

// 2. Metadados personalizados e URLs diretas para canais específicos
const customChannelMeta = {
  "abc": {
    poster: "https://cdn.abcotvs.com/dip/images/11479454_011822-cc-abc-generic-thumb-img.jpg",
    logo: "https://cdn.abcotvs.com/dip/images/11479454_011822-cc-abc-generic-thumb-img.jpg",
    genres: ["Entertainment"],
    streamUrl: "https://seu-servidor.com/live/abc.m3u8"
  },
  "acc-network": {
    poster: "https://theacc.com/images/2018/11/30/ACCN_Launch.png",
    logo: "https://theacc.com/images/2018/11/30/ACCN_Launch.png",
    genres: ["Sports"],
    streamUrl: "https://seu-servidor.com/live/acc-network.m3u8"
  },
  "cartoon-network": {
    poster: "https://1000logos.net/wp-content/uploads/2016/10/Cartoon-Network-logo.jpg",
    logo: "https://1000logos.net/wp-content/uploads/2016/10/Cartoon-Network-logo.jpg",
    genres: ["Cartoons"],
    streamUrl: "https://seu-servidor.com/live/cartoon-network.m3u8"
  },
  "espn": {
    poster: "https://a1.espncdn.com/combiner/i?img=%2Fi%2Fespn%2Fespn_logos%2Fespn_red.png",
    logo: "https://a1.espncdn.com/combiner/i?img=%2Fi%2Fespn%2Fespn_logos%2Fespn_red.png",
    genres: ["Sports"],
    streamUrl: "https://seu-servidor.com/live/espn.m3u8"
  },
  "the-weather-channel": {
    poster: "https://i.ibb.co/bRJqL6WK/LWRBPBUMCVFA3-G5-Q4-ZH3-XJYDNY.avif",
    logo: "https://i.ibb.co/bRJqL6WK/LWRBPBUMCVFA3-G5-Q4-ZH3-XJYDNY.avif",
    genres: ["News/Politics"],
    streamUrl: "https://seu-servidor.com/live/the-weather-channel.m3u8"
  }
};

// 3. Lista completa de slugs dos canais
const rawSlugs = [
  "abc", "acc-network", "ae-network", "amc", "animal-planet", "axs-tv",
  "bbc-america", "bbc-one-london", "bbc-two", "bein-sports", "bein-sports-francais-1",
  "bein-sports-francais-2", "bein-sports-francais-3", "big-ten-network", "boomerang",
  "bravo", "canal-extra-1", "canal-extra-2", "canal-sport-pl", "canal-sport-2-pl",
  "canal-sport-3-pl", "canal-sport-4-pl", "canal-sport-5-pl", "canal-sport-6-pl",
  "cartoon-network", "cbeebies", "cbs", "cbs-sports-network", "cnbc", "comedy-central",
  "cw", "dazn-1-germany", "dazn-2-germany", "dazn-1-italia", "dazn-1-spain",
  "dazn-2-spain", "dazn-1-portugal", "dazn-1-usa", "dazn-f1", "dazn-laliga",
  "discovery-channel", "discovery-family", "discovery-turbo", "disney-channel",
  "disney-junior", "disney-xd", "eleven-sports-1", "eleven-sports-2", "eleven-sports-3",
  "eleven-sports-4", "espn", "espn-deportes", "espn2", "espnews", "espnu",
  "food-network", "fox", "fox-deportes", "fox-sports-1", "fox-sports-2",
  "fox-sports-501-cricket", "fox-sports-502-league", "fox-sports-503",
  "fox-sports-504-footy", "fox-sports-505", "fox-sports-506", "fox-sports-507",
  "fx", "fxm", "fxx", "freeform", "go3-sport-1", "go3-sport-2", "go3-sport-3",
  "golf-channel", "hbo", "hbo-comedy", "hbo-drama", "hbo-latino", "hbo-movies",
  "hgtv", "mlb-network", "motogp-channel", "movistar-deportes", "movistar-deportes-2",
  "movistar-deportes-3", "movistar-laliga", "movistar-plus", "mtv", "nba-tv",
  "nbc", "nbc-sports-bay-area", "nbc-sports-philadelphia", "nfl-network",
  "nhl-network", "nick-jr", "nickelodeon", "nicktoons", "polsat-sport-1",
  "polsat-sport-2", "polsat-sport-3", "polsat-sport-fight", "premier-sports-1-ie",
  "premier-sports-2-ie", "premiere", "racer-network", "sec-network", "showtime",
  "showtime-2", "showtime-extreme", "showtime-family-zone", "showtime-next",
  "showtime-women", "sky-sport-1-nz", "sky-sport-2-nz", "sky-sport-3-nz",
  "sky-sport-4-nz", "sky-sport-5-nz", "sky-sport-6-nz", "sky-sport-7-nz",
  "sky-sport-8-nz", "sky-sport-9-nz", "sky-sport-select-nz", "sky-sport-bundesliga",
  "sky-sports-plus", "sky-sports-action", "sky-sports-cricket", "sky-sports-f1",
  "sky-sports-football", "sky-sports-golf", "sky-sports-main-event", "sky-sports-mix",
  "sky-sports-news", "sky-sports-premier-league", "sky-sports-racing",
  "sky-sports-tennis", "sony-sports-network", "sony-sports-network-2",
  "sony-sports-network-3", "sony-sports-network-4", "sony-sports-network-5",
  "sportdigital-fussball", "sport-tv1", "sport-tv2", "sport-tv3", "sport-tv4",
  "sport-tv5", "starz", "starz-cinema", "starz-comedy", "starz-kids-and-family",
  "syfy", "tbs", "teenick", "telemundo", "tennis-channel", "the-weather-channel",
  "tnt", "tnt-sports-1", "tnt-sports-2", "tnt-sports-3", "tnt-sports-4",
  "trutv", "tsn1", "tudn", "tyc-sports-internacional", "ufc-fight-pass-24-7",
  "usa-network", "wapa-america", "wapa-deportes", "willow-cricket", "willow-cricket-2",
  "sky-sport-24", "sky-sport-uno"
];

// 4. Mapeamento dinâmico de canais
const channels = rawSlugs.map((slug) => {
  const custom = customChannelMeta[slug] || {};
  return {
    id: `timst:${slug}`,
    slug: slug,
    type: "tv",
    name: formatName(slug),
    poster: custom.poster || null,
    logo: custom.logo || null,
    posterShape: "landscape",
    genres: custom.genres || ["General"],
    description: `Assistir ao canal ${formatName(slug)} em direto 24/7.`,
    streamUrl: custom.streamUrl || null,
    externalUrl: `https://timst.top/channel/${slug}`
  };
});

// 5. Manifest do Addon
const manifest = {
  id: "top.timst.livetv",
  version: "1.0.0",
  name: "LIVE TV (Timst)",
  description: "Acesso 24/7 aos principais canais de entretenimento, desporto, notícias e desenhos animados.",
  resources: ["catalog", "meta", "stream"],
  types: ["tv"],
  catalogs: [
    {
      type: "tv",
      id: "timst_tv_catalog",
      name: "LIVE TV",
      genres: ["Entertainment", "Sports", "Cartoons", "News/Politics", "General"]
    }
  ]
};

const builder = new addonBuilder(manifest);

// 6. Handlers
builder.defineCatalogHandler(({ type, id, extra }) => {
  if (type === "tv" && id === "timst_tv_catalog") {
    let results = channels;

    if (extra && extra.genre) {
      results = channels.filter((item) => item.genres.includes(extra.genre));
    }

    const metas = results.map((item) => ({
      id: item.id,
      type: item.type,
      name: item.name,
      poster: item.poster,
      logo: item.logo,
      posterShape: item.posterShape,
      description: item.description,
      genres: item.genres
    }));

    return Promise.resolve({ metas });
  }
  return Promise.resolve({ metas: [] });
});

builder.defineMetaHandler(({ type, id }) => {
  if (type === "tv" && id.startsWith("timst:")) {
    const channel = channels.find((item) => item.id === id);
    if (channel) {
      return Promise.resolve({
        meta: {
          id: channel.id,
          type: channel.type,
          name: channel.name,
          poster: channel.poster,
          logo: channel.logo,
          description: channel.description,
          genres: channel.genres
        }
      });
    }
  }
  return Promise.resolve({ meta: null });
});

builder.defineStreamHandler(({ type, id }) => {
  if (type === "tv" && id.startsWith("timst:")) {
    const channel = channels.find((item) => item.id === id);

    if (channel) {
      const streams = [];

      if (channel.streamUrl) {
        streams.push({
          title: "Stream Direto (HD)",
          url: channel.streamUrl
        });
      }

      streams.push({
        title: "Abrir no Navegador / Web Stream",
        externalUrl: channel.externalUrl
      });

      return Promise.resolve({ streams });
    }
  }
  return Promise.resolve({ streams: [] });
});

// 7. Servidor Express com compatibilidade Serverless / Vercel
const app = express();
const addonInterface = builder.getInterface();
const addonRouter = getRouter(addonInterface);

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  next();
});

app.use("/", addonRouter);

// Permite execução local via `node index.js`, mas delega o roteamento para a Vercel em produção
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 7000;
  app.listen(PORT, () => {
    console.log(`Addon rodando em: http://127.0.0.1:${PORT}/manifest.json`);
  });
}

module.exports = app;
