const express = require("express");
const { addonBuilder, getRouter } = require("stremio-addon-sdk");

// 1. Função auxiliar para formatar os nomes dos canais
function formatName(slug) {
  return slug
    .split("-")
    .map((word) => word.toUpperCase())
    .join(" ");
}

// 2. Metadados completos com logos e categorias para todos os canais
const customChannelMeta = {
  "abc": {
    logo: "https://cdn.abcotvs.com/dip/images/11479454_011822-cc-abc-generic-thumb-img.jpg",
    genres: ["Entertainment"]
  },
  "acc-network": {
    logo: "https://theacc.com/images/2018/11/30/ACCN_Launch.png",
    genres: ["Sports"]
  },
  "ae-network": {
    logo: "https://www.aetv.com/assets/images/aetv/generic-thumb.jpg",
    genres: ["Entertainment"]
  },
  "amc": {
    logo: "https://tvseriesfinale.com/wp-content/uploads/2014/08/amc02.jpg",
    genres: ["Entertainment"]
  },
  "american-heroes-channel": {
    logo: "https://payload.cargocollective.com/1/10/342209/9724942/AHC_15a_3_1340_c.jpg",
    genres: ["Entertainment"]
  },
  "animal-planet": {
    logo: "https://mir-s3-cdn-cf.behance.net/project_modules/disp/f9ee57107702215.5facf9f601507.jpg",
    genres: ["Entertainment"]
  },
  "axs-tv": {
    logo: "https://www.hcc.net/wp-content/uploads/2012/06/AXS_TV_BlueWhite.jpg",
    genres: ["Entertainment"]
  },
  "bbc-america": {
    logo: "https://veja.abril.com.br/wp-content/uploads/2016/11/bbc-america.jpg",
    genres: ["Entertainment"]
  },
  "bbc-one-london": {
    logo: "https://ichef.bbci.co.uk/images/ic/1200x675/p0dkt7rv.jpg",
    genres: ["Entertainment"]
  },
  "bbc-two": {
    logo: "https://ichef.bbci.co.uk/images/ic/1200x675/p0bvs8dg.jpg",
    genres: ["Entertainment"]
  },
  "bein-sports": {
    logo: "https://assets-us-01.kc-usercontent.com/31dbcbc6-da4c-0033-328a-d7621d0fa726/1318873e-8501-4f79-bb69-182d741cf9ad/beIN%20SPORTS%20Portada.jpg?ver=03-06-2025&w=3840&q=75",
    genres: ["Sports"]
  },
  "bein-sports-francais-1": {
    logo: "https://cdn.jsdelivr.net/gh/willthequeencome/img-cdn/beinsports.png",
    genres: ["Sports"]
  },
  "bein-sports-francais-2": {
    logo: "https://cdn.jsdelivr.net/gh/willthequeencome/img-cdn/beinsports.png",
    genres: ["Sports"]
  },
  "bein-sports-francais-3": {
    logo: "https://cdn.jsdelivr.net/gh/willthequeencome/img-cdn/beinsports.png",
    genres: ["Sports"]
  },
  "big-ten-network": {
    logo: "https://bigten.org/common/controls/image_handler.aspx?thumb_id=0&image_path=/images/2026/8/11/BTN.jpg",
    genres: ["Sports"]
  },
  "boomerang": {
    logo: "https://cdn.broadbandtvnews.com/wp-content/uploads/2024/08/05120702/Boomerang.jpg",
    genres: ["Cartoons"]
  },
  "bravo": {
    logo: "https://www.bravotv.com/sites/bravo/files/2024/05/bravo-logo-2jpg.jpg",
    genres: ["Entertainment"]
  },
  "canal-extra-1": {
    logo: "https://cdn.jsdelivr.net/gh/willthequeencome/img-cdn/canalextra.png",
    genres: ["Sports"]
  },
  "canal-extra-2": {
    logo: "https://cdn.jsdelivr.net/gh/willthequeencome/img-cdn/canalextra.png",
    genres: ["Sports"]
  },
  "canal-sport-pl": {
    logo: "https://cdn.jsdelivr.net/gh/willthequeencome/img-cdn/canansport.png",
    genres: ["Sports"]
  },
  "canal-sport-2-pl": {
    logo: "https://cdn.jsdelivr.net/gh/willthequeencome/img-cdn/canansport.png",
    genres: ["Sports"]
  },
  "canal-sport-3-pl": {
    logo: "https://cdn.jsdelivr.net/gh/willthequeencome/img-cdn/canansport.png",
    genres: ["Sports"]
  },
  "canal-sport-4-pl": {
    logo: "https://cdn.jsdelivr.net/gh/willthequeencome/img-cdn/canansport.png",
    genres: ["Sports"]
  },
  "canal-sport-5-pl": {
    logo: "https://cdn.jsdelivr.net/gh/willthequeencome/img-cdn/canansport.png",
    genres: ["Sports"]
  },
  "canal-sport-6-pl": {
    logo: "https://cdn.jsdelivr.net/gh/willthequeencome/img-cdn/canansport.png",
    genres: ["Sports"]
  },
  "cartoon-network": {
    logo: "https://1000logos.net/wp-content/uploads/2016/10/Cartoon-Network-logo.jpg",
    genres: ["Cartoons"]
  },
  "cbeebies": {
    logo: "https://static.files.bbci.co.uk/core/website/assets/static/childrens-web/images/metadata/cbeebies-poster-1024x576.8eb27aa32e.png",
    genres: ["Cartoons"]
  },
  "cbs": {
    logo: "https://wwwimage-tve.cbsstatic.com/base/files/seo/cbs_seo_1200x627_1.jpg",
    genres: ["Entertainment"]
  },
  "cbs-sports-network": {
    logo: "https://www.paramountshop.com/cdn/shop/files/cbssportsnetwork-mobile-min.png",
    genres: ["Sports"]
  },
  "cnbc": {
    logo: "https://cdn.versantmedia.com/versantmedia/styles/newsroom/s3/2025-11/cnbc%281600x900%29.png",
    genres: ["Entertainment"]
  },
  "comedy-central": {
    logo: "https://wwwimage-us.pplusstatic.com/base/files/seo/og-brand-comedy-central.jpg?format=webp",
    genres: ["Entertainment"]
  },
  "cw": {
    logo: "https://www.wavy.com/wp-content/uploads/sites/3/2024/08/cw-logo-white-on-blue-wavy-background.jpg?w=1280",
    genres: ["Entertainment"]
  },
  "dazn-1-germany": {
    logo: "https://image.discovery.indazn.com/ca/v2/ca/image?id=12dpnhddhmpm71228raanhyxs2_image-header_pDach_1723627450000&quality=70",
    genres: ["Sports"]
  },
  "dazn-2-germany": {
    logo: "https://image.discovery.indazn.com/ca/v2/ca/image?id=1ni1lpwjtnxmr1xklfoptrt2mz_image-header_pDach_1723628653000",
    genres: ["Sports"]
  },
  "dazn-1-italia": {
    logo: "https://image.discovery.indazn.com/ca/v2/ca/image?id=pterrit4f2xu1pa2r6x87y5e9_image-header_pIt_1724315365000&quality=70",
    genres: ["Sports"]
  },
  "dazn-1-spain": {
    logo: "https://image.discovery.indazn.com/ca/v2/ca/image?id=hn9vkic8rbfi1ndrym8sw2qh7_image-header_pEs_1723035920000",
    genres: ["Sports"]
  },
  "dazn-2-spain": {
    logo: "https://image.discovery.indazn.com/ca/v2/ca/image?id=2ouwtae8ad7l1fxviow9bowpk_image-header_pEs_1723118632000&quality=70",
    genres: ["Sports"]
  },
  "dazn-1-portugal": {
    logo: "https://image.discovery.indazn.com/ca/v2/ca/image?id=1o4eamzb4env61ddc8wv4ra06l_image-header_pRow_1720521601000&quality=70",
    genres: ["Sports"]
  },
  "dazn-1-usa": {
    logo: "https://image.discovery.indazn.com/ca/v2/ca/image?id=1owzb99m9mnzy15hjxolpukwul_image-header_pUs_1771501796000&quality=70",
    genres: ["Sports"]
  },
  "dazn-f1": {
    logo: "https://image.discovery.indazn.com/ca/v2/ca/image?id=14ln25pmjdv031ejxsmg8dczsu_image-header_pEs_1723117975000&quality=70",
    genres: ["Sports"]
  },
  "dazn-laliga": {
    logo: "https://image.discovery.indazn.com/ca/v2/ca/image?id=1weziux6zy5mb16pev002ax1yu_image-header_pEs_1723118324000",
    genres: ["Sports"]
  },
  "discovery-channel": {
    logo: "https://i.ibb.co/k2rbB1jc/e35d6be84084fed1d756c39242f13163.webp",
    genres: ["Entertainment"]
  },
  "discovery-family": {
    logo: "https://i.ibb.co/wFmT9Q5t/Discovery-Family-ID-Let-s-Go-Yellow.webp",
    genres: ["Cartoons"]
  },
  "discovery-turbo": {
    logo: "https://i.ibb.co/20MgSXjy/featured-Image-1767979538707.jpg",
    genres: ["Entertainment"]
  },
  "disney-channel": {
    logo: "https://vignette4.wikia.nocookie.net/logopedia/images/9/93/Disney_Channel_Original_2014.png/revision/latest?cb=20140705213010",
    genres: ["Cartoons"]
  },
  "disney-junior": {
    logo: "https://thewaltdisneycompany.com/app/uploads/2021/02/021221_Disney-Junior-10th-Anniversary-00.jpg",
    genres: ["Cartoons"]
  },
  "disney-xd": {
    logo: "https://www.laughingplace.com/uploads/2015/10/d128457e3b3ab8c050f306aa8e23666b9b05d3cc.jpg",
    genres: ["Cartoons"]
  },
  "eleven-sports-1": {
    logo: "https://cdn.jsdelivr.net/gh/willthequeencome/img-cdn/100659.png",
    genres: ["Sports"]
  },
  "eleven-sports-2": {
    logo: "https://cdn.jsdelivr.net/gh/willthequeencome/img-cdn/100659.png",
    genres: ["Sports"]
  },
  "eleven-sports-3": {
    logo: "https://cdn.jsdelivr.net/gh/willthequeencome/img-cdn/100659.png",
    genres: ["Sports"]
  },
  "eleven-sports-4": {
    logo: "https://cdn.jsdelivr.net/gh/willthequeencome/img-cdn/100659.png",
    genres: ["Sports"]
  },
  "espn": {
    logo: "https://a1.espncdn.com/combiner/i?img=%2Fi%2Fespn%2Fespn_logos%2Fespn_red.png",
    genres: ["Sports"]
  },
  "espn-deportes": {
    logo: "https://i.ibb.co/Y7zHmbbz/i.png",
    genres: ["Sports"]
  },
  "espn2": {
    logo: "https://discgolf.ultiworld.com/wp-content/uploads/2020/10/ESPN2.png",
    genres: ["Sports"]
  },
  "espnews": {
    logo: "https://i.ibb.co/5h4LGFHq/image.png",
    genres: ["Sports"]
  },
  "espnu": {
    logo: "https://i.ibb.co/Lh5jHVDm/ESPNU-logo-1-jpg.webp",
    genres: ["Sports"]
  },
  "food-network": {
    logo: "https://i.ibb.co/5WcnZbYf/food-network-jpg.jpg",
    genres: ["Entertainment"]
  },
  "fox": {
    logo: "https://i.ibb.co/8JdwqP4/foxusa.png",
    genres: ["Entertainment"]
  },
  "fox-deportes": {
    logo: "https://foxsports-wordpress-www-prsupports-prod.s3.amazonaws.com/uploads/sites/2/2016/12/LOGO-DEPORTES-1040x585.jpg",
    genres: ["Entertainment"]
  },
  "fox-sports-1": {
    logo: "https://www.autoracing1.com/wp-content/uploads/logos/fox-sports-fs1-logo.jpg",
    genres: ["Sports"]
  },
  "fox-sports-2": {
    logo: "https://banner2.cleanpng.com/20180815/qqr/kisspng-fox-sports-networks-television-channel-fox-sports-fox-sports-2-logo-png-online-5b74b3eb441a99.411812021534374891279.jpg",
    genres: ["Sports"]
  },
  "fox-sports-501-cricket": {
    logo: "https://i.ibb.co/Y4bTS1p7/image.webp",
    genres: ["Sports"]
  },
  "fox-sports-502-league": {
    logo: "https://i.ibb.co/tppZhDrb/image.webp",
    genres: ["Sports"]
  },
  "fox-sports-503": {
    logo: "https://i.ibb.co/xS4MkGSL/image.webp",
    genres: ["Sports"]
  },
  "fox-sports-504-footy": {
    logo: "https://i.ibb.co/SXvQLc0M/image.webp",
    genres: ["Sports"]
  },
  "fox-sports-505": {
    logo: "https://i.ibb.co/prKZGNLt/image.webp",
    genres: ["Sports"]
  },
  "fox-sports-506": {
    logo: "https://i.ibb.co/Swks4Lmj/image.webp",
    genres: ["Sports"]
  },
  "fox-sports-507": {
    logo: "https://i.ibb.co/7d6VgDVL/image.webp",
    genres: ["Sports"]
  },
  "fx": {
    logo: "https://static0.srcdn.com/wordpress/wp-content/uploads/2026/01/gold-fx-channel-logo-1.jpg",
    genres: ["Entertainment"]
  },
  "fxm": {
    logo: "https://ygo-assets-entities-us.yougov.net/817b25d9-af2d-11e7-bb98-5f64ef68aa44.jpg",
    genres: ["Entertainment"]
  },
  "fxx": {
    logo: "https://thestreamable.com/media/pages/channels/fxx/b6fc72ce3d-1756344305/fxx-banner-1536x864-crop.png",
    genres: ["Entertainment"]
  },
  "freeform": {
    logo: "https://d2z00kf51ll94q.cloudfront.net//archive/2023/large/ADC102_BCD021B_0.jpg",
    genres: ["Entertainment"]
  },
  "go3-sport-1": {
    logo: "https://cdn.jsdelivr.net/gh/willthequeencome/img-cdn/go3sport.png",
    genres: ["Sports"]
  },
  "go3-sport-2": {
    logo: "https://cdn.jsdelivr.net/gh/willthequeencome/img-cdn/go3sport.png",
    genres: ["Sports"]
  },
  "go3-sport-3": {
    logo: "https://cdn.jsdelivr.net/gh/willthequeencome/img-cdn/go3sport.png",
    genres: ["Sports"]
  },
  "golf-channel": {
    logo: "https://cdn.versantmedia.com/versantmedia/styles/newsroom/s3/2026-01/GC_Logo_STILL.png",
    genres: ["Sports"]
  },
  "hbo": {
    logo: "https://static.hbo.com/2021-11/hbo-static-1920.jpg",
    genres: ["Entertainment"]
  },
  "hbo-comedy": {
    logo: "https://www.tvinsider.com/wp-content/uploads/2022/03/hbo-comedy.png",
    genres: ["Entertainment"]
  },
  "hbo-drama": {
    logo: "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5c/HBO_Drama_Logo.svg/1280px-HBO_Drama_Logo.svg.png",
    genres: ["Entertainment"]
  },
  "hbo-latino": {
    logo: "https://i.ibb.co/TMzmbVYq/maxresdefault.jpg",
    genres: ["Entertainment"]
  },
  "hbo-movies": {
    logo: "https://i.ibb.co/Qv2Mz3ZB/https-archive-images-prod-global-a201836-reutersmedia-net-2016-10-30-LYNXMPEC9-T08-O.avif",
    genres: ["Entertainment"]
  },
  "hgtv": {
    logo: "https://i.ibb.co/gbtDnLhS/hgtv-jpg.jpg",
    genres: ["Entertainment"]
  },
  "mlb-network": {
    logo: "https://img.mlbstatic.com/mlb-images/image/private/t_16x9/t_w2208/mlb/xtkynqe5wgtzaddnsus2.jpg",
    genres: ["Sports"]
  },
  "motogp-channel": {
    logo: "https://sportbikesincmag.com/wp-content/uploads/2024/11/New-MotoGP-Logo-sportbikesincmag.com-4.jpg",
    genres: ["Sports"]
  },
  "movistar-deportes": {
    logo: "https://cdn.jsdelivr.net/gh/willthequeencome/img-cdn/movistardeportes.png",
    genres: ["Sports"]
  },
  "movistar-deportes-2": {
    logo: "https://cdn.jsdelivr.net/gh/willthequeencome/img-cdn/movistardeportes.png",
    genres: ["Sports"]
  },
  "movistar-deportes-3": {
    logo: "https://cdn.jsdelivr.net/gh/willthequeencome/img-cdn/movistardeportes.png",
    genres: ["Sports"]
  },
  "movistar-laliga": {
    logo: "https://cdn.jsdelivr.net/gh/willthequeencome/img-cdn/movistarlaliga.png",
    genres: ["Sports"]
  },
  "movistar-plus": {
    logo: "https://imagenes.hobbyconsolas.com/uploads/imagenes/2026/05/11/6a01f2422d3b19-96205427.jpeg",
    genres: ["Entertainment"]
  },
  "mtv": {
    logo: "https://static0.colliderimages.com/wordpress/wp-content/uploads/2025/12/mtv-logo-1.jpg",
    genres: ["Entertainment"]
  },
  "nba-tv": {
    logo: "https://static.cdn.turner.com/styles/header_image_1500x500_cropped/s3/nba-tv-16x9-1.jpg?itok=6H8mrlyR",
    genres: ["Sports"]
  },
  "nbc": {
    logo: "https://cdn.mos.cms.futurecdn.net/zP42nmS7MRj2kvBqNEs8CE.jpg",
    genres: ["Entertainment"]
  },
  "nbc-sports-bay-area": {
    logo: "https://cdn.mos.cms.futurecdn.net/d7jWexxhtezRZ6ryLHyKmd.jpeg",
    genres: ["Sports"]
  },
  "nbc-sports-philadelphia": {
    logo: "https://media.nbcsportsphiladelphia.com/2023/04/Philly-Landmark.png?resize=1200%2C675&quality=85&strip=all",
    genres: ["Sports"]
  },
  "nfl-network": {
    logo: "https://i.ibb.co/ZRsTndvV/tfki7njrm3y8jycbtkrx.jpg",
    genres: ["Sports"]
  },
  "nhl-network": {
    logo: "https://media.d3.nhle.com/image/private/t_ratio16_9-size50/prd/lhum6z3hyaga9ahnjow0.png",
    genres: ["Sports"]
  },
  "nick-jr": {
    logo: "https://i.ibb.co/xS6CMxZD/nick-jr-logo-2023-4.jpg",
    genres: ["Cartoons"]
  },
  "nickelodeon": {
    logo: "https://i.ibb.co/xSM8bDYh/roger-nickelodeon-graphic-design-format-webp-width-2880-8-Yj-L2u3-KSI20j-HDQ.webp",
    genres: ["Cartoons"]
  },
  "nicktoons": {
    logo: "https://i.ibb.co/XfX32tyx/nicktoons-logo-2023-rebrand-2.png",
    genres: ["Cartoons"]
  },
  "polsat-sport-1": {
    logo: "https://staticeu.sweet.tv/images/cache/v2/channel_banner/COEd/3809-polsat-sport-1-hd.png",
    genres: ["Sports"]
  },
  "polsat-sport-2": {
    logo: "https://staticeu.sweet.tv/images/cache/v2/channel_banner/COId/3810-polsat-sport-2-hd.png",
    genres: ["Sports"]
  },
  "polsat-sport-3": {
    logo: "https://staticeu.sweet.tv/images/cache/v2/channel_banner/COMd/3811-polsat-sport-3-hd.png",
    genres: ["Sports"]
  },
  "polsat-sport-fight": {
    logo: "https://staticeu.sweet.tv/images/cache/v2/channel_banner/COUd/3813-polsat-sport-fight-hd.png",
    genres: ["Sports"]
  },
  "premier-sports-1-ie": {
    logo: "https://cdn.jsdelivr.net/gh/willthequeencome/img-cdn/premiersports.png",
    genres: ["Sports"]
  },
  "premier-sports-2-ie": {
    logo: "https://cdn.jsdelivr.net/gh/willthequeencome/img-cdn/premiersports.png",
    genres: ["Sports"]
  },
  "premiere": {
    logo: "https://s3.glbimg.com/v1/AUTH_36abb2af534644878388f516c38b89ac/prod/home-share-1b75cdaa.png",
    genres: ["Sports"]
  },
  "racer-network": {
    logo: "https://cdn-cs-images.racer.com/v3/assets/blte77f57883ea46be1/bltb30b537c79808b35/680f2c517c8c98109d720e49/Racer_Network_1920x1080_Presser_V1.jpg",
    genres: ["Sports"]
  },
  "sec-network": {
    logo: "https://cdn.jsdelivr.net/gh/willthequeencome/img-cdn/images/2NRKBDE2CLIGI5XHHHHMY2BCAQ.jpg",
    genres: ["Sports"]
  },
  "showtime": {
    logo: "https://i.ibb.co/v7vcNY4/Showtime-Logo.webp",
    genres: ["Entertainment"]
  },
  "showtime-2": {
    logo: "https://i.ibb.co/8gCRbv0s/Showtime-2-svg.webp",
    genres: ["Entertainment"]
  },
  "showtime-extreme": {
    logo: "https://i.ibb.co/1t5fNwpQ/Showtime-Closing-2013.webp",
    genres: ["Entertainment"]
  },
  "showtime-family-zone": {
    logo: "https://i.ibb.co/1t5fNwpQ/Showtime-Closing-2013.webp",
    genres: ["Entertainment"]
  },
  "showtime-next": {
    logo: "https://i.ibb.co/1t5fNwpQ/Showtime-Closing-2013.webp",
    genres: ["Entertainment"]
  },
  "showtime-women": {
    logo: "https://i.ibb.co/1t5fNwpQ/Showtime-Closing-2013.webp",
    genres: ["Entertainment"]
  },
  "sky-sport-1-nz": {
    logo: "https://i.ibb.co/v4NvkZst/Untitled-design.png",
    genres: ["Sports"]
  },
  "sky-sport-2-nz": {
    logo: "https://i.ibb.co/v4NvkZst/Untitled-design.png",
    genres: ["Sports"]
  },
  "sky-sport-3-nz": {
    logo: "https://i.ibb.co/v4NvkZst/Untitled-design.png",
    genres: ["Sports"]
  },
  "sky-sport-4-nz": {
    logo: "https://i.ibb.co/v4NvkZst/Untitled-design.png",
    genres: ["Sports"]
  },
  "sky-sport-5-nz": {
    logo: "https://i.ibb.co/v4NvkZst/Untitled-design.png",
    genres: ["Sports"]
  },
  "sky-sport-6-nz": {
    logo: "https://i.ibb.co/v4NvkZst/Untitled-design.png",
    genres: ["Sports"]
  },
  "sky-sport-7-nz": {
    logo: "https://i.ibb.co/v4NvkZst/Untitled-design.png",
    genres: ["Sports"]
  },
  "sky-sport-8-nz": {
    logo: "https://i.ibb.co/v4NvkZst/Untitled-design.png",
    genres: ["Sports"]
  },
  "sky-sport-9-nz": {
    logo: "https://i.ibb.co/v4NvkZst/Untitled-design.png",
    genres: ["Sports"]
  },
  "sky-sport-select-nz": {
    logo: "https://i.ibb.co/v4NvkZst/Untitled-design.png",
    genres: ["Sports"]
  },
  "sky-sport-bundesliga": {
    logo: "https://www.sportsvideo.org/wp-content/uploads/2024/12/Sky-Sports-Bundesliega-featured.png",
    genres: ["Sports"]
  },
  "sky-sports-plus": {
    logo: "https://e0.365dm.com/24/07/2048x1152/skysports-ssplus-sky-sports-plus_6644064.jpg",
    genres: ["Sports"]
  },
  "sky-sports-action": {
    logo: "https://cdn.jsdelivr.net/gh/willthequeencome/img-cdn/skysportsaction.png",
    genres: ["Sports"]
  },
  "sky-sports-cricket": {
    logo: "https://e0.365dm.com/17/07/2048x1152/skysports-sky-sports-cricket-podcast-sky-cricket-podcast_4004801.jpg",
    genres: ["Sports"]
  },
  "sky-sports-f1": {
    logo: "https://e0.365dm.com/21/03/1600x900/skysports-f1-2021-graphic_5299452.png",
    genres: ["Sports"]
  },
  "sky-sports-football": {
    logo: "https://images.squarespace-cdn.com/content/v1/6380a5b12f7b6f632e16ce77/46d62da8-e650-4d2b-a5bc-48a5648edb8e/Beth_Mead.jpg",
    genres: ["Sports"]
  },
  "sky-sports-golf": {
    logo: "https://e0.365dm.com/23/05/1600x900/skysports-golf-sky-sports-golf_6158933.jpg",
    genres: ["Sports"]
  },
  "sky-sports-main-event": {
    logo: "https://e0.365dm.com/17/07/1600x900/skysports-all-new-rebrand-f1-premier-league-golf-cricket_4001810.jpg",
    genres: ["Sports"]
  },
  "sky-sports-mix": {
    logo: "https://cdn.jsdelivr.net/gh/willthequeencome/img-cdn/Sky_Sports_Mix_Generic_ID_2017.webp",
    genres: ["Sports"]
  },
  "sky-sports-news": {
    logo: "https://cdn.jsdelivr.net/gh/willthequeencome/img-cdn/image.jpg",
    genres: ["Sports"]
  },
  "sky-sports-premier-league": {
    logo: "https://e0.365dm.com/25/06/2048x1152/skysports-premier-league-fixtures_6937276.jpg",
    genres: ["Sports"]
  },
  "sky-sports-racing": {
    logo: "https://e0.365dm.com/23/07/2048x1152/skysports-racing-league-sky-sports-racing_6230990.jpg",
    genres: ["Sports"]
  },
  "sky-sports-tennis": {
    logo: "https://e0.365dm.com/24/01/2048x1152/skysports-sky-sports-tennis_6437709.jpg",
    genres: ["Sports"]
  },
  "sony-sports-network": {
    logo: "https://cdn.jsdelivr.net/gh/willthequeencome/img-cdn/085457534.png",
    genres: ["Sports"]
  },
  "sony-sports-network-2": {
    logo: "https://cdn.jsdelivr.net/gh/willthequeencome/img-cdn/085457534.png",
    genres: ["Sports"]
  },
  "sony-sports-network-3": {
    logo: "https://cdn.jsdelivr.net/gh/willthequeencome/img-cdn/085457534.png",
    genres: ["Sports"]
  },
  "sony-sports-network-4": {
    logo: "https://cdn.jsdelivr.net/gh/willthequeencome/img-cdn/085457534.png",
    genres: ["Sports"]
  },
  "sony-sports-network-5": {
    logo: "https://cdn.jsdelivr.net/gh/willthequeencome/img-cdn/085457534.png",
    genres: ["Sports"]
  },
  "sportdigital-fussball": {
    logo: "https://image.discovery.indazn.com/ca/v2/ca/image?id=712wbfqz8apl1k09rf681eqxd_image-header_pDach_1661948855000&quality=70",
    genres: ["Sports"]
  },
  "sport-tv1": {
    logo: "https://cdn.jsdelivr.net/gh/willthequeencome/img-cdn/sportv-pt.png",
    genres: ["Sports"]
  },
  "sport-tv2": {
    logo: "https://cdn.jsdelivr.net/gh/willthequeencome/img-cdn/sportv-pt.png",
    genres: ["Sports"]
  },
  "sport-tv3": {
    logo: "https://cdn.jsdelivr.net/gh/willthequeencome/img-cdn/sportv-pt.png",
    genres: ["Sports"]
  },
  "sport-tv4": {
    logo: "https://cdn.jsdelivr.net/gh/willthequeencome/img-cdn/sportv-pt.png",
    genres: ["Sports"]
  },
  "sport-tv5": {
    logo: "https://cdn.jsdelivr.net/gh/willthequeencome/img-cdn/sportv-pt.png",
    genres: ["Sports"]
  },
  "starz": {
    logo: "https://careers.starz.com/wp-content/uploads/2025/01/STARZ-LOGO-IMAGE.png",
    genres: ["Entertainment"]
  },
  "starz-cinema": {
    logo: "https://careers.starz.com/wp-content/uploads/2025/01/STARZ-LOGO-IMAGE.png",
    genres: ["Entertainment"]
  },
  "starz-comedy": {
    logo: "https://careers.starz.com/wp-content/uploads/2025/01/STARZ-LOGO-IMAGE.png",
    genres: ["Entertainment"]
  },
  "starz-kids-and-family": {
    logo: "https://careers.starz.com/wp-content/uploads/2025/01/STARZ-LOGO-IMAGE.png",
    genres: ["Cartoons"]
  },
  "syfy": {
    logo: "https://assets.goal.com/images/v3/blt1be56273baf0440d/syfy%20logo.jpg?auto=webp&format=pjpg&width=3840&quality=60",
    genres: ["Entertainment"]
  },
  "tbs": {
    logo: "https://cdn.sanity.io/images/1pn9obcz/production/a6971fbe09c85f2deeb480fc494a39219d039135-1920x1080.jpg",
    genres: ["Entertainment"]
  },
  "teenick": {
    logo: "https://i.ibb.co/3yCJDVrW/Teen-Nick-2023.webp",
    genres: ["Cartoons"]
  },
  "telemundo": {
    logo: "https://media-cldnry.s-nbcnews.com/image/upload/newscms/2020_20/3352176/telemundo-social-default.png",
    genres: ["Entertainment"]
  },
  "tennis-channel": {
    logo: "https://s10019.cdn.ncms.io/wp-content/uploads/2026/05/tenn2.jpg.jpeg",
    genres: ["Sports"]
  },
  "the-weather-channel": {
    logo: "https://www.nj.com/resizer/v2/LWRBPBUMCVFA3G5Q4ZH3XJYDNY.jpg?auth=4a59ec67834efd4c8c6e3b11b7b78bca566531ab2663e818397b022b71ed1065&width=1280&smart=true&quality=90",
    genres: ["News/Politics"]
  },
  "tnt": {
    logo: "https://i.ytimg.com/vi/F-AHKcxi3pY/maxresdefault.jpg",
    genres: ["Entertainment"]
  },
  "tnt-sports-1": {
    logo: "https://cdn.mos.cms.futurecdn.net/y3oPitXYAwGJnyTHFYo5qB.jpeg",
    genres: ["Sports"]
  },
  "tnt-sports-2": {
    logo: "https://cdn.mos.cms.futurecdn.net/y3oPitXYAwGJnyTHFYo5qB.jpeg",
    genres: ["Sports"]
  },
  "tnt-sports-3": {
    logo: "https://cdn.mos.cms.futurecdn.net/y3oPitXYAwGJnyTHFYo5qB.jpeg",
    genres: ["Sports"]
  },
  "tnt-sports-4": {
    logo: "https://cdn.mos.cms.futurecdn.net/y3oPitXYAwGJnyTHFYo5qB.jpeg",
    genres: ["Sports"]
  },
  "trutv": {
    logo: "https://i.ibb.co/DfGcnjXY/Header-tru-TV.webp",
    genres: ["Entertainment"]
  },
  "tsn1": {
    logo: "https://www.bellmedia.ca/lede/wp-content/uploads/2024/09/18581592_10155403529061055_8240563011649656197_n.jpg",
    genres: ["Sports"]
  },
  "tudn": {
    logo: "https://cdn.aptoide.com/imgs/e/e/6/ee65573e3ed2c5fcafa0191860afdf51_fgraphic.png",
    genres: ["Sports"]
  },
  "tyc-sports-internacional": {
    logo: "https://assets.goal.com/images/v3/blta396e76391fffdfa/TyC_Sports_logo.jpg",
    genres: ["Sports"]
  },
  "ufc-fight-pass-24-7": {
    logo: "https://fightrecord.co.uk/wp-content/uploads/2020/12/ufc-fight-pass-lion-fight-muay-thai.jpg",
    genres: ["Sports"]
  },
  "usa-network": {
    logo: "https://variety.com/wp-content/uploads/2013/10/usa-network-logo1.jpg",
    genres: ["Entertainment"]
  },
  "wapa-america": {
    logo: "https://m.media-amazon.com/images/I/81AEkpHaIPL._SL1920_.png",
    genres: ["Entertainment"]
  },
  "wapa-deportes": {
    logo: "https://i.ibb.co/pBzhsJ17/WAPA-Deportes.jpg",
    genres: ["Entertainment"]
  },
  "willow-cricket": {
    logo: "https://mgpindia.com/wp-content/uploads/2021/10/willow-logo.jpg",
    genres: ["Sports"]
  },
  "willow-cricket-2": {
    logo: "https://d229kpbsb5jevy.cloudfront.net/tv/1920/1080/languages/WILLOW-2.jpg",
    genres: ["Sports"]
  },
  "sky-sport-24": {
    logo: "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200_webp/dfa89629775883.5602ff6b0aacf.jpg",
    genres: ["Sports"]
  },
  "sky-sport-uno": {
    logo: "https://i.imgur.com/dnoy7mK.png",
    genres: ["Sports"]
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
    poster: custom.poster || custom.logo || null,
    logo: custom.logo || custom.poster || null,
    posterShape: "landscape",
    genres: custom.genres || ["General"],
    description: `Assistir ao canal ${formatName(slug)} em direto 24/7.`,
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
      return Promise.resolve({
        streams: [
          {
            title: "Abrir no Navegador / Web Stream",
            externalUrl: channel.externalUrl
          }
        ]
      });
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
