import { services } from "./services.mjs";

export const siteOrigin = "https://www.nnarcher.com";
export const coreRoutes = ["/", "/works/", "/usluge/", "/o-meni/", "/about/", "/privacy-policy/", "/privacy-policy-1/"];
export const servicePages = [
  {
    id: "vencanja", gallery: "vencanja", image: 4,
    sr: {
      path: "/fotograf-za-vencanja/", name: "Fotografisanje venčanja",
      title: "Fotograf za venčanja Beograd | NNPhotoArcher",
      description: "Umetničko fotografisanje venčanja i mladenaca u Beogradu, Novom Sadu i drugim gradovima. Pogledajte fotografije, pakete od 200€ i pošaljite upit za termin.",
      heading: "Fotograf za venčanja u Beogradu",
      paragraphs: [
        "Ja sam Nikolina Nikolić, fotografkinja iza imena NNPhotoArcher. Fotografisanje venčanja posvećujem mladencima: pogledima, bliskosti i detaljima koji pričaju Vašu priču. Radim pretežno u Beogradu, kao i u Novom Sadu i drugim gradovima Srbije po dogovoru.",
        "Ako tražite fotografa za svadbu sa umetničkim pristupom, ovde možete uporediti osnovni i celodnevni paket. Konsultacije i priprema su uključene, a fokus oba paketa je na mladencima i njihovim trenucima. Fotografisanje gostiju nije uključeno.",
      ],
      questions: [
        ["Koliko košta fotografisanje venčanja?", "Osnovni paket je 200€ i uključuje 200 obrađenih digitalnih fotografija. Celodnevni paket je 500€ za osam sati umetničkog fotografisanja i 500 obrađenih fotografija. Albumi i dodatni sati naplaćuju se prema prikazanom cenovniku."],
        ["Da li fotografišete venčanja van Beograda?", "Da, dostupno je fotografisanje u Novom Sadu i drugim gradovima po dogovoru. U upitu navedite lokaciju i datum kako bismo proverili dostupnost i dogovorili uslove."],
        ["Kako se rezerviše fotograf za venčanje?", "Pošaljite datum, lokaciju i željeni paket putem kontakt forme. Nakon konsultacija dogovaramo detalje; slanje upita samo po sebi ne potvrđuje termin."],
      ],
    },
    en: {
      path: "/wedding-photographer/", name: "Wedding photography",
      title: "Wedding Photographer in Belgrade | NNPhotoArcher",
      description: "Artistic wedding and couple photography in Belgrade, Novi Sad and other Serbian cities. Explore the portfolio and packages from €200, and enquire about your date.",
      heading: "Wedding photographer in Belgrade",
      paragraphs: [
        "I'm Nikolina Nikolić, the photographer behind NNPhotoArcher. My wedding photography focuses on the couple: their glances, closeness and the details that tell their story. I work mainly in Belgrade, and also in Novi Sad and other Serbian cities by arrangement.",
        "If you're looking for an artistic approach to wedding photography, compare the basic and full-day packages below. Both include consultation and preparation, with the focus on the couple and their moments. Guest photography is not included.",
      ],
      questions: [
        ["How much does wedding photography cost?", "The basic package costs €200 and includes 200 edited digital photographs. The full-day package costs €500 for eight hours of artistic photography and 500 edited photographs. Albums and additional hours are priced separately in the package list."],
        ["Do you photograph weddings outside Belgrade?", "Yes, sessions in Novi Sad and other cities are available by arrangement. Include the location and date in your enquiry so we can check availability and agree the details."],
        ["How do I book a wedding photographer?", "Send your date, location and preferred package through the contact form. We'll discuss the details during a consultation; sending an enquiry does not itself confirm a booking."],
      ],
    },
  },
  {
    id: "poslovni", gallery: "poslovne", image: 6,
    sr: {
      path: "/poslovno-fotografisanje/", name: "Poslovno fotografisanje",
      title: "Poslovno fotografisanje Beograd — portreti | NNPhotoArcher",
      description: "Poslovni portreti za LinkedIn, CV i sajt, fotografije prostora i rada. Fotografisanje u Beogradu i Novom Sadu po dogovoru. Pogledajte pakete i cene.",
      heading: "Poslovno fotografisanje u Beogradu",
      paragraphs: [
        "Profesionalni portret predstavlja Vas pre prvog sastanka. Fotografije za CV, LinkedIn, poslovni profil i sajt treba da pokažu Vaš karakter i način rada. Fotografisanje organizujem pretežno u Beogradu, kao i u Novom Sadu i drugim gradovima po dogovoru.",
        "Pored poslovnih portreta, fotografišem prostor, detalje i rad malih biznisa, salona i preduzetnika. Možete izabrati portrete, fotografije prostora i usluga ili kombinovani biznis paket za celovito predstavljanje Vašeg poslovanja.",
      ],
      questions: [
        ["Koliko košta poslovni portret?", "Paket poslovnih portreta košta 60€ za jednu, 80€ za dve ili 100€ za tri osobe. Predviđeno je 45 minuta po osobi i 20 editovanih fotografija, od kojih je 10 retuširano, po osobi."],
        ["Da li fotografišete poslovni prostor?", "Da. Paket Vaš prostor i rad košta 100€ i obuhvata 90 minuta fotografisanja prostora, detalja i prikaza rada, uz 20 editovanih fotografija, od kojih je 10 retuširano."],
        ["Možemo li kombinovati portrete i fotografije prostora?", "Biznis paket spaja oba paketa uz 10% popusta na ukupnu cenu. Fotografisanje više od tri zaposlenih dogovara se posebno."],
      ],
    },
    en: {
      path: "/business-photography/", name: "Business photography",
      title: "Business Portraits & Photography Belgrade | NNPhotoArcher",
      description: "Professional portraits for LinkedIn, CVs and websites, plus workplace photography in Belgrade and Novi Sad by arrangement. Explore packages and prices.",
      heading: "Business photography in Belgrade",
      paragraphs: [
        "A professional portrait introduces you before your first meeting. Photographs for your CV, LinkedIn profile and website should reflect your character and work. I arrange sessions mainly in Belgrade, as well as Novi Sad and other cities by agreement.",
        "Alongside business portraits, I photograph the spaces, details and work of small businesses, salons and entrepreneurs. Choose portraits, photographs of your premises and services, or a combined business package.",
      ],
      questions: [
        ["How much does a business portrait session cost?", "Business portraits cost €60 for one person, €80 for two or €100 for three. The package allows 45 minutes per person and includes 20 edited photographs, of which 10 are retouched, per person."],
        ["Do you photograph business premises?", "Yes. Your Space and Work costs €100 for a 90-minute session covering your space, details and work, with 20 edited photographs, of which 10 are retouched."],
        ["Can we combine portraits and workplace photographs?", "The Business Package combines both packages with a 10% discount on the total price. Sessions for more than three employees are arranged separately."],
      ],
    },
  },
  {
    id: "portreti", gallery: "portreti", image: 7,
    sr: {
      path: "/lifestyle-fotograf/", name: "Lifestyle i portretno fotografisanje",
      title: "Lifestyle fotograf Beograd — portreti | NNPhotoArcher",
      description: "Lifestyle i portretno fotografisanje u Beogradu: individualne, partnerske i grupne sesije. Paketi od 40€, uz mogućnost studija i dolaska u Novi Sad po dogovoru.",
      heading: "Lifestyle fotograf u Beogradu",
      paragraphs: [
        "Lifestyle fotografija čuva lični izraz, pokret i atmosferu svakodnevnih trenutaka. Fotografisanje pojedinaca, parova i grupa organizujem u Beogradu, uz mogućnost rada u Novom Sadu i drugim gradovima po dogovoru.",
        "Zajedno biramo ambijent i stil sesije, a kroz fotografisanje Vas vodim smernicama za opušteno poziranje. Paketi obuhvataju konsultacije i neograničen broj osoba. Ako želite portretno fotografisanje u studiju, studio je dostupan uz doplatu navedenu ispod.",
      ],
      questions: [
        ["Koliko košta lifestyle fotografisanje?", "Mini sesija od 30 minuta košta 40€ i uključuje 15 editovanih fotografija. Osnovni paket je 80€ za 90 minuta, a lifestyle paket 150€ za 180 minuta. Broj fotografija i retuširanje navedeni su uz svaki paket."],
        ["Da li možemo da dođemo kao par ili grupa?", "Da. Portretni paketi uključuju neograničen broj osoba, pa sesiju možete organizovati individualno, kao par ili kao grupa. Ambijent i stil biramo zajedno."],
        ["Da li je moguće fotografisanje u studiju?", "Da, sesija u studiju može se dogovoriti uz doplatu od 50€. U upitu navedite da želite studio i željeni datum."],
      ],
    },
    en: {
      path: "/lifestyle-photographer/", name: "Lifestyle and portrait photography",
      title: "Lifestyle & Portrait Photographer Belgrade | NNPhotoArcher",
      description: "Lifestyle and portrait photography in Belgrade for individuals, couples and groups. Packages from €40, with studio sessions and Novi Sad visits by arrangement.",
      heading: "Lifestyle photographer in Belgrade",
      paragraphs: [
        "Lifestyle photography captures personal expression, movement and the atmosphere of everyday moments. I photograph individuals, couples and groups in Belgrade, with sessions in Novi Sad and other cities available by arrangement.",
        "We'll choose the setting and style together, and I'll guide you with relaxed posing tips throughout the session. Packages include a consultation and an unlimited number of people. Studio portrait sessions are available for the additional fee listed below.",
      ],
      questions: [
        ["How much does lifestyle photography cost?", "A 30-minute mini session costs €40 and includes 15 edited photographs. The basic package is €80 for 90 minutes, and the lifestyle package is €150 for 180 minutes. Photo counts and retouching are listed with each package."],
        ["Can we book as a couple or group?", "Yes. Portrait packages allow an unlimited number of people, so you can book individually, as a couple or as a group. We'll choose the setting and style together."],
        ["Are studio sessions available?", "Yes, a studio session can be arranged for an additional €50. Mention your preferred date and that you'd like a studio session in your enquiry."],
      ],
    },
  },
  {
    id: "proslave", gallery: "proslave", image: 8,
    sr: {
      path: "/fotograf-za-proslave/", name: "Fotografisanje proslava i događaja",
      title: "Fotograf za proslave i događaje Beograd | NNPhotoArcher",
      description: "Fotograf za proslave u Beogradu: punoletstva, mature, krštenja, dečji rođendani i poslovni događaji. Pogledajte pakete i dogovorite fotografisanje.",
      heading: "Fotograf za proslave i događaje u Beogradu",
      paragraphs: [
        "Fotografisanje proslava posvećujem ljudima, emocijama i atmosferi koja svaki događaj čini posebnim. Dostupna sam pretežno u Beogradu, kao i u Novom Sadu i drugim gradovima po dogovoru.",
        "U ponudi su paketi za mature i apsolventske večeri, punoletstva, krštenja i dečje rođendane. Za promocije i poslovna okupljanja pošaljite opis događaja, lokaciju i trajanje kako bismo dogovorili obim fotografisanja. Konsultacije i priprema deo su saradnje.",
      ],
      questions: [
        ["Koliko košta fotograf za proslavu ili rođendan?", "Paket za mature i apsolventske večeri košta 50€, za punoletstva 80€, a za krštenja i dečje rođendane 100€. Svaki paket ima određeno trajanje i broj fotografija, navedene uz paket."],
        ["Šta obuhvata fotografisanje punoletstva?", "Paket obuhvata fotografisanje slavljenika i uže porodice pre proslave, do 120 minuta fotografisanja i 150 editovanih fotografija, od kojih je 15 retuširano."],
        ["Da li fotografišete poslovne događaje i promocije?", "Da, moguće je dogovoriti fotografisanje promocija i poslovnih okupljanja. U upitu navedite vrstu događaja, datum, lokaciju i očekivano trajanje."],
      ],
    },
    en: {
      path: "/event-photographer/", name: "Event and celebration photography",
      title: "Event Photographer in Belgrade | NNPhotoArcher",
      description: "Event photography in Belgrade: birthdays, graduations, christenings and business events. Explore packages and enquire about sessions in Novi Sad and other cities.",
      heading: "Event and celebration photographer in Belgrade",
      paragraphs: [
        "My celebration photography focuses on people, emotions and the atmosphere that makes each event special. I work mainly in Belgrade, and also in Novi Sad and other cities by arrangement.",
        "Packages cover graduation celebrations, 18th birthdays, christenings and children's birthdays. For launches and business gatherings, send the event details, location and duration so we can agree the scope of photography. Consultation and preparation are part of the process.",
      ],
      questions: [
        ["How much does event photography cost?", "Graduation packages cost €50, 18th birthday packages €80, and christening and children's birthday packages €100. Each package has a specified duration and number of photographs, shown in the package list."],
        ["What does the 18th birthday package include?", "It includes portraits of the guest of honour and immediate family before the celebration, up to 120 minutes of photography, and 150 edited photographs, of which 15 are retouched."],
        ["Do you photograph business events and launches?", "Yes, photography for launches and business gatherings can be arranged. Include the event type, date, location and expected duration in your enquiry."],
      ],
    },
  },
];

