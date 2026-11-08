/* =========================================================================
   motion.js — all the "feel": intro loader, smooth scroll, cursor,
   scroll-driven reveals, horizontal projects gallery, magnetic buttons, tilt.
   Uses GSAP + ScrollTrigger + Lenis (loaded from CDN in index.html).
   If any of them fail to load, the page still works — just without motion.
   Hooks used in markup (set by main.js):
     data-intro     hero elements revealed after the loader
     data-split     headings revealed word by word
     data-scrub     text whose words light up as you scroll
     data-up        fades / slides up into view  (data-up="x" slides from the left)
     data-stagger   container whose children cascade in
     data-tilt      3D tilt on hover
     data-magnetic  element pulled toward the cursor
     data-count     number counts up
   ========================================================================= */
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const root = document.documentElement;
  const loader = $(".loader");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;

  const dropLoader = () => { if (loader) loader.remove(); root.classList.remove("is-loading"); };

  if (!window.gsap || !window.ScrollTrigger || reduce) { dropLoader(); return; }

  gsap.registerPlugin(ScrollTrigger);
  root.classList.add("is-loading");

  // Unlock = remove loader + allow scrolling. Idempotent, and never depends on
  // the intro timeline finishing (slow devices / background tabs throttle rAF).
  let lenis = null, unlocked = false;
  const unlock = () => {
    if (unlocked) return;
    unlocked = true;
    dropLoader();
    if (lenis) lenis.start();
    root.classList.remove("lenis-stopped");
    ScrollTrigger.refresh();
    document.dispatchEvent(new CustomEvent("motion:ready"));
  };
  window.__unlockMotion = unlock;

  try {
    /* ------------------------- Smooth scroll ------------------------- */
    if (window.Lenis) {
      lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((t) => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
      lenis.stop();
    }
    // Smooth anchor navigation
    document.addEventListener("click", (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute("href");
      const target = id.length > 1 && document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(target, { offset: id === "#home" ? 0 : -40, duration: 1.6 });
      else target.scrollIntoView({ behavior: "smooth" });
    });

    /* ------------------------- Word splitter ------------------------- */
    const split = (el) => {
      const walk = (node) => {
        [...node.childNodes].forEach((n) => {
          if (n.nodeType === 3) {
            const grad = !!(n.parentElement && n.parentElement.closest(".grad-text"));
            const frag = document.createDocumentFragment();
            n.textContent.split(/(\s+)/).forEach((part) => {
              if (!part) return;
              if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(" ")); return; }
              const w = document.createElement("span"); w.className = "w";
              const i = document.createElement("span"); i.className = "wi" + (grad ? " grad-text" : "");
              i.textContent = part; w.appendChild(i); frag.appendChild(w);
            });
            n.replaceWith(frag);
          } else if (n.nodeType === 1 && n.tagName !== "BR") walk(n);
        });
      };
      walk(el);
      // move gradient from wrappers onto each word so it survives transforms
      $$(".grad-text", el).forEach((g) => { if (!g.classList.contains("wi")) g.classList.remove("grad-text"); });
      return $$(".wi", el);
    };

    /* ------------------------- Intro / loader ------------------------- */
    const heroWords = split($(".hero h1"));
    const codeCard = $(".code-card");
    gsap.set(heroWords, { yPercent: 120 });
    gsap.set("[data-intro]", { y: 40, opacity: 0 });
    gsap.set(codeCard, { y: 120, opacity: 0, rotationY: -35, rotationX: 15, transformPerspective: 1200 });

    let seen = false;
    try { seen = sessionStorage.getItem("seen") === "1"; sessionStorage.setItem("seen", "1"); } catch (e) {}
    const loadDur = seen ? 0.6 : 1.8;
    const counter = { v: 0 };
    const countEl = $(".loader-count");

    const intro = gsap.timeline({ defaults: { ease: "expo.out" } });
    if (loader) {
      intro
        .to(counter, { v: 100, duration: loadDur, ease: "power3.inOut", onUpdate: () => (countEl.textContent = Math.round(counter.v)) })
        .to(".loader-bar i", { scaleX: 1, duration: loadDur, ease: "power3.inOut" }, 0)
        .to(".loader-inner", { yPercent: -110, duration: 0.6, ease: "power3.in" })
        .to(".loader-bar", { scaleX: 0, transformOrigin: "100% 50%", duration: 0.5, ease: "power3.in" }, "<")
        .to(loader, { clipPath: "inset(0% 0% 100% 0%)", duration: 1.1, ease: "expo.inOut" }, "-=0.15");
    }
    intro
      .to(heroWords, { yPercent: 0, duration: 1.4, stagger: 0.07 }, loader ? "-=0.55" : 0)
      .to("[data-intro]", { y: 0, opacity: 1, duration: 1.2, stagger: 0.09 }, "-=1.1")
      .to(codeCard, { y: 0, opacity: 1, rotationY: -10, rotationX: 5, duration: 1.8 }, "-=1.3")
      .add(unlock, "-=1.4");
    // Hard fallback on a plain timer, in case the animation frame loop is throttled
    setTimeout(unlock, (loadDur + 2.6) * 1000);

    /* ------------------------- Hero scroll-out ------------------------- */
    const heroST = { trigger: ".hero", start: "top top", end: "bottom top", scrub: true };
    gsap.to(".hero-copy", { yPercent: -30, opacity: 0, ease: "none", scrollTrigger: heroST });
    gsap.to(".code-wrap", { yPercent: -60, ease: "none", scrollTrigger: { ...heroST } });
    gsap.to("#neural", { scale: 1.25, opacity: 0, ease: "none", scrollTrigger: { ...heroST } });
    gsap.to(".scroll-hint", { opacity: 0, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "15% top", scrub: true } });

    /* ------------------------- Section reveals ------------------------- */
    $$("[data-split]").forEach((h) => {
      gsap.from(split(h), { yPercent: 120, rotate: 4, duration: 1.3, ease: "expo.out", stagger: 0.06, scrollTrigger: { trigger: h, start: "top 88%" } });
    });

    $$("[data-up]").forEach((el) => {
      const fromX = el.dataset.up === "x";
      gsap.from(el, { x: fromX ? -60 : 0, y: fromX ? 0 : 50, opacity: 0, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 90%" } });
    });

    $$("[data-stagger]").forEach((g) => {
      gsap.from(g.children, {
        y: 90, opacity: 0, rotationX: -18, transformPerspective: 1000, transformOrigin: "50% 100%",
        duration: 1.3, ease: "expo.out", stagger: 0.09, scrollTrigger: { trigger: g, start: "top 85%" },
      });
    });

    $$("[data-scrub]").forEach((el) => {
      gsap.fromTo(split(el), { opacity: 0.12 }, { opacity: 1, ease: "none", stagger: 0.1, scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 40%", scrub: 0.6 } });
    });

    $$("[data-count]").forEach((el) => {
      const target = +el.dataset.count, suffix = el.dataset.suffix || "", o = { v: 0 };
      el.textContent = "0";
      gsap.to(o, { v: target, duration: 2.2, ease: "power3.out", scrollTrigger: { trigger: el.closest("[data-stagger]") || el, start: "top 80%" },
        onUpdate: () => (el.textContent = Math.round(o.v) + (o.v >= target ? suffix : "")) });
    });

    $$(".tl-line").forEach((l) => {
      gsap.fromTo(l, { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: { trigger: l.closest(".timeline"), start: "top 75%", end: "bottom 55%", scrub: true } });
    });

    const contact = $(".contact-card");
    if (contact) gsap.from(contact, { scale: 0.86, borderRadius: 120, ease: "none", scrollTrigger: { trigger: contact, start: "top bottom", end: "top 35%", scrub: true } });

    // Parallax on section headings' eyebrow line
    $$("section.block").forEach((s) => {
      const head = $(".sec-head", s);
      if (head) gsap.fromTo(head, { y: 40 }, { y: -40, ease: "none", scrollTrigger: { trigger: s, start: "top bottom", end: "bottom top", scrub: true } });
    });

    /* ------------------------- Horizontal projects ------------------------- */
    const mm = gsap.matchMedia();
    mm.add("(min-width: 981px)", () => {
      const sec = $(".projects-sec"), track = $(".h-track", sec);
      if (!sec || !track) return;
      const dist = () => Math.max(0, track.scrollWidth - innerWidth);
      const cards = () => $$(".project:not(.hide), .h-end", track);
      const cur = $("#hCur");
      const tween = gsap.to(track, {
        x: () => -dist(), ease: "none",
        scrollTrigger: {
          trigger: sec, start: "top top", end: () => "+=" + Math.round(dist() * 0.7), pin: true, scrub: 1, invalidateOnRefresh: true, anticipatePin: 1,
          onUpdate: (self) => {
            gsap.set(".h-bar i", { scaleX: self.progress });
            const n = $$(".project:not(.hide)", track).length;
            if (cur) cur.textContent = String(Math.min(n, 1 + Math.floor(self.progress * n))).padStart(2, "0");
          },
        },
      });
      // inner parallax + skew while moving
      $$(".project", track).forEach((card) => {
        gsap.fromTo($(".big-icon", card), { x: 80 }, { x: -80, ease: "none",
          scrollTrigger: { trigger: card, containerAnimation: tween, start: "left right", end: "right left", scrub: true } });
        gsap.fromTo($(".num", card), { x: -60 }, { x: 60, ease: "none",
          scrollTrigger: { trigger: card, containerAnimation: tween, start: "left right", end: "right left", scrub: true } });
      });
      gsap.from(cards(), { y: 120, opacity: 0, rotationY: 20, transformPerspective: 1200, duration: 1.3, ease: "expo.out", stagger: 0.1,
        scrollTrigger: { trigger: sec, start: "top 70%" } });
      const onFilter = () => ScrollTrigger.refresh();
      document.addEventListener("projects:filtered", onFilter);
      return () => document.removeEventListener("projects:filtered", onFilter);
    });
    mm.add("(max-width: 980px)", () => {
      gsap.from($$(".h-track > *"), { y: 80, opacity: 0, duration: 1.2, ease: "expo.out", stagger: 0.08, scrollTrigger: { trigger: ".h-track", start: "top 85%" } });
      const onFilter = () => ScrollTrigger.refresh();
      document.addEventListener("projects:filtered", onFilter);
      return () => document.removeEventListener("projects:filtered", onFilter);
    });

    /* ------------------------- Velocity marquee ------------------------- */
    const rows = $$(".mq-track").map((el, i) => ({ el, x: 0, dir: i % 2 ? 1 : -1, w: 0 }));
    const measure = () => rows.forEach((r) => (r.w = r.el.scrollWidth / 2));
    measure(); addEventListener("resize", measure);
    let lastY = scrollY, vel = 0, sign = 1;
    gsap.ticker.add(() => {
      const v = scrollY - lastY; lastY = scrollY;
      vel += (v - vel) * 0.12;
      if (Math.abs(vel) > 0.6) sign = vel > 0 ? 1 : -1;
      const speed = 0.7 + Math.min(Math.abs(vel) * 0.35, 14);
      const skew = gsap.utils.clamp(-12, 12, vel * -0.4);
      rows.forEach((r) => {
        if (!r.w) return;
        r.x += r.dir * sign * speed;
        if (r.x <= -r.w) r.x += r.w;
        if (r.x > 0) r.x -= r.w;
        r.el.style.transform = `translate3d(${r.x}px,0,0) skewX(${skew}deg)`;
      });
    });

    /* ------------------------- Pointer effects (desktop) ------------------------- */
    if (fine) {
      // Magnetic buttons
      $$("[data-magnetic], .icon-btn").forEach((b) => {
        const xt = gsap.quickTo(b, "x", { duration: 0.5, ease: "power3" }), yt = gsap.quickTo(b, "y", { duration: 0.5, ease: "power3" });
        b.addEventListener("pointermove", (e) => {
          const r = b.getBoundingClientRect();
          xt((e.clientX - r.left - r.width / 2) * 0.35); yt((e.clientY - r.top - r.height / 2) * 0.35);
        });
        b.addEventListener("pointerleave", () => { xt(0); yt(0); });
      });

      // 3D tilt
      $$("[data-tilt]").forEach((c) => {
        const isCode = c.classList.contains("code-card");
        const base = isCode ? { x: 5, y: -10 } : { x: 0, y: 0 };
        const tx = gsap.quickTo(c, "rotationX", { duration: 0.7, ease: "power3" }), ty = gsap.quickTo(c, "rotationY", { duration: 0.7, ease: "power3" });
        c.addEventListener("pointermove", (e) => {
          const r = c.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
          gsap.set(c, { transformPerspective: 1000 });
          ty(px * (isCode ? 14 : 9)); tx(-py * (isCode ? 14 : 9));
        });
        c.addEventListener("pointerleave", () => { tx(base.x); ty(base.y); });
      });
    }

    addEventListener("load", () => ScrollTrigger.refresh());
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { measure(); ScrollTrigger.refresh(); });
  } catch (err) {
    // Fail safe: if anything above breaks, show the page without motion.
    console.error("[motion] disabled:", err);
    ScrollTrigger.getAll().forEach((t) => t.kill());
    gsap.globalTimeline.clear();
    gsap.set("[data-intro], .wi, [data-up], [data-stagger] > *, .code-card, .h-track, .h-track > *, [data-count]", { clearProps: "all" });
    unlock();
  }
})();
