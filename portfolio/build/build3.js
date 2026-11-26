const fs=require("fs"),path=require("path"),crypto=require("crypto");
const J=JSON.parse(fs.readFileSync("patch3.json","utf8")),P=J.patches;
const sha=b=>crypto.createHash("sha1").update(b).digest("hex");
for(const f of ["build3.js","patch3.json"]){try{fs.unlinkSync(path.join("dist",f));}catch(e){}}
for(const [out,p] of Object.entries(P)){const base=fs.readFileSync(p.base);if(sha(base)!==p.baseSha)throw new Error("base mismatch "+out);
 const parts=[];let pos=0;for(const [i1,i2,t] of p.ops){parts.push(base.subarray(pos,i1),Buffer.from(t,"utf8"));pos=i2;}parts.push(base.subarray(pos));
 const res=Buffer.concat(parts);if(sha(res)!==p.outSha)throw new Error("out mismatch "+out);fs.writeFileSync(path.join("dist",out),res);console.log("patched3",out,res.length);}
(async()=>{for(const [dst,url,h] of J.media){const r=await fetch(url);if(!r.ok)throw new Error("fetch "+r.status+" "+url);const b=Buffer.from(await r.arrayBuffer());if(sha(b)!==h)throw new Error("media mismatch "+dst);fs.writeFileSync(path.join("dist",dst),b);console.log("media",dst,b.length);}})().catch(e=>{console.error(e);process.exit(1);});
