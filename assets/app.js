(() => {
  const LS = {
    lang: "zs_lang",
    slide: "zs_slide",
    users: "zs_users",
    session: "zs_session",
  };

  const SLIDES = /** @type {const} */ ({
    zaponizer: "zaponizer",
    soul: "soul",
  });

  const PALETTE = [
    { name: "red", h: 0 },
    { name: "yellow", h: 48 },
    { name: "lime", h: 105 },
    { name: "cyan", h: 178 },
    { name: "blue", h: 215 },
    { name: "purple", h: 275 },
  ];

  const I18N = {
    ru: {
      "nav.about": "О создателе",
      "nav.login": "Вход",
      "nav.profile": "Профиль",
      "auth.login": "Вход",
      "auth.register": "Регистрация",
      "auth.nickname": "Никнейм",
      "auth.password": "Пароль",
      "menu.info": "Информация",
      "menu.news": "Новости",
      "menu.secret": "Секретник",
      "menu.open": "Открыть",
      "auth.ok": "Готово.",
      "auth.bad": "Неверный ник или пароль.",
      "auth.exists": "Этот ник уже занят.",
      "auth.created": "Аккаунт создан. Вы вошли в систему.",
      "auth.short": "Пароль слишком короткий.",
    },
    en: {
      "nav.about": "About creator",
      "nav.login": "Sign in",
      "nav.profile": "Profile",
      "auth.login": "Sign in",
      "auth.register": "Register",
      "auth.nickname": "Nickname",
      "auth.password": "Password",
      "menu.info": "Information",
      "menu.news": "News",
      "menu.secret": "Secrets",
      "menu.open": "Open",
      "auth.ok": "Done.",
      "auth.bad": "Wrong nickname or password.",
      "auth.exists": "This nickname is already taken.",
      "auth.created": "Account created. You're signed in.",
      "auth.short": "Password is too short.",
    },
  };

  const MENU = {
    zaponizer: [
      { key: "menu.info", href: "./info-zaponizer.html", descKey: "menu.open" },
      { key: "menu.news", href: "./news.html", descKey: "menu.open" },
    ],
    soul: [
      { key: "menu.info", href: "./info-soul.html", descKey: "menu.open" },
      { key: "menu.secret", href: "./secret.html", descKey: "menu.open" },
    ],
  };

  function $(sel, root = document) {
    return root.querySelector(sel);
  }
  function $all(sel, root = document) {
    return Array.from(root.querySelectorAll(sel));
  }

  function safeJsonParse(s, fallback) {
    try {
      const v = JSON.parse(s);
      return v ?? fallback;
    } catch {
      return fallback;
    }
  }

  function getLang() {
    const l = (localStorage.getItem(LS.lang) || "ru").toLowerCase();
    return l === "en" ? "en" : "ru";
  }
  function setLang(lang) {
    localStorage.setItem(LS.lang, lang);
  }

  function t(key) {
    const lang = getLang();
    return (I18N[lang] && I18N[lang][key]) || (I18N.ru[key] ?? key);
  }

  function applyI18n(root = document) {
    const lang = getLang();
    document.documentElement.lang = lang;
    const label = $('[data-lang="label"]', root);
    if (label) label.textContent = lang.toUpperCase();

    $all("[data-i18n]", root).forEach((el) => {
      const k = el.getAttribute("data-i18n");
      if (!k) return;
      el.textContent = t(k);
    });
  }

  function hsl(h, s, l) {
    return `hsl(${Math.round(h)} ${Math.round(s)}% ${Math.round(l)}%)`;
  }

  function pickAccent() {
    const p = PALETTE[Math.floor(Math.random() * PALETTE.length)];
    const hue = p.h + (Math.random() - 0.5) * 8;
    const s1 = 92 + Math.random() * 6;
    const l1 = 62 + Math.random() * 8;
    const l2 = 40 + Math.random() * 6;
    const c1 = hsl(hue, s1, l1);
    const c2 = hsl(hue + 10 + Math.random() * 16, s1, l2);
    const glow = `hsla(${Math.round(hue)} ${Math.round(s1)}% ${Math.round(l1)}% / .55)`;
    return { c1, c2, glow };
  }

  function applyAccentVars() {
    const { c1, c2, glow } = pickAccent();
    document.documentElement.style.setProperty("--accent-a", c1);
    document.documentElement.style.setProperty("--accent-b", c2);
    document.documentElement.style.setProperty("--accent-glow", glow);
  }

  function applyRandomGradients(root = document) {
    const btns = $all(".neon-btn", root);
    btns.forEach((b) => {
      const { c1, c2, glow } = pickAccent();
      b.style.setProperty("--g1", c1);
      b.style.setProperty("--g2", c2);
      b.style.setProperty("--glow", glow);
    });

    const langbtn = $(".langbtn", root);
    if (langbtn) {
      const { c1, c2, glow } = pickAccent();
      langbtn.style.setProperty("--accent-a", c1);
      langbtn.style.setProperty("--accent-b", c2);
      langbtn.style.setProperty("--accent-glow", glow);
    }
  }

  function getSlide() {
    const s = (localStorage.getItem(LS.slide) || SLIDES.zaponizer).toLowerCase();
    return s === SLIDES.soul ? SLIDES.soul : SLIDES.zaponizer;
  }
  function setSlide(slide) {
    localStorage.setItem(LS.slide, slide);
  }

  function renderMenuFor(slide) {
    const track = $('[data-menu="track"]');
    if (!track) return;

    const panes = $all('[data-menu="pane"]');
    panes.forEach((p) => {
      const isActive = p.getAttribute("data-pane") === slide;
      p.setAttribute("aria-hidden", String(!isActive));
    });

    const pane = panes.find((p) => p.getAttribute("data-pane") === slide);
    if (!pane) return;

    const grid = $('[data-menu="grid"]', pane);
    if (!grid) return;

    const items = MENU[slide] || [];
    // Always render 2 columns × 3 rows. Missing entries become empty cells.
    const cells = Array.from({ length: 6 }, (_, i) => items[i] ?? null);

    grid.innerHTML = cells
      .map((it) => (it ? menuButtonHtml(it) : '<div class="menu__empty" aria-hidden="true"></div>'))
      .join("");
    applyI18n(pane);
    applyRandomGradients(pane);
  }

  function menuButtonHtml(item) {
    const label = t(item.key);
    return `
      <a class="neon-btn" href="${item.href}">
        <span class="neon-btn__cutout">${escapeHtml(label)}</span>
      </a>
    `.trim();
  }

  function escapeHtml(s) {
    return String(s)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function animateSlideTo(slide) {
    const track = $('[data-menu="track"]');
    if (!track) return;
    // track is 200% width (two panes), so second pane starts at -50%
    const x = slide === SLIDES.soul ? "-50%" : "0%";
    track.style.transform = `translateX(${x})`;
  }

  function initSlider() {
    const btns = $all("[data-slide]");
    if (btns.length === 0) return;

    function updateUI(slide) {
      btns.forEach((b) => b.classList.toggle("is-active", b.getAttribute("data-slide") === slide));
      renderMenuFor(slide);
      animateSlideTo(slide);
    }

    const initial = getSlide();
    updateUI(initial);

    btns.forEach((b) => {
      b.addEventListener("click", () => {
        const slide = b.getAttribute("data-slide");
        if (slide !== SLIDES.zaponizer && slide !== SLIDES.soul) return;
        setSlide(slide);
        updateUI(slide);
      });
    });
  }

  // Auth
  async function sha256Hex(text) {
    const data = new TextEncoder().encode(text);
    const hash = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hash))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }

  function loadUsers() {
    return safeJsonParse(localStorage.getItem(LS.users) || "{}", {});
  }
  function saveUsers(users) {
    localStorage.setItem(LS.users, JSON.stringify(users));
  }
  function getSession() {
    return safeJsonParse(localStorage.getItem(LS.session) || "null", null);
  }
  function setSession(nickname) {
    localStorage.setItem(LS.session, JSON.stringify({ nickname }));
  }
  function clearSession() {
    localStorage.removeItem(LS.session);
  }

  function normalizeNick(n) {
    return String(n || "").trim();
  }

  function updateAuthUI() {
    const s = getSession();
    const openBtn = $('[data-auth="open"]');
    const profileLink = $('[data-auth="profileLink"]');
    if (s?.nickname) {
      if (openBtn) openBtn.classList.add("is-hidden");
      if (profileLink) profileLink.classList.remove("is-hidden");
    } else {
      if (openBtn) openBtn.classList.remove("is-hidden");
      if (profileLink) profileLink.classList.add("is-hidden");
    }
  }

  function setHint(text, kind = "") {
    const hints = $all('[data-auth="hint"]');
    hints.forEach((h) => {
      h.textContent = text;
      h.classList.toggle("is-error", kind === "error");
      h.classList.toggle("is-ok", kind === "ok");
    });
  }

  function openModal() {
    const m = $('[data-auth="modal"]');
    if (!m) return;
    m.classList.remove("is-hidden");
    setHint("");
    const input = $('form[data-form="login"] input[name="nickname"]', m);
    input?.focus?.();
  }
  function closeModal() {
    const m = $('[data-auth="modal"]');
    if (!m) return;
    m.classList.add("is-hidden");
    setHint("");
  }

  function selectAuthTab(tab) {
    const modal = $('[data-auth="modal"]');
    if (!modal) return;
    $all('[data-auth="tab"]', modal).forEach((b) => b.classList.toggle("is-active", b.getAttribute("data-tab") === tab));
    $all('[data-auth="form"]', modal).forEach((f) => f.classList.toggle("is-hidden", f.getAttribute("data-form") !== tab));
    setHint("");
  }

  function initAuth() {
    updateAuthUI();

    document.addEventListener("click", (e) => {
      const tEl = /** @type {HTMLElement|null} */ (e.target instanceof HTMLElement ? e.target : null);
      if (!tEl) return;
      const open = tEl.closest?.('[data-auth="open"]');
      if (open) openModal();

      const close = tEl.closest?.('[data-auth="close"]');
      if (close) closeModal();

      const tabBtn = tEl.closest?.('[data-auth="tab"]');
      if (tabBtn) {
        const tab = tabBtn.getAttribute("data-tab");
        if (tab === "login" || tab === "register") selectAuthTab(tab);
      }

      const langToggle = tEl.closest?.('[data-lang="toggle"]');
      if (langToggle) {
        const next = getLang() === "ru" ? "en" : "ru";
        setLang(next);
        applyI18n(document);
        // rerender visible menu labels
        renderMenuFor(getSlide());
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeModal();
    });

    $all('form[data-auth="form"]').forEach((form) => {
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const f = /** @type {HTMLFormElement} */ (e.currentTarget);
        const mode = f.getAttribute("data-form");
        const nickname = normalizeNick(new FormData(f).get("nickname"));
        const password = String(new FormData(f).get("password") || "");
        if (!nickname) return setHint(t("auth.bad"), "error");

        const users = loadUsers();
        const key = nickname.toLowerCase();

        if (mode === "register") {
          if (password.length < 4) return setHint(t("auth.short"), "error");
          if (users[key]) return setHint(t("auth.exists"), "error");
          const passHash = await sha256Hex(password);
          users[key] = {
            nickname,
            passHash,
            points: 0,
            joinedAt: new Date().toISOString(),
            history: [],
            claimed: {},
          };
          saveUsers(users);
          setSession(nickname);
          updateAuthUI();
          setHint(t("auth.created"), "ok");
          setTimeout(closeModal, 650);
          return;
        }

        if (mode === "login") {
          const u = users[key];
          if (!u) return setHint(t("auth.bad"), "error");
          const passHash = await sha256Hex(password);
          if (u.passHash !== passHash) return setHint(t("auth.bad"), "error");
          setSession(u.nickname);
          updateAuthUI();
          setHint(t("auth.ok"), "ok");
          setTimeout(closeModal, 450);
        }
      });
    });
  }

  // Secret page hooks
  const SECRET_CODES = {
    zaponizer: [{ code: "ZAP-42", points: 15 }],
    soul: [{ code: "SOUL-777", points: 25 }],
  };

  function initSecretPage() {
    const form = $('[data-secret="form"]');
    if (!form) return;

    const msg = $('[data-secret="msg"]');
    const slide = getSlide();
    const slideLabel = $('[data-secret="slide"]');
    if (slideLabel) slideLabel.textContent = slide === SLIDES.soul ? "The Soul's Contour" : "Zaponizer";

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const s = getSession();
      if (!s?.nickname) {
        msg && (msg.textContent = getLang() === "ru" ? "Нужно войти в аккаунт." : "You need to sign in.");
        msg && msg.classList.add("is-error");
        openModal();
        return;
      }

      const input = /** @type {HTMLInputElement|null} */ ($('[data-secret="input"]'));
      const raw = String(input?.value || "").trim();
      if (!raw) return;

      const users = loadUsers();
      const u = users[s.nickname.toLowerCase()];
      if (!u) return;

      const codes = SECRET_CODES[slide] || [];
      const found = codes.find((c) => c.code.toLowerCase() === raw.toLowerCase());
      if (!found) {
        if (msg) {
          msg.textContent = getLang() === "ru" ? "Неверный код." : "Wrong code.";
          msg.className = "form__hint is-error";
        }
        return;
      }

      const claimKey = `${slide}:${found.code.toLowerCase()}`;
      u.claimed ||= {};
      if (u.claimed[claimKey]) {
        if (msg) {
          msg.textContent = getLang() === "ru" ? "Этот код уже засчитан." : "This code was already claimed.";
          msg.className = "form__hint is-error";
        }
        return;
      }

      u.points = Number(u.points || 0) + found.points;
      u.claimed[claimKey] = true;
      u.history ||= [];
      u.history.unshift({
        kind: "secret",
        slide,
        code: found.code,
        points: found.points,
        at: new Date().toISOString(),
      });
      users[s.nickname.toLowerCase()] = u;
      saveUsers(users);

      if (msg) {
        msg.textContent =
          (getLang() === "ru" ? "Код принят. +" : "Accepted. +") + String(found.points);
        msg.className = "form__hint is-ok";
      }
      if (input) input.value = "";
    });
  }

  function initProfilePage() {
    const root = $('[data-profile="root"]');
    if (!root) return;
    const s = getSession();
    if (!s?.nickname) {
      root.innerHTML = `<div class="card"><h1 class="h1">${escapeHtml(
        getLang() === "ru" ? "Нужно войти" : "Sign in required"
      )}</h1><p class="p muted">${
        getLang() === "ru"
          ? "Откройте окно входа и войдите в аккаунт."
          : "Open the sign in modal and log in."
      }</p><button class="neon-btn neon-btn--wide" type="button" data-auth="open">${
        getLang() === "ru" ? "Вход" : "Sign in"
      }</button></div>`;
      applyRandomGradients(root);
      return;
    }

    const users = loadUsers();
    const u = users[s.nickname.toLowerCase()];
    if (!u) {
      clearSession();
      updateAuthUI();
      location.reload();
      return;
    }

    const joined = new Date(u.joinedAt).toLocaleString(undefined, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    const points = Number(u.points || 0);
    const history = Array.isArray(u.history) ? u.history.slice(0, 12) : [];

    root.innerHTML = `
      <div class="card">
        <h1 class="h1">${escapeHtml(getLang() === "ru" ? "Профиль" : "Profile")}</h1>
        <p class="p"><span class="muted">${escapeHtml(getLang() === "ru" ? "Ник" : "Nickname")}:</span> ${escapeHtml(u.nickname)}</p>
        <p class="p"><span class="muted">${escapeHtml(getLang() === "ru" ? "Дата регистрации" : "Registered")}:</span> ${escapeHtml(joined)}</p>
        <p class="p"><span class="muted">${escapeHtml(getLang() === "ru" ? "Очки" : "Points")}:</span> <strong>${escapeHtml(points)}</strong></p>
        <div style="height:10px"></div>
        <h2 class="h1" style="font-size:18px; margin-bottom:10px">${escapeHtml(getLang() === "ru" ? "Последние начисления" : "Recent awards")}</h2>
        <div class="card" style="background: rgba(255,255,255,.03); border-radius: 12px;">
          ${
            history.length
              ? history
                  .map((h) => {
                    const at = new Date(h.at).toLocaleString();
                    const name = h.kind === "secret" ? "Secret" : "Award";
                    return `<p class="p" style="margin:0 0 10px"><span class="muted">${escapeHtml(
                      at
                    )}</span> — ${escapeHtml(name)} (${escapeHtml(h.slide)}) <strong>+${escapeHtml(
                      h.points
                    )}</strong></p>`;
                  })
                  .join("")
              : `<p class="p muted" style="margin:0">${escapeHtml(
                  getLang() === "ru" ? "Пока пусто." : "No entries yet."
                )}</p>`
          }
        </div>
        <div style="height:14px"></div>
        <button class="topbtn" type="button" data-profile="logout">${escapeHtml(
          getLang() === "ru" ? "Выйти" : "Log out"
        )}</button>
      </div>
    `;

    applyRandomGradients(root);
    root.addEventListener("click", (e) => {
      const el = e.target instanceof HTMLElement ? e.target : null;
      if (!el) return;
      if (el.closest('[data-profile="logout"]')) {
        clearSession();
        updateAuthUI();
        location.href = "./index.html";
      }
    });
  }

  function boot() {
    applyAccentVars();
    applyI18n(document);
    applyRandomGradients(document);
    initAuth();
    initSlider();
    initSecretPage();
    initProfilePage();
    updateAuthUI();

    if (typeof window.__startAshParticles === "function") {
      window.__startAshParticles(document);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();