export const localizedRoute = (route, language = "sr") => {
  if (language === "sr") return route || "/";
  const page = servicePages.find((p) => p.sr.path === route);
  return `/en${page ? page.en.path : route || "/"}`;
};
export const indexableRoutes = [...coreRoutes, ...servicePages.map((p) => p.sr.path)];
export const absoluteUrl = (path) => new URL(path, siteOrigin).href;
export const servicePath = (id) => servicePages.find((p) => p.id === id)?.sr.path;

const metadata = {
  "/": {
    sr: ["Fotograf Beograd — venčanja, portreti i proslave | NNPhotoArcher", "Nikolina Nikolić, fotograf u Beogradu. Umetničko fotografisanje venčanja, proslava, lifestyle i poslovnih portreta. Novi Sad i drugi gradovi po dogovoru."],
    en: ["Photographer in Belgrade — Weddings & Portraits | NNPhotoArcher", "Nikolina Nikolić, photographer in Belgrade. Artistic wedding, event, lifestyle and business photography. Available in Novi Sad and other Serbian cities by arrangement."],
  },
  "/works/": {
    sr: ["Galerija — venčanja, portreti i proslave | NNPhotoArcher", "Pogledajte portfolio Nikoline Nikolić: fotografije venčanja, poslovne portrete, lifestyle i proslave. Pronađite inspiraciju za svoje fotografisanje u Beogradu."],
    en: ["Photography Portfolio — Weddings & Portraits | NNPhotoArcher", "Explore Nikolina Nikolić's wedding, business, lifestyle and event photography portfolio. Find inspiration for your photo session in Belgrade."],
  },
  "/usluge/": {
    sr: ["Fotografisanje Beograd — usluge, paketi i cene | NNPhotoArcher", "Uporedite pakete i cene fotografisanja venčanja, proslava, portreta i biznisa u Beogradu. Konsultacije i zakazivanje sa fotografkinjom Nikolinom Nikolić."],
    en: ["Photography Packages & Prices in Belgrade | NNPhotoArcher", "Compare wedding, event, portrait and business photography packages and prices in Belgrade. Arrange a consultation and book with photographer Nikolina Nikolić."],
  },
  "/o-meni/": {
    sr: ["Nikolina Nikolić — fotografkinja u Beogradu | NNPhotoArcher", "Upoznajte Ninu, fotografkinju iza imena NNPhotoArcher. Lifestyle, venčanja i portreti kroz umetnički pristup, pažnju prema emocijama i igru svetlosti."],
    en: ["Nikolina Nikolić — Belgrade Photographer | NNPhotoArcher", "Meet Nina, the photographer behind NNPhotoArcher. Discover her artistic approach to lifestyle, weddings and portraits, shaped by emotion and light."],
  },
  "/about/": {
    sr: ["Kontakt i zakazivanje fotografisanja Beograd | NNPhotoArcher", "Zakažite fotografisanje sa Nikolinom Nikolić u Beogradu, Novom Sadu ili drugom gradu po dogovoru. Pošaljite datum, željeni paket i lokaciju putem kontakt forme."],
    en: ["Contact & Book a Photographer in Belgrade | NNPhotoArcher", "Enquire about photography with Nikolina Nikolić in Belgrade, Novi Sad or another city by arrangement. Send your preferred date, package and location."],
  },
  "/privacy-policy/": {
    sr: ["Politika privatnosti | NNPhotoArcher", "Saznajte kako NNPhotoArcher prikuplja, koristi i štiti lične podatke prilikom korišćenja sajta, kontakt forme i fotografskih usluga."],
    en: ["Privacy Policy | NNPhotoArcher", "Read how NNPhotoArcher collects, uses and protects personal data when you use the website, contact form and photography services."],
  },
  "/privacy-policy-1/": {
    sr: ["Uslovi korišćenja | NNPhotoArcher", "Uslovi korišćenja NNPhotoArcher sajta: fotografske usluge, zakazivanje, autorska prava, obrada, isporuka i korišćenje fotografija."],
    en: ["Terms and Conditions | NNPhotoArcher", "Terms for using the NNPhotoArcher website: photography services, booking, copyright, editing, delivery and use of photographs."],
  },
};

