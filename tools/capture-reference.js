async (page) => {
  const root = 'C:/Users/jovan/Desktop/NNArcher-Website/reference';
  const routes = ['/', '/works', '/usluge', '/o-meni', '/about', '/privacy-policy', '/privacy-policy-1', '/home-1'];
  const summaries = [];
  const captures = [];
  await page.setViewportSize({ width: 1440, height: 1000 });
  for (const route of routes) {
    const name = route === '/' ? 'home' : route.slice(1);
    await page.goto('https://www.nnarcher.com' + route, { waitUntil: 'networkidle' });
    for (let y = 0; y < await page.evaluate(() => document.body.scrollHeight); y += 800) {
      await page.evaluate(y => window.scrollTo(0, y), y);
      await page.waitForTimeout(150);
    }
    await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all([...document.images].map(i => i.decode().catch(() => {})));
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(300);
    const data = await page.evaluate(() => {
      const rect = el => { const r = el.getBoundingClientRect(); return { x:r.x,y:r.y,w:r.width,h:r.height }; };
      const style = el => { const s=getComputedStyle(el); return Object.fromEntries(['fontFamily','fontSize','fontWeight','lineHeight','letterSpacing','color','backgroundColor','textAlign','padding','margin','borderRadius','objectFit','objectPosition'].map(k=>[k,s[k]])); };
      return {
        title:document.title, url:location.href, text:document.body.innerText,
        html:document.documentElement.outerHTML,
        links:[...document.querySelectorAll('a')].map(a=>({text:a.innerText.trim(),href:a.getAttribute('href')})),
        images:[...document.images].map(i=>({src:i.getAttribute('data-src')||i.src,currentSrc:i.currentSrc,alt:i.alt,dimensions:i.getAttribute('data-image-dimensions'),natural:[i.naturalWidth,i.naturalHeight],rect:rect(i),style:style(i)})),
        texts:[...document.querySelectorAll('h1,h2,h3,h4,p,.header-title-text,.header-nav-item a,.sqs-block-button-element')].map(el=>({tag:el.tagName,text:el.innerText,rect:rect(el),style:style(el)})),
        sections:[...document.querySelectorAll('.page-section')].map(el=>({id:el.id,data:el.dataset,rect:rect(el),style:style(el),html:el.outerHTML})),
        forms:[...document.forms].map(f=>({action:f.action,html:f.outerHTML})),
        styles:[...document.styleSheets].map(s=>s.href).filter(Boolean),
        resources:performance.getEntriesByType('resource').map(r=>r.name)
      };
    });
    captures.push(data);
    await page.screenshot({path:root+'/'+name+'-desktop.png',fullPage:true});
    summaries.push({route,title:data.title,text:data.text,images:data.images.length,forms:data.forms.length});
  }
  await page.evaluate(data => window.__referenceCaptures = data, captures);
  return summaries;
}
