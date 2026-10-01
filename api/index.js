const express = require("express");
const { addonBuilder, getRouter } = require("stremio-addon-sdk");

// 1. Função auxiliar para formatar os nomes dos canais
function formatName(slug) {
  return slug
    .split("-")
    .map((word) => word.toUpperCase())
    .join(" ");
}

// 2. Metadados personalizados e URLs de logos para os canais
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
  "ae-network": {
    poster: "https://www.aetv.com/assets/images/aetv/generic-thumb.jpg",
    logo: "https://www.aetv.com/assets/images/aetv/generic-thumb.jpg",
    genres: ["Entertainment"]
  },
  "amc": {
    poster: "https://tvseriesfinale.com/wp-content/uploads/2014/08/amc02.jpg",
    logo: "https://tvseriesfinale.com/wp-content/uploads/2014/08/amc02.jpg",
    genres: ["Entertainment"]
  },
  "american-heroes-channel": {
    poster: "https://payload.cargocollective.com/1/10/342209/9724942/AHC_15a_3_1340_c.jpg",
    logo: "https://payload.cargocollective.com/1/10/342209/9724942/AHC_15a_3_1340_c.jpg",
    genres: ["Entertainment"]
  },
  "animal-planet": {
    poster: "https://mir-s3-cdn-cf.behance.net/project_modules/disp/f9ee57107702215.5facf9f601507.jpg",
    logo: "https://mir-s3-cdn-cf.behance.net/project_modules/disp/f9ee57107702215.5facf9f601507.jpg",
    genres: ["Entertainment"]
  },
  "axs-tv": {
    poster: "https://www.hcc.net/wp-content/uploads/2012/06/AXS_TV_BlueWhite.jpg",
    logo: "https://www.hcc.net/wp-content/uploads/2012/06/AXS_TV_BlueWhite.jpg",
    genres: ["Entertainment"]
  },
  "bbc-america": {
    poster: "https://via.placeholder.com/640x360/0c0c0c/ffffff?text=Channel",
    logo: "https://via.placeholder.com/640x360/0c0c0c/ffffff?text=Channel",
    genres: ["Entertainment"]
  },
  "bbc-one-london": {
    poster: "https://ichef.bbci.co.uk/images/ic/1200x675/p0dkt7rv.jpg",
    logo: "https://ichef.bbci.co.uk/images/ic/1200x675/p0dkt7rv.jpg",
    genres: ["Entertainment"]
  },
  "bbc-two": {
    poster: "https://ichef.bbci.co.uk/images/ic/1200x675/p0bvs8dg.jpg",
    logo: "https://ichef.bbci.co.uk/images/ic/1200x675/p0bvs8dg.jpg",
    genres: ["Entertainment"]
  },
  "bein-sports": {
    poster: "https://assets-us-01.kc-usercontent.com/31dbcbc6-da4c-0033-328a-d7621d0fa726/1318873e-8501-4f79-bb69-182d741cf9ad/beIN%20SPORTS%20Portada.jpg?ver=03-06-2025&w=3840&q=75",
    logo: "https://assets-us-01.kc-usercontent.com/31dbcbc6-da4c-0033-328a-d7621d0fa726/1318873e-8501-4f79-bb69-182d741cf9ad/beIN%20SPORTS%20Portada.jpg?ver=03-06-2025&w=3840&q=75",
    genres: ["Sports"]
  },
  "bein-sports-francais-1": {
    poster: "https://cdn.jsdelivr.net/gh/willthequeencome/img-cdn/beinsports.png",
    logo: "https://cdn.jsdelivr.net/gh/willthequeencome/img-cdn/beinsports.png",
    genres: ["Sports"]
  },
  "bein-sports-francais-2": {
    poster: "https://cdn.jsdelivr.net/gh/willthequeencome/img-cdn/beinsports.png",
    logo: "https://cdn.jsdelivr.net/gh/willthequeencome/img-cdn/beinsports.png",
    genres: ["Sports"]
  },
  "bein-sports-francais-3": {
    poster: "https://cdn.jsdelivr.net/gh/willthequeencome/img-cdn/beinsports.png",
    logo: "https://cdn.jsdelivr.net/gh/willthequeencome/img-cdn/beinsports.png",
    genres: ["Sports"]
  },
  "big-ten-network": {
    poster: "https://barrettmedia.com/wp-content/uploads/2024/07/Big-Ten-Network-BTN-Logo.jpg",
    logo: "https://barrettmedia.com/wp-content/uploads/2024/07/Big-Ten-Network-BTN-Logo.jpg",
    genres: ["Sports"]
  },
  "boomerang": {
    poster: "https://cdn.broadbandtvnews.com/wp-content/uploads/2024/08/05120702/Boomerang.jpg",
    logo: "https://cdn.broadbandtvnews.com/wp-content/uploads/2024/08/05120702/Boomerang.jpg",
    genres: ["Cartoons"]
  },
  "bravo": {
    poster: "https://www.bravotv.com/sites/bravo/files/2024/05/bravo-logo-2jpg.jpg",
    logo: "https://www.bravotv.com/sites/bravo/files/2024/05/bravo-logo-2jpg.jpg",
    genres: ["Entertainment"]
  },
  "canal-extra-1": {
    poster: "https://cdn.jsdelivr.net/gh/willthequeencome/img-cdn/canalextra.png",
    logo: "https://cdn.jsdelivr.net/gh/willthequeencome/img-cdn/canalextra.png",
    genres: ["Sports"]
  },
  "canal-extra-2": {
    poster: "https://cdn.jsdelivr.net/gh/willthequeencome/img-cdn/canalextra.png",
    logo: "https://cdn.jsdelivr.net/gh/willthequeencome/img-cdn/canalextra.png",
    genres: ["Sports"]
  },
  "canal-sport-pl": {
    poster: "https://cdn.jsdelivr.net/gh/willthequeencome/img-cdn/canansport.png",
    logo: "https://cdn.jsdelivr.net/gh/willthequeencome/img-cdn/canansport.png",
    genres: ["Sports"]
  },
  "canal-sport-2-pl": {
    poster: "https://cdn.jsdelivr.net/gh/willthequeencome/img-cdn/canansport.png",
    logo: "https://cdn.jsdelivr.net/gh/willthequeencome/img-cdn/canansport.png",
    genres: ["Sports"]
  },
  "canal-sport-3-pl": {
    poster: "https://cdn.jsdelivr.net/gh/willthequeencome/img-cdn/canansport.png",
    logo: "https://cdn.jsdelivr.net/gh/willthequeencome/img-cdn/canansport.png",
    genres: ["Sports"]
  },
  "canal-sport-4-pl": {
    poster: "https://cdn.jsdelivr.net/gh/willthequeencome/img-cdn/canansport.png",
    logo: "https://cdn.jsdelivr.net/gh/willthequeencome/img-cdn/canansport.png",
    genres: ["Sports"]
  },
  "canal-sport-5-pl": {
    poster: "https://cdn.jsdelivr.net/gh/willthequeencome/img-cdn/canansport.png",
    logo: "https://cdn.jsdelivr.net/gh/willthequeencome/img-cdn/canansport.png",
    genres: ["Sports"]
  },
  "canal-sport-6-pl": {
    poster: "https://cdn.jsdelivr.net/gh/willthequeencome/img-cdn/canansport.png",
    logo: "https://cdn.jsdelivr.net/gh/willthequeencome/img-cdn/canansport.png",
    genres: ["Sports"]
  },
  "cartoon-network": {
    poster: "https://1000logos.net/wp-content/uploads/2016/10/Cartoon-Network-logo.jpg",
    logo: "https://1000logos.net/wp-content/uploads/2016/10/Cartoon-Network-logo.jpg",
    genres: ["Cartoons"],
    streamUrl: "https://seu-servidor.com/live/cartoon-network.m3u8"
  },
  "cbeebies": {
    poster: "https://static.files.bbci.co.uk/core/website/assets/static/childrens-web/images/metadata/cbeebies-poster-1024x576.8eb27aa32e.png",
    logo: "https://static.files.bbci.co.uk/core/website/assets/static/childrens-web/images/metadata/cbeebies-poster-1024x576.8eb27aa32e.png",
    genres: ["Cartoons"]
  },
  "cbs": {
    poster: "https://wwwimage-tve.cbsstatic.com/base/files/seo/cbs_seo_1200x627_1.jpg",
    logo: "https://wwwimage-tve.cbsstatic.com/base/files/seo/cbs_seo_1200x627_1.jpg",
    genres: ["Entertainment"]
  },
  "cbs-sports-network": {
    poster: "https://www.paramountshop.com/cdn/shop/files/cbssportsnetwork-mobile-min.png",
    logo: "https://www.paramountshop.com/cdn/shop/files/cbssportsnetwork-mobile-min.png",
    genres: ["Sports"]
  },
  "cnbc": {
    poster: "https://cdn.versantmedia.com/versantmedia/styles/newsroom/s3/2025-11/cnbc%281600x900%29.png",
    logo: "https://cdn.versantmedia.com/versantmedia/styles/newsroom/s3/2025-11/cnbc%281600x900%29.png",
    genres: ["Entertainment"]
  },
  "comedy-central": {
    poster: "https://wwwimage-us.pplusstatic.com/base/files/seo/og-brand-comedy-central.jpg?format=webp",
    logo: "https://wwwimage-us.pplusstatic.com/base/files/seo/og-brand-comedy-central.jpg?format=webp",
    genres: ["Entertainment"]
  },
  "cw": {
    poster: "https://www.wavy.com/wp-content/uploads/sites/3/2024/08/cw-logo-white-on-blue-wavy-background.jpg?w=1280",
    logo: "https://www.wavy.com/wp-content/uploads/sites/3/2024/08/cw-logo-white-on-blue-wavy-background.jpg?w=1280",
    genres: ["Entertainment"]
  },
  "dazn-1-germany": {
    poster: "https://image.discovery.indazn.com/ca/v2/ca/image?id=12dpnhddhmpm71228raanhyxs2_image-header_pDach_1723627450000&quality=70",
    logo: "https://image.discovery.indazn.com/ca/v2/ca/image?id=12dpnhddhmpm71228raanhyxs2_image-header_pDach_1723627450000&quality=70",
    genres: ["Sports"]
  },
  "dazn-2-germany": {
    poster: "https://image.discovery.indazn.com/ca/v2/ca/image?id=1ni1lpwjtnxmr1xklfoptrt2mz_image-header_pDach_1723628653000",
    logo: "https://image.discovery.indazn.com/ca/v2/ca/image?id=1ni1lpwjtnxmr1xklfoptrt2mz_image-header_pDach_1723628653000",
    genres: ["Sports"]
  },
  "dazn-1-italia": {
    poster: "https://image.discovery.indazn.com/ca/v2/ca/image?id=pterrit4f2xu1pa2r6x87y5e9_image-header_pIt_1724315365000&quality=70",
    logo: "https://image.discovery.indazn.com/ca/v2/ca/image?id=pterrit4f2xu1pa2r6x87y5e9_image-header_pIt_1724315365000&quality=70",
    genres: ["Sports"]
  },
  "dazn-1-spain": {
    poster: "https://image.discovery.indazn.com/ca/v2/ca/image?id=hn9vkic8rbfi1ndrym8sw2qh7_image-header_pEs_1723035920000",
    logo: "https://image.discovery.indazn.com/ca/v2/ca/image?id=hn9vkic8rbfi1ndrym8sw2qh7_image-header_pEs_1723035920000",
    genres: ["Sports"]
  },
  "dazn-2-spain": {
    poster: "https://image.discovery.indazn.com/ca/v2/ca/image?id=2ouwtae8ad7l1fxviow9bowpk_image-header_pEs_1723118632000&quality=70",
    logo: "https://image.discovery.indazn.com/ca/v2/ca/image?id=2ouwtae8ad7l1fxviow9bowpk_image-header_pEs_1723118632000&quality=70",
    genres: ["Sports"]
  },
  "dazn-1-portugal": {
    poster: "https://image.discovery.indazn.com/ca/v2/ca/image?id=1o4eamzb4env61ddc8wv4ra06l_image-header_pRow_1720521601000&quality=70",
    logo: "https://image.discovery.indazn.com/ca/v2/ca/image?id=1o4eamzb4env61ddc8wv4ra06l_image-header_pRow_1720521601000&quality=70",
    genres: ["Sports"]
  },
  "dazn-1-usa": {
    poster: "https://image.discovery.indazn.com/ca/v2/ca/image?id=1owzb99m9mnzy15hjxolpukwul_image-header_pUs_1771501796000&quality=70",
    logo: "https://image.discovery.indazn.com/ca/v2/ca/image?id=1owzb99m9mnzy15hjxolpukwul_image-header_pUs_1771501796000&quality=70",
    genres: ["Sports"]
  },
  "dazn-f1": {
    poster: "https://image.discovery.indazn.com/ca/v2/ca/image?id=14ln25pmjdv031ejxsmg8dczsu_image-header_pEs_1723117975000&quality=70",
    logo: "https://image.discovery.indazn.com/ca/v2/ca/image?id=14ln25pmjdv031ejxsmg8dczsu_image-header_pEs_1723117975000&quality=70",
    genres: ["Sports"]
  },
  "dazn-laliga": {
    poster: "https://image.discovery.indazn.com/ca/v2/ca/image?id=1weziux6zy5mb16pev002ax1yu_image-header_pEs_1723118324000",
    logo: "https://image.discovery.indazn.com/ca/v2/ca/image?id=1weziux6zy5mb16pev002ax1yu_image-header_pEs_1723118324000",
    genres: ["Sports"]
  },
  "discovery-channel": {
    poster: "https://i.ibb.co/k2rbB1jc/e35d6be84084fed1d756c39242f13163.webp",
    logo: "https://i.ibb.co/k2rbB1jc/e35d6be84084fed1d756c39242f13163.webp",
    genres: ["Entertainment"]
  },
  "discovery-family": {
    poster: "https://i.ibb.co/wFmT9Q5t/Discovery-Family-ID-Let-s-Go-Yellow.webp",
    logo: "https://i.ibb.co/wFmT9Q5t/Discovery-Family-ID-Let-s-Go-Yellow.webp",
    genres: ["Cartoons"]
  },
  "discovery-turbo": {
    poster: "https://i.ibb.co/20MgSXjy/featured-Image-1767979538707.jpg",
    logo: "https://i.ibb.co/20MgSXjy/featured-Image-1767979538707.jpg",
    genres: ["Entertainment"]
  },
  "disney-channel": {
    poster: "https://vignette4.wikia.nocookie.net/logopedia/images/9/93/Disney_Channel_Original_2014.png/revision/latest?cb=20140705213010",
    logo: "https://vignette4.wikia.nocookie.net/logopedia/images/9/93/Disney_Channel_Original_2014.png/revision/latest?cb=20140705213010",
    genres: ["Cartoons"]
  },
  "disney-junior": {
    poster: "https://thewaltdisneycompany.com/app/uploads/2021/02/021221_Disney-Junior-10th-Anniversary-00.jpg",
    logo: "https://thewaltdisneycompany.com/app/uploads/2021/02/021221_Disney-Junior-10th-Anniversary-00.jpg",
    genres: ["Cartoons"]
  },
  "disney-xd": {
    poster: "https://www.laughingplace.com/uploads/2015/10/d128457e3b3ab8c050f306aa8e23666b9b05d3cc.jpg",
    logo: "https://www.laughingplace.com/uploads/2015/10/d128457e3b3ab8c050f306aa8e23666b9b05d3cc.jpg",
    genres: ["Cartoons"]
  },
  "eleven-sports-1": {
    poster: "https://cdn.jsdelivr.net/gh/willthequeencome/img-cdn/100659.png",
    logo: "https://cdn.jsdelivr.net/gh/willthequeencome/img-cdn/100659.png",
    genres: ["Sports"]
  },
  "eleven-sports-2": {
    poster: "https://cdn.jsdelivr.net/gh/willthequeencome/img-cdn/100659.png",
    logo: "https://cdn.jsdelivr.net/gh/willthequeencome/img-cdn/100659.png",
    genres: ["Sports"]
  },
  "eleven-sports-3": {
    poster: "https://cdn.jsdelivr.net/gh/willthequeencome/img-cdn/100659.png",
    logo: "https://cdn.jsdelivr.net/gh/willthequeencome/img-cdn/100659.png",
    genres: ["Sports"]
  },
  "eleven-sports-4": {
    poster: "https://cdn.jsdelivr.net/gh/willthequeencome/img-cdn/100659.png",
    logo: "https://cdn.jsdelivr.net/gh/willthequeencome/img-cdn/100659.png",
    genres: ["Sports"]
  },
  "espn": {
    poster: "https://a1.espncdn.com/combiner/i?img=%2Fi%2Fespn%2Fespn_logos%2Fespn_red.png",
    logo: "https://a1.espncdn.com/combiner/i?img=%2Fi%2Fespn%2Fespn_logos%2Fespn_red.png",
    genres: ["Sports"],
    streamUrl: "https://seu-servidor.com/live/espn.m3u8"
  },
  "espn-deportes": {
    poster: "https://i.ibb.co/Y7zHmbbz/i.png",
    logo: "https://i.ibb.co/Y7zHmbbz/i.png",
    genres: ["Sports"]
  },
  "espn2": {
    poster: "https://discgolf.ultiworld.com/wp-content/uploads/2020/10/ESPN2.png",
    logo: "https://discgolf.ultiworld.com/wp-content/uploads/2020/10/ESPN2.png",
    genres: ["Sports"]
  },
  "espnews": {
    poster: "https://i.ibb.co/5h4LGFHq/image.png",
    logo: "https://i.ibb.co/5h4LGFHq/image.png",
    genres: ["Sports"]
  },
  "espnu": {
    poster: "https://i.ibb.co/Lh5jHVDm/ESPNU-logo-1-jpg.webp",
    logo: "https://i.ibb.co/Lh5jHVDm/ESPNU-logo-1-jpg.webp",
    genres: ["Sports"]
  },
  "food-network": {
    poster: "https://i.ibb.co/5WcnZbYf/food-network-jpg.jpg",
    logo: "https://i.ibb.co/5WcnZbYf/food-network-jpg.jpg",
    genres: ["Entertainment"]
  },
  "fox": {
    poster: "https://i.ibb.co/8JdwqP4/foxusa.png",
    logo: "https://i.ibb.co/8JdwqP4/foxusa.png",
    genres: ["Entertainment"]
  },
  "fox-deportes": {
    poster: "https://foxsports-wordpress-www-prsupports-prod.s3.amazonaws.com/uploads/sites/2/2016/12/LOGO-DEPORTES-1040x585.jpg",
    logo: "https://foxsports-wordpress-www-prsupports-prod.s3.amazonaws.com/uploads/sites/2/2016/12/LOGO-DEPORTES-1040x585.jpg",
    genres: ["Entertainment"]
  },
  "fox-sports-1": {
    poster: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/2015_Fox_Sports_1_logo.svg/1280px-2015_Fox_Sports_1_logo.svg.png",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/2015_Fox_Sports_1_logo.svg/1280px-2015_Fox_Sports_1_logo.svg.png",
    genres: ["Sports"]
  },
  "fox-sports-2": {
    poster: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/FS2_logo_2015.svg/1280px-FS2_logo_2015.svg.png",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/FS2_logo_2015.svg/1280px-FS2_logo_2015.svg.png",
    genres: ["Sports"]
  },
  "fox-sports-501-cricket": {
    poster: "https://i.ibb.co/Y4bTS1p7/image.webp",
    logo: "https://i.ibb.co/Y4bTS1p7/image.webp",
    genres: ["Sports"]
  },
  "fox-sports-502-league": {
    poster: "https://i.ibb.co/tppZhDrb/image.webp",
    logo: "https://i.ibb.co/tppZhDrb/image.webp",
    genres: ["Sports"]
  },
  "fox-sports-503": {
    poster: "https://i.ibb.co/xS4MkGSL/image.webp",
    logo: "https://i.ibb.co/xS4MkGSL/image.webp",
    genres: ["Sports"]
  },
  "fox-sports-504-footy": {
    poster: "https://i.ibb.co/SXvQLc0M/image.webp",
    logo: "https://i.ibb.co/SXvQLc0M/image.webp",
    genres: ["Sports"]
  },
  "fox-sports-505": {
    poster: "https://i.ibb.co/prKZGNLt/image.webp",
    logo: "https://i.ibb.co/prKZGNLt/image.webp",
    genres: ["Sports"]
  },
  "fox-sports-506": {
    poster: "https://i.ibb.co/Swks4Lmj/image.webp",
    logo: "https://i.ibb.co/Swks4Lmj/image.webp",
    genres: ["Sports"]
  },
  "fox-sports-507": {
    poster: "https://i.ibb.co/7d6VgDVL/image.webp",
    logo: "https://i.ibb.co/7d6VgDVL/image.webp",
    genres: ["Sports"]
  },
  "fx": {
    poster: "https://static0.srcdn.com/wordpress/wp-content/uploads/2026/01/gold-fx-channel-logo-1.jpg",
    logo: "https://static0.srcdn.com/wordpress/wp-content/uploads/2026/01/gold-fx-channel-logo-1.jpg",
    genres: ["Entertainment"]
  },
  "fxm": {
    poster: "https://www.awn.com/sites/default/files/styles/original/public/image/featured/50716-buster-creates-brand-id-new-fxm-programming-block_0.jpg",
    logo: "https://www.awn.com/sites/default/files/styles/original/public/image/featured/50716-buster-creates-brand-id-new-fxm-programming-block_0.jpg",
    genres: ["Entertainment"]
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
  "abc", "acc-network", "ae-network", "amc", "american-heroes-channel", "animal-planet", "axs-tv",
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

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 7000;
  app.listen(PORT, () => {
    console.log(`Addon rodando em: http://127.0.0.1:${PORT}/manifest.json`);
  });
}

module.exports = app;
