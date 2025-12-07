// Extracted JS from index.html - preserve logic and order

console.log(`
$$$$$$$\\   $$$$$$\\  $$$$$$\\ $$\\    $$\\  $$$$$$\\  
$$  __$$\\ $$  __$$\\ \\_$$  _|$$ |   $$ |$$  __$$\\ 
$$ |  $$ |$$ /  $$ |  $$ |  $$ |   $$ |$$ /  $$ |
$$$$$$$  |$$$$$$$$ |  $$ |  \\$$\\  $$  |$$$$$$$$ |
$$  ____/ $$  __$$ |  $$ |   \\$$\\$$  / $$  __$$ |
$$ |      $$ |  $$ |  $$ |    \\$$$  /  $$ |  $$ |
$$ |      $$ |  $$ |$$$$$$\\    \\$  /   $$ |  $$ |
\\__|      \\__|  \\__|\\______|    \\_/    \\__|  \\__|
`);

// --- API CONFIGURATION ---
const API_BASE_URL = 'https://portfolio-0fkz.onrender.com';

// Fetch projects from API
async function fetchProjects() {
    try {
        const response = await fetch(`${API_BASE_URL}/projects`);
        const data = await response.json();
        if (data.success && data.data) {
            window.projectsData = data.data;
            return data.data;
        }
    } catch (error) {
        // Silent fail - using local data
    }
    return window.projectsData || [];
}

// Fetch experience from API
async function fetchExperience() {
    try {
        const response = await fetch(`${API_BASE_URL}/experience`);
        const data = await response.json();
        if (data.success && data.data) {
            window.experienceData = data.data;
            return data.data;
        }
    } catch (error) {
        // Silent fail - using local data
    }
    return window.experienceData || [];
}

// Submit contact form to API
async function submitContact(name, email, message) {
    try {
        const response = await fetch(`${API_BASE_URL}/contact`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, message }),
        });
        const data = await response.json();
        return data;
    } catch (error) {
        return { success: false, error: 'Network error. Please try again.' };
    }
}

// --- TRANSLATIONS (EN / PT) ---
const translations = {
    en: {
        "nav.home": "./EXPERIENCE",
        "nav.projects": "./PROJECTS",
        "nav.about": "./WHOAMI",
        "nav.contact": "./CONTACT",
        "home.title1": "Junior",
        "home.title2": "Backend",
        "home.title3": "Developer.",
        "home.name": "Afonso Paiva",
        "home.desc": "Junior Backend Developer passionate about learning microservices, distributed systems, and cloud-native infrastructure.",
        "home.cta_projects": "EXECUTE PROJECTS.EXE",
        "home.cta_contact": "INIT_MESSAGE",
        "proj1.title": "Distributed Payment Gateway",
        "proj1.desc": "A high-throughput payment processing engine handling idempotency keys and eventual consistency across microservices.",
        "proj2.title": "Real-time Analytics Pipeline",
        "proj2.desc": "Ingests terabytes of logs via gRPC, processes with Go workers, and indexes into ElasticSearch for instant querying.",
        "proj3.title": "Infrastructure as Code CLI",
        "proj3.desc": "A custom CLI tool written in Rust to automate AWS ECS deployments and manage Terraform state files securely.",
        "about.p1": "Hello I'm Afonso Paiva. I am a junior backend developer eager to learn about software architecture. I'm building my skills in creating resilient and scalable systems.",
        "about.p2": "My journey started with simple scripts and I'm continuously learning about distributed systems. I enjoy diving deep into the stack—learning SQL optimization, understanding async patterns, and improving API performance.",
        "about.p3": "Currently focused on learning Backend Development and Cloud Native solutions.",
        "contact.subtitle": "Initiate handshake protocol."
    },
    pt: {
        "nav.home": "./EXPERIÊNCIA",
        "nav.projects": "./PROJETOS",
        "nav.about": "./SOBRE",
        "nav.contact": "./CONTATO",
        "home.title1": "Desenvolvedor",
        "home.title2": "Backend",
        "home.title3": "Júnior.",
        "home.name": "Afonso Paiva",
        "home.desc": "Desenvolvedor Backend Júnior apaixonado por aprender microsserviços, sistemas distribuídos e infraestrutura cloud-native.",
        "home.cta_projects": "EXECUTAR PROJETOS.EXE",
        "home.cta_contact": "INICIAR MESSAGE",
        "proj1.title": "Gateway de Pagamento Distribuído",
        "proj1.desc": "Motor de processamento de pagamentos de alto throughput lidando com chaves de idempotência e consistência eventual.",
        "proj2.title": "Pipeline de Analytics Real-time",
        "proj2.desc": "Ingere terabytes de logs via gRPC, processa com workers em Go e indexa no ElasticSearch para consultas instantâneas.",
        "proj3.title": "CLI de Infra como Código",
        "proj3.desc": "Uma ferramenta CLI customizada em Rust para automatizar deploys no AWS ECS e gerenciar arquivos de estado do Terraform.",
        "about.p1": "Olá sou o Afonso Paiva. Sou um desenvolvedor backend júnior ansioso por aprender sobre arquitetura de software. Estou desenvolvendo minhas habilidades na criação de sistemas resilientes e escaláveis.",
        "about.p2": "Minha jornada começou com scripts simples e estou continuamente aprendendo sobre sistemas distribuídos. Gosto de mergulhar fundo na stack—aprendendo otimização SQL, entendendo padrões assíncronos e melhorando a performance de APIs.",
        "about.p3": "Focado atualmente em aprender Desenvolvimento Backend e soluções Cloud Native.",
        "contact.subtitle": "Inicie o protocolo de handshake."
    }
};

