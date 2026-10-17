async (page) => {
  // Run through the Playwright browser tool against npm start on port 4173.
  const base = 'http://127.0.0.1:4173';
  const report = {checkedAt: new Date().toISOString(), layouts: [], interactions: {}};
  const errors=[];
  const errorListener=error=>errors.push(error.message);
  page.on('pageerror',errorListener);
  for(const width of [320,390,768,1024,1440,1920]) {
    await page.setViewportSize({width,height:900});
    for(const route of ['/','/works/','/usluge/','/o-meni/','/about/','/privacy-policy/','/privacy-policy-1/']) {
      await page.goto(base+route,{waitUntil:'networkidle'});
      const layout=await page.evaluate(()=>({route:location.pathname,width:innerWidth,overflow:document.documentElement.scrollWidth-innerWidth,clipped:[...document.querySelectorAll('h1,h2,h3,main input,main select,main textarea')].filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&(r.left< -1||r.right>innerWidth+1)&&!e.closest('.service-track');}).map(e=>e.textContent.trim().slice(0,70))}));
      if(layout.overflow>1||layout.clipped.length)throw new Error(JSON.stringify(layout));
      report.layouts.push(layout);
      if([390,1440].includes(width)&&['/','/works/','/usluge/','/o-meni/','/about/'].includes(route)) {
        await page.evaluate(async()=>{document.querySelectorAll('img').forEach(i=>i.loading='eager');await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));});
        await page.screenshot({path:`C:/Users/jovan/Desktop/NNArcher-Website/reference/rebuild-${route==='/'?'home':route.split('/')[1]}-${width===390?'mobile':'desktop'}.png`,fullPage:true});
      }
    }
  }
  await page.setViewportSize({width:390,height:844});
  await page.goto(base);
  await page.getByRole('button',{name:'Otvori meni'}).click();
  if(!(await page.locator('#main-navigation').isVisible()))throw new Error('Menu did not open');
  if(!(await page.locator('main').evaluate(e=>e.inert)))throw new Error('Menu focus isolation failed');
  await page.keyboard.press('Escape');
  if(await page.locator('#main-navigation').isVisible())throw new Error('Menu did not close');
  report.interactions.menu=true;
  const left=await page.locator('.service-track').evaluate(e=>e.scrollLeft);
  await page.getByRole('button',{name:'Sledeće usluge'}).click();
  await page.waitForTimeout(500);
  if((await page.locator('.service-track').evaluate(e=>e.scrollLeft))<=left)throw new Error('Carousel did not move');
  report.interactions.carousel=true;
  await page.goto(base+'/works/');
  await page.locator('.gallery-photo').first().click();
  if(!(await page.locator('.lightbox').isVisible()))throw new Error('Lightbox did not open');
  await page.keyboard.press('ArrowRight');
  if((await page.locator('.lightbox figcaption').innerText())!=='2 / 12')throw new Error('Lightbox navigation failed');
  await page.keyboard.press('Escape');
  if(await page.locator('.lightbox').isVisible())throw new Error('Lightbox did not close');
  report.interactions.gallery=true;
  async function fillForm() {
    await page.goto(base+'/about/?service=Portret');
    if((await page.locator('#service').inputValue())!=='Portret')throw new Error('Booking prefill failed');
    await page.locator('#full-name').fill('Local Test');
    await page.locator('#email').fill('test@example.invalid');
    await page.locator('#phone').fill('+381 65 123 4567');
    await page.locator('#date').fill('2027-06-15');
    await page.locator('#details').fill('Local verification only');
  }
  await fillForm();
  await page.getByRole('button',{name:'POŠALJITE ZAHTEV'}).click();
  if(!(await page.locator('#email-fallback').isVisible()))throw new Error('Email fallback absent');
  if(!(await page.locator('#email-draft').getAttribute('href')).startsWith('mailto:photo@nnarcher.com?'))throw new Error('Email draft invalid');
  report.interactions.emailFallback=true;
  // Intercepted browser responses test UI states without sending any email.
  await page.route('**/contact-config.json',route=>route.fulfill({json:{mode:'smtp'}}));
  await page.route('**/api/contact',route=>route.fulfill({json:{ok:true}}));
  await fillForm();
  await page.getByRole('button',{name:'POŠALJITE ZAHTEV'}).click();
  await page.locator('#form-status[data-state=success]').waitFor();
  if((await page.locator('#full-name').inputValue())!=='')throw new Error('Successful form was not reset');
  report.interactions.successUI=true;
  await page.unroute('**/api/contact');
  await page.route('**/api/contact',route=>route.fulfill({status:502,json:{ok:false}}));
  await fillForm();
  await page.getByRole('button',{name:'POŠALJITE ZAHTEV'}).click();
  await page.locator('#form-status[data-state=error]').waitFor();
  if(!(await page.locator('#email-fallback').isVisible())||(await page.locator('#full-name').inputValue())!=='Local Test')throw new Error('Failed submission lost input or fallback');
  report.interactions.failureUI=true;
  await page.unroute('**/api/contact');
  await page.unroute('**/contact-config.json');
  page.off('pageerror',errorListener);
  report.errors=errors;
  if(errors.length)throw new Error(errors.join('\n'));
  await page.goto(base);
  await page.evaluate(report=>window.__verificationReport=report,report);
  return {layouts:report.layouts.length,interactions:report.interactions,errors};
}
