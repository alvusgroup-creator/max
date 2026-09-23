/* Maxilimpo — interações da página
   - menu (telemóvel) e header sticky
   - carrossel de serviços (setas + swipe)
   - carrossel contínuo dos trabalhos (duplica os itens para o ciclo ser contínuo)
   - brilhos flutuantes nas margens laterais (só ecrãs largos)
   - entrada suave das dobras e sublinhado animado
   - validação e envio dos formulários
   - WhatsApp flutuante + barra fixa
*/
(() => {
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* ---------- Ano no rodapé ---------- */
  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- Menu ---------- */
  const header = $('.site-header');
  const toggle = $('.menu-toggle');
  const nav = $('#menu');
  const navLabel = toggle.querySelector('.sr-only');

  const setMenu = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
    navLabel.textContent = open ? 'Fechar menu' : 'Abrir menu';
  };
  toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  nav.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) { setMenu(false); toggle.focus(); }
  });

  /* ---------- Header: sombra ao descer ---------- */
  const onScroll = () => header.classList.toggle('is-stuck', window.scrollY > 8);
  onScroll();
  addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Secção ativa no menu ---------- */
  const navLinks = $$('.nav a[href^="#"]');
  const sections = navLinks.map((a) => $(a.hash)).filter(Boolean);
  if (sections.length && 'IntersectionObserver' in window) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        navLinks.forEach((a) => a.removeAttribute('aria-current'));
        const active = navLinks.find((a) => a.hash === '#' + en.target.id);
        if (active) active.setAttribute('aria-current', 'true');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach((s) => spy.observe(s));
  }

  /* ---------- Carrossel de serviços ---------- */
  $$('[data-carousel]').forEach((car) => {
    const track = $('.svc-track', car);
    const [prev, next] = $$('.carousel-btn', car);
    if (!track || !prev || !next) return;

    const update = () => {
      const max = track.scrollWidth - track.clientWidth - 2;
      prev.disabled = track.scrollLeft <= 2;
      next.disabled = track.scrollLeft >= max;
    };
    const step = () => {
      const card = $('.svc-card', track);
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      return card.getBoundingClientRect().width + gap;
    };
    [prev, next].forEach((btn) => {
      btn.addEventListener('click', () => {
        track.scrollBy({ left: step() * Number(btn.dataset.dir), behavior: reduceMotion ? 'auto' : 'smooth' });
      });
    });
    track.addEventListener('scroll', update, { passive: true });
    addEventListener('resize', update);
    update();
  });

  /* ---------- Carrossel contínuo dos trabalhos ---------- */
  $$('[data-marquee]').forEach((m) => {
    const track = $('.marquee-track', m);
    if (!track || reduceMotion) return;
    const originals = [...track.children];
    originals.forEach((el) => {
      const copy = el.cloneNode(true);
      copy.setAttribute('aria-hidden', 'true');
      const img = copy.querySelector('img');
      if (img) img.alt = '';
      track.appendChild(copy);
    });
    // ~9s por imagem, para passar devagar
    track.style.setProperty('--dur', originals.length * 9 + 's');
  });

  /* ---------- Brilhos flutuantes (só nas margens, ecrãs largos) ---------- */
  const wide = matchMedia('(min-width: 1280px)');
  const rand = (a, b) => a + Math.random() * (b - a);

  const buildSparkles = () => {
    $$('.sparkles').forEach((box) => {
      box.innerHTML = '';
      box.classList.remove('is-on');
      if (!wide.matches) return;

      const margin = (box.parentElement.clientWidth - 1140) / 2;
      if (margin < 90) return;

      const n = 3;
      for (const side of ['left', 'right']) {
        for (let i = 0; i < n; i++) {
          const s = document.createElement('span');
          s.className = 'sparkle';
          const size = rand(12, 26);
          s.style.width = s.style.height = size + 'px';
          s.style[side] = rand(12, margin - size - 14) + 'px';
          s.style.top = rand(12, 82) + '%';
          s.style.setProperty('--o', rand(0.22, 0.5).toFixed(2));
          s.style.setProperty('--t', rand(4, 8).toFixed(1) + 's');
          s.style.setProperty('--dl', rand(0, 3).toFixed(1) + 's');
          s.style.setProperty('--dx', rand(-10, 10).toFixed(0) + 'px');
          s.style.setProperty('--dy', rand(-22, -8).toFixed(0) + 'px');
          s.style.color = i % 2 ? 'var(--green-hi)' : 'var(--water)';
          s.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><use href="#i-sparkle-solid"/></svg>';
          box.appendChild(s);
        }
      }
      requestAnimationFrame(() => box.classList.add('is-on'));
    });
  };
  buildSparkles();
  let rt;
  addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(buildSparkles, 250); });

  /* ---------- Entrada do hero e do cabeçalho (ao carregar) ---------- */
  const hero = $('.hero');
  requestAnimationFrame(() => {
    header.classList.add('is-ready');
    if (hero) hero.classList.add('is-ready');
  });

  /* ---------- Entrada suave das dobras (ao entrar no ecrã) ---------- */
  if (!reduceMotion && 'IntersectionObserver' in window) {
    const groups = [
      ['.head, .place-box, .marquee, .marquee-note, .cta-row, .final-card, .about-actions', 0],
      ['.benefit, .who-card, .svc-card, .final-contacts li, .site-footer .footer-grid > *', 80],
      ['.step', 160],
      ['.step-grid', 0, 'reveal-line'],
      ['.about-media', 0, 'reveal-left'],
      ['.about-copy, .final-grid > div:first-child', 0, 'reveal-right'],
    ];
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        en.target.classList.add('is-in');
        io.unobserve(en.target);
        // cards fora do ecrã num carrossel entram com o primeiro
        if (en.target.parentElement.matches('.svc-track')) {
          $$('.reveal, .reveal-left, .reveal-right', en.target.parentElement).forEach((el) => { el.classList.add('is-in'); io.unobserve(el); });
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });

    groups.forEach(([sel, stagger, variante]) => {
      const seen = new Map();
      $$(sel).forEach((el) => {
        if (el.closest('.hero') || el.classList.contains('reveal')) return;
        const parent = el.parentElement;
        const i = seen.get(parent) || 0;
        seen.set(parent, i + 1);
        el.classList.add(variante || 'reveal');
        if (stagger) el.style.setProperty('--d', i * stagger + 'ms');
        io.observe(el);
      });
    });
  }

  /* ---------- Sublinhado animado ---------- */
  const marks = $$('.hl-line');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    marks.forEach((m) => m.classList.add('is-drawn'));
  } else {
    const mio = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        en.target.classList.add('is-drawn');
        mio.unobserve(en.target);
      });
    }, { threshold: 0.6 });
    marks.forEach((m) => mio.observe(m));
  }

  /* ---------- Formulários ----------
     TODO: ligar a um serviço real (Formspree, Web3Forms, endpoint próprio…).
     Enquanto não estiver ligado, o pedido é encaminhado para o WhatsApp
     com todos os campos já preenchidos. */
  const WHATSAPP = '351912994788';

  const sendQuote = async (data) => {
    const linhas = [
      'Olá! Gostaria de pedir um orçamento de limpeza.',
      'Nome: ' + data.nome,
      'Telemóvel: ' + data.telefone,
      data.email ? 'Email: ' + data.email : '',
      'Serviço: ' + data.servico,
      data.localidade ? 'Localidade: ' + data.localidade : '',
      data.mensagem ? 'Mensagem: ' + data.mensagem : '',
    ].filter(Boolean);
    const url = 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(linhas.join('\n'));
    window.open(url, '_blank', 'noopener');
    return true;
  };

  const setupForm = (form) => {
    if (!form) return;
    const status = form.querySelector('.form-status');

    const showError = (el, msg) => {
      el.setAttribute('aria-invalid', 'true');
      let err = el.parentElement.querySelector('.err');
      if (!err) {
        err = document.createElement('span');
        err.className = 'err';
        el.parentElement.appendChild(err);
      }
      err.textContent = msg;
    };
    const clearError = (el) => {
      el.removeAttribute('aria-invalid');
      const err = el.parentElement.querySelector('.err');
      if (err) err.remove();
    };
    form.addEventListener('input', (e) => {
      if (e.target.matches('input, select, textarea')) clearError(e.target);
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      status.textContent = '';
      status.className = 'form-status';

      const nome = form.querySelector('[name="nome"]');
      const tel = form.querySelector('[name="telefone"]');
      const svc = form.querySelector('[name="servico"]');
      const email = form.querySelector('[name="email"]');
      let ok = true;

      if (!nome.value.trim()) { showError(nome, 'Diga-nos o seu nome.'); ok = false; }
      if (!/^[\d\s+()-]{9,}$/.test(tel.value.trim())) { showError(tel, 'Indique um telemóvel válido.'); ok = false; }
      if (!svc.value) { showError(svc, 'Escolha o tipo de serviço.'); ok = false; }
      if (email && email.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
        showError(email, 'Verifique o email.');
        ok = false;
      }
      if (!ok) {
        status.textContent = 'Verifique os campos assinalados.';
        status.classList.add('is-err');
        form.querySelector('[aria-invalid="true"]').focus();
        return;
      }

      const data = Object.fromEntries(new FormData(form).entries());
      const enviado = await sendQuote(data);
      if (enviado) {
        status.textContent = 'Pedido pronto no WhatsApp. Se a janela não abrir, use o botão verde.';
        status.classList.add('is-ok');
        form.reset();
      } else {
        status.textContent = 'Algo correu mal. Tente novamente ou fale connosco pelo WhatsApp.';
        status.classList.add('is-err');
      }
    });
  };
  ['#form-final', '#form-modal'].forEach((s) => setupForm($(s)));

  /* ---------- Popup de orçamento ---------- */
  const modal = $('#quote-modal');
  let lastTrigger = null;

  const openModal = (trigger) => {
    lastTrigger = trigger || null;
    const svc = trigger && trigger.dataset.servico;
    if (svc) {
      const sel = modal.querySelector('[name="servico"]');
      if ([...sel.options].some((o) => o.text === svc)) sel.value = svc;
    }
    modal.showModal();
    const first = modal.querySelector('input, select');
    if (first) first.focus();
  };
  modal.addEventListener('close', () => { if (lastTrigger) lastTrigger.focus(); });
  modal.addEventListener('click', (e) => {
    if (e.target.closest('[data-close]') || e.target === modal) modal.close();
  });
  $$('[data-quote]').forEach((el) => {
    el.addEventListener('click', (e) => { e.preventDefault(); openModal(el); });
  });

  /* ---------- WhatsApp flutuante + barra fixa ---------- */
  const waFloat = $('.wa-float');
  const bar = $('.mobile-bar');
  const contacto = $('#contacto');
  let heroVisible = true;
  let contactoVisible = false;

  const updateQuick = () => {
    const on = !heroVisible && !contactoVisible;
    waFloat.classList.toggle('is-on', on);
    bar.classList.toggle('is-on', on);
    document.body.classList.toggle('has-bar', on);
  };
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([en]) => { heroVisible = en.isIntersecting; updateQuick(); }, { threshold: 0.15 }).observe(hero);
    new IntersectionObserver(([en]) => { contactoVisible = en.isIntersecting; updateQuick(); }, { threshold: 0.2 }).observe(contacto);
  }
})();
