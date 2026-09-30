const express = require("express");
const { addonBuilder, getRouter } = require("stremio-addon-sdk");

const channelsData = [
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

function formatName(slug) {
  return slug
    .split("-")
    .map((word) => word.toUpperCase())
    .join(" ");
}

const manifest = {
  id: "top.timst.livetv",
  version: "1.0.0",
  name: "LIVE TV (Timst)",
  description: "24/7 access to top entertainment, sports, news, and cartoons.",
  resources: ["catalog", "meta", "stream"],
  types: ["tv"],
  catalogs: [
    {
      type: "tv",
      id: "timst_tv_catalog",
      name: "LIVE TV"
    }
  ]
};

const builder = new addonBuilder(manifest);

builder.defineCatalogHandler(({ type, id }) => {
  if (type === "tv" && id === "timst_tv_catalog") {
    const metas = channelsData.map((slug) => ({
      id: `timst:${slug}`,
      type: "tv",
      name: formatName(slug),
      posterShape: "landscape",
      description: `Assistir ao canal ${formatName(slug)} em direto.`
    }));
    return Promise.resolve({ metas });
  }
  return Promise.resolve({ metas: [] });
});

builder.defineMetaHandler(({ type, id }) => {
  if (type === "tv" && id.startsWith("timst:")) {
    const slug = id.replace("timst:", "");
    return Promise.resolve({
      meta: {
        id,
        type: "tv",
        name: formatName(slug),
        description: `Emissão em direto de ${formatName(slug)}`
      }
    });
  }
  return Promise.resolve({ meta: null });
});

builder.defineStreamHandler(({ type, id }) => {
  if (type === "tv" && id.startsWith("timst:")) {
    const slug = id.replace("timst:", "");
    const externalUrl = `https://timst.top/channel/${slug}`;

    return Promise.resolve({
      streams: [
        {
          title: "Abrir no Navegador / Web Stream",
          externalUrl: externalUrl
        }
      ]
    });
  }
  return Promise.resolve({ streams: [] });
});

const app = express();
const addonInterface = builder.getInterface();
const addonRouter = getRouter(addonInterface);

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  next();
});

app.use("/", addonRouter);

module.exports = app;
