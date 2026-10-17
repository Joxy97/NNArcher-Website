(() => {
  const menu = document.querySelector(".menu-toggle");
  const nav = document.querySelector("#main-navigation");
  const main = document.querySelector("main");
  const footer = document.querySelector(".site-footer");
  function closeMenu() {
    nav.classList.remove("is-open");
    menu.setAttribute("aria-expanded", "false");
    menu.setAttribute("aria-label", "Otvori meni");
    document.body.classList.remove("menu-open");
    main.inert = false;
    footer.inert = false;
  }
  menu.addEventListener("click", () => {
    const open = menu.getAttribute("aria-expanded") !== "true";
    nav.classList.toggle("is-open", open);
    menu.setAttribute("aria-expanded", String(open));
    menu.setAttribute("aria-label", open ? "Zatvori meni" : "Otvori meni");
    document.body.classList.toggle("menu-open", open);
    main.inert = open;
    footer.inert = open;
  });
  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) closeMenu();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && nav.classList.contains("is-open")) {
      closeMenu();
      menu.focus();
    }
    if (event.key === "Tab" && nav.classList.contains("is-open")) {
      const first = document.querySelector(".brand");
      const last = nav.querySelector("a:last-child");
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });
  window
    .matchMedia("(min-width: 701px)")
    .addEventListener("change", (event) => {
      if (event.matches) closeMenu();
    });

  const track = document.querySelector(".service-track");
  if (track) {
    const carousel = track.closest(".carousel");
    const firstImage = track.querySelector(".home-service-card > img");
    const centerArrows = () => {
      const image = firstImage.getBoundingClientRect();
      const container = carousel.getBoundingClientRect();
      carousel.style.setProperty(
        "--carousel-arrow-top",
        `${image.top - container.top + image.height / 2}px`,
      );
    };
    const arrowObserver = new ResizeObserver(centerArrows);
    arrowObserver.observe(track);
    arrowObserver.observe(firstImage);
    centerArrows();
    const move = (direction) => {
      const card = track.firstElementChild;
      const step =
        card.getBoundingClientRect().width +
        parseFloat(getComputedStyle(track).gap);
      const max = track.scrollWidth - track.clientWidth;
      let next = track.scrollLeft + direction * step;
      if (direction > 0 && track.scrollLeft >= max - 2) next = 0;
      if (direction < 0 && track.scrollLeft <= 2) next = max;
      track.scrollTo({
        left: next,
        behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
      });
    };
    document
      .querySelector(".carousel-prev")
      .addEventListener("click", () => move(-1));
    document
      .querySelector(".carousel-next")
      .addEventListener("click", () => move(1));
    track.addEventListener("keydown", (event) => {
      if (["ArrowLeft", "ArrowRight"].includes(event.key)) {
        event.preventDefault();
        move(event.key === "ArrowRight" ? 1 : -1);
      }
    });
  }

  const lightbox = document.querySelector(".lightbox");
  const lightboxImage = lightbox.querySelector("figure img");
  let photos = [],
    photoIndex = 0,
    opener = null,
    touchX = null;
  function showPhoto(index) {
    photoIndex = (index + photos.length) % photos.length;
    const a = photos[photoIndex];
    lightboxImage.src = a.dataset.full;
    lightboxImage.alt = a.querySelector("img").alt;
    lightbox.querySelector("figcaption").textContent =
      `${photoIndex + 1} / ${photos.length}`;
  }
  function closeLightbox() {
    lightbox.close();
    document.body.classList.remove("lightbox-open");
    lightboxImage.removeAttribute("src");
    opener?.focus({ preventScroll: true });
  }
  document.querySelectorAll(".gallery-photo").forEach((a) =>
    a.addEventListener("click", (event) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
        return;
      event.preventDefault();
      opener = a;
      photos = [
        ...document.querySelectorAll(`[data-gallery="${a.dataset.gallery}"]`),
      ];
      showPhoto(photos.indexOf(a));
      lightbox.showModal();
      document.body.classList.add("lightbox-open");
      lightbox.querySelector(".lightbox-close").focus();
    }),
  );
  lightbox
    .querySelector(".lightbox-close")
    .addEventListener("click", closeLightbox);
  lightbox
    .querySelector(".lightbox-prev")
    .addEventListener("click", () => showPhoto(photoIndex - 1));
  lightbox
    .querySelector(".lightbox-next")
    .addEventListener("click", () => showPhoto(photoIndex + 1));
  lightbox.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeLightbox();
  });
  lightbox.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      showPhoto(photoIndex + 1);
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      showPhoto(photoIndex - 1);
    }
  });
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });
  lightbox.addEventListener(
    "touchstart",
    (event) => {
      touchX = event.changedTouches[0].clientX;
    },
    { passive: true },
  );
  lightbox.addEventListener(
    "touchend",
    (event) => {
      const distance = event.changedTouches[0].clientX - touchX;
      if (Math.abs(distance) > 60)
        showPhoto(photoIndex + (distance < 0 ? 1 : -1));
      touchX = null;
    },
    { passive: true },
  );

  const form = document.querySelector("#booking-form");
  if (!form) return;
  const status = document.querySelector("#form-status");
  const submit = form.querySelector("[type=submit]");
  let delivery = { mode: "email", endpoint: null };
  let requestText = "";
  // The Node server supplies this dynamically; static hosts use the local JSON file.
  const capabilities = fetch("/contact-config.json", {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(5000),
  })
    .then((r) => (r.ok ? r.json() : {}))
    .then((config) => {
      if (config.mode === "smtp")
        delivery = { mode: "smtp", endpoint: "/api/contact" };
      else if (config.mode === "netlify")
        delivery = { mode: "netlify", endpoint: "/" };
    })
    .catch(() => {});
  const parameters = new URLSearchParams(location.search);
  const service = parameters.get("service");
  if ([...form.service.options].some((o) => o.value === service))
    form.service.value = service;
  if (parameters.get("package")) form.details.value = parameters.get("package");
  const setStatus = (message, state = "info") => {
    status.textContent = message;
    status.dataset.state = state;
  };
  function prepareFallback(data) {
    requestText = `Zdravo,\n\nZainteresovan/a sam za fotografisanje.\n\nIme i prezime: ${data.name}\nImejl: ${data.email}\nTelefon: ${data.phone}\nUsluga: ${data.service}\nDatum: ${data.date}\nKomunikacija: ${data.communication.join(", ") || "Po dogovoru"}\n\nPaket / specifične potrebe:\n${data.details || "—"}\n`;
    document.querySelector("#email-draft").href =
      `mailto:photo@nnarcher.com?subject=${encodeURIComponent("Upit za fotografisanje — " + data.service)}&body=${encodeURIComponent(requestText)}`;
    document.querySelector("#email-fallback").hidden = false;
  }
  document
    .querySelector("#copy-request")
    .addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(requestText);
        setStatus("Upit je kopiran. Pošaljite ga na photo@nnarcher.com.");
      } catch {
        setStatus(
          "Kopiranje nije dostupno. Koristite dugme OTVORITE IMEJL.",
          "error",
        );
      }
    });
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    submit.disabled = true;
    submit.textContent = "SLANJE…";
    document.querySelector("#email-fallback").hidden = true;
    setStatus("");
    const fields = new FormData(form);
    const data = Object.fromEntries(fields);
    data.communication = fields.getAll("communication");
    await capabilities;
    try {
      if (delivery.mode === "email") {
        prepareFallback(data);
        setStatus(
          "Upit je pripremljen. Otvorite imejl i pošaljite poruku da biste završili slanje.",
        );
        return;
      }
      const options =
        delivery.mode === "smtp"
          ? {
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(data),
            }
          : {
              headers: { "Content-Type": "application/x-www-form-urlencoded" },
              body: new URLSearchParams([...fields]).toString(),
            };
      const response = await fetch(delivery.endpoint, {
        method: "POST",
        ...options,
        signal: AbortSignal.timeout(25000),
      });
      if (!response.ok) throw new Error("Delivery failed");
      if (delivery.mode === "smtp") {
        const result = await response.json();
        if (result.ok !== true) throw new Error("Delivery not confirmed");
      }
      setStatus(
        "Hvala! Vaš zahtev je poslat. Javiću Vam se uskoro.",
        "success",
      );
      form.reset();
    } catch {
      prepareFallback(data);
      setStatus(
        "Zahtev nije poslat. Pokušajte ponovo ili nastavite putem imejla.",
        "error",
      );
    } finally {
      submit.disabled = false;
      submit.textContent = "POŠALJITE ZAHTEV";
    }
  });
})();