export function pageMetadata(route, language, content) {
  const landing = servicePages.find((p) => p.sr.path === route);
  const copy = landing?.[language];
  const [title, description] = copy ? [copy.title, copy.description] : metadata[route]?.[language] || [language === "en" ? "Page not found | NNPhotoArcher" : "Stranica nije pronađena | NNPhotoArcher", ""];
  const imageId = landing ? content.services.images[landing.image] : route === "/o-meni/" ? content.about.images[0] : route === "/about/" ? content.contact.images[1] : content.home.hero;
  return { title, description, imageId, landing };
}

export function structuredData(route, language, content, translate) {
  const meta = pageMetadata(route, language, content);
  const url = absoluteUrl(localizedRoute(route, language));
  const lang = language === "sr" ? "sr-Latn" : "en";
  const organizationId = absoluteUrl("/#organization");
  const personId = absoluteUrl("/#nikolina-nikolic");
  const websiteId = absoluteUrl("/#website");
  const areaServed = [{ "@type": "City", name: "Beograd", alternateName: "Belgrade" }, { "@type": "City", name: "Novi Sad" }, { "@type": "Country", name: "Srbija", alternateName: "Serbia" }];
  const asset = content.images[meta.imageId];
  const variant = asset.variants.at(-1);
  const image = { "@type": "ImageObject", "@id": `${url}#primary-image`, contentUrl: absoluteUrl(variant.src), url: absoluteUrl(variant.src), width: variant.width, height: Math.round(variant.width * asset.height / asset.width), creator: { "@id": personId } };
  const graph = [
    { "@type": "Organization", "@id": organizationId, name: "NNPhotoArcher", alternateName: "Photoarcher", url: siteOrigin + "/", logo: { "@type": "ImageObject", contentUrl: absoluteUrl("/assets/branding/full-logo.png"), width: 696, height: 696 }, email: "photo@nnarcher.com", telephone: "+381655179733", sameAs: ["https://www.instagram.com/nnarcher"], founder: { "@id": personId }, areaServed, contactPoint: { "@type": "ContactPoint", contactType: "booking", email: "photo@nnarcher.com", telephone: "+381655179733", availableLanguage: ["Serbian", "English"] } },
    { "@type": "Person", "@id": personId, name: "Nikolina Nikolić", alternateName: "Nina", jobTitle: language === "sr" ? "Fotografkinja" : "Photographer", url: absoluteUrl(localizedRoute("/o-meni/", language)), worksFor: { "@id": organizationId }, homeLocation: { "@type": "City", name: "Beograd" }, sameAs: ["https://www.instagram.com/nnarcher"] },
    { "@type": "WebSite", "@id": websiteId, name: "NNPhotoArcher", alternateName: "Photoarcher", url: siteOrigin + "/", inLanguage: ["sr-Latn", "en"], publisher: { "@id": organizationId } },
    image,
    { "@type": route === "/o-meni/" ? "AboutPage" : route === "/about/" ? "ContactPage" : ["/works/", "/usluge/"].includes(route) ? "CollectionPage" : "WebPage", "@id": `${url}#webpage`, url, name: meta.title, description: meta.description, inLanguage: lang, isPartOf: { "@id": websiteId }, publisher: { "@id": organizationId }, primaryImageOfPage: { "@id": image["@id"] }, ...(route === "/o-meni/" ? { mainEntity: { "@id": personId } } : {}) },
  ];
  const selected = meta.landing ? [meta.landing] : route === "/usluge/" ? servicePages : [];
  for (const landing of selected) {
    const s = services.find((entry) => entry.id === landing.id);
    const serviceUrl = absoluteUrl(localizedRoute(landing.sr.path, language));
    graph.push({ "@type": "Service", "@id": `${serviceUrl}#service`, url: serviceUrl, name: landing[language].name, serviceType: landing[language].name, description: translate(s.description), provider: { "@id": organizationId }, areaServed, mainEntityOfPage: { "@id": `${serviceUrl}#webpage` }, hasOfferCatalog: { "@type": "OfferCatalog", name: landing[language].name, itemListElement: s.packages.map((p) => {
      const prices = p.price?.match(/\d+/g)?.map(Number) || [];
      return { "@type": prices.length > 1 ? "AggregateOffer" : "Offer", name: translate(p.title), description: [p.description, ...p.items].filter(Boolean).map(translate).join(". "), url: serviceUrl, ...(prices.length > 1 ? { lowPrice: Math.min(...prices), highPrice: Math.max(...prices), offerCount: prices.length, priceCurrency: "EUR" } : prices.length === 1 ? { price: prices[0], priceCurrency: "EUR" } : {}), itemOffered: { "@id": `${serviceUrl}#service` } };
    }) } });
  }
  if (meta.landing) graph.find((x) => x["@id"] === `${url}#webpage`).mainEntity = { "@id": `${url}#service` };
  if (route !== "/") {
    const crumbs = [{ "@type": "ListItem", position: 1, name: language === "sr" ? "Početna" : "Home", item: absoluteUrl(localizedRoute("/", language)) }];
    if (meta.landing) crumbs.push({ "@type": "ListItem", position: 2, name: language === "sr" ? "Usluge" : "Services", item: absoluteUrl(localizedRoute("/usluge/", language)) });
    crumbs.push({ "@type": "ListItem", position: crumbs.length + 1, name: meta.landing?.[language].name || meta.title.split(" | ")[0], item: url });
    graph.push({ "@type": "BreadcrumbList", "@id": `${url}#breadcrumbs`, itemListElement: crumbs });
    graph.find((x) => x["@id"] === `${url}#webpage`).breadcrumb = { "@id": `${url}#breadcrumbs` };
  }
  return { "@context": "https://schema.org", "@graph": graph };
}

