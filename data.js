function wl(m) {
  return 299792458 / m;
}

const human = -2.5;
const bands = -2;
const ieee  = -1;
const wire = 1;
const rf = 2;
const nature = 3;
const av = 4;

const location = ['germany', 'eu', 'europe', 'emea', 'earth']; // todo dynamic location

export default [
//{f: 0,                            l: 0,       t: 'DC',                              },
  {f: [20, 20e3],                   l: human,   t: 'Human-audible range',             },
  {f: [wl(780e-9), wl(380e-9)],     l: human,   t: 'Human-visible range',             },

  {f: [3, 30],                      l: bands,   t: 'ELF Extremely low',               },
  {f: [30, 300],                    l: bands,   t: 'SLF Super low',                   },
  {f: [300, 3e3],                   l: bands,   t: 'ULF Ultra low',                   },
  {f: [3e3, 30e3],                  l: bands,   t: 'VLF Very low',                    },
  {f: [30e3, 300e3],                l: bands,   t: 'LF Low',                          },
  {f: [300e3, 3e6],                 l: bands,   t: 'MF Medium',                       },
  {f: [3e6, 30e6],                  l: bands,   t: 'HF High',                         },
  {f: [30e6, 300e6],                l: bands,   t: 'VHF Very high',                   },
  {f: [300e6, 3e9],                 l: bands,   t: 'UHF Ultra high',                  },
  {f: [3e9, 30e9],                  l: bands,   t: 'SHF Super high',                  },
  {f: [30e9, 300e9],                l: bands,   t: 'EHF Extremely high',              },
  {f: [300e9, 3e12],                l: bands,   t: 'THF Tremendously high',           },

  {f: [1e9,  2e9],                  l: ieee,    t: 'L Long wave',                     },
  {f: [2e9, 4e9],                   l: ieee,    t: 'S Short wave',                    },
  {f: [4e9, 8e9],                   l: ieee,    t: 'C',                               },
  {f: [8e9, 12e9],                  l: ieee,    t: 'X',                               },
  {f: [12e9, 18e9],                 l: ieee,    t: 'Ku Kurz-under ',                  },
  {f: [18e9, 27e9],                 l: ieee,    t: 'K Kurz',                          },
  {f: [27e9, 40e9],                 l: ieee,    t: 'Ka Kurz-above',                   },
  {f: [40e9, 75e9],                 l: ieee,    t: 'V',                               },
  {f: [75e9, 110e9],                l: ieee,    t: 'W',                               },
  {f: [110e9, 300e9],               l: ieee,    t: 'G / mm',                          },

  {f: [148.5e3, 283.5e3],           l: rf,      t: 'AM LW',                           },
  {f: [525e3, 1606.5e3],            l: rf,      t: 'AM MW',                           rex: 'north-america australia philippines'},
  {f: [525e3, 1705e3],              l: rf,      t: 'AM MW',                           rin: 'north-america australia philippines'},
  //{f: [2.3e6, 26.1e6],              l: rf,      t: 'AM SW',                           },
  {f: [87.5e6, 108e6],              l: rf,      t: 'FM radio',                        rex: 'japan'},
  {f: [76e6, 90e6],                 l: rf,      t: 'FM radio',                        rin: 'japan'},
  {f: [2.401e9, 2.483e9],           l: rf,      t: 'Wifi', d: 'a/b/g/n',              },
  {f: [5.150e9, 5.835e9],           l: rf,      t: 'Wifi', d: 'n/ac',                 },
  {f: 103.7e6,                      l: rf,      t: 'NDR Info',                        rin: 'germany' },
  {f: 2.455e9,                      l: rf,      t: 'Microwave Oven',                  },
  {f: [380.2e6, 389.8e6],           l: rf,      t: 'GSM', d: 'T-GSM-380 Uplink',      },
  {f: [390.2e6, 399.8e6],           l: rf,      t: 'GSM', d: 'T-GSM-380 Downlink',    },
  {f: [410.2e6, 419.8e6],           l: rf,      t: 'GSM', d: 'T-GSM-410 Uplink',      },
  {f: [420.2e6, 429.8e6],           l: rf,      t: 'GSM', d: 'T-GSM-410 Downlink',    },
  {f: [450.6e6, 457.6e6],           l: rf,      t: 'GSM', d: 'GSM-450 Uplink',        },
  {f: [460.6e6, 467.6e6],           l: rf,      t: 'GSM', d: 'GSM-450 Downlink',      },
  {f: [479.0e6, 486.0e6],           l: rf,      t: 'GSM', d: 'GSM-480 Uplink',        },
  {f: [489.0e6, 496.0e6],           l: rf,      t: 'GSM', d: 'GSM-480 Downlink',      },
  {f: [698.2e6, 716.2e6],           l: rf,      t: 'GSM', d: 'GSM-710 Uplink',        },
  {f: [728.2e6, 746.2e6],           l: rf,      t: 'GSM', d: 'GSM-710 Downlink',      },
  {f: [777.2e6, 792.2e6],           l: rf,      t: 'GSM', d: 'GSM-750 Uplink',        },
  {f: [747.2e6, 762.2e6],           l: rf,      t: 'GSM', d: 'GSM-750 Downlink',      },
  {f: [806.2e6, 821.2e6],           l: rf,      t: 'GSM', d: 'T-GSM-810 Uplink',      },
  {f: [851.2e6, 866.2e6],           l: rf,      t: 'GSM', d: 'T-GSM-810 Downlink',    },
  {f: [824.2e6, 848.8e6],           l: rf,      t: 'GSM', d: 'GSM-850 Uplink',        rin: 'cala nar'},
  {f: [869.2e6, 893.8e6],           l: rf,      t: 'GSM', d: 'GSM-850 Downlink',      rin: 'cala nar'},
  {f: [880.0e6, 915.0e6],           l: rf,      t: 'GSM', d: 'E-GSM-900 Uplink',      rin: 'apac emea'},
  {f: [925.0e6, 960.0e6],           l: rf,      t: 'GSM', d: 'E-GSM-900 Downlink',    rin: 'apac emea'},
  {f: [876.0e6, 915.0e6],           l: rf,      t: 'GSM', d: 'R-GSM-900 Uplink',      rin: 'apac emea'},
  {f: [921.0e6, 960.0e6],           l: rf,      t: 'GSM', d: 'R-GSM-900 Downlink',    rin: 'apac emea'},
  {f: [870.4e6, 876.0e6],           l: rf,      t: 'GSM', d: 'T-GSM-900 Uplink',      },
  {f: [915.4e6, 921.0e6],           l: rf,      t: 'GSM', d: 'T-GSM-900 Downlink',    },
  {f: [3.4e9, 4.2e9],               l: rf,      t: 'DVB-S',                           rin: 'america asia africa'},
  {f: [10.7e9, 12.75e9],            l: rf,      t: 'DVB-S',                           rin: 'europe'},
  {f: 1575.42e6,                    l: rf,      t: 'GPS',                             },
  {f: 1227.60e6,                    l: rf,      t: 'GPS',                             },

  {f: [0.3e3, 130e3],               l: wire,    t: 'ISDN',                            },
  {f: [0.3e3, 3.4e3],               l: wire,    t: 'POTS',                            },
  {f: [138e3, 2.208e6],             l: wire,    t: 'ADSL+ (Annex B)',                 },
  {f: [138e3, 35e6],                l: wire,    t: 'VDSL2 (Annex B)',                 },
  {f: [111e6, 864e6],               l: wire,    t: 'Cable DVB-C TV'                   },
  {f: [85e6, 111e6],                l: wire,    t: 'Cable FM-Radio'                   },
  {f: [5e6, 85e6],                  l: wire,    t: 'Cable Upstream'                   },
  {f: [111e6, 864e6],               l: wire,    t: 'Cable Downstream'                 },
  {f: 50,                           l: wire,    t: 'EU Power Grid',                   rin: 'europe' },
  {f: 60,                           l: wire,    t: 'US Power Grid',                   rin: 'usa' },

  {f: 22.23508e9,                   l: nature,  t: 'Water resonance',                 },

  {f: 440,                          l: av,      t: 'Concert pitch A',                 },
  {f: 8e3,                          l: av,      t: 'ISDN Samplerate',                 },
  {f: 44.1e3,                       l: av,      t: 'CD Samplerate',                   },
  {f: 48.0e3,                       l: av,      t: 'DVD Samplerate',                  },
  {f: 24,                           l: av,      t: 'Cinema Framerate',                },
  {f: 50,                           l: av,      t: 'EU TV Framerate (PAL)',           rin: 'europe' },
  {f: 59.94,                        l: av,      t: 'US TV Framerate (NTSC)',          rin: 'usa' },
]
  .map((p)=>{
    if (typeof p.f === 'number') p.f = [p.f, p.f];
    if (typeof p.f[1] !== 'number') p.f = [p.f[0], p.f[0]];
    return {
      f: p.f,
      layer: p.l || 1,
      label: p.t,
      color: p.c || 'hsl('+(Math.random()*360)+'deg, 100%, 70%)',
      regionInclude: (p.rin || 'earth').toLowerCase(),
      regionExclude: (p.rex || '').toLowerCase(),
      description: p.d || '',
    };
  })
  //"germany japan".includes('germany')  == true
  .filter(p=>
    location.map(l=>p.regionInclude.includes(l)).reduce((p,c)=>p||c, false)
    && !location.map(l=>p.regionExclude.includes(l)).reduce((p,c)=>p||c, false)
  )
  .sort((a,b)=>(a.f[0] ? a.f[0] : a.f) - (b.f[0] ? b.f[0] : b.f));
