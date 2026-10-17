// Edit packages, prices and descriptions here, then run npm run build.
export const services = [
  {
    id: "vencanja",
    title: "VENČANJA",
    homeTitle: "VENČANJA",
    formValue: "Venčanje",
    image: 0,
    description:
      "Fotografisanje venčanja, sesija mladenaca kao i proslave uz pažnju posvećenu spontanim trenucima, emocijama i detaljima.",
    intro:
      "Oba paketa Venčanja podrazumevaju umetničko fotografisanje (fokus je na mladencima i njihovim trenucima), kao i konsultacije, pripremu i saradnju po njihovoj želji.",
    note: "Bez fotografisanja gostiju.",
    packages: [
      {
        title: "OSNOVNI PAKET",
        price: "200€",
        items: [
          "Fotografisanje mladenaca pre venčanja",
          "Fotografisanje ceremonije venčanja",
          "200 obrađenih fotografija u digitalnom formatu",
        ],
        extras: [
          "+ 50€ Album od 100 odabranih štampanih fotografija",
          "+ 30€ Svaki naredni sat",
        ],
      },
      {
        title: "CELODNEVNI PAKET",
        price: "500€",
        items: [
          "8h umetničkog fotografisanja mladenaca",
          "Fotografisanje mladenaca pre venčanja",
          "Fotografisanje ceremonije venčanja",
          "Fotografisanje mladenaca tokom proslave i sečenja torte",
          "500 obrađenih fotografija u digitalnom formatu",
        ],
        extras: [
          "+ 80€ Album od 200 odabranih štampanih fotografija",
          "+ 40€ Svaki naredni sat",
        ],
      },
    ],
  },
  {
    id: "poslovni",
    galleryId: "poslovne",
    title: "BIZNIS",
    homeTitle: "POSLOVNE FOTOGRAFIJE",
    formValue: "Poslovni",
    image: 2,
    description:
      "Poslovni portreti, moda i enterijeri. Fotografije koje predstavljaju Vas, Vaš rad i prostor na sajtu i društvenim mrežama.",
    packages: [
      {
        title: "POSLOVNI PORTRETI",
        description:
          "Za CV, LinkedIn, poslovni profil i predstavljanje na sajtu",
        price: "60€ / 80€ / 100€",
        items: [
          "Za jednu, dve ili tri osobe",
          "45 minuta po osobi",
          "20 editovanih (10 retuširanih) fotografija po osobi",
        ],
      },
      {
        title: "VAŠ PROSTOR I RAD",
        description:
          "Za salone, male biznise i preduzetnike kojima su potrebne fotografije prostora i usluga.",
        price: "100€",
        items: [
          "Fotografisanje Vašeg prostora, detalja i prikaza rada",
          "90 minuta fotografisanja",
          "20 editovanih (10 retuširanih) fotografija",
        ],
      },
      {
        title: "BIZNIS PAKET",
        description:
          "Kompletan paket za Vaš biznis koji uključuje fotografisanje zaposlenih, prostora, rada i usluga.",
        items: [
          "Uključuje oba gore navedena paketa",
          "10% popusta na ukupnu cenu",
          "Fotografisanje za više od 3 zaposlenih po dogovoru",
        ],
      },
    ],
  },
  {
    id: "portreti",
    title: "LIFESTYLE",
    homeTitle: "LIFESTYLE",
    formValue: "Portret",
    image: 1,
    description:
      "Individualne, partnerske i grupne sesije. Zajedno biramo ambijent i stil, uz moje smernice za opušteno poziranje i idealne fotke za društvene mreže.",
    intro:
      "Svi paketi Portreta podrazumevaju konsultacije sa klijentima, kao i neograničen broj subjekata.",
    note: "*Moguće je zakazati sesiju u studiju uz doplatu od 50€.",
    packages: [
      {
        title: "MINI PHOTOSHOOT",
        price: "40€",
        items: ["30 minuta fotografisanja", "15 editovanih fotografija"],
      },
      {
        title: "OSNOVNI PAKET",
        price: "80€",
        items: [
          "90 minuta fotografisanja",
          "50 editovanih fotografija (10 retuširanih)",
        ],
      },
      {
        title: "LIFESTYLE PAKET",
        price: "150€",
        items: [
          "180 minuta fotografisanja",
          "120 editovanih fotografija (25 retuširanih)",
        ],
      },
    ],
  },
  {
    id: "proslave",
    title: "PROSLAVE",
    homeTitle: "PROSLAVE",
    formValue: "Proslava",
    image: 3,
    description:
      "Fotografisanje proslava, promocija i poslovnih okupljanja, sa fokusom na ljude, atmosferu i trenutke koji događaj čine posebnim.",
    intro:
      "Svi paketi Proslava podrazumevaju umetničko fotografisanje, kao i konsultacije, pripremu i saradnju sa klijentima po njihovoj želji.",
    packages: [
      {
        title: "MATURE I APSOLVENTSKE VEČERI",
        price: "50€",
        items: [
          "Fotografisanje pre ulaska u salu",
          "90 minuta fotografisanja",
          "100 editovanih fotografija (10 retuširanih)",
        ],
      },
      {
        title: "PUNOLETSTVA",
        price: "80€",
        items: [
          "Fotografisanje slavljenika i uže porodice pre proslave",
          "Do 120 minuta fotografisanja",
          "150 editovanih fotografija (15 retuširanih)",
        ],
      },
      {
        title: "KRŠTENJA I DEČJI ROĐENDANI",
        price: "100€",
        items: ["Do 180 minuta fotografisanja", "200 editovanih fotografija"],
      },
    ],
  },
];