export function sitemapXml(content) {
  const xml = (value) => String(value).replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
  const imageIds = (route) => {
    const landing = servicePages.find((p) => p.sr.path === route);
    if (landing) return [content.services.images[landing.image], ...content.galleries.find((g) => g.id === landing.gallery).images.slice(0, 4)];
    if (route === "/works/") return content.galleries.flatMap((g) => g.images);
    if (route === "/usluge/") return [...services.map((service) => content.services.images[service.image]), ...servicePages.flatMap((page) => imageIds(page.sr.path))];
    if (route === "/o-meni/") return content.about.images;
    if (route === "/about/") return content.contact.images;
    if (route === "/") return [content.home.hero, ...content.home.serviceImages, content.home.portrait, content.home.banner];
    return [];
  };
  return '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n' + indexableRoutes.flatMap((route) => ["sr", "en"].map((language) => {
    const alternates = ["sr", "en"].map((lang) => `<xhtml:link rel="alternate" hreflang="${lang}" href="${xml(absoluteUrl(localizedRoute(route, lang)))}"/>`).join("");
    const images = [...new Set(imageIds(route))].filter((id) => id !== content.home.arrow).map((id) => `<image:image><image:loc>${xml(absoluteUrl(content.images[id].variants.at(-1).src))}</image:loc></image:image>`).join("");
    return `<url><loc>${xml(absoluteUrl(localizedRoute(route, language)))}</loc>${alternates}<xhtml:link rel="alternate" hreflang="x-default" href="${xml(absoluteUrl(route))}"/>${images}</url>`;
  })).join("\n") + "\n</urlset>\n";
}