// --- STATE & ROUTER ---
const state = {
    // Default language set to Portuguese as requested
    lang: 'pt',
    currentPage: 'home',
    isAnimating: false
};

// Global error handlers
window.addEventListener('error', (ev) => {
    // Silent error handling
});
window.addEventListener('unhandledrejection', (ev) => {
    // Silent rejection handling
});

// Global event delegation for mobile menu toggle - works even after page transitions
document.addEventListener('click', (e) => {
    const toggleBtn = e.target.closest('#mobile-toggle, .mobile-toggle');
    if (toggleBtn) {
        e.preventDefault();
        e.stopPropagation();
        const menu = document.getElementById('mobile-menu');
        if (menu) {
            menu.classList.toggle('show-mobile');
            const expanded = menu.classList.contains('show-mobile');
            toggleBtn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
        }
    }
});

// Register GSAP plugins if available (safe-guard for delayed/deferred loading)
try {
    if (typeof gsap !== 'undefined' && typeof gsap.registerPlugin === 'function' && typeof TextPlugin !== 'undefined') {
        gsap.registerPlugin(TextPlugin);
    }
} catch (e) { /* ignore */ }

// Load persisted language if available
try {
    const persisted = localStorage.getItem('lang');
    if (persisted) state.lang = persisted;
} catch (e) {
    // ignore (localStorage may be unavailable in some contexts)
}

function updateLanguage(lang) {
    state.lang = lang;
    const ptSpan = document.getElementById('lang-pt');
    const enSpan = document.getElementById('lang-en');
    if (ptSpan && enSpan) {
        ptSpan.className = lang === 'pt' ? 'text-primary' : 'text-dim';
        enSpan.className = lang === 'en' ? 'text-primary' : 'text-dim';
    }
    
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang][key]) {
            gsap.to(el, { opacity: 0, duration: 0.2, onComplete: () => {
                el.innerHTML = translations[lang][key]; 
                gsap.to(el, { opacity: 1, duration: 0.2 });
            }});
        }
    });
    // Re-render projects and experience if on respective pages
    try { if (typeof renderProjects === 'function') renderProjects(); } catch(e) {}
    try { if (typeof renderExperience === 'function') renderExperience(); } catch(e) {}
    try { localStorage.setItem('lang', lang); } catch(e) {}
}

const _langToggle = document.getElementById('langToggle');
if (_langToggle) {
    _langToggle.addEventListener('click', () => {
        const newLang = state.lang === 'en' ? 'pt' : 'en';
        updateLanguage(newLang);
    });
}

