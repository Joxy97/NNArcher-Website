import fs from 'node:fs';
const pages = JSON.parse(fs.readFileSync(new URL('../reference/all-pages.json', import.meta.url), 'utf8'));
for (const p of pages.filter(p=>['/','/works','/o-meni'].includes(new URL(p.url).pathname))) {
  console.log(p.url);
  for(const s of p.sections) {
    console.log('SECTION',s.id,s.data.sectionId,s.rect.h);
    console.log([...s.html.matchAll(/<img\b[^>]*>/g)].map(m=>{const tag=m[0];return {src:tag.match(/data-src="([^"]+)"/)?.[1]||tag.match(/src="([^"]+)"/)?.[1],alt:tag.match(/alt="([^"]*)"/)?.[1]};}));
  }
}
const faces=[...pages[0].html.matchAll(/@font-face\s*\{[^}]+\}/g)].map(m=>m[0]);
console.log('FONT FACES',faces.join('\n'));
