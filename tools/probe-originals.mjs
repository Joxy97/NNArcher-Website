import sharp from 'sharp';
const base='https://images.squarespace-cdn.com/content/v1/6a8b2a61f9f71727bd8dd107/8bf68654-78c9-438d-a6a0-dd5221d9cc86/DSC06956.jpg';
for(const suffix of ['?format=original','?format=6000w','?format=100%25','?download=true']) {
  const r=await fetch(base+suffix);
  const b=Buffer.from(await r.arrayBuffer());
  let meta;try{meta=await sharp(b).metadata();}catch{}
  console.log(suffix,r.status,b.length,meta?.width,meta?.height);
}