const router = {
    navigate: (pageId) => {
        if (state.currentPage === pageId || state.isAnimating) return;
        // ensure target exists in the current DOM; if not, bail safely
        const safeNext = document.getElementById(pageId);
        if (!safeNext) {
            // try falling back to a full navigation if an <a> exists for that page
            const link = document.querySelector(`a[href$="${pageId}.html"], a[href$="/${pageId}.html"], a[href*="${pageId}"]`);
            if (link && link.href) {
                window.location.href = link.href;
                return;
            }
            return;
        }
        state.isAnimating = true;
        
        const currentEl = document.getElementById(state.currentPage);
        const nextEl = safeNext;
        const overlay = document.getElementById('transition-overlay');

        const targets = nextEl.querySelectorAll('h1, h2, h3, p, .code-block, button, form, .prose > *, .terminal-header, .terminal-content');

        const tl = gsap.timeline({
            onComplete: () => {
                state.currentPage = pageId;
                state.isAnimating = false;
                gsap.set(targets, { clearProps: "all" });
            }
        });

        tl.to(overlay, {
            scaleY: 1,
            transformOrigin: "bottom",
            duration: 0.28,
            ease: "power2.inOut",
            onComplete: () => {
                try { currentEl && currentEl.classList.add('hidden'); } catch(e) {}
                try { nextEl && nextEl.classList.remove('hidden'); } catch(e) {}
                try { nextEl && nextEl.classList.remove('pointer-events-none'); } catch(e) {}
                window.scrollTo(0,0);
                try { document.getElementById('mobile-menu')?.classList.remove('show-mobile'); } catch(e) {}
                gsap.set(targets, { y: 20, opacity: 0 });
            }
        })
        .to(overlay, {
            scaleY: 0,
            transformOrigin: "top",
            duration: 0.28,
            ease: "power2.inOut"
        })
        .to(targets, { 
            y: 0, 
            opacity: 1, 
            duration: 0.35, 
            stagger: 0.05,
            ease: "back.out(1.1)"
        });
    }
};

// --- INITIALIZATION ---
// Run early when DOM is ready to reduce icon-induced layout shift
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
    });
} else {
    if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
}

window.onload = () => {
    // Defer heavy canvas drawing until idle to avoid blocking initial paint
    if (document.getElementById('bgCanvas')) {
        if ('requestIdleCallback' in window) {
            requestIdleCallback(() => initMatrixRain(), {timeout: 500});
        } else {
            setTimeout(() => initMatrixRain(), 200);
        }
    }

    if (document.getElementById('typewriter-1')) initTypewriter();

    // Apply persisted or default language on load early
    if (typeof updateLanguage === 'function') updateLanguage(state.lang);

    // Attach global link interception for page transitions
    // Also run initAll here to ensure everything is initialized after deferred scripts
    if (typeof interceptLinks === 'function') interceptLinks();
    if (typeof initAll === 'function') initAll();

    // Initialize project expander if on projects page
    if (document.querySelectorAll && document.querySelectorAll('.project-card').length) {
        initProjectExpander();
    }

    // Home entrance animation (safe to run even if not on home)
    const homeEl = document.getElementById('home');
    if (homeEl) {
        try { homeEl.classList.remove('pointer-events-none'); } catch(e) {}
        const homeTargets = homeEl.querySelectorAll('.terminal-header, .terminal-content, .hero-title > span, .hero-desc, .hero-btns button');
        if (homeTargets && homeTargets.length) {
            gsap.set(homeTargets, { y: 20, opacity: 0 });
            gsap.to(homeTargets, {
                y: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.1,
                delay: 0,
                ease: "power3.out"
            });
        }
    }
    // Ensure state.currentPage reflects the section present in the loaded HTML
    try {
        const section = document.querySelector('main .page-section');
        if (section && section.id) {
            state.currentPage = section.id;
        } else if (document.getElementById('home')) {
            state.currentPage = 'home';
        }
    } catch (e) { /* silent */ }
};

// Run early initialization that is safe to run on DOMContentLoaded and after dynamic swaps
function initAll() {
    try {
        if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
    } catch(e) {}
    try { if (document.getElementById('bgCanvas')) initMatrixRain(); } catch(e) {}
    try { if (document.getElementById('typewriter-1')) initTypewriter(); } catch(e) {}
    // server logs removed
    // Render projects if grid exists (before checking for cards)
    try { 
        if (typeof renderProjects === 'function' && document.getElementById('projects-grid')) {
            renderProjects(); 
        }
    } catch(e) { /* Silent */ }
    try { if (typeof renderExperience === 'function' && document.getElementById('experience-grid')) renderExperience(); } catch(e) {}
    try { if (document.querySelectorAll && document.querySelectorAll('.project-card').length) initProjectExpander(); } catch(e) {}
    try { if (typeof updateLanguage === 'function') updateLanguage(state.lang); } catch(e) {}
    try { if (typeof interceptLinks === 'function') interceptLinks(); } catch(e) {}
    try { if (typeof initMobileToggle === 'function') initMobileToggle(); } catch(e) {}
}

