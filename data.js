function wl(m) {
  return 299792458 / m;
}

const human = -2.5
const bands = -2
const ieee  = -1

export default [
//{f: 0,                            l: 0,       t: 'DC',                              },
  {f: [20, 20e3],                   l: human,   t: 'Human-audible range',             },
  {f: [wl(780e-9), wl(380e-9)],     l: human,   t: 'Human-visible range',             },

  {f: [3, 30],                      l: bands,   t: 'ELF Extremely low frequency',     },
  {f: [30, 300],                    l: bands,   t: 'SLF Super low frequency',     },
  {f: [300, 3e3],                   l: bands,   t: 'ULF Ultra low frequency',     },
  {f: [3e3, 30e3],                  l: bands,   t: 'VLF Very low frequency',     },
  {f: [30e3, 300e3],                l: bands,   t: 'LF Low frequency',     },
  {f: [300e3, 3e6],                 l: bands,   t: 'MF Medium frequency',     },
  {f: [3e6, 30e6],                  l: bands,   t: 'HF High frequency',     },
  {f: [30e6, 300e6],                l: bands,   t: 'VHF Very high frequency',     },
  {f: [300e6, 3e9],                 l: bands,   t: 'UHF Ultra high frequency',     },
  {f: [3e9, 30e9],                  l: bands,   t: 'SHF Super high frequency',     },
  {f: [30e9, 300e9],                l: bands,   t: 'EHF Extremely high frequency',     },
  {f: [300e9, 3e12],                l: bands,   t: 'THF Tremendously high frequency',     },

  {f: [1e9,  2e9],                  l: ieee,    t: 'L Long wave',     },
  {f: [2e9, 4e9],                   l: ieee,    t: 'S Short wave',     },
  {f: [4e9, 8e9],                   l: ieee,    t: 'C',     },
  {f: [8e9, 12e9],                  l: ieee,    t: 'X',     },
  {f: [12e9, 18e9],                 l: ieee,    t: 'Ku Kurz-under ',     },
  {f: [18e9, 27e9],                 l: ieee,    t: 'K Kurz',     },
  {f: [27e9, 40e9],                 l: ieee,    t: 'Ka Kurz-above',     },
  {f: [40e9, 75e9],                 l: ieee,    t: 'V',     },
  {f: [75e9, 110e9],                l: ieee,    t: 'W',     },
  {f: [110e9, 300e9],               l: ieee,    t: 'G/mm Millimeter',     },

  {f: [2.401e9, 2.483e9],           l: 1,       t: 'Wifi a/b/g/n',                    },
  {f: [5.150e9, 5.835e9],           l: 1,       t: 'Wifi n/ac',                       },
  {f: 103.7e6,                      l: 1,       t: 'NDR Info',                        },
  {f: 50,                           l: 1,       t: 'EU Power Grid AC',                },
  {f: 22.23508e9,                   l: 1,       t: 'Water resonance',                 },
  {f: 2.455e9,                      l: 1,       t: 'Microwave Oven',                  },
].sort((a,b)=>(a.f[0] ? a.f[0] : a.f) - (b.f[0] ? b.f[0] : b.f));
