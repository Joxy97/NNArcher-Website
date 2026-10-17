import { services } from "./services.mjs";
import { createEnglishTranslator } from "./english.mjs";
import { absoluteUrl, localizedRoute, pageMetadata, servicePages, servicePath, structuredData } from "./seo.mjs";
import { createImageDescriptions } from "./image-descriptions.mjs";
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
export function createSite(content, language = "sr", options = {}) {
  if (!["sr", "en"].includes(language)) throw new Error("Unsupported language");
  const english = language === "en";
  const tr = english ? createEnglishTranslator(content) : (text) => text;
  const routeFor = (route, lang = language) => localizedRoute(route, lang);
  const imageDescription = createImageDescriptions(content, language);
  const button = (href, text, cls = "") =>
    `<a class="button ${cls}" href="${e(href.startsWith("/") ? routeFor(href) : href)}">${e(tr(text))}</a>`;
  const contactLinks = (cls = "") =>
    `<div class="contact-links ${cls}"><p>Instagram: <a href="https://www.instagram.com/nnarcher" target="_blank" rel="noopener noreferrer">@nnarcher</a></p><p>E-mail: <a href="mailto:photo@nnarcher.com?subject=${english ? "Photography%20enquiry" : "Kontakt%20za%20fotografisanje"}">photo@nnarcher.com</a></p><p>Tel. <a href="tel:+381655179733">+381 65 517 97 33</a></p></div>`;
  const images = content.images;
  const img = (id, alt = "", cls = "", sizes = "100vw", eager = false, priority = eager) => {
    const asset = images[id];
    if (!asset) throw new Error("Missing image " + id);
    return `<img class="${cls}" src="${asset.variants[1].src}" srcset="${asset.variants.map((v) => `${v.src} ${v.width}w`).join(", ")}" sizes="${sizes}" width="${asset.width}" height="${asset.height}" alt="${e(alt ? imageDescription(id, tr(alt)) : "")}" loading="${eager ? "eager" : "lazy"}"${priority ? ' fetchpriority="high"' : ""} decoding="async">`;
  };
  const arrow = (cls = "") =>
    img(
      content.home.arrow,
      "",
      `arrow-art ${cls}`,
      "(max-width: 600px) 70vw, 400px",
    );
  const header = (route, activeRoute = route) =>
    `<a class="skip-link" href="#page">SKIP TO CONTENT</a><header class="site-header"><a class="brand" href="${routeFor("/")}">NIKOLINA NIKOLIĆ</a><button class="menu-toggle" type="button" aria-label="${tr("Otvori meni")}" aria-controls="main-navigation" aria-expanded="false"><span></span><span></span></button><nav id="main-navigation" aria-label="${tr("Glavna navigacija")}">${navItems.map(([href, label]) => `<a href="${routeFor(href)}"${activeRoute === href ? ' aria-current="page"' : ""}>${tr(label)}</a>`).join("")}<a class="language-switch" href="${routeFor(route || "/", english ? "sr" : "en")}" lang="${english ? "sr" : "en"}" hreflang="${english ? "sr" : "en"}" aria-label="${english ? "Prikaži na srpskom" : "View in English"}">${english ? "SR" : "EN"}</a></nav></header>`;
  const footer = () =>
    `<footer class="site-footer"><a class="footer-brand" href="${routeFor("/")}" aria-label="${tr("NN Photoarcher — početna")}"><img src="/assets/branding/full-logo.png" width="696" height="696" alt="NN Photoarcher"></a><div class="footer-legal"><p>© 2026 NNPhotoArcher. ${tr("Sva prava su rezervisana.")}</p><nav aria-label="${tr("Pravne informacije")}"><a href="${routeFor("/privacy-policy/")}">${tr("Politika privatnosti")}</a><a href="${routeFor("/privacy-policy-1/")}">${tr("Uslovi korišćenja")}</a><a href="${routeFor("/about/")}">${tr("Kontakt i zakazivanje")}</a></nav></div>${contactLinks()}</footer>`;
  const seoHead = (route) => {
    const meta = pageMetadata(route, language, content);
    const url = absoluteUrl(routeFor(route));
    const asset = images[meta.imageId];
    const social = asset.variants.at(-1);
    const indexable = Boolean(route) && options.indexable !== false;
    const alternateLinks = route ? ["sr", "en", "x-default"].map((lang) => `<link rel="alternate" hreflang="${lang}" href="${absoluteUrl(routeFor(route, lang === "x-default" ? "sr" : lang))}">`).join("") : "";
    const preload = ["/", "/o-meni/"].includes(route) ? `<link rel="preload" as="image" href="${asset.variants[1].src}" imagesrcset="${asset.variants.map((v) => `${v.src} ${v.width}w`).join(", ")}" imagesizes="${route === "/" ? "100vw" : "94vw"}" fetchpriority="high">` : "";
    const json = route ? JSON.stringify(structuredData(route, language, content, tr)).replaceAll("<", "\\u003c").replaceAll("\u2028", "\\u2028").replaceAll("\u2029", "\\u2029") : "";
    return `<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${e(meta.title)}</title><meta name="description" content="${e(meta.description)}"><meta name="robots" content="${indexable ? "index, follow, max-image-preview:large" : "noindex, follow"}"><meta name="theme-color" content="#1c301e">${route ? `<link rel="canonical" href="${url}">` : ""}${alternateLinks}<meta property="og:title" content="${e(meta.title)}"><meta property="og:description" content="${e(meta.description)}"><meta property="og:type" content="website"><meta property="og:site_name" content="NNPhotoArcher"><meta property="og:url" content="${url}"><meta property="og:locale" content="${english ? "en_GB" : "sr_RS"}"><meta property="og:locale:alternate" content="${english ? "sr_RS" : "en_GB"}"><meta property="og:image" content="${absoluteUrl(social.src)}"><meta property="og:image:type" content="image/webp"><meta property="og:image:width" content="${social.width}"><meta property="og:image:height" content="${Math.round(social.width * asset.height / asset.width)}"><meta property="og:image:alt" content="${e(imageDescription(meta.imageId, english ? "Photography by Nikolina Nikolić" : "Fotografija Nikoline Nikolić"))}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${e(meta.title)}"><meta name="twitter:description" content="${e(meta.description)}"><meta name="twitter:image" content="${absoluteUrl(social.src)}">${options.verification ? `<meta name="google-site-verification" content="${e(options.verification)}">` : ""}<link rel="icon" href="/favicon.png" type="image/png"><link rel="preload" href="/assets/fonts/font-b1acf2a145.woff2" as="font" type="font/woff2" crossorigin><link rel="preload" href="/assets/fonts/font-e1c37692d1.woff2" as="font" type="font/woff2" crossorigin>${preload}<link rel="stylesheet" href="/fonts.css"><link rel="stylesheet" href="/styles.css"><script src="/app.js" defer></script>${json ? `<script type="application/ld+json">${json}</script>` : ""}`;
  };
  const layout = (route, body) => `<!doctype html>
<html lang="${english ? "en" : "sr-Latn"}"><head>${seoHead(route)}</head><body>${header(route, servicePages.some((p) => p.sr.path === route) ? "/usluge/" : route)}<main id="page">${body}</main>${footer()}<dialog class="lightbox" aria-label="${tr("Pregled fotografije")}"><button type="button" class="lightbox-close" aria-label="${tr("Zatvori fotografiju")}">×</button><button type="button" class="lightbox-prev" aria-label="${tr("Prethodna fotografija")}">←</button><figure><img alt=""><figcaption aria-live="polite"></figcaption></figure><button type="button" class="lightbox-next" aria-label="${tr("Sledeća fotografija")}">→</button></dialog></body></html>`;
  const paragraph = (texts, start) =>
    tr(texts.find((t) => t.tag === "p" && t.text.startsWith(start))?.text || "");
  const paras = (texts, start, end) => {
    const from = texts.findIndex((t) => t.text === start) + 1;
    const to = end
      ? texts.findIndex((t, i) => i >= from && t.text === end)
      : texts.length;
    return texts
      .slice(from, to < 0 ? texts.length : to)
      .filter((t) => t.tag === "p")
      .map((t) => `<p>${e(tr(t.text))}</p>`)
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
      `
      <section class="home-hero" aria-label="${tr("Photoarcher fotografija")}">${img(content.home.hero, "Mlada u venčanici na sofi, u svetlosti prozora", "hero-image", "100vw", true)}<div class="hero-shade"></div><div class="hero-brand"><h1>PHOTOARCHER</h1><p>PHOTOGRAPHY</p></div><div class="hero-statement"><p>${tr("PRIMETITE LEPOTU U SVOM ŽIVOTU,")}</p><p><strong>${tr("JA ĆU UČINITI DA TRAJE ZAUVEK.")}</strong></p></div></section>
      <section class="home-services" aria-labelledby="home-services-title"><h2 id="home-services-title">${tr("USLUGE")}</h2><div class="carousel"><div class="service-track" tabindex="0" aria-label="${tr("Fotografske usluge")}">${services.map((s, i) => `<article class="home-service-card">${img(content.home.serviceImages[i], s.homeTitle, "", "(max-width: 600px) 86vw, (max-width: 900px) 43vw, 28vw")}<div class="card-copy"><h3>${tr(s.homeTitle)}</h3><p>${e(paragraph(text, starts[i]))}</p>${button(servicePath(s.id), "SAZNAJ VIŠE")}</div></article>`).join("")}</div><button class="carousel-prev" type="button" aria-label="${tr("Prethodne usluge")}"><svg viewBox="0 0 44 20" aria-hidden="true"><path d="M40 10H4m0 0 7-7m-7 7 7 7"/></svg></button><button class="carousel-next" type="button" aria-label="${tr("Sledeće usluge")}"><svg viewBox="0 0 44 20" aria-hidden="true"><path d="M4 10h36m0 0-7-7m7 7-7 7"/></svg></button></div></section>
      <section class="inspiration"><div class="inspiration-copy"><h2>INSPIRATION</h2><blockquote><p>${e(paragraph(text, "“Sjajna"))}</p><cite>—Steve McCurry</cite></blockquote>${arrow("inspiration-arrow")}<p class="inspiration-description">${e(paragraph(text, "Vaš dan,"))}</p>${button("/o-meni/", "O MENI", "full-width")}</div>${img(content.home.portrait, "Nina sa fotoaparatom", "inspiration-portrait", "(max-width: 700px) 88vw, 40vw")}</section>
      <section class="portrait-banner">${img(content.home.banner, "Blizak, emotivan trenutak mladenaca", "banner-image", "100vw")}<div class="banner-tint"></div><svg class="wave" viewBox="0 0 1440 140" preserveAspectRatio="none" aria-hidden="true"><path d="M0,0H1440V65C1170,110 1090,118 870,83S460,-8 265,32S90,63 0,67Z" fill="white"/></svg><h2><span>PORTRAIT PHOTOGRAPHER</span><span>SEEKING TO CAPTURE</span><span>IDENTITIES, EXPRESSIONS,</span><span>&amp; AURAS OF PEOPLE.</span></h2></section>`,
    );
  };
  const photoButton = (id, title, group, index, wide = false, eager = false) =>
    `<a class="gallery-photo" href="${images[id].variants.at(-1).src}" data-gallery="${group}" data-index="${index}" data-full="${images[id].variants.at(-1).src}" aria-label="${e(imageDescription(id, tr(title)))} — ${tr("fotografija")} ${index + 1}">${img(id, `${tr(title)} — ${tr("fotografija")} ${index + 1}`, "", wide ? "(max-width: 600px) 50vw, 25vw" : "(max-width: 600px) 46vw, 23vw", eager, eager && index === 0)}</a>`;
  const gallery = () =>
    layout(
      "/works/",
      content.galleries
        .map(
          (g) =>
            `<section class="gallery-section" id="${g.id}" aria-labelledby="title-${g.id}"><h1 id="title-${g.id}">${tr(g.title)}</h1><div class="portrait-grid page-width">${g.images
              .slice(0, 8)
              .map((id, i) => photoButton(id, g.title, g.id, i, false, g === content.galleries[0] && i < 4))
              .join("")}</div><div class="wide-grid">${g.images
              .slice(8)
              .map((id, i) => photoButton(id, g.title, g.id, i + 8, true))
              .join(
                "",
              )}</div>${button(servicePath(g.serviceAnchor), "POGLEDAJ USLUGE", "gallery-cta")}</section>`,
        )
        .join(""),
    );
  const packageBlock = (p) =>
    `<article class="package"><h3>${e(tr(p.title))}</h3>${p.description ? `<p class="package-description">${e(tr(p.description))}</p>` : ""}${p.price ? `<p class="price">${p.price}</p>` : ""}<ul>${p.items.map((i) => `<li>${e(tr(i))}</li>`).join("")}</ul>${p.extras ? `<div class="package-extras">${p.extras.map((x) => `<p>${e(tr(x))}</p>`).join("")}</div>` : ""}</article>`;
  const book = (s) =>
    button(
      `/about/?service=${encodeURIComponent(s.formValue)}`,
      "ZAKAŽI FOTOGRAFISANJE",
      "booking-cta",
    );
  const servicePage = () => {
    const im = content.services.images;
    return layout(
      "/usluge/",
      `<section class="service-overview page-width"><h1>${tr("ASORTIMAN")}<br>${english ? "SERVICES" : "USLUGA"}</h1><div class="overview-grid">${services.map((s) => `<article>${img(im[s.image], s.title, "", "(max-width: 600px) 88vw, (max-width: 900px) 44vw, 23vw", true, s === services[0])}<h2>${tr(s.title)}</h2><p>${e(tr(s.description))}</p>${button("#" + s.id, "POGLEDAJ DETALJNIJE")}</article>`).join("")}</div></section>${servicePages.map((page) => serviceSection(page)).join("")}`,
    );
  };
  const about = () => {
    const t = content.about.texts,
      im = content.about.images;
    return layout(
      "/o-meni/",
      `<section class="about-hero page-width">${img(im[0], "Nina, Photoarcher, sa fotoaparatom na terasi", "about-hero-image", "94vw", true)}<h1>PHOTOARCHER</h1><div class="definition"><h2><small>def.</small> ${tr("FOTOSTRELAC")}</h2><p>${e(paragraph(t, "Ona koja"))}</p></div></section><section class="about-story"><div class="story-columns"><div class="story-column">${img(im[1], "Nina sa fotoaparatom, ispred mosta na Adi", "story-portrait", "(max-width: 700px) 88vw, 31vw")}<div class="principles"><h2>${tr("CILJEVI I PRINCIPI")}</h2>${paras(t, "CILJEVI I PRINCIPI", "“AKO MOŽEŠ DA PRONAĐEŠ LEPOTU U SVAKOM MOMENTU, STIL NIJE BITAN. NE OGRANIČAVAJ SE.”")}</div></div><div class="story-column"><div class="biography"><h2>${tr("ZDRAVO!")}</h2>${paras(t, "ZDRAVO!", "CILJEVI I PRINCIPI")}</div>${img(im[2], "Autoportret Nine sa fotoaparatom u ogledalu", "mirror-portrait", "(max-width: 700px) 88vw, 31vw")}</div></div>${arrow("story-arrow")}<blockquote class="about-quote">${tr("“AKO MOŽEŠ DA PRONAĐEŠ LEPOTU U SVAKOM MOMENTU, STIL NIJE BITAN. NE OGRANIČAVAJ SE.”")}</blockquote></section>`,
    );
  };
  const contact = () =>
    layout(
      "/about/",
      `<section class="contact-page"><h1>${tr("ZAKAŽITE FOTOGRAFISANJE")}</h1><div class="contact-inner"><form name="booking" id="booking-form" method="POST" action="/api/contact" data-netlify="true" netlify-honeypot="website"><input type="hidden" name="form-name" value="booking"><div class="honeypot" aria-hidden="true"><label>Website <input name="website" tabindex="-1" autocomplete="off"></label></div><div class="form-field"><label for="full-name">${tr("Ime i prezime")} <span>(required)</span></label><input id="full-name" name="name" autocomplete="name" maxlength="150" required></div><div class="form-field"><label for="email">${tr("Vaš imejl")} <span>(required)</span></label><input id="email" name="email" type="email" autocomplete="email" maxlength="254" required></div><div class="form-field"><label for="phone">${tr("Broj telefona")} <span>(required)</span></label><input id="phone" name="phone" type="tel" autocomplete="tel" maxlength="50" required></div><div class="form-field"><label for="service">${tr("Odaberite uslugu")} <span>(required)</span></label><select id="service" name="service" required><option value="" disabled selected>Select an option</option>${["Venčanje", "Portret", "Poslovni", "Proslava"].map((s) => `<option value="${s}">${tr(s)}</option>`).join("")}</select></div><div class="form-field"><label for="details">${tr("Navedite paket koji biste odabrali ili specifične potrebe")}</label><textarea id="details" name="details" rows="4" maxlength="5000"></textarea></div><div class="form-field date-field"><label for="date">${tr("Datum fotografisanja")} <span>(required)</span></label><input id="date" name="date" type="date" required></div><fieldset class="communication"><legend>${tr("Kako biste želeli da komuniciramo?")}</legend>${["Telefonom", "Video pozivom", "Uživo"].map((x) => `<label><input type="checkbox" name="communication" value="${x}"><span>${tr(x).toUpperCase()}</span></label>`).join("")}</fieldset><button class="button submit-button" type="submit">${tr("POŠALJITE ZAHTEV")}</button><div id="form-status" role="status" aria-live="polite"></div><div id="email-fallback" hidden><p>${tr("Direktno slanje trenutno nije dostupno. Nastavite slanjem upita iz svoje imejl aplikacije.")}</p><a class="button" id="email-draft" href="mailto:photo@nnarcher.com">${tr("OTVORITE IMEJL")}</a><button class="button" type="button" id="copy-request">${tr("KOPIRAJTE UPIT")}</button></div><noscript><p>${tr("Za slanje upita možete pisati na")} <a href="mailto:photo@nnarcher.com">photo@nnarcher.com</a>.</p></noscript></form>${contactLinks("inline-contact")}${arrow("contact-arrow")}${img(content.contact.images[1], "Nina sa fotoaparatom", "contact-portrait", "270px")}</div></section>`,
    );
  const legal = (kind) => {
    const items = content.legal[kind];
    return layout(
      kind === "privacy" ? "/privacy-policy/" : "/privacy-policy-1/",
      `<article class="legal-page page-width">${items.map((t, i) => `<${i === 0 ? "h1" : /^\d+\./.test(t.text) ? "h2" : "p"}>${e(tr(t.text))}</${i === 0 ? "h1" : /^\d+\./.test(t.text) ? "h2" : "p"}>`).join("")}</article>`,
    );
  };
  // Share the complete service layout between USLUGE and the individual pages.
  const serviceSection = (page, standalone = false) => {
    const copy = page[language];
    const service = services.find((s) => s.id === page.id);
    const gallery = content.galleries.find((g) => g.id === page.gallery);
    const heading = standalone ? "h1" : "h2";
    const subheading = standalone ? "h2" : "h3";
    return `<section class="service-section page-width service-landing" id="${page.id}" aria-labelledby="service-${page.id}-title"><nav class="service-breadcrumbs" aria-label="${english ? "Breadcrumbs" : "Putanja stranice"}"><a href="${routeFor("/")}">${english ? "Home" : "Početna"}</a><span aria-hidden="true"> / </span><a href="${routeFor("/usluge/")}">${tr("USLUGE")}</a><span aria-hidden="true"> / </span><span>${e(copy.name)}</span></nav><${heading} class="service-landing-title" id="service-${page.id}-title">${e(copy.heading)}</${heading}><div class="service-intro">${copy.paragraphs.map((p) => `<p>${e(p)}</p>`).join("")}</div><div class="service-details">${img(content.services.images[page.image], service.title, "service-feature", "(max-width: 700px) 88vw, 40vw", standalone)}<div class="packages">${service.packages.map(packageBlock).join("")}</div></div>${service.note ? `<p class="service-intro">${e(tr(service.note))}</p>` : ""}${book(service)}<div class="service-questions"><${subheading}>${english ? "Questions about your session" : "Pitanja o fotografisanju"}</${subheading}>${copy.questions.map(([q, a]) => `<details><summary>${e(q)}</summary><p>${e(a)}</p></details>`).join("")}</div></section><section class="gallery-section service-landing-gallery" aria-labelledby="${page.id}-photos-title"><${subheading} id="${page.id}-photos-title">${english ? "Selected photographs" : "Izabrane fotografije"}</${subheading}><div class="portrait-grid page-width">${gallery.images.slice(0, 4).map((id, i) => photoButton(id, gallery.title, gallery.id, i)).join("")}</div>${button(`/works/#${gallery.id}`, english ? "VIEW FULL GALLERY" : "POGLEDAJ CELU GALERIJU", "gallery-cta")}</section>`;
  };
  const serviceLanding = (page) => layout(page.sr.path, serviceSection(page, true));
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
    ...servicePages.map((page) => [`${page[language].path.slice(1)}index.html`, serviceLanding(page)]),
    [
      "404.html",
      layout(
        "",
        `<section class="not-found"><h1>${tr("Stranica nije pronađena")}</h1>${button("/", "POČETNA")}</section>`,
      ),
    ],
  ]);
}