// Ensure initAll runs at DOMContentLoaded as well (helps with deferred script timing differences)
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        try { initAll(); } catch(e) {}
    });
} else {
    try { initAll(); } catch(e) {}
}

// --- EFFECTS ---
function initTypewriter() {
    const text = "init_sequence --verbose --force";
    gsap.to("#typewriter-1", {
        text: { value: text },
        duration: 1.5,
        ease: "none",
        delay: 0
    });
}

// initServerLogs removed — system logs feature disabled

function initMatrixRain() {
    const canvas = document.getElementById('bgCanvas');
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const chars = '01';
    const fontSize = 12;
    const columns = width / fontSize;
    const drops = [];

    for (let i = 0; i < columns; i++) drops[i] = 1;

    function draw() {
        ctx.fillStyle = 'rgba(5, 5, 5, 0.05)';
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = '#1f1f1f';
        ctx.font = fontSize + 'px monospace';

        for (let i = 0; i < drops.length; i++) {
            const text = chars.charAt(Math.floor(Math.random() * chars.length));
            if(Math.random() > 0.99) ctx.fillStyle = '#00ff9d';
            else if(Math.random() > 0.99) ctx.fillStyle = '#bd00ff';
            else ctx.fillStyle = '#1a1a1a';

            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            if (drops[i] * fontSize > height && Math.random() > 0.975) drops[i] = 0;
            drops[i]++;
        }
    }
    setInterval(draw, 50);
    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });
}

function simulateRequest() {
    const btn = document.getElementById('sendBtn');
    const preview = document.getElementById('response-area');
    
    btn.innerHTML = '<span class="animate-pulse">SENDING BYTE STREAM...</span>';
    btn.disabled = true;

    setTimeout(() => {
        btn.innerHTML = 'Error 404: Not Found';
        btn.classList.add('error');
        btn.classList.remove('border-primary', 'text-primary');
        
        preview.innerHTML = `\n<pre class="text-red-400">\n{\n  "status": 404,\n  "error": "Not Found",\n  "message": "Backend not implemented yet. Message not sent.",\n  "timestamp": ${Date.now()}\n}\n</pre>`;
    }, 1500);
}

// --- Page transition helpers (swup-like behavior using GSAP) ---
function createOrGetOverlay() {
    let overlay = document.getElementById('transition-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'transition-overlay';
        overlay.className = 'fixed inset-0 bg-primary transform scale-y-0 origin-bottom flex items-center justify-center dynamic-overlay';
        overlay.style.pointerEvents = 'none';
        document.body.appendChild(overlay);
    }
    return overlay;
}

// Fetch-based page loader with GSAP transitions (swup-like)
const pageCache = new Map();

async function prefetchPage(url) {
    if (pageCache.has(url)) return pageCache.get(url);
    try {
        const res = await fetch(url, { credentials: 'same-origin' });
        if (!res.ok) throw new Error('Network response not ok');
        const text = await res.text();
        pageCache.set(url, text);
        return text;
    } catch (e) {
        return null;
    }
}

