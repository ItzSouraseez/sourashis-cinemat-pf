(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const pad = (n) => String(n).padStart(2, "0");
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const ROLE = { direct: "DIR", shoot: "DOP", edit: "EDIT" };
  const thumb = (id, size = "mqdefault") => `https://i.ytimg.com/vi/${id}/${size}.jpg`;

  /* ── data ── */
  function ytId(url) {
    if (!url) return "";
    const m = String(url).match(/(?:youtu\.be\/|v=|\/embed\/|\/shorts\/|\/live\/)([\w-]{11})/);
    return m ? m[1] : /^[\w-]{11}$/.test(url) ? url : "";
  }
  const secs = (rt) => (rt || "0:0").split(":").reduce((a, b) => a * 60 + +b, 0);
  const fmtDate = (d, opt) => (d ? new Date(d + "T00:00:00").toLocaleDateString("en-GB", opt) : "");
  const hm = (s) => `${Math.floor(s / 3600)}h ${pad(Math.round((s % 3600) / 60))}m`;
  const films = (window.DAILIES || [])
    .map((f) => ({ ...f, id: ytId(f.url), roles: f.roles || [] }))
    .sort((a, b) => String(b.date || b.year || "").localeCompare(String(a.date || a.year || "")))
    .map((f, i, all) => ({ ...f, n: all.length - i }));
  const total = films.length;
  const runtime = films.reduce((s, f) => s + secs(f.runtime), 0);

  /* ── 0. iris opens once ── */
  const iris = $(".iris");
  const xf = $("#x-f");
  if (reduce) { iris.remove(); xf.textContent = "T2.0"; }
  else {
    const pts = Array.from({ length: 8 }, (_, i) => {
      const a = (Math.PI / 4) * i + Math.PI / 8;
      return `${50 + 75 * Math.cos(a)},${50 + 75 * Math.sin(a)}`;
    }).join(" ");
    iris.innerHTML = `<svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
      <defs><mask id="ap"><rect x="-50" y="-50" width="200" height="200" fill="#fff"/>
      <polygon class="blades" points="${pts}" fill="#000"/></mask></defs>
      <rect x="-50" y="-50" width="200" height="200" fill="#0b0b0a" mask="url(#ap)"/></svg>`;
    // the iris readout opens up with it
    ["T22", "T16", "T11", "T8", "T5.6", "T4", "T2.8", "T2.0"].forEach((v, i) => setTimeout(() => (xf.textContent = v), 250 + i * 170));
    setTimeout(() => iris.remove(), 2000);
  }

  /* ── 1. hero wall + rack focus ── */
  const hero = $(".hero");
  const tiles = Array.from({ length: 60 }, (_, i) => films[(i * 7) % total]).filter((f) => f && f.id);
  const tileHTML = tiles.map((f) => `<img src="${thumb(f.id)}" alt="" decoding="async">`).join("");
  $$(".wall-layer").forEach((l) => (l.innerHTML = tileHTML));

  const af = $("#afbox");
  const afLabel = $("i", af);
  let lockT;
  function focusAt(x, y) {
    const r = hero.getBoundingClientRect();
    const wall = $("#wall").getBoundingClientRect();
    hero.style.setProperty("--mx", `${x - wall.left}px`);
    hero.style.setProperty("--my", `${y - wall.top}px`);
    af.style.setProperty("--ax", `${x - r.left}px`);
    af.style.setProperty("--ay", `${y - r.top}px`);
    if (af.classList.contains("is-locked")) { af.classList.remove("is-locked"); afLabel.textContent = "AF"; }
    clearTimeout(lockT);
    lockT = setTimeout(() => {
      af.classList.add("is-locked");
      afLabel.textContent = `AF lock · ${(1.2 + ((y - r.top) / r.height) * 3).toFixed(1)}m`;
    }, 420);
  }
  const home = () => { const r = hero.getBoundingClientRect(); focusAt(r.left + r.width * 0.66, r.top + r.height * (finePointer ? 0.34 : 0.22)); };
  if (finePointer && !reduce) {
    hero.addEventListener("pointermove", (e) => focusAt(e.clientX, e.clientY));
  } else if (!reduce) {
    // touch: the camera hunts for focus on its own
    let t = 0, last = 0;
    const drift = (now) => {
      const r = hero.getBoundingClientRect();
      if (r.bottom > 0 && now - last > 1600) {
        last = now; t += 1;
        focusAt(r.left + r.width * (0.5 + 0.26 * Math.sin(t * 1.7)), r.top + r.height * (0.22 + 0.05 * Math.cos(t * 2.3)));
      }
      requestAnimationFrame(drift);
    };
    setTimeout(() => requestAnimationFrame(drift), 1800);
  }
  requestAnimationFrame(home);
  addEventListener("resize", home);

  /* ── 2. story: the act in view drives the monitor ── */
  $$("[data-src]").forEach((im) => (im.src = thumb(im.dataset.src, "maxresdefault")));
  $$("[data-t]").forEach((s) => (s.style.backgroundImage = `url(${thumb(s.dataset.t)})`));
  const acts = $$(".act");
  const layers = [".l-board", ".l-shoot", ".l-cut"].map((s) => $(s));
  const labels = ["BOARDS", "REC", "EDIT"];
  const clipNo = ["07", "12", "19"];
  function setAct(i) {
    acts.forEach((a, j) => a.classList.toggle("is-on", j === i));
    layers.forEach((l, j) => l.classList.toggle("is-on", j === i));
    $("#act-label").textContent = labels[i];
    $("#act-step").textContent = `${pad(i + 1)} / 03`;
    $("#act-clip").textContent = clipNo[i];
    $("#act-prog").style.width = `${((i + 1) / 3) * 100}%`;
  }
  const actIO = new IntersectionObserver(
    (es) => es.forEach((e) => e.isIntersecting && setAct(+e.target.dataset.act)),
    { rootMargin: "-45% 0px -45% 0px" }
  );
  acts.forEach((a) => actIO.observe(a));

  /* ── 3. playback deck ── */
  const bin = $("#bin");
  const screen = $("#pm-screen");
  const img = $("#pm-img");
  let cur = 0;

  bin.innerHTML = films.map((f, i) => `
    <li><button class="clip" data-i="${i}" data-roles="${f.roles.join(" ")}" aria-label="Play ${esc(f.title)}">
      <span class="clip-thumb"><img src="${thumb(f.id)}" alt="" loading="lazy" decoding="async"><span class="dur">${esc(f.runtime || "")}</span></span>
      <span><span class="clip-title">${esc(f.title)}</span>
      <span class="clip-sub lbl">${esc(f.client)} · ${fmtDate(f.date, { day: "numeric", month: "short" })}</span></span>
    </button></li>`).join("");

  function cue(i, play = false) {
    const f = films[i];
    if (!f) return;
    cur = i;
    screen.classList.remove("is-playing");
    $("iframe", screen)?.remove();
    if (img.dataset.id !== f.id) {
      screen.classList.add("is-swapping");
      const next = new Image();
      next.onload = next.onerror = () => { img.src = next.src; img.dataset.id = f.id; screen.classList.remove("is-swapping"); };
      next.src = thumb(f.id, "maxresdefault");
    }
    img.alt = f.title;
    $("#pm-title").textContent = f.title;
    $("#pm-sub").textContent = [f.client, f.format, fmtDate(f.date, { day: "numeric", month: "short", year: "numeric" })].filter(Boolean).join(" · ");
    $("#pm-roles").innerHTML = f.roles.map((r) => `<span class="role ${r}">${ROLE[r] || r}</span>`).join("");
    $("#pm-yt").href = `https://www.youtube.com/watch?v=${f.id}`;
    $("#pm-clip").textContent = `CLIP ${pad(f.n)} / ${pad(total)}`;
    const s = secs(f.runtime);
    $("#pm-tc").textContent = `00:${pad(Math.floor(s / 60))}:${pad(s % 60)}:00`;
    $("#pm-state").innerHTML = "▶ <b>CUED</b>";
    $("#pm-play").setAttribute("aria-label", `Play ${f.title}`);
    $$(".clip", bin).forEach((c) => c.classList.toggle("is-on", +c.dataset.i === i));
    if (play) start();
  }
  function start() {
    const f = films[cur];
    screen.insertAdjacentHTML("beforeend",
      `<iframe src="https://www.youtube-nocookie.com/embed/${f.id}?autoplay=1&rel=0&modestbranding=1&playsinline=1"
        title="${esc(f.title)}" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`);
    screen.classList.add("is-playing");
    $("#pm-state").innerHTML = "● <b>PLAYBACK</b>";
  }
  $("#pm-play").addEventListener("click", start);
  bin.addEventListener("click", (e) => {
    const c = e.target.closest(".clip");
    if (!c) return;
    cue(+c.dataset.i, true);
    if (innerWidth <= 1100) $(".play-monitor").scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
  });

  $$(".chip").forEach((chip) => {
    const f = chip.dataset.f;
    const n = f === "all" ? total : films.filter((x) => x.roles.includes(f)).length;
    chip.querySelector("span").textContent = n;
    if (!n) chip.hidden = true; // no films with this role yet
    chip.addEventListener("click", () => {
      $$(".chip").forEach((o) => { o.classList.toggle("is-on", o === chip); o.setAttribute("aria-pressed", o === chip); });
      const shown = $$(".clip", bin).filter((c) => {
        const ok = f === "all" || c.dataset.roles.split(" ").includes(f);
        c.parentElement.hidden = !ok;
        return ok;
      });
      if (shown.length && !shown.some((c) => +c.dataset.i === cur)) cue(+shown[0].dataset.i);
      bin.scrollTop = 0;
    });
  });

  $("#count-films").textContent = total;
  $("#count-runtime").textContent = hm(runtime);
  cue(0);

  /* ── 4. credits ledger, built from the data ── */
  const by = {};
  films.forEach((f) => {
    const c = (by[f.client] ||= { n: 0, roles: new Set() });
    c.n++; f.roles.forEach((r) => c.roles.add(r));
  });
  $("#ledger").innerHTML = Object.entries(by).sort((a, b) => b[1].n - a[1].n).map(([name, c]) => `
    <li><h3>${esc(name)}</h3>
      <span class="num">${c.n}<small>${c.n === 1 ? "film" : "films"}</small></span>
      <div class="roles">${["direct", "shoot", "edit"].filter((r) => c.roles.has(r)).map((r) => `<span class="role ${r}">${ROLE[r]}</span>`).join("")}</div></li>`).join("") +
    `<li class="total"><h3>Runtime released</h3><span class="num">${hm(runtime)}<small>${total} films</small></span></li>`;

  /* ── 5. the slate is the brief form ──
     No server yet: a valid brief opens the visitor's email app with
     everything filled in. Swap CONTACT_EMAIL for the real address. */
  const CONTACT_EMAIL = "personal.sourashisghoshroy@gmail.com";
  const form = $("#brief");
  const body = $(".slate-body", form);
  const done = $("#done");
  let take = 1;
  $("#slate-date").textContent = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short" });

  const clap = () => { form.classList.remove("is-clap"); void form.offsetWidth; form.classList.add("is-clap"); };
  const checks = [
    ["f-prod", "e-prod", (v) => v.trim() ? "" : "Give the film a working title."],
    ["f-name", "e-name", (v) => v.trim() ? "" : "Tell me who's asking."],
    ["f-email", "e-email", (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? "" : "I need an email to reply to."],
  ];
  const check = (id, eid, test) => {
    const el = $("#" + id), msg = test(el.value);
    $("#" + eid).textContent = msg;
    el.closest(".cell").classList.toggle("is-bad", !!msg);
    el.setAttribute("aria-invalid", msg ? "true" : "false");
    if (msg) el.setAttribute("aria-describedby", eid); else el.removeAttribute("aria-describedby");
    return !msg;
  };
  checks.forEach(([id, eid, test]) => $("#" + id).addEventListener("blur", (e) => e.target.value && check(id, eid, test)));

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const bad = checks.filter(([id, eid, test]) => !check(id, eid, test));
    if (bad.length) { $("#" + bad[0][0]).focus(); return; }

    const d = Object.fromEntries(new FormData(form));
    const subject = `Brief: ${d.production}${d.client ? ` for ${d.client}` : ""}`;
    const lines = [
      `Production: ${d.production}`,
      d.client ? `Brand / client: ${d.client}` : null,
      `Format: ${d.format}`,
      d.date ? `Shoot date: ${/^\d{4}-/.test(d.date) ? fmtDate(d.date, { weekday: "long", day: "numeric", month: "long", year: "numeric" }) : d.date}` : null,
      d.city ? `City: ${d.city}` : null,
      `Budget: ${d.budget}`,
      "",
      d.brief ? d.brief : null,
      d.brief ? "" : null,
      d.name,
      d.email,
    ].filter((l) => l !== null);
    const href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;

    clap();
    setTimeout(() => {
      window.location.href = href;
      $("#done-take").textContent = pad(take);
      const m = $("#done-mail");
      m.href = href; m.textContent = CONTACT_EMAIL;
      body.hidden = true; done.hidden = false;
      done.querySelector("h3").setAttribute("tabindex", "-1");
      done.querySelector("h3").focus();
    }, reduce ? 0 : 420);
  });
  $("#again").addEventListener("click", () => {
    take++; $("#take").textContent = pad(take);
    done.hidden = true; body.hidden = false;
    $("#f-prod").focus();
  });

  /* ── 5b. custom form controls ── */
  const isoOf = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const pickers = [];
  const closeAll = (except) => pickers.forEach((p) => p !== except && p.close(false));

  // date picker
  (() => {
    const cell = $(".c-date"), btn = $("#date-btn"), pop = $("#cal"), out = $("#date-val"), input = $("#f-date");
    let view = new Date(today.getFullYear(), today.getMonth(), 1);
    let focus = new Date(today), sel = null;
    const chev = (d) => `<svg viewBox="0 0 16 16" aria-hidden="true"><path d="${d}"/></svg>`;

    function render() {
      const y = view.getFullYear(), m = view.getMonth();
      const lead = (new Date(y, m, 1).getDay() + 6) % 7;
      const days = new Date(y, m + 1, 0).getDate();
      const canPrev = new Date(y, m, 1) > new Date(today.getFullYear(), today.getMonth(), 1);
      const fIso = isoOf(focus), sIso = sel && isoOf(sel), tIso = isoOf(today);
      let cells = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) => `<span class="cal-dow" aria-hidden="true">${d}</span>`).join("");
      cells += "<span></span>".repeat(lead);
      for (let i = 1; i <= days; i++) {
        const d = new Date(y, m, i), iso = isoOf(d), dow = (d.getDay() + 6) % 7;
        const cls = ["cal-day", iso === tIso && "is-today", iso === sIso && "is-sel", dow > 4 && "is-weekend"].filter(Boolean).join(" ");
        cells += `<button type="button" class="${cls}" data-d="${iso}" tabindex="${iso === fIso ? 0 : -1}"
          ${d < today ? "disabled" : ""} ${iso === tIso ? 'aria-current="date"' : ""} aria-pressed="${iso === sIso}"
          aria-label="${d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}">${i}</button>`;
      }
      pop.innerHTML = `
        <div class="cal-head">
          <p class="cal-title" aria-live="polite">${view.toLocaleDateString("en-GB", { month: "long", year: "numeric" })}</p>
          <div class="cal-nav">
            <button type="button" data-step="-1" aria-label="Previous month" ${canPrev ? "" : "disabled"}>${chev("M10 3L5 8l5 5")}</button>
            <button type="button" data-step="1" aria-label="Next month">${chev("M6 3l5 5-5 5")}</button>
          </div>
        </div>
        <div class="cal-grid">${cells}</div>
        <div class="cal-foot">
          <button type="button" class="cal-flex" data-act="flex">Not fixed yet</button>
          <button type="button" data-act="clear">Clear</button>
        </div>`;
    }
    const focusDay = () => $(`.cal-day[data-d="${isoOf(focus)}"]`, pop)?.focus();
    function moveTo(d) {
      if (d < today) d = new Date(today);
      focus = d;
      if (d.getMonth() !== view.getMonth() || d.getFullYear() !== view.getFullYear()) view = new Date(d.getFullYear(), d.getMonth(), 1);
      render(); focusDay();
    }
    function set(label, value) {
      input.value = value; out.textContent = label;
      out.classList.toggle("is-empty", !value);
    }
    const api = {
      open() {
        closeAll(api);
        focus = sel ? new Date(sel) : new Date(today);
        view = new Date(focus.getFullYear(), focus.getMonth(), 1);
        render(); pop.hidden = false; cell.classList.add("is-open");
        btn.setAttribute("aria-expanded", "true"); focusDay();
      },
      close(refocus) {
        if (pop.hidden) return;
        pop.hidden = true; cell.classList.remove("is-open");
        btn.setAttribute("aria-expanded", "false");
        if (refocus) btn.focus();
      },
    };
    pickers.push(api);
    btn.addEventListener("click", () => (pop.hidden ? api.open() : api.close(true)));
    pop.addEventListener("click", (e) => {
      const step = e.target.closest("[data-step]");
      if (step) {
        view = new Date(view.getFullYear(), view.getMonth() + +step.dataset.step, 1);
        focus = new Date(view); if (focus < today) focus = new Date(today);
        render(); $(`[data-step="${step.dataset.step}"]`, pop)?.focus();
        return;
      }
      const act = e.target.closest("[data-act]");
      if (act) {
        sel = null;
        if (act.dataset.act === "flex") set("Not fixed yet", "Not fixed yet");
        else set("Pick a day", "");
        return api.close(true);
      }
      const day = e.target.closest(".cal-day");
      if (day && !day.disabled) {
        sel = new Date(day.dataset.d + "T00:00:00");
        set(sel.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" }), day.dataset.d);
        api.close(true);
      }
    });
    pop.addEventListener("keydown", (e) => {
      if (e.key === "Escape") { e.preventDefault(); return api.close(true); }
      if (!e.target.classList.contains("cal-day")) return;
      const d = new Date(focus), dow = (d.getDay() + 6) % 7;
      const moves = {
        ArrowLeft: () => d.setDate(d.getDate() - 1), ArrowRight: () => d.setDate(d.getDate() + 1),
        ArrowUp: () => d.setDate(d.getDate() - 7), ArrowDown: () => d.setDate(d.getDate() + 7),
        Home: () => d.setDate(d.getDate() - dow), End: () => d.setDate(d.getDate() + 6 - dow),
        PageUp: () => d.setMonth(d.getMonth() - 1), PageDown: () => d.setMonth(d.getMonth() + 1),
      };
      if (moves[e.key]) { e.preventDefault(); moves[e.key](); moveTo(d); }
    });
    cell.addEventListener("focusout", (e) => { if (e.relatedTarget && !cell.contains(e.relatedTarget)) api.close(false); });
  })();

  // budget dropdown
  (() => {
    const cell = $(".c-budget"), btn = $("#budget-btn"), list = $("#budget-list"), out = $("#budget-val"), input = $("#f-budget");
    const opts = $$("li", list);
    let active = 0, typed = "", typedT;
    const mark = (i) => {
      active = (i + opts.length) % opts.length;
      opts.forEach((o, j) => o.classList.toggle("is-active", j === active));
      list.setAttribute("aria-activedescendant", opts[active].id);
    };
    const choose = (i) => {
      opts.forEach((o, j) => o.setAttribute("aria-selected", j === i));
      input.value = out.textContent = opts[i].textContent;
      api.close(true);
    };
    const api = {
      open() {
        closeAll(api);
        list.hidden = false; cell.classList.add("is-open"); btn.setAttribute("aria-expanded", "true");
        mark(Math.max(0, opts.findIndex((o) => o.getAttribute("aria-selected") === "true")));
        list.focus();
      },
      close(refocus) {
        if (list.hidden) return;
        list.hidden = true; cell.classList.remove("is-open"); btn.setAttribute("aria-expanded", "false");
        if (refocus) btn.focus();
      },
    };
    pickers.push(api);
    btn.addEventListener("click", () => (list.hidden ? api.open() : api.close(true)));
    btn.addEventListener("keydown", (e) => { if (e.key === "ArrowDown" || e.key === "ArrowUp") { e.preventDefault(); api.open(); } });
    list.addEventListener("click", (e) => { const li = e.target.closest("li"); if (li) choose(opts.indexOf(li)); });
    list.addEventListener("pointermove", (e) => { const li = e.target.closest("li"); if (li) mark(opts.indexOf(li)); });
    list.addEventListener("keydown", (e) => {
      const k = e.key;
      if (k === "ArrowDown") mark(active + 1);
      else if (k === "ArrowUp") mark(active - 1);
      else if (k === "Home") mark(0);
      else if (k === "End") mark(opts.length - 1);
      else if (k === "Enter" || k === " ") choose(active);
      else if (k === "Escape") api.close(true);
      else if (k === "Tab") return api.close(false);
      else if (k.length === 1) {
        typed += k.toLowerCase(); clearTimeout(typedT); typedT = setTimeout(() => (typed = ""), 600);
        const hit = opts.findIndex((o) => o.textContent.toLowerCase().replace(/[^a-z0-9 ]/g, "").trim().startsWith(typed));
        if (hit > -1) mark(hit);
      } else return;
      e.preventDefault();
    });
    list.addEventListener("blur", (e) => { if (!cell.contains(e.relatedTarget)) api.close(false); });
  })();

  document.addEventListener("pointerdown", (e) => {
    if (!e.target.closest(".c-date, .c-budget")) closeAll();
  });

  // the brief grows with what's typed
  const brief = $("#f-brief");
  brief.addEventListener("input", () => { brief.style.height = "auto"; brief.style.height = brief.scrollHeight + "px"; });

  /* ── HUD: timecode, mode, nav, scrolled state ── */
  const tc = $("#tc");
  const t0 = performance.now();
  (function tick() {
    const fr = Math.floor(((performance.now() - t0) / 1000) * 24);
    const s = Math.floor(fr / 24), m = Math.floor(s / 60), h = Math.floor(m / 60);
    tc.textContent = `${pad(h)}:${pad(m % 60)}:${pad(s % 60)}:${pad(fr % 24)}`;
    requestAnimationFrame(tick);
  })();

  const hud = $(".hud");
  const onScroll = () => hud.classList.toggle("is-scrolled", scrollY > 24);
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const links = $$(".nav a");
  const secIO = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    $("#mode").textContent = e.target.dataset.mode;
    links.forEach((a) => a.classList.toggle("is-active", a.hash === "#" + e.target.id));
  }), { rootMargin: "-50% 0px -50% 0px" });
  $$("main > section").forEach((s) => secIO.observe(s));

  $("#yr").textContent = new Date().getFullYear();
})();
