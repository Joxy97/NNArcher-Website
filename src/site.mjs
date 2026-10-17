import { services } from "./services.mjs";
export const escape = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const e = escape;
const navItems = [
  ["/", "POČETNA"],
  ["/works/", "GALERIJA"],
  ["/usluge/", "USLUGE"],
  ["/o-meni/", "O MENI"],
  ["/about/", "KONTAKT"],
];
const button = (href, text, cls = "") =>
  `<a class="button ${cls}" href="${e(href)}">${text}</a>`;
const contactLinks = (cls = "") =>
  `<div class="contact-links ${cls}"><p>Instagram: <a href="https://www.instagram.com/nnarcher" target="_blank" rel="noopener noreferrer">@nnarcher</a></p><p>E-mail: <a href="mailto:photo@nnarcher.com?subject=Kontakt%20za%20fotografisanje">photo@nnarcher.com</a></p><p>Tel. <a href="tel:+381655179733">+381 65 517 97 33</a></p></div>`;
export function createSite(content) {
  const images = content.images;
  const img = (id, alt = "", cls = "", sizes = "100vw", eager = false) => {
    const asset = images[id];
    if (!asset) throw new Error("Missing image " + id);
    return `<img class="${cls}" src="${asset.variants[1].src}" srcset="${asset.variants.map((v) => `${v.src} ${v.width}w`).join(", ")}" sizes="${sizes}" width="${asset.width}" height="${asset.height}" alt="${e(alt)}" ${eager ? 'loading="eager" fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;
  };
  const arrow = (cls = "") =>
    img(
      content.home.arrow,
      "",
      `arrow-art ${cls}`,
      "(max-width: 600px) 70vw, 400px",
    );
  const header = (route) =>
    `<a class="skip-link" href="#page">SKIP TO CONTENT</a><header class="site-header"><a class="brand" href="/">NIKOLINA NIKOLIĆ</a><button class="menu-toggle" type="button" aria-label="Otvori meni" aria-controls="main-navigation" aria-expanded="false"><span></span><span></span></button><nav id="main-navigation" aria-label="Glavna navigacija">${navItems.map(([href, label]) => `<a href="${href}"${route === href ? ' aria-current="page"' : ""}>${label}</a>`).join("")}</nav></header>`;
  const footer = () =>
    `<footer class="site-footer"><div class="footer-legal"><p>© 2026 NNPhotoArcher. Sva prava su rezervisana.</p><nav aria-label="Pravne informacije"><a href="/privacy-policy/">Politika privatnosti</a><a href="/privacy-policy-1/">Uslovi korišćenja</a><a href="/about/">Kontakt i zakazivanje</a></nav></div>${contactLinks()}</footer>`;
  const layout = (
    route,
    title,
    body,
    description = "Fotografija koja čuva emocije, priče i Vaše najlepše trenutke. Venčanja, poslovni portreti, lifestyle i proslave. Nikolina Nikolić — NNPhotoArcher.",
  ) => `<!doctype html>
<html lang="sr-Latn"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${e(title)}</title><meta name="description" content="${e(description)}"><meta name="theme-color" content="#1c301e"><link rel="canonical" href="https://www.nnarcher.com${route}"><meta property="og:title" content="${e(title)}"><meta property="og:description" content="${e(description)}"><meta property="og:type" content="website"><meta property="og:image" content="https://www.nnarcher.com${images[content.home.hero].variants.at(-1).src}"><link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="/fonts.css"><link rel="stylesheet" href="/styles.css"><script src="/app.js" defer></script></head><body>${header(route)}<main id="page">${body}</main>${footer()}<dialog class="lightbox" aria-label="Pregled fotografije"><button type="button" class="lightbox-close" aria-label="Zatvori fotografiju">×</button><button type="button" class="lightbox-prev" aria-label="Prethodna fotografija">←</button><figure><img alt=""><figcaption aria-live="polite"></figcaption></figure><button type="button" class="lightbox-next" aria-label="Sledeća fotografija">→</button></dialog></body></html>`;
  const paragraph = (texts, start) =>
    texts.find((t) => t.tag === "p" && t.text.startsWith(start))?.text || "";
  const paras = (texts, start, end) => {
    const from = texts.findIndex((t) => t.text === start) + 1;
    const to = end
      ? texts.findIndex((t, i) => i >= from && t.text === end)
      : texts.length;
    return texts
      .slice(from, to < 0 ? texts.length : to)
      .filter((t) => t.tag === "p")
      .map((t) => `<p>${e(t.text)}</p>`)
      .join("");
  };
  const home = () => {
    const text = content.home.texts;
    const starts = [
      "Neki trenuci",
      "Prvi utisak",
      "Lepota se",
      "Najlepše proslave",
    ];
    return layout(
      "/",
      "Nikolina Nikolić",
      `
      <section class="home-hero" aria-label="Photoarcher fotografija">${img(content.home.hero, "Mlada u venčanici na sofi, u svetlosti prozora", "hero-image", "100vw", true)}<div class="hero-shade"></div><div class="hero-brand"><h1>PHOTOARCHER</h1><p>PHOTOGRAPHY</p></div><div class="hero-statement"><p>PRIMETITE LEPOTU U SVOM ŽIVOTU,</p><p><strong>JA ĆU UČINITI DA TRAJE ZAUVEK.</strong></p></div></section>
      <section class="home-services" aria-labelledby="home-services-title"><h2 id="home-services-title">USLUGE</h2><div class="carousel"><div class="service-track" tabindex="0" aria-label="Fotografske usluge">${services.map((s, i) => `<article class="home-service-card">${img(content.home.serviceImages[i], s.homeTitle, "", "(max-width: 600px) 86vw, (max-width: 900px) 43vw, 28vw")}<div class="card-copy"><h3>${s.homeTitle}</h3><p>${e(paragraph(text, starts[i]))}</p>${button(`/works/#${s.galleryId || s.id}`, "SAZNAJ VIŠE")}</div></article>`).join("")}</div><button class="carousel-prev" type="button" aria-label="Prethodne usluge">⟵</button><button class="carousel-next" type="button" aria-label="Sledeće usluge">⟶</button></div></section>
      <section class="inspiration"><div class="inspiration-copy"><h2>INSPIRATION</h2><blockquote><p>${e(paragraph(text, "“Sjajna"))}</p><cite>—Steve McCurry</cite></blockquote>${arrow("inspiration-arrow")}<p class="inspiration-description">${e(paragraph(text, "Vaš dan,"))}</p>${button("/o-meni/", "O MENI", "full-width")}</div>${img(content.home.portrait, "Nina sa fotoaparatom", "inspiration-portrait", "(max-width: 700px) 88vw, 40vw")}</section>
      <section class="portrait-banner">${img(content.home.banner, "Blizak, emotivan trenutak mladenaca", "banner-image", "100vw")}<div class="banner-tint"></div><svg class="wave" viewBox="0 0 1440 140" preserveAspectRatio="none" aria-hidden="true"><path d="M0,0H1440V65C1170,110 1090,118 870,83S460,-8 265,32S90,63 0,67Z" fill="white"/></svg><h2><span>PORTRAIT PHOTOGRAPHER</span><span>SEEKING TO CAPTURE</span><span>IDENTITIES, EXPRESSIONS,</span><span>&amp; AURAS OF PEOPLE.</span></h2></section>`,
    );
  };
  const photoButton = (id, title, group, index, wide = false) =>
    `<a class="gallery-photo" href="${images[id].variants.at(-1).src}" data-gallery="${group}" data-index="${index}" data-full="${images[id].variants.at(-1).src}" aria-label="${e(title)} — fotografija ${index + 1}">${img(id, `${title} — fotografija ${index + 1}`, "", wide ? "(max-width: 600px) 50vw, 25vw" : "(max-width: 600px) 46vw, 23vw")}</a>`;
  const gallery = () =>
    layout(
      "/works/",
      "GALERIJA — Nikolina Nikolić",
      content.galleries
        .map(
          (g) =>
            `<section class="gallery-section" id="${g.id}" aria-labelledby="title-${g.id}"><h1 id="title-${g.id}">${g.title}</h1><div class="portrait-grid page-width">${g.images
              .slice(0, 8)
              .map((id, i) => photoButton(id, g.title, g.id, i))
              .join("")}</div><div class="wide-grid">${g.images
              .slice(8)
              .map((id, i) => photoButton(id, g.title, g.id, i + 8, true))
              .join(
                "",
              )}</div>${button(`/usluge/#${g.serviceAnchor}`, "POGLEDAJ USLUGE", "gallery-cta")}</section>`,
        )
        .join(""),
    );
  const packageBlock = (p) =>
    `<article class="package"><h3>${p.title}</h3>${p.description ? `<p class="package-description">${e(p.description)}</p>` : ""}${p.price ? `<p class="price">${p.price}</p>` : ""}<ul>${p.items.map((i) => `<li>${e(i)}</li>`).join("")}</ul>${p.extras ? `<div class="package-extras">${p.extras.map((x) => `<p>${e(x)}</p>`).join("")}</div>` : ""}</article>`;
  const book = (s) =>
    button(
      `/about/?service=${encodeURIComponent(s.formValue)}`,
      "ZAKAŽI FOTOGRAFISANJE",
      "booking-cta",
    );
  const servicePage = () => {
    const im = content.services.images;
    const wedding = services[0];
    const rest = services
      .slice(1)
      .map(
        (s) =>
          `<section class="service-section page-width ${s.id === "poslovni" ? "business-section" : ""}" id="${s.id}"><h2>${s.id === "poslovni" ? "BIZNIS FOTOGRAFISANJE" : s.title}</h2>${s.intro ? `<div class="service-intro"><p>${e(s.intro)}</p>${s.note ? `<p>${e(s.note)}</p>` : ""}</div>` : ""}<div class="service-details">${img(im[s.id === "poslovni" ? 6 : s.id === "portreti" ? 7 : 8], s.title, "service-feature", "(max-width: 700px) 88vw, 40vw")}<div class="packages">${s.packages.map(packageBlock).join("")}</div></div>${book(s)}</section>`,
      )
      .join("");
    return layout(
      "/usluge/",
      "USLUGE — Nikolina Nikolić",
      `<section class="service-overview page-width"><h1>ASORTIMAN<br>USLUGA</h1><div class="overview-grid">${services.map((s) => `<article>${img(im[s.image], s.title, "", "(max-width: 600px) 88vw, (max-width: 900px) 44vw, 23vw", true)}<h2>${s.title}</h2><p>${e(s.description)}</p>${button("#" + s.id, "POGLEDAJ DETALJNIJE")}</article>`).join("")}</div></section><section class="service-section wedding-section page-width" id="vencanja"><h2>VENČANJA</h2><div class="service-intro"><p>${e(wedding.intro)}</p><p>${e(wedding.note)}</p></div><div class="wedding-packages">${img(im[4], "Mladenci na stepeništu", "wedding-first", "(max-width: 700px) 88vw, 44vw")}${packageBlock(wedding.packages[0])}${packageBlock(wedding.packages[1])}${img(im[5], "Mladenci pod velom", "wedding-second", "(max-width: 700px) 88vw, 44vw")}</div>${book(wedding)}</section>${rest}`,
    );
  };
  const about = () => {
    const t = content.about.texts,
      im = content.about.images;
    return layout(
      "/o-meni/",
      "O MENI — Nikolina Nikolić",
      `<section class="about-hero page-width">${img(im[0], "Nina, Photoarcher, sa fotoaparatom na terasi", "about-hero-image", "94vw", true)}<h1>PHOTOARCHER</h1><div class="definition"><h2><small>def.</small> FOTOSTRELAC</h2><p>${e(paragraph(t, "Ona koja"))}</p></div></section><section class="about-story"><div class="story-columns"><div class="story-column">${img(im[1], "Nina sa fotoaparatom, ispred mosta na Adi", "story-portrait", "(max-width: 700px) 88vw, 31vw")}<div class="principles"><h2>CILJEVI I PRINCIPI</h2>${paras(t, "CILJEVI I PRINCIPI", "“AKO MOŽEŠ DA PRONAĐEŠ LEPOTU U SVAKOM MOMENTU, STIL NIJE BITAN. NE OGRANIČAVAJ SE.”")}</div></div><div class="story-column"><div class="biography"><h2>ZDRAVO!</h2>${paras(t, "ZDRAVO!", "CILJEVI I PRINCIPI")}</div>${img(im[2], "Autoportret Nine sa fotoaparatom u ogledalu", "mirror-portrait", "(max-width: 700px) 88vw, 31vw")}</div></div>${arrow("story-arrow")}<blockquote class="about-quote">“AKO MOŽEŠ DA PRONAĐEŠ LEPOTU U SVAKOM MOMENTU, STIL NIJE BITAN. NE OGRANIČAVAJ SE.”</blockquote></section>`,
    );
  };
  const contact = () =>
    layout(
      "/about/",
      "KONTAKT — Nikolina Nikolić",
      `<section class="contact-page"><h1>ZAKAŽITE FOTOGRAFISANJE</h1><div class="contact-inner"><form name="booking" id="booking-form" method="POST" action="/api/contact" data-netlify="true" netlify-honeypot="website"><input type="hidden" name="form-name" value="booking"><div class="honeypot" aria-hidden="true"><label>Website <input name="website" tabindex="-1" autocomplete="off"></label></div><div class="form-field"><label for="full-name">Ime i prezime <span>(required)</span></label><input id="full-name" name="name" autocomplete="name" maxlength="150" required></div><div class="form-field"><label for="email">Vaš imejl <span>(required)</span></label><input id="email" name="email" type="email" autocomplete="email" maxlength="254" required></div><div class="form-field"><label for="phone">Broj telefona <span>(required)</span></label><input id="phone" name="phone" type="tel" autocomplete="tel" maxlength="50" required></div><div class="form-field"><label for="service">Odaberite uslugu <span>(required)</span></label><select id="service" name="service" required><option value="" disabled selected>Select an option</option>${["Venčanje", "Portret", "Poslovni", "Proslava"].map((s) => `<option>${s}</option>`).join("")}</select></div><div class="form-field"><label for="details">Navedite paket koji biste odabrali ili specifične potrebe</label><textarea id="details" name="details" rows="4" maxlength="5000"></textarea></div><div class="form-field date-field"><label for="date">Datum fotografisanja <span>(required)</span></label><input id="date" name="date" type="date" required></div><fieldset class="communication"><legend>Kako biste želeli da komuniciramo?</legend>${["Telefonom", "Video pozivom", "Uživo"].map((x, i) => `<label><input type="checkbox" name="communication" value="${x}"><span>${x.toUpperCase()}</span></label>`).join("")}</fieldset><button class="button submit-button" type="submit">POŠALJITE ZAHTEV</button><div id="form-status" role="status" aria-live="polite"></div><div id="email-fallback" hidden><p>Direktno slanje trenutno nije dostupno. Nastavite slanjem upita iz svoje imejl aplikacije.</p><a class="button" id="email-draft" href="mailto:photo@nnarcher.com">OTVORITE IMEJL</a><button class="button" type="button" id="copy-request">KOPIRAJTE UPIT</button></div><noscript><p>Za slanje upita možete pisati na <a href="mailto:photo@nnarcher.com">photo@nnarcher.com</a>.</p></noscript></form>${contactLinks("inline-contact")}${arrow("contact-arrow")}${img(content.contact.images[1], "Nina sa fotoaparatom", "contact-portrait", "270px")}</div></section>`,
    );
  const legal = (kind) => {
    const items = content.legal[kind];
    return layout(
      kind === "privacy" ? "/privacy-policy/" : "/privacy-policy-1/",
      kind === "privacy"
        ? "Privacy Policy — Nikolina Nikolić"
        : "Terms & Conditions — Nikolina Nikolić",
      `<article class="legal-page page-width">${items.map((t, i) => `<${i === 0 ? "h1" : /^\d+\./.test(t.text) ? "h2" : "p"}>${e(t.text)}</${i === 0 ? "h1" : /^\d+\./.test(t.text) ? "h2" : "p"}>`).join("")}</article>`,
    );
  };
  return new Map([
    ["index.html", home()],
    ["home/index.html", home()],
    ["home-1/index.html", home()],
    ["works/index.html", gallery()],
    ["usluge/index.html", servicePage()],
    ["o-meni/index.html", about()],
    ["about/index.html", contact()],
    ["privacy-policy/index.html", legal("privacy")],
    ["privacy-policy-1/index.html", legal("terms")],
    [
      "404.html",
      layout(
        "",
        "Stranica nije pronađena — Nikolina Nikolić",
        `<section class="not-found"><h1>Stranica nije pronađena</h1>${button("/", "POČETNA")}</section>`,
      ),
    ],
  ]);
}