async function loadPage(url, { push = true } = {}) {
    const overlay = createOrGetOverlay();
    // animate curtain up (faster)
    await gsap.to(overlay, { scaleY: 1, transformOrigin: 'bottom', duration: 0.28, ease: 'power2.inOut' });

    let html = pageCache.get(url) || null;
    if (!html) {
        try {
            const res = await fetch(url, { credentials: 'same-origin' });
            if (!res.ok) throw new Error('Network');
            html = await res.text();
            pageCache.set(url, html);
        } catch (e) {
            // fallback to full navigation on error
            window.location.href = url;
            return;
        }
    }

    // parse returned HTML and extract <main>
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const newMain = doc.querySelector('main');
    const newTitle = doc.querySelector('title') ? doc.querySelector('title').innerText : document.title;

    const currentMain = document.querySelector('main');
    if (newMain && currentMain) {
        currentMain.innerHTML = newMain.innerHTML;
        // Execute any inline scripts inside the newly injected main (so page-specific inline JS runs)
        const scripts = Array.from(currentMain.querySelectorAll('script'));
        scripts.forEach(s => {
            try {
                const newScript = document.createElement('script');
                if (s.src) {
                    // external scripts need absolute path fixes if necessary; append to head
                    newScript.src = s.src;
                    newScript.defer = s.defer || false;
                } else {
                    newScript.textContent = s.textContent;
                }
                document.head.appendChild(newScript);
            } catch(e) { /* Silent */ }
            s.remove();
        });
    } else {
        // if structure differs, navigate normally
        window.location.href = url;
        return;
    }

    // update title and history
    document.title = newTitle;
    if (push) history.pushState({ url }, '', url);
    // update internal currentPage state to reflect the newly loaded section (use id if available)
    try {
        const newSection = document.querySelector('main .page-section');
        if (newSection && newSection.id) state.currentPage = newSection.id;
        else {
            // try to infer from URL path (e.g., /projects.html => 'projects')
            try {
                const p = new URL(url, location.href).pathname.split('/').pop().split('.').shift();
                if (p) state.currentPage = p === 'index' ? 'home' : p;
            } catch(e) {}
        }
    } catch(e) {}

    // no artificial delay: proceed to initialize immediately after DOM swap

    // Re-run initializers and translations on new content
    if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
    if (document.getElementById('bgCanvas')) initMatrixRain();
    if (document.getElementById('typewriter-1')) initTypewriter();
    // server logs removed
    
    // Render projects/experience first before checking for cards
    if (typeof renderProjects === 'function' && document.getElementById('projects-grid')) renderProjects();
    if (typeof renderExperience === 'function' && document.getElementById('experience-grid')) renderExperience();
    
    if (document.querySelectorAll && document.querySelectorAll('.project-card').length) initProjectExpander();
    if (typeof updateLanguage === 'function') updateLanguage(state.lang);

    // Make sure everything that should run after page swap also runs
    try { initAll(); } catch(e) {}

    // reattach link interception for dynamically added links
    interceptLinks();

    // animate curtain down and reveal (faster) - exclude project-cards as they have their own animation
    await gsap.fromTo(currentMain.querySelectorAll('h1, h2, h3, p:not(.project-card p), button, form, .prose > *, .terminal-header, .terminal-content'), { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.34, stagger: 0.04, ease: 'power2.out' });
    await gsap.to(overlay, { scaleY: 0, transformOrigin: 'top', duration: 0.28, ease: 'power2.inOut' });
    window.scrollTo(0,0);
}

function isInternalLink(a) {
    try {
        const url = new URL(a.href, location.href);
        return url.origin === location.origin;
    } catch (e) {
        return false;
    }
}

function interceptLinks() {
    try {
        // remove previous listeners by cloning anchors to prevent double-binding
        const anchors = Array.from(document.querySelectorAll('a[href]'));
        anchors.forEach(a => {
            // avoid binding the same anchor more than once
            if (a.dataset.swBound) return;
            a.dataset.swBound = '1';
            // skip links that should not be intercepted
            const href = a.getAttribute('href');
            if (!href) return;
            if (href.startsWith('#')) return;
            if (href.startsWith('mailto:') || href.startsWith('tel:')) return;
            if (a.target && a.target === '_blank') return;
            if (!isInternalLink(a)) return;

            // prefetch on hover
            a.addEventListener('mouseenter', () => { prefetchPage(a.href); });
            if (!a.dataset.swBoundLogged) {
                a.dataset.swBoundLogged = '1';
            }

            a.addEventListener('click', (ev) => {
                if (ev.ctrlKey || ev.metaKey || ev.shiftKey || ev.altKey) return;
                ev.preventDefault();
                loadPage(a.href, { push: true });
                // Close mobile menu after navigation
                const menu = document.getElementById('mobile-menu');
                if (menu) menu.classList.remove('show-mobile');
                const btn = document.getElementById('mobile-toggle');
                if (btn) btn.setAttribute('aria-expanded', 'false');
            });
        });
    } catch (e) {
        // Silent error handling
    }

    // support back/forward
    window.onpopstate = (ev) => {
        const url = location.href;
        loadPage(url, { push: false });
    };
}

