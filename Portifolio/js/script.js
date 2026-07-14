// ===== MENU MOBILE =====
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });

  // fecha o menu ao clicar em um link (mobile)
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
    });
  });
}

// ===== TEMA CLARO / ESCURO =====
const themeToggle = document.getElementById('themeToggle');
const root = document.documentElement;

function applyTheme(theme) {
  root.setAttribute('data-theme', theme);
  if (themeToggle) {
    themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
  }
  localStorage.setItem('theme', theme);
}

const savedTheme = localStorage.getItem('theme') ||
  (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
applyTheme(savedTheme);

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const current = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(current);
  });
}

// ===== ANO ATUAL NO RODAPÉ =====
const yearSpan = document.getElementById('year');
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

// ===== NAVBAR COM SOMBRA AO ROLAR =====
const header = document.querySelector('.header');
if (header) {
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 10);
  });
}

// ===== EFEITO DE DIGITAÇÃO NO HERO =====
// Ideia: pega as frases separadas por "|" no atributo data-roles do HTML
// (<h2 class="hero-role" data-roles="Frase 1 | Frase 2">) e vai
// escrevendo/apagando uma letra por vez, em loop, trocando de frase.
const heroRole = document.querySelector('.hero-role');
if (heroRole) {
  const roles = (heroRole.dataset.roles || heroRole.textContent)
    .split('|')
    .map(r => r.trim())
    .filter(Boolean);

  let roleIndex = 0;   // qual frase está sendo exibida agora
  let charIndex = 0;   // quantas letras dessa frase já foram "digitadas"
  let deleting = false; // false = escrevendo, true = apagando

  // troca o texto simples por dois <span>: um pro texto digitado
  // e outro só pra desenhar o cursor piscando (via CSS)
  heroRole.innerHTML = '<span class="typed-text"></span><span class="cursor"></span>';
  const typedText = heroRole.querySelector('.typed-text');

  // essa função chama ela mesma (setTimeout) repetidamente, tipo um
  // relógio: cada chamada escreve ou apaga 1 letra e agenda a próxima
  function typeLoop() {
    const currentRole = roles[roleIndex];

    if (!deleting) {
      charIndex++;
      typedText.textContent = currentRole.slice(0, charIndex);
      if (charIndex === currentRole.length) {
        deleting = true;
        setTimeout(typeLoop, 1600); // pausa maior com a frase completa na tela
        return;
      }
    } else {
      charIndex--;
      typedText.textContent = currentRole.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length; // vai pra próxima frase (e volta pro início no fim da lista)
      }
    }

    setTimeout(typeLoop, deleting ? 40 : 90); // apagar é mais rápido que escrever
  }

  if (roles.length) {
    typeLoop();
  }
}

// ===== REVELAÇÃO AO ROLAR (SCROLL REVEAL) =====
// IntersectionObserver = um "vigia" do navegador que avisa quando um
// elemento entra ou sai da tela, sem precisar ficar checando a posição
// do scroll manualmente. threshold: 0.15 significa "avisa quando 15%
// do elemento já estiver visível".
const revealEls = document.querySelectorAll('[data-reveal]');
if (revealEls.length) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { // entrou na tela
        entry.target.classList.add('visible'); // o CSS cuida da animação
        observer.unobserve(entry.target); // já apareceu, não precisa vigiar mais
      }
    });
  }, { threshold: 0.15 });

  revealEls.forEach(el => observer.observe(el));
}

// ===== BARRAS DE HABILIDADE ANIMADAS =====
// Mesma ideia do vigia acima, mas em vez de só mostrar o elemento,
// aqui a gente pega o valor de data-percent="90" no HTML e usa como
// a largura final da barra (width: 90%) — o CSS anima esse crescimento.
const skillBars = document.querySelectorAll('.skill-bar span');
if (skillBars.length) {
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        bar.style.width = (bar.dataset.percent || '0') + '%';
        skillObserver.unobserve(bar);
      }
    });
  }, { threshold: 0.4 });

  skillBars.forEach(bar => skillObserver.observe(bar));
}

// ===== EFEITO RIPPLE NOS BOTÕES =====
// Ao clicar, cria um <span class="ripple"> exatamente no ponto do clique.
// O tamanho e a animação de "crescer e sumir" ficam por conta do CSS
// (.ripple e @keyframes ripple); aqui só posicionamos e removemos depois.
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', function (e) {
    const rect = this.getBoundingClientRect();
    const ripple = document.createElement('span');
    const size = Math.max(rect.width, rect.height);

    ripple.className = 'ripple';
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
    ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';

    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600); // remove depois que a animação (0.6s) termina
  });
});

// ===== BOTÃO VOLTAR AO TOPO =====
const backToTop = document.getElementById('backToTop');
if (backToTop) {
  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('visible', window.scrollY > 400);
  });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ===== FORMULÁRIO DE CONTATO (placeholder) =====
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // TODO: integrar com EmailJS, backend próprio ou serviço de e-mail
    alert('Mensagem enviada! (isso é um placeholder — conecte a um serviço real de envio)');
    contactForm.reset();
  });
}
