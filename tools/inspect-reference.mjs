import fs from 'node:fs';
const pages = JSON.parse(fs.readFileSync(new URL('../reference/all-pages.json', import.meta.url), 'utf8'));
const wanted = process.argv[2];
for (const p of pages.filter(p => !wanted || new URL(p.url).pathname === wanted)) {
  console.log(JSON.stringify({url:p.url,sections:p.sections.map(s=>({id:s.id,theme:s.data.sectionTheme,rect:s.rect})),headings:p.texts.filter(t=>/^H/.test(t.tag)&&t.rect.x>=0).map(t=>({tag:t.tag,text:t.text,rect:t.rect,font:t.style.fontSize})),bodySample:p.texts.find(t=>t.tag==='P'&&t.text.length>90),images:p.images.filter(i=>i.rect.w>0&&i.rect.x>=0).map(i=>({src:i.src,dim:i.dimensions,rect:i.rect})),fonts:p.resources.filter(r=>/woff|typekit|fonts/.test(r)),fontMarkup:(p.html.match(/.{0,60}(?:@font-face|fonts\.(?:google|gstatic)|typekit|\.woff2?).{0,250}/g)||[]).slice(0,20),form:p.forms.map(f=>f.html)},null,2));
}