// --- Contact Form Handler ---
function handleContactSubmit(form) {
    const formData = new FormData(form);
    
    // Collect all form data for backend processing
    const contactData = {
        name: formData.get('name'),
        email: formData.get('email'),
        subject: formData.get('subject') || '',
        message: formData.get('message'),
        timestamp: new Date().toISOString(),
        lang: state.lang
    };
    
    const btn = form.querySelector('#sendBtn');
    const originalText = btn.textContent;
    
    // Show loading state
    btn.disabled = true;
    btn.textContent = 'Sending...';
    btn.style.opacity = '0.7';
    
    // Simulate API call - replace with actual backend endpoint
    // Example: fetch('/api/v1/messages/send', { method: 'POST', body: JSON.stringify(contactData), headers: { 'Content-Type': 'application/json' } })
    
    setTimeout(() => {
        // Success state
        btn.textContent = '✓ Message Sent!';
        btn.style.background = 'var(--primary)';
        btn.style.color = '#000';
        
        // Reset form
        form.reset();
        
        // Reset button after delay
        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
            btn.style.color = '';
            btn.style.opacity = '';
            btn.disabled = false;
        }, 3000);
    }, 1500);
    
    return contactData;
}

// Make it globally available
window.handleContactSubmit = handleContactSubmit;

// --- Project expander (no longer needed - handled in renderProjects) ---
function initProjectExpander() {
    // Click handlers are now added directly in renderProjects
}

function openProjectModal(project) {
    const lang = state.lang;
    const statusColor = project.status.color === 'green' ? '#00ff9d' :
                       project.status.color === 'yellow' ? '#ffc107' : '#6b7280';
    
    // Handle both API format (nested objects) and local format
    const title = typeof project.title === 'object' ? project.title[lang] : project.title;
    const shortDesc = typeof project.shortDescription === 'object' ? project.shortDescription[lang] : project.shortDescription;
    const fullDesc = project.fullDescription ? 
        (typeof project.fullDescription === 'object' ? project.fullDescription[lang] : project.fullDescription) : shortDesc;
    const features = project.features ? 
        (typeof project.features === 'object' && project.features[lang] ? project.features[lang] : project.features) : null;
    
    // Create overlay
    const overlay = document.createElement('div');
    overlay.id = 'project-modal-overlay';
    overlay.style.cssText = `
        position: fixed; inset: 0; background: rgba(0,0,0,0.9);
        z-index: 9998; opacity: 0; transition: opacity 0.3s ease;
    `;
    
    // Create modal - starts from bottom
    const modal = document.createElement('div');
    modal.id = 'project-modal';
    modal.style.cssText = `
        position: fixed; bottom: 0; left: 0; right: 0;
        background: #0a0a0a; border-top: 1px solid #2a2a2a;
        border-radius: 20px 20px 0 0; z-index: 9999;
        max-height: 85vh; overflow-y: auto;
        transform: translateY(100%); transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    `;
    
    modal.innerHTML = `
        <div style="position: sticky; top: 0; background: #0a0a0a; padding: 16px 24px; border-bottom: 1px solid #1a1a1a; display: flex; justify-content: space-between; align-items: center; z-index: 10;">
            <span style="color: #666; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Project Details</span>
            <button id="close-modal" style="background: #1a1a1a; border: 1px solid #2a2a2a; border-radius: 8px; width: 36px; height: 36px; color: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s ease;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
        </div>
        <div style="padding: 24px;">
            <div style="display: inline-block; background: ${statusColor}; color: #000; font-size: 11px; font-weight: 700; padding: 5px 12px; border-radius: 6px; margin-bottom: 16px;">${project.status.text}</div>
            <h2 style="color: #fff; font-size: 28px; font-weight: 700; margin-bottom: 16px;">${title}</h2>
            <p style="color: #999; font-size: 15px; line-height: 1.8; margin-bottom: 24px;">${fullDesc}</p>
            ${features && Array.isArray(features) ? `
            <div style="background: #111; border: 1px solid #222; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
                <h4 style="color: #00ff9d; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 16px;">Features</h4>
                <ul style="list-style: none; padding: 0; margin: 0;">
                    ${features.map(f => `<li style="color: #ccc; font-size: 14px; margin-bottom: 10px; display: flex; align-items: center; gap: 10px;"><span style="color: #00ff9d;">▸</span>${f}</li>`).join('')}
                </ul>
            </div>
            ` : ''}
            <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 24px;">
                ${project.tech.map(t => `<span style="background: #1a1a1a; border: 1px solid #2a2a2a; color: #00ff9d; font-size: 12px; padding: 6px 14px; border-radius: 6px; font-family: monospace;">${t}</span>`).join('')}
            </div>
            <a href="${project.link}" target="_blank" style="display: inline-flex; align-items: center; gap: 10px; background: #00ff9d; color: #000; font-size: 14px; font-weight: 700; padding: 14px 28px; border-radius: 8px; text-decoration: none; transition: all 0.2s ease;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
                View on GitHub
            </a>
        </div>
    `;
    
    document.body.appendChild(overlay);
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Animate in
    requestAnimationFrame(() => {
        overlay.style.opacity = '1';
        modal.style.transform = 'translateY(0)';
    });
    
    // Close function
    function closeModal() {
        modal.style.transform = 'translateY(100%)';
        overlay.style.opacity = '0';
        setTimeout(() => {
            overlay.remove();
            modal.remove();
            document.body.style.overflow = '';
        }, 400);
    }
    
    // Close handlers
    modal.querySelector('#close-modal').addEventListener('click', closeModal);
    modal.querySelector('#close-modal').addEventListener('mouseenter', (e) => {
        e.target.style.background = '#00ff9d';
        e.target.style.color = '#000';
    });
    modal.querySelector('#close-modal').addEventListener('mouseleave', (e) => {
        e.target.style.background = '#1a1a1a';
        e.target.style.color = '#fff';
    });
    overlay.addEventListener('click', closeModal);
    document.addEventListener('keydown', function escHandler(e) {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', escHandler);
        }
    });
}

