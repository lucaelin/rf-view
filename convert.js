export const radToDegAsync = async (rad)=>(((await rad > 0 ? 0 : 2*Math.PI) + await rad) * 180 / Math.PI);
export const degToRadAsync = async (deg)=>(((await deg > 0 ? 0 : 360) + await deg) * Math.PI / 180);
export const radToDeg = (rad)=>(((rad > 0 ? 0 : 2*Math.PI) + rad) * 180 / Math.PI);
export const degToRad = (deg)=>(((deg > 0 ? 0 : 360) + deg) * Math.PI / 180);
export const add = async (a, b)=>await a + await b;
export const sub = async (a, b)=>await a - await b;
export const mul = async (a, b)=>await a * await b;
export const div = async (a, b)=>await a / await b;
export const SI = (v, fixed = 3)=>{
  if(!Number.isFinite(v)) return v.toString();
  let prefix = '';
  let sign = Math.sign(v);
  v = Math.abs(v);

  if(v>1) {
    let prefixes = ['k', 'M', 'G', 'T', 'P', 'E'];
    for(let i in prefixes) {
      if(v < 1000) break;
      prefix = prefixes[i];
      v = v / 1000;
    }
  } else if(v<1) {
    let prefixes = ['m', 'μ', 'n', 'p', 'f', 'a'];
    for(let i in prefixes) {
      if(v > 1.) break;
      prefix = prefixes[i];
      v = v * 1000;
    }
  }

  return (sign*v).toFixed(fixed) + '\u00A0' + prefix;
};
export const time = (v)=>{
  if(!Number.isFinite(v)) return v.toString();
  v *= 1000;
  let sign = Math.sign(v);
  v = Math.abs(v);
  let steps = [     1000,  60,  60,   6,        426,   Infinity];
  let names = ['\u00A0s', '.', ':', ':', '\u00A0d ', '\u00A0y '];
  let onDemand = [false, false, false, false,  true,       true];
  let s = '';
  let mod = 0;
  for(let i in steps) {
    mod = steps[i];
    let val = Math.round(v)%mod;
    if(val > 0 || !onDemand[i]) {
      val = val.toString();
      val = val.padStart(Number.isFinite(mod)?(mod-1).toString().length:0,'0');
      s = val + names[i] + s;
    }
    v = Math.floor(v/mod);
  }
  return sign>=0?''+s:'-'+s;
};
