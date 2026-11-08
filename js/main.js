/* =========================================================================
   main.js — builds the page from window.PORTFOLIO (js/data.js) and wires up
   basic interactions. All scroll/intro animation lives in js/motion.js.
   To add a new section: write a render function and add it to SECTIONS.
   ========================================================================= */
(() => {
  const D = window.PORTFOLIO;
  const P = D.profile;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const esc = (s = "") =>
    String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const has = (v) => (Array.isArray(v) ? v.length > 0 : !!v);
  const pad = (n) => String(n).padStart(2, "0");

  /* ---------------------------- Icons ---------------------------- */
  const ICONS = {
    brain: '<path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/><path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"/><path d="M12 5v13"/>',
    code: '<path d="m16 18 6-6-6-6M8 6l-6 6 6 6"/>',
    tool: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
    database: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/><path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3"/>',
    chart: '<path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/>',
    sparkles: '<path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"/><path d="M5 3v4M19 17v4M3 5h4M17 19h4"/>',
    pulse: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
    eye: '<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
    chat: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M8 9h8M8 13h5"/>',
    mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>',
    phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>',
    pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
    linkedin: '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>',
    github: '<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65S8.93 17.38 9 18v4"/><path d="M9 18c-4.51 2-5-2-7-2"/>',
    external: '<path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
    cap: '<path d="M22 10 12 5 2 10l10 5 10-5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>',
    briefcase: '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
    award: '<circle cx="12" cy="8" r="6"/><path d="M15.48 12.89 17 22l-5-3-5 3 1.52-9.11"/>',
    arrow: '<path d="M5 12h14M12 5l7 7-7 7"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>',
    copy: '<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>',
    moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    close: '<path d="M18 6 6 18M6 6l12 12"/>',
  };
  const icon = (name, cls = "") =>
    `<svg class="i ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ICONS.sparkles}</svg>`;
  const chips = (arr = [], cls = "") =>
    has(arr) ? `<div class="chips ${cls}">${arr.map((t) => `<span class="chip">${esc(t)}</span>`).join("")}</div>` : "";
  const secHead = (n, eyebrow, title, sub = "") => `
    <div class="sec-head">
      <span class="eyebrow mono" data-up>${pad(n)} · ${esc(eyebrow)}</span>
      <h2 data-split>${title}</h2>
      ${sub ? `<p data-up>${esc(sub)}</p>` : ""}
    </div>`;
  const tel = (p) => `tel:${p.replace(/[^\d+]/g, "")}`;

  /* ---------------------------- Derived data ---------------------------- */
  const skillCount = D.skills.reduce((n, s) => n + s.items.length, 0);
  const stats = [
    { value: D.projects.length, suffix: "+", label: "AI / ML projects built" },
    { value: D.certifications.length, suffix: "", label: "Certifications earned" },
    { value: skillCount, suffix: "+", label: "Tools & technologies in my stack" },
    ...(D.extraStats || []),
  ].filter((s) => s.value > 0);

  /* ---------------------------- Hero + marquee ---------------------------- */
  const socialLinks = () => [
    P.email && `<a class="icon-btn" href="mailto:${esc(P.email)}" aria-label="Email">${icon("mail")}</a>`,
    P.linkedin && `<a class="icon-btn" href="${esc(P.linkedin)}" target="_blank" rel="noopener" aria-label="LinkedIn">${icon("linkedin")}</a>`,
    P.github && `<a class="icon-btn" href="${esc(P.github)}" target="_blank" rel="noopener" aria-label="GitHub">${icon("github")}</a>`,
    P.phone && `<a class="icon-btn" href="${tel(P.phone)}" aria-label="Phone">${icon("phone")}</a>`,
  ].filter(Boolean).join("");

  const renderHero = () => {
    const stack = P.codeStack.map((s) => `<span class="tk-s">"${esc(s)}"</span>`).join(", ");
    return `
    <section class="hero" id="home">
      <canvas id="neural" aria-hidden="true"></canvas>
      <div class="container hero-grid">
        <div class="hero-copy">
          ${P.available ? `<span class="badge" data-intro><span class="pulse"></span>Open to opportunities · ${esc(P.location)}</span>` : ""}
          <h1>${P.headline.map((l, i) => `<span class="line ${i === P.headline.length - 1 ? "grad-text" : ""}">${esc(l)}</span>`).join("")}</h1>
          <p class="intro" data-intro>${esc(P.intro)}</p>
          <p class="rotator mono" data-intro>&gt; focused on <span class="word" id="rotWord">${esc(P.rotatingRoles[0])}</span><span class="caret"></span></p>
          <div class="cta" data-intro>
            <a href="#projects" class="btn btn-primary" data-magnetic>View my work ${icon("arrow", "arrow")}</a>
            ${P.resume ? `<a href="${esc(P.resume)}" class="btn btn-ghost" data-magnetic download>${icon("download")} Resume</a>`
                       : `<a href="#contact" class="btn btn-ghost" data-magnetic>${icon("mail")} Contact me</a>`}
          </div>
          <div class="socials" data-intro>${socialLinks()}</div>
        </div>
        <div class="code-wrap">
          <div class="card code-card" data-tilt>
            <div class="code-head"><span></span><span></span><span></span><em class="mono">engineer.py</em></div>
            <div class="code-body mono"><span class="tk-k">class</span> <span class="tk-c">Engineer</span>:
    name  = <span class="tk-s">"${esc(P.name)}"</span>
    role  = <span class="tk-s">"${esc(P.role)}"</span>
    based = <span class="tk-s">"${esc(P.location)}"</span>
    stack = [${stack}]

    <span class="tk-k">def</span> <span class="tk-f">solve</span>(self, problem):
        data  = self.<span class="tk-f">explore</span>(problem)
        model = self.<span class="tk-f">train</span>(data)
        <span class="tk-k">return</span> self.<span class="tk-f">deploy</span>(model)  <span class="tk-m"># ship it 🚀</span></div>
          </div>
        </div>
      </div>
      <div class="scroll-hint mono"><span class="line-anim"></span>SCROLL</div>
    </section>
    ${renderMarquee()}`;
  };

  const renderMarquee = () => {
    const all = [...new Set(D.skills.flatMap((s) => s.items))];
    const half = Math.ceil(all.length / 2);
    const row = (items, cls) => `<div class="mq-row ${cls}"><div class="mq-track">${[...items, ...items, ...items, ...items].map((t) => `<span>${esc(t)}</span>`).join("")}</div></div>`;
    return `<div class="marquee" aria-hidden="true">${row(all.slice(0, half), "")}${row(all.slice(half), "outline")}</div>`;
  };

  /* ---------------------------- Sections ---------------------------- */
  const statCard = (s, i) => `
    <div class="card stat-card ${i === 2 ? "wide" : ""}" data-tilt>
      <strong class="grad-text" data-count="${s.value}" data-suffix="${esc(s.suffix || "")}">${s.value}${esc(s.suffix || "")}</strong>
      <span>${esc(s.label)}</span>
    </div>`;

  // The scroll-lit statement doubles as the section heading (keeps the page short).
  const renderAbout = (n) => `
    <div class="sec-head wide"><span class="eyebrow mono" data-up>${pad(n)} · About</span></div>
    ${P.statement ? `<p class="statement" data-scrub>${esc(P.statement)}</p>` : ""}
    <div class="about-grid" data-stagger>
      <div class="card about-text">${P.about.map((p) => `<p>${p}</p>`).join("")}</div>
      <div class="stat-col">${stats.slice(0, 3).map(statCard).join("")}</div>
    </div>`;

  const renderSkills = (n) => {
    const max = Math.max(...D.skills.map((s) => s.items.length));
    return `
    ${secHead(n, "Skills", "My technical toolkit")}
    <div class="skills-grid" data-stagger>
      ${D.skills.map((s) => `
        <div class="card skill-card ${s.items.length === max ? "wide" : ""}" data-tilt>
          <header><span class="icon-tile">${icon(s.icon)}</span><span class="count mono">${pad(s.items.length)} items</span></header>
          <h3>${esc(s.category)}</h3>
          ${chips(s.items)}
        </div>`).join("")}
    </div>`;
  };

  // Full-width section (horizontal gallery), so it returns its own <section>.
  const renderProjects = (n) => {
    const list = [...D.projects].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || b.year - a.year);
    const tags = ["All", ...new Set(list.flatMap((p) => p.tags || []))];
    return `
    <section class="block projects-sec" id="projects">
      <div class="container">
        ${secHead(n, "Projects", `Things I've <span class="grad-text">built</span>`, "Scroll to explore →")}
        ${tags.length > 2 ? `<div class="filters" data-up>${tags.map((t, i) => `<button class="filter ${i ? "" : "active"}" data-filter="${esc(t)}">${esc(t)}</button>`).join("")}</div>` : ""}
      </div>
      <div class="h-wrap"><div class="h-track">
        ${list.map((p, i) => `
          <article class="card project" data-tags="${esc((p.tags || []).join("|"))}">
            <div class="project-cover">
              ${p.featured ? `<span class="featured-tag mono">★ Featured</span>` : ""}
              <span class="big-icon">${icon(p.icon)}</span>
              <span class="num">${pad(i + 1)}</span>
            </div>
            <div class="project-body">
              <div class="project-meta mono"><span>${esc((p.tags || []).join(" · "))}</span><span>${esc(p.year)}</span></div>
              <h3>${esc(p.title)}</h3>
              <p>${esc(p.description)}</p>
              ${chips(p.tech, "tech")}
              ${p.links && (p.links.github || p.links.demo) ? `<div class="project-links">
                ${p.links.github ? `<a href="${esc(p.links.github)}" target="_blank" rel="noopener">${icon("github")} Code</a>` : ""}
                ${p.links.demo ? `<a href="${esc(p.links.demo)}" target="_blank" rel="noopener">${icon("external")} Live demo</a>` : ""}
              </div>` : ""}
            </div>
          </article>`).join("")}
        <a href="#contact" class="card h-end">
          <span>Have a project or role in mind?</span>
          <strong>Let's build it together</strong>
          ${icon("arrow")}
        </a>
      </div></div>
      <div class="container h-progress mono"><span id="hCur">01</span><div class="h-bar"><i></i></div><span>${pad(list.length)}</span></div>
    </section>`;
  };

  const timeline = (items) => `
    <div class="timeline">
      <div class="tl-track"><i class="tl-line"></i></div>
      ${items.map((e) => `
      <div class="tl-item" data-up="x"><div class="card">
        <span class="period mono">${esc(e.period)}</span>
        <h3>${esc(e.title)}</h3>
        <div class="org">${esc(e.org)}</div>
        ${e.description ? `<p class="desc">${esc(e.description)}</p>` : ""}
        ${chips(e.tags)}
      </div></div>`).join("")}
    </div>`;

  // Compact certification rows (title + issuer · date · ID) — one line each.
  const certList = () => `
    <div class="cert-list" data-stagger>
      ${D.certifications.map((c) => {
        const meta = [c.issuer, c.date, c.credentialId && `ID ${c.credentialId}`].filter(Boolean).map(esc).join(" · ");
        const tag = c.url ? "a" : "div";
        return `<${tag} class="card cert-row" ${c.url ? `href="${esc(c.url)}" target="_blank" rel="noopener"` : ""} ${c.topics ? `title="${esc(c.topics)}"` : ""}>
          <span class="icon-tile">${icon("award")}</span>
          <div><h3>${esc(c.title)}</h3><span class="mono">${meta}</span></div>
          ${c.url ? icon("external") : ""}
        </${tag}>`;
      }).join("")}
    </div>`;

  // Experience, education and certifications share one section, side by side.
  const renderJourney = (n) => `
    ${secHead(n, "Journey", has(D.experience) ? "Experience, education & certifications" : "Education & certifications")}
    <div class="journey-grid">
      <div>
        ${has(D.experience) ? `<div class="tl-title mono" data-up>${icon("briefcase")} EXPERIENCE</div>${timeline(D.experience)}<div style="height:28px"></div>` : ""}
        ${has(D.education) ? `<div class="tl-title mono" data-up>${icon("cap")} EDUCATION</div>${timeline(D.education)}` : ""}
      </div>
      ${has(D.certifications) ? `<div><div class="tl-title mono" data-up>${icon("award")} CERTIFICATIONS</div>${certList()}</div>` : ""}
    </div>`;

  const renderContact = () => `
    <div class="contact-card">
      <span class="eyebrow mono" data-up>Contact</span>
      <h2 data-split>${esc(D.contact.heading)}</h2>
      <p data-up>${esc(D.contact.text)}</p>
      <div class="cta" data-up>
        <a href="mailto:${esc(P.email)}" class="btn btn-primary" data-magnetic>${icon("mail")} Say hello</a>
        <button class="btn btn-ghost" id="copyEmail" data-magnetic>${icon("copy")} Copy email</button>
        ${P.linkedin ? `<a href="${esc(P.linkedin)}" target="_blank" rel="noopener" class="btn btn-ghost" data-magnetic>${icon("linkedin")} LinkedIn</a>` : ""}
      </div>
    </div>`;

  // Order here = order on page. `show` hides a section (and nav link) when it has no data.
  // `full: true` means the render function returns its own <section> element.
  const SECTIONS = [
    { id: "about", label: "About", render: renderAbout, show: true },
    { id: "skills", label: "Skills", render: renderSkills, show: has(D.skills) },
    { id: "projects", label: "Projects", render: renderProjects, show: has(D.projects), full: true },
    { id: "journey", label: "Journey", render: renderJourney, show: has(D.experience) || has(D.education) || has(D.certifications) },
    { id: "contact", label: "Contact", render: renderContact, show: !!P.email },
  ].filter((s) => s.show);

  /* ---------------------------- Mount ---------------------------- */
  document.title = `${P.name} — ${P.role}`;
  $("#logoText").textContent = P.shortName;
  $("#logoMark").textContent = P.name.split(" ").map((w) => w[0]).join("").slice(0, 2);
  const loaderName = $(".loader-name");
  if (loaderName) loaderName.textContent = `${P.name} — ${P.role}`;
  $("#navLinks").innerHTML = SECTIONS.map((s) => `<a href="#${s.id}" data-sec="${s.id}">${s.label}</a>`).join("");
  $("#app").innerHTML =
    renderHero() +
    SECTIONS.map((s, i) =>
      s.full ? s.render(i + 1) : `<section class="block" id="${s.id}"><div class="container">${s.render(i + 1)}</div></section>`
    ).join("");
  $("#footer").innerHTML = `<div class="container foot">
      <span>© ${new Date().getFullYear()} ${esc(P.name)}.</span>
      <a href="#home">Back to top ↑</a>
    </div>`;

  // Safety net: never leave the loader covering the page.
  setTimeout(() => {
    if (window.__unlockMotion) return window.__unlockMotion();
    const l = $(".loader"); if (l) l.remove();
    document.documentElement.classList.remove("is-loading", "lenis-stopped");
  }, 7000);

  /* ---------------------------- Interactions ---------------------------- */
  // Theme (circular reveal from the button where supported)
  const root = document.documentElement;
  const themeBtn = $("#themeBtn");
  const isDark = () => (root.dataset.theme ? root.dataset.theme === "dark" : !matchMedia("(prefers-color-scheme: light)").matches);
  const syncThemeIcon = () => (themeBtn.innerHTML = icon(isDark() ? "sun" : "moon"));
  try { const t = localStorage.getItem("theme"); if (t) root.dataset.theme = t; } catch (e) {}
  syncThemeIcon();
  themeBtn.addEventListener("click", (ev) => {
    const apply = () => {
      root.dataset.theme = isDark() ? "light" : "dark";
      try { localStorage.setItem("theme", root.dataset.theme); } catch (e) {}
      syncThemeIcon();
    };
    if (!document.startViewTransition || reduceMotion) return apply();
    const r = themeBtn.getBoundingClientRect();
    const x = r.left + r.width / 2, y = r.top + r.height / 2;
    const end = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    document.startViewTransition(apply).ready.then(() => {
      root.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${end}px at ${x}px ${y}px)`] },
        { duration: 800, easing: "cubic-bezier(.7,0,.3,1)", pseudoElement: "::view-transition-new(root)" }
      );
    });
  });

  // Mobile menu
  const menuBtn = $("#menuBtn"), navLinks = $("#navLinks");
  menuBtn.innerHTML = icon("menu");
  menuBtn.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    menuBtn.innerHTML = icon(open ? "close" : "menu");
  });
  $$("a", navLinks).forEach((a) => a.addEventListener("click", () => { navLinks.classList.remove("open"); menuBtn.innerHTML = icon("menu"); }));

  // Scroll progress, nav shadow, hide-on-scroll-down
  const nav = $(".nav"), bar = $(".progress");
  let lastY = scrollY;
  const onScroll = () => {
    const h = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${scrollY / Math.max(h, 1)})`;
    nav.classList.toggle("scrolled", scrollY > 20);
    if (!navLinks.classList.contains("open")) nav.classList.toggle("hidden", scrollY > lastY && scrollY > 300);
    lastY = scrollY;
  };
  addEventListener("scroll", onScroll, { passive: true }); onScroll();

  // Active nav link
  const secObs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) $$("#navLinks a").forEach((a) => a.classList.toggle("active", a.dataset.sec === e.target.id));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  SECTIONS.forEach((s) => secObs.observe(document.getElementById(s.id)));

  // Card spotlight
  document.addEventListener("pointermove", (ev) => {
    const card = ev.target.closest && ev.target.closest(".card");
    if (!card) return;
    const r = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${ev.clientX - r.left}px`);
    card.style.setProperty("--my", `${ev.clientY - r.top}px`);
  });

  // Project filters
  $$(".filter").forEach((btn) => btn.addEventListener("click", () => {
    $$(".filter").forEach((b) => b.classList.toggle("active", b === btn));
    const f = btn.dataset.filter;
    $$(".project").forEach((p) => p.classList.toggle("hide", !(f === "All" || p.dataset.tags.split("|").includes(f))));
    document.dispatchEvent(new CustomEvent("projects:filtered"));
  }));

  // Copy email
  const toast = $(".toast");
  const showToast = (msg) => { toast.textContent = msg; toast.classList.add("show"); setTimeout(() => toast.classList.remove("show"), 1800); };
  const copyBtn = $("#copyEmail");
  if (copyBtn) copyBtn.addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(P.email); showToast("Email copied to clipboard ✓"); }
    catch (e) { showToast(P.email); }
  });

  // Rotating role text (type / delete)
  const rot = $("#rotWord");
  if (rot && !reduceMotion && P.rotatingRoles.length > 1) {
    let w = 0, c = P.rotatingRoles[0].length, del = true;
    const tick = () => {
      const word = P.rotatingRoles[w];
      if (del) {
        c--;
        if (c <= 0) { del = false; w = (w + 1) % P.rotatingRoles.length; }
      } else {
        c++;
        if (c >= P.rotatingRoles[w].length) { rot.textContent = P.rotatingRoles[w]; del = true; return setTimeout(tick, 1800); }
      }
      rot.textContent = (del ? word : P.rotatingRoles[w]).slice(0, c);
      setTimeout(tick, del ? 35 : 75);
    };
    setTimeout(tick, 3500);
  }

  /* ---------------------------- Neural network canvas ---------------------------- */
  const canvas = $("#neural");
  if (canvas && !reduceMotion) {
    const ctx = canvas.getContext("2d");
    let W, H, nodes = [], running = true, mouse = { x: -999, y: -999 };
    const dpr = Math.min(devicePixelRatio || 1, 2);
    const readColors = () => { const cs = getComputedStyle(root); return [cs.getPropertyValue("--a1").trim(), cs.getPropertyValue("--a2").trim()]; };
    let [c1, c2] = readColors();
    new MutationObserver(() => ([c1, c2] = readColors())).observe(root, { attributes: true, attributeFilter: ["data-theme"] });

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      W = r.width; H = r.height;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(110, (W * H) / 13000));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.45, vy: (Math.random() - 0.5) * 0.45,
        r: Math.random() * 1.8 + 0.9,
      }));
    };
    const LINK = 150;
    const draw = () => {
      if (!running) return;
      ctx.clearRect(0, 0, W, H);
      for (const n of nodes) {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;
        const dx = mouse.x - n.x, dy = mouse.y - n.y, d = Math.hypot(dx, dy);
        if (d < 200) { n.x += dx * 0.006; n.y += dy * 0.006; }
      }
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j], d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < LINK) {
            ctx.globalAlpha = (1 - d / LINK) * 0.45;
            ctx.strokeStyle = (i + j) % 2 ? c1 : c2;
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
        // links to the cursor
        const m = nodes[i], dm = Math.hypot(m.x - mouse.x, m.y - mouse.y);
        if (dm < 200) {
          ctx.globalAlpha = (1 - dm / 200) * 0.8; ctx.strokeStyle = c2;
          ctx.beginPath(); ctx.moveTo(m.x, m.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        ctx.fillStyle = i % 3 ? c1 : c2;
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2); ctx.fill();
      }
      requestAnimationFrame(draw);
    };
    resize(); draw();
    addEventListener("resize", resize);
    const hero = canvas.parentElement;
    hero.addEventListener("pointermove", (e) => { const r = canvas.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; });
    hero.addEventListener("pointerleave", () => (mouse.x = mouse.y = -999));
    new IntersectionObserver(([e]) => { const was = running; running = e.isIntersecting; if (running && !was) draw(); }).observe(canvas);
  }
})();