function expandProjectCard(card) {
    // Legacy function - now handled by openProjectModal
    const projectId = parseInt(card.dataset.projectId);
    const project = window.projectsData.find(p => p.id === projectId);
    if (project) {
        openProjectModal(project);
    }
}

// Render projects dynamically - SIMPLE & ALWAYS VISIBLE
async function renderProjects() {
    const grid = document.getElementById('projects-grid');
    if (!grid) {
        return;
    }

    // Fetch from API if not already loaded
    if (!window.projectsData || window.projectsData.length === 0) {
        await fetchProjects();
    }

    if (!window.projectsData || window.projectsData.length === 0) {
        grid.innerHTML = '<p style="color: #666; text-align: center; grid-column: 1/-1;">No projects found.</p>';
        return;
    }

    const lang = state.lang;
    grid.innerHTML = '';

    window.projectsData.forEach((project, index) => {
        const statusColor = project.status.color === 'green' ? '#00ff9d' :
                           project.status.color === 'yellow' ? '#ffc107' : '#6b7280';

        // Handle both API format (nested objects) and local format
        const title = typeof project.title === 'object' ? project.title[lang] : project.title;
        const shortDesc = typeof project.shortDescription === 'object' ? project.shortDescription[lang] : project.shortDescription;

        const card = document.createElement('div');
        card.className = 'project-card';
        card.dataset.projectId = project.id;
        card.style.cssText = `
            background: rgba(20, 20, 20, 0.95);
            border: 1px solid #2a2a2a;
            border-radius: 12px;
            overflow: hidden;
            cursor: pointer;
            transition: all 0.3s ease;
        `;
        
        card.innerHTML = `
            <div style="position: relative; height: 180px; overflow: hidden;">
                <img src="${project.image}" alt="${title}" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s ease;">
                <div style="position: absolute; top: 12px; left: 12px; background: ${statusColor}; color: #000; font-size: 10px; font-weight: 700; padding: 4px 10px; border-radius: 4px; text-transform: uppercase;">${project.status.text}</div>
            </div>
            <div style="padding: 20px;">
                <h3 style="color: #fff; font-size: 18px; font-weight: 700; margin-bottom: 10px; transition: color 0.2s ease;">${title}</h3>
                <p style="color: #888; font-size: 13px; line-height: 1.6; margin-bottom: 16px;">${shortDesc}</p>
                <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px;">
                    ${project.tech.map(t => `<span style="font-size: 11px; color: #00ff9d; font-family: monospace;">${t}</span>`).join('')}
                </div>
                <div style="display: flex; align-items: center; gap: 8px; color: #666; font-size: 12px; font-weight: 600; text-transform: uppercase;">
                    <span>View Project →</span>
                </div>
            </div>
        `;
        
        // Hover effects
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-4px)';
            card.style.borderColor = statusColor;
            card.style.boxShadow = `0 12px 40px rgba(0, 0, 0, 0.4)`;
            card.querySelector('h3').style.color = '#00ff9d';
            card.querySelector('img').style.transform = 'scale(1.05)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.borderColor = '#2a2a2a';
            card.style.boxShadow = 'none';
            card.querySelector('h3').style.color = '#fff';
            card.querySelector('img').style.transform = 'scale(1)';
        });
        
        // Click to open modal
        card.addEventListener('click', () => openProjectModal(project));
        
        grid.appendChild(card);
    });
    
    // Simple slide-up animation
    const cards = grid.querySelectorAll('.project-card');
    if (typeof gsap !== 'undefined') {
        gsap.fromTo(cards, 
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.4, stagger: 0.1, ease: 'power2.out' }
        );
    }
}

