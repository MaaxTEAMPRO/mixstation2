// Banco de dados das radios.
// Cada entrada possui: name, url, icon e genre (categoria usada no filtro).
const stations = [
    // ---------- Pop / Hits ----------
    { name: 'Antenne Bayern', url: 'https://stream.antenne.de/antenne', icon: 'icons/Antenne_Bayern.webp', genre: 'Pop' },
    { name: 'Hunter FM Pop', url: 'https://live.hunter.fm/pop_high', icon: 'icons/Hunter_FM_Pop.jpg', genre: 'Pop' },
    { name: 'Antenne Bayern - Top 40', url: 'https://mp3channels.webradio.antenne.de/top-40', icon: 'icons/Antenne_Bayern_TOP_40.webp', genre: 'Pop' },
    { name: 'Antenne Bayern - Happy Hits', url: 'https://s6-webradio.antenne.de/happy-hits/stream/mp3', icon: 'icons/Antenne_Bayern_Happy_Hits.webp', genre: 'Pop' },
    { name: 'Antenne Bayern - Party Hits', url: 'https://s7-webradio.antenne.de/sommer-hits/stream/mp3', icon: 'icons/Antenne_Bayern_Party_Hits.webp', genre: 'Pop' },
    { name: 'Antenne Bayern - In The Mix', url: 'https://mp3channels.webradio.antenne.de/hitmix', icon: 'icons/Antenne_Bayern_In_The_Mix.webp', genre: 'Pop' },

    // ---------- Oldies / 70s / 80s / Retro ----------
    { name: 'Antenne Bayern - Oldies but Goldies', url: 'https://stream.antenne.de/oldies-but-goldies/stream/aacp', icon: 'icons/Antenne_Bayern_Oldies_but_Goldies.webp', genre: 'Oldies' },
    { name: 'Antenne Bayern - 70er Hits', url: 'https://stream.antenne.de/70er-hits/stream/aacp', icon: 'icons/Antenne_Bayern_70er_Hits.webp', genre: 'Oldies' },
    { name: 'Antenne Bayern - 70er Rock', url: 'https://s8-webradio.antenne.de/antenne-bayern-70er-rock/stream/aacp', icon: 'icons/Antenne_Bayern_70er_Rock.webp', genre: 'Oldies' },
    { name: 'Antenne Bayern - 80er Kulthits', url: 'https://stream.antenne.de/80er-kulthits/stream/aacp', icon: 'icons/Antenne_Bayern_80er_Kulthits.png', genre: 'Oldies' },
    { name: 'Antenne Bayern - 2000 Hits', url: 'https://s2-webradio.antenne.de/2000er-hits', icon: 'icons/Antenne_Bayern_2000_Hits.webp', genre: 'Oldies' },
    { name: 'Oldie Antenne - 80er Hits', url: 'https://s3-webradio.oldie-antenne.de/oldie-antenne-80er-hits/stream/aacp', icon: 'icons/Oldie_Antenne_80er_Hits.webp', genre: 'Oldies' },
    { name: 'Oldie Antenne - Rock Classics', url: 'https://s3-webradio.oldie-antenne.de/oldie-antenne-rock-classics/stream/aacp', icon: 'icons/Oldie_Antenne_Rock_Classics.webp', genre: 'Oldies' },
    { name: 'Oldie Antenne - NDW', url: 'https://s3-webradio.oldie-antenne.de/oldie-antenne-ndw/stream/mp3', icon: 'icons/Oldie_Antenne_NDW.webp', genre: 'Oldies' },
    { name: 'Hunter FM - 80s Retro', url: 'https://live.hunter.fm/80s_high', icon: 'icons/Hunter_FM_80s_Retro.jpg', genre: 'Oldies' },
    { name: 'Italia anni 60', url: 'https://str01.fluidstream.net/anni60.mp3', icon: 'icons/Italia_anni_60.jpg', genre: 'Oldies' },
    { name: 'Love Radio - Timeless Songs', url: 'https://stream.btsstream.com:8092/loveradio.aac', icon: 'icons/Love_Radio_Timeless_Songs.png', genre: 'Oldies' },
    { name: 'Guldkanalen 80-tal', url: 'https://stream.dbmedia.se/gk80tal96', icon: 'icons/fallback.png', genre: 'Oldies' },
    { name: 'Guldkanalen 70-tal', url: 'https://stream.dbmedia.se/gk70tal96', icon: 'icons/fallback.png', genre: 'Oldies' },
    { name: 'Guldkanalen 90-tal', url: 'https://stream.dbmedia.se/gk90tal96', icon: 'icons/fallback.png', genre: 'Oldies' },
    { name: 'Guldkanalen 60-tal', url: 'https://stream.dbmedia.se/gk60tal96', icon: 'icons/fallback.png', genre: 'Oldies' },
    { name: 'Studio Flashback', url: 'https://stream.zeno.fm/6gv76f1xruquv', icon: 'icons/fallback.png', genre: 'Oldies' },

    // ---------- Sertanejo ----------
    { name: 'Hunter - Moda Sertaneja', url: 'https://live.hunter.fm/modasertaneja_high', icon: 'icons/Hunter_Moda_Sertaneja.jpg', genre: 'Sertanejo' },
    { name: 'Hunter FM - Sertanejo', url: 'https://live.hunter.fm/sertanejo_high', icon: 'icons/Hunter_FM_Sertanejo.jpg', genre: 'Sertanejo' },

    // ---------- Country ----------
    { name: '100.9 Classic Country', url: 'https://live.amperwave.net/direct/wboc-waaifmmp3-ibc2?_=84', icon: 'icons/100_9_Classic_Country.png', genre: 'Country' },
    { name: '1FM - Country One', url: 'https://strm112.1.fm/country_mobile_mp3', icon: 'icons/1FM_Country_One.png', genre: 'Country' },

    // ---------- Eletronica / House / Dance ----------
    { name: 'FG Radio - Remixes', url: 'https://stream.rcs.revma.com/w1psqtmd342vv', icon: 'icons/FG_Radio_Remixes.jpg', genre: 'Dance' },
    { name: 'FG Radio - Mix House', url: 'https://stream.rcs.revma.com/5kucq079n98uv', icon: 'icons/ibiza_global_radio.png', genre: 'Dance' },
    { name: 'FG Radio - Tech House', url: 'https://stream.rcs.revma.com/007e1v9f772vv', icon: 'icons/ibiza_global_radio.png', genre: 'Dance' },
    { name: 'Ibiza - Global Radio', url: 'https://listenssl.ibizaglobalradio.com:8024/ibizaglobalradio.mp3', icon: 'icons/ibiza_global_radio.png', genre: 'Dance' },
    { name: 'Ibiza - Global Classics', url: 'https://control.streaming-pro.com:8000/ibizaglobalclassics.mp3', icon: 'icons/Ibiza_Global_Classics.jpg', genre: 'Dance' },

    // ---------- Chill / Lounge / Coffee ----------
    { name: 'Antenne Bayern - Coffee Music', url: 'https://stream.antenne.de/coffee/stream/aacp', icon: 'icons/Antenne_Bayern_Coffee_Music.webp', genre: 'Chill' },
    { name: 'RFM Lounge', url: 'https://stream.rfm.fr/rfm-wr6.mp3', icon: 'icons/RFM_Lounge.png', genre: 'Chill' },
    { name: 'RFM - Slow', url: 'https://rfm.lmn.fm/rfm-wr13.aac', icon: 'icons/RFM_Slow.png', genre: 'Chill' },
    { name: 'RFM - 80s', url: 'https://stream.rfm.fr/rfm-wr7.aac', icon: 'icons/RFM_80s.png', genre: 'Chill' },
    { name: 'Radio Kos', url: 'https://lyd.radiokos.no/kos_hq', icon: 'icons/fallback.png', genre: 'Chill' },

    // ---------- Brasileiras / Locais ----------
    { name: 'Jovem Pan', url: 'https://ice.fabricahost.com.br/jovempansp1009', icon: 'icons/Jovem_Pan.jpg', genre: 'Brasil' },
    { name: 'Jovem Pan Classic', url: 'https://stream.zeno.fm/rtk4pzcome3vv', icon: 'icons/Jovem_Pan_Classic.png', genre: 'Brasil' },
    { name: 'Radio Clube de Canoinhas', url: 'https://cast.youngtech.radio.br/radio/8370/radio', icon: 'icons/Radio_Clube_de_Canoinhas.jpg', genre: 'Brasil' },

    // ---------- Selecao (caminhoneiros / simuladores / locais) ----------
    { name: 'Truckers FM', url: 'https://radio.truckers.fm/', icon: 'icons/Truckers_FM.png', genre: 'Seleção' },
    { name: 'TruckSim FM', url: 'https://radio.trucksim.fm:8000/stream', icon: 'icons/TruckSim_FM.jpg', genre: 'Seleção' },
    { name: 'Simulator Radio', url: 'https://simulatorradio.stream/stream.mp3', icon: 'icons/simulator_radio.png', genre: 'Seleção' },
    { name: 'Galaxy Rosenheim', url: 'https://s17.myradiostream.com:13366/;stream.mp3', icon: 'icons/Galaxy_Rosenheim.jpg', genre: 'Seleção' },
    { name: 'AS FM', url: 'https://mastermedia.shoutca.st/proxy/radioasfm?mp=/stream', icon: 'icons/AS_FM.jpg', genre: 'Seleção' }

];

// Generos disponiveis (para popular o seletor de filtro)
const GENRES = [...new Set(stations.map(s => s.genre))];