// Simple animation function (backup)
function animateProjectCards() {
    // Animation now handled inside renderProjects
}

// Render experience dynamically
async function renderExperience() {
    const grid = document.getElementById('experience-grid');
    if (!grid) return;

    // Fetch from API if not already loaded
    if (!window.experienceData || window.experienceData.length === 0) {
        await fetchExperience();
    }

    if (!window.experienceData || window.experienceData.length === 0) {
        grid.innerHTML = '<p style="color: #666; text-align: center;">No experience found.</p>';
        return;
    }

    const lang = state.lang;
    grid.innerHTML = '';

    window.experienceData.forEach(exp => {
        // Handle both API format (nested objects) and local format
        const company = typeof exp.company === 'object' ? exp.company[lang] : exp.company;
        const role = typeof exp.role === 'object' ? exp.role[lang] : exp.role;
        const period = typeof exp.period === 'object' ? exp.period[lang] : exp.period;
        const description = typeof exp.description === 'object' ? exp.description[lang] : exp.description;

        const expItem = document.createElement('div');
        expItem.className = 'experience-item p-6 bg-surface/50 backdrop-blur border border-border rounded-lg';
        expItem.innerHTML = `
            <div class="experience-header">
                <img src="${exp.logo}" alt="${company}" class="company-logo">
                <div class="experience-info">
                    <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                        <div>
                            <h3 class="text-xl font-bold text-white">${company}</h3>
                            <p class="text-lg text-primary font-semibold">${role}</p>
                        </div>
                        <span class="text-sm text-dim font-mono mt-2 md:mt-0">${period}</span>
                    </div>
                    <p class="text-sm text-dim mb-4 leading-relaxed">${description}</p>
                    <div class="mb-4">
                        <div class="flex flex-wrap gap-2">
                            ${exp.tech.map(t => `<span class="text-xs text-secondary font-mono">${t}</span>`).join('')}
                        </div>
                    </div>
                    <div class="border-t border-border pt-4">
                        <h4 class="text-sm font-bold text-white mb-2">Key Achievements:</h4>
                        <ul class="text-sm text-dim space-y-1">
                            ${exp.achievements.map(a => {
                                const achievementText = typeof a === 'object' ? a[lang] : a;
                                return `<li class="flex items-start gap-2"><span class="text-primary mt-1">•</span> ${achievementText}</li>`;
                            }).join('')}
                        </ul>
                    </div>
                </div>
            </div>
        `;
        grid.appendChild(expItem);
    });
}

// Mobile menu toggle - just ensures initial state and lucide icons
function initMobileToggle(){
    const btn = document.getElementById('mobile-toggle');
    const menu = document.getElementById('mobile-menu');
    if (!btn || !menu) return;
    
    // ensure initial aria state
    const isVisible = menu.classList.contains('show-mobile');
    btn.setAttribute('aria-expanded', isVisible ? 'true' : 'false');
    
    // Ensure lucide icons are rendered
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
    }
}

// Contact form handler - sends to API
async function handleContactSubmit(form) {
    const name = form.querySelector('#name').value;
    const email = form.querySelector('#email').value;
    const message = form.querySelector('#message').value;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;

    // Disable button and show loading
    submitBtn.disabled = true;
    submitBtn.textContent = 'SENDING...';

    const result = await submitContact(name, email, message);

    if (result.success) {
        // Success
        submitBtn.textContent = '✓ SENT!';
        submitBtn.classList.remove('error');
        submitBtn.classList.add('success');
        form.reset();
        
        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.classList.remove('success');
            submitBtn.disabled = false;
        }, 3000);
    } else {
        // Error
        submitBtn.textContent = '✗ FAILED';
        submitBtn.classList.add('error');
        
        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.classList.remove('error');
            submitBtn.disabled = false;
        }, 3000);
    }
}

/* End of extracted JS */
