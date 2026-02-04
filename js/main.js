// Simplified Main JS
const API_BASE = 'https://portfolio-0fkz.onrender.com/api/v1';

const state = {
    lang: localStorage.getItem('lang') || 'pt',
    projects: [],
    experience: [],
    docs: [],
    translations: {
        en: {
            "nav.about": "./ABOUT",
            "nav.experience": "./EXPERIENCE",
            "nav.projects": "./PROJECTS",
            "nav.docs": "./DOCS",
            "nav.contact": "./CONTACT",
            "hero.role": "Junior Backend Developer",
            "hero.desc": "Backend Engineer specialized in high-performance microservices, distributed systems, and cloud-native infrastructure.",
            "hero.cta": "VIEW_WORK.SH",
            "hero.open_work": "OPEN_FOR_WORK",
            "hero.last_updated": "LAST_UPDATED::2026-02-04",
            "section.about": "About Me",
            "about.text1": "Backend Developer based in Porto, Portugal. Specialized in building robust server-side architectures, API development, and efficient database management. Focused on system scalability, security, and performance.",
            "about.text2": "I specialize in creating efficient services and have a strong foundation in distributed systems. I'm always eager to learn new technologies and improve my craft.",
            "about.education": "Education",
            "about.degree": "Bachelor in Digital Game Engineering and Development",
            "about.uni": "IPCA",
            "about.edu_period": "Sep 2023 - Present",
            "about.stack": "Tech Stack",
            "about.github": "GitHub Stats",
            "section.experience": "Experience",
            "section.projects": "Projects",
            "section.docs": "Documentation",
            "contact.title": "Get In Touch",
            "contact.desc": "Currently looking for new opportunities. Whether you have a question or just want to say hi, I'll try my best to get back to you!",
            "contact.btn": "SEND_MESSAGE",
            "modal.repo": "VIEW REPOSITORY"
        },
        pt: {
            "nav.about": "./SOBRE",
            "nav.experience": "./EXPERIÊNCIA",
            "nav.projects": "./PROJETOS",
            "nav.docs": "./DOCS",
            "nav.contact": "./CONTATO",
            "hero.role": "Desenvolvedor Backend Júnior",
            "hero.desc": "Engenheiro Backend especializado em microsserviços de alta performance, sistemas distribuídos e infraestrutura cloud-native.",
            "hero.cta": "VER_TRABALHO.SH",
            "hero.open_work": "DISPONÍVEL_PARA_TRABALHO",
            "hero.last_updated": "ULTIMA_ATUALIZAÇÃO::04-02-2026",
            "section.about": "Sobre Mim",
            "about.text1": "Desenvolvedor Backend sediado no Porto, Portugal. Especializado na construção de arquiteturas de servidor robustas, desenvolvimento de APIs e gestão eficiente de bases de dados. Focado em escalabilidade, segurança e performance de sistemas.",
            "about.text2": "Especializo-me em criar serviços eficientes e tenho uma base sólida em sistemas distribuídos. Estou sempre ansioso para aprender novas tecnologias e melhorar minha arte.",
            "about.education": "Educação",
            "about.degree": "Licenciatura em Engenharia e Desenvolvimento de Jogos Digitais",
            "about.uni": "IPCA",
            "about.edu_period": "Set 2023 - Presente",
            "about.stack": "Stack Tecnológica",
            "about.github": "Estatísticas GitHub",
            "section.experience": "Experiência",
            "section.docs": "Documentação",
            "section.projects": "Projetos",
            "contact.title": "Entre em Contato",
            "contact.desc": "Atualmente em busca de novas oportunidades. Se tiver uma pergunta ou apenas quiser dizer olá, tentarei responder o mais rápido possível!",
            "contact.btn": "ENVIAR_MENSAGEM",
            "modal.repo": "VER REPOSITÓRIO"
        }
    }
};

// --- API Functions ---

async function fetchProjects() {
    try {
        const res = await fetch(`${API_BASE}/projects`);
        const json = await res.json();
        if (json.success) {
            console.log('Projects loaded:', json.data);
            state.projects = json.data.sort((a, b) => b.id - a.id);
            renderProjects();
        }
    } catch (e) {
        console.error("Failed to fetch projects", e);
        document.getElementById('projects-grid').innerHTML = '<p class="text-red-500">Error loading projects.</p>';
    }
}

async function fetchExperience() {
    try {
        const res = await fetch(`${API_BASE}/experience`);
        const json = await res.json();
        if (json.success) {
            state.experience = json.data;
            renderExperience();
        }
    } catch (e) {
        console.error("Failed to fetch experience", e);
        document.getElementById('experience-list').innerHTML = '<p class="text-red-500">Error loading experience.</p>';
    }
}

async function fetchDocs() {
    try {
        const res = await fetch(`${API_BASE}/docs`);
        const json = await res.json();
        if (json.success) {
            state.docs = json.data;
            renderDocs();
        }
    } catch (e) {
        console.error("Failed to fetch docs", e);
        document.getElementById('docs-grid').innerHTML = '<p class="text-red-500">Error loading docs.</p>';
    }
}

async function fetchGitHubStats() {
    const container = document.getElementById('github-stats');
    if (!container) return;

    try {
        const [userRes, eventsRes, prsRes, issuesRes] = await Promise.all([
            fetch('https://api.github.com/users/AfonsoPaiva'),
            fetch('https://api.github.com/users/AfonsoPaiva/events?per_page=100'),
            fetch('https://api.github.com/search/issues?q=author:AfonsoPaiva+type:pr+is:merged'),
            fetch('https://api.github.com/search/issues?q=author:AfonsoPaiva+type:issue')
        ]);

        const user = await userRes.json();
        const events = await eventsRes.json();
        const prs = await prsRes.json();
        const issues = await issuesRes.json();

        // 1. Counts
        const prsCount = prs.total_count || 0;
        const issuesCount = issues.total_count || 0;
        
        // 2. Last Commit
        const lastPush = Array.isArray(events) ? events.find(e => e.type === 'PushEvent') : null;
        let lastCommitDate = 'N/A';
        let lastCommitRepo = 'No recent activity';
        let lastCommitLink = 'https://github.com/AfonsoPaiva';
        
        if (lastPush) {
            const date = new Date(lastPush.created_at);
            lastCommitDate = date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
            lastCommitRepo = lastPush.repo.name.replace('AfonsoPaiva/', '');
            if (lastPush.payload && lastPush.payload.commits && lastPush.payload.commits.length > 0) {
                 const sha = lastPush.payload.commits[lastPush.payload.commits.length - 1].sha;
                 lastCommitLink = `https://github.com/${lastPush.repo.name}/commit/${sha}`;
            } else {
                 lastCommitLink = `https://github.com/${lastPush.repo.name}`;
            }
        }

        // 3. Streak & Graph (Based on Public Events)
        const activityMap = {};
        if (Array.isArray(events)) {
             events.forEach(e => {
                if (e.type === 'PushEvent') {
                    const dateStr = new Date(e.created_at).toISOString().split('T')[0];
                    activityMap[dateStr] = true;
                }
            });
        }
        
        // Calculate Streak
        let streak = 0;
        const today = new Date();
        let currentCheck = new Date();
        let checking = true;

        // Check if active today
        const todayStr = today.toISOString().split('T')[0];
        
        while (checking) {
            const dateStr = currentCheck.toISOString().split('T')[0];
            if (activityMap[dateStr]) {
                streak++;
                currentCheck.setDate(currentCheck.getDate() - 1);
            } else {
                 // Allow missing today if it's the first check
                 if (streak === 0 && dateStr === todayStr) {
                    currentCheck.setDate(currentCheck.getDate() - 1);
                    continue; 
                 }
                 checking = false;
            }
            // Safety break for loop
            if (streak > 365) checking = false;
        }

        // Generate Graph (Last 21 days - 3 weeks)
        let graphHTML = '';
        const daysToShow = 21;
        for (let i = daysToShow - 1; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dStr = d.toISOString().split('T')[0];
            const hasActivity = activityMap[dStr];
            const colorClass = hasActivity ? 'bg-green-400' : 'bg-white/10';
            graphHTML += `<div class="w-1.5 h-1.5 ${colorClass} rounded-sm" title="${dStr}"></div>`;
        }
        
        container.innerHTML = `
            <a href="https://github.com/search?q=author%3AAfonsoPaiva+type%3Apr+is%3Amerged" target="_blank" class="p-3 border border-white/10 bg-white/5 hover:border-green-400 transition-colors group block">
                <div class="text-xs text-gray-500 mb-1 font-mono">PRS_SOLVED</div>
                <div class="text-2xl font-bold text-white group-hover:text-green-400 font-mono">${prsCount}</div>
            </a>
             <a href="https://github.com/search?q=author%3AAfonsoPaiva+type%3Aissue" target="_blank" class="p-3 border border-white/10 bg-white/5 hover:border-green-400 transition-colors group block">
                <div class="text-xs text-gray-500 mb-1 font-mono">ISSUES_FILED</div>
                <div class="text-2xl font-bold text-white group-hover:text-green-400 font-mono">${issuesCount}</div>
            </a>
            <a href="${lastCommitLink}" target="_blank" class="p-3 border border-white/10 bg-white/5 hover:border-green-400 transition-colors group block">
                <div class="text-xs text-gray-500 mb-1 font-mono">LAST_COMMIT</div>
                <div class="text-sm font-bold text-white group-hover:text-green-400 font-mono truncate" title="${lastCommitRepo}">${lastCommitRepo}</div>
                 <div class="text-xs text-gray-500 font-mono mt-1">${lastCommitDate}</div>
            </a>
            <a href="https://github.com/AfonsoPaiva" target="_blank" class="p-3 border border-white/10 bg-white/5 hover:border-green-400 transition-colors group flex flex-col justify-between block">
                 <div class="flex justify-between items-start">
                    <div class="text-xs text-gray-500 font-mono">STREAK</div>
                    <div class="text-xl font-bold text-white group-hover:text-green-400 font-mono">${streak}<span class="text-xs ml-1 text-gray-500 font-normal">DAYS</span></div>
                 </div>
                 <div class="flex gap-1 mt-1 justify-end flex-wrap max-w-full">
                    ${graphHTML}
                 </div>
            </a>
        `;
    } catch (e) {
        console.error("Failed to fetch GitHub stats", e);
        container.innerHTML = '<div class="col-span-2 text-red-500 border border-red-500/20 p-2 text-xs font-mono text-center">Connection_Lost</div>';
    }
}

async function submitContact(e) {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    const originalText = btn.innerText;
    btn.innerText = "SENDING...";
    btn.disabled = true;

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
        const res = await fetch(`${API_BASE}/contact`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        if (res.ok) {
            btn.innerText = "SENT!";
            btn.classList.add('bg-green-400', 'text-black');
            e.target.reset();
            setTimeout(() => {
                btn.innerText = originalText;
                btn.classList.remove('bg-green-400', 'text-black');
                btn.disabled = false;
            }, 3000);
        } else {
            throw new Error('Network response was not ok');
        }
    } catch (error) {
        btn.innerText = "ERROR";
        console.error('Error:', error);
        setTimeout(() => {
            btn.innerText = originalText;
            btn.disabled = false;
        }, 3000);
    }
}

// --- Render Functions ---

function renderExperience() {
    const list = document.getElementById('experience-list');
    const lang = state.lang;
    
    if (state.experience.length === 0) {
        list.innerHTML = '<p class="text-center text-gray-500">No experience data.</p>';
        return;
    }

    list.innerHTML = state.experience.map((exp, index) => {
        const company = exp.company?.[lang] || exp.company || "Unknown Company";
        const role = exp.role?.[lang] || exp.role || "Role";
        const period = exp.period?.[lang] || exp.period || "";
        const desc = exp.description?.[lang] || exp.description || "";
        const achievements = exp.achievements || [];

        return `
        <div class="group relative pl-8 border-l border-white/10 hover:border-green-400 transition-colors duration-300">
       
            
            <div class="flex flex-col md:flex-row md:items-start md:justify-between mb-4 gap-4">
                <div>
                    <h4 class="text-xl font-bold text-white group-hover:text-green-400 transition-colors">${role}</h4>
                    <p class="text-sm text-green-400 font-mono mb-2">${company}</p>
                </div>
                <div class="text-xs text-gray-500 font-mono border border-white/10 px-2 py-1">${period}</div>
            </div>

            <div class="grid md:grid-cols-[1fr_100px] gap-6">
                <div>
                    <p class="text-gray-400 text-sm leading-relaxed mb-4">${desc}</p>
                    ${achievements.length > 0 ? `
                    <ul class="space-y-2 mb-4">
                        ${achievements.map(a => `
                            <li class="flex items-start gap-2 text-sm text-gray-500">
                                <span class="text-green-400 mt-1">›</span>
                                ${a[lang] || a}
                            </li>
                        `).join('')}
                    </ul>
                    ` : ''}
                    <div class="flex flex-wrap gap-2">
                        ${(exp.tech || []).map(t => `<span class="text-xs text-gray-500 border border-white/10 px-2 py-1">${t}</span>`).join('')}
                    </div>
                </div>
                ${exp.logo ? `
                <div class="hidden md:flex items-center justify-center p-2 bg-white/5 rounded border border-white/10 h-24 w-24">
                    <img src="${exp.logo}" alt="${company} Logo" class="max-w-full max-h-full object-contain transition-all duration-300">
                </div>
                ` : ''}
            </div>
        </div>
        `;
    }).join('');
    
    lucide.createIcons();
}

function renderProjects() {
    const grid = document.getElementById('projects-grid');
    const lang = state.lang;
    
    if (state.projects.length === 0) {
        grid.innerHTML = '<p class="col-span-full text-center text-gray-500">No projects data.</p>';
        return;
    }

    grid.innerHTML = state.projects.map(project => {
        const title = project.title?.[lang] || "Untitled Project";
        const shortDesc = project.shortDescription?.[lang] || "No description.";
        const tech = project.tech || [];
        const status = project.status?.text || "UNKNOWN";
        const statusColor = project.status?.color === 'green' ? 'text-green-400' : 'text-yellow-400';

        return `
        <div class="group border-2 border-white/10 bg-black hover:border-green-400 transition-all duration-300 cursor-pointer overflow-hidden" onclick="openModal('${project.id}')">
            <div class="h-48 overflow-hidden relative border-b-2 border-white/10">
                <img src="${project.image}" alt="${title}" class="w-full h-full object-cover  transition-all duration-500">
                <div class="absolute top-2 right-2 bg-black/80 backdrop-blur px-2 py-1 text-[10px] font-bold border border-white/20 ${statusColor}">
                    ${status}
                </div>
            </div>
            <div class="p-6">
                <h3 class="text-lg font-bold text-white mb-2 group-hover:text-green-400 transition-colors line-clamp-1">${title}</h3>
                <p class="text-gray-500 text-sm mb-4 line-clamp-2 min-h-[40px]">${shortDesc}</p>
                <div class="flex flex-wrap gap-2">
                    ${tech.slice(0, 3).map(t => `<span class="text-xs text-green-400/80 font-mono">#${t}</span>`).join('')}
                    ${tech.length > 3 ? `<span class="text-xs text-gray-600">+${tech.length - 3}</span>` : ''}
                </div>
            </div>
        </div>
        `;
    }).join('');
}

function renderDocs() {
    const grid = document.getElementById('docs-grid');
    const lang = state.lang;
    
    if (state.docs.length === 0) {
        grid.innerHTML = '<p class="col-span-full text-center text-gray-500">No documentation data.</p>';
        return;
    }

    grid.innerHTML = state.docs.map(doc => {
        const title = doc.title?.[lang] || "Untitled Doc";
        const desc = doc.description?.[lang] || "";
        const linkText = doc.linkText?.[lang] || "READ_MORE";
        const icon = doc.icon || "file-text";

        return `
        <div class="p-6 border border-white/10 bg-white/5 hover:border-green-400 transition-colors group">
             <div class="flex items-center gap-4 mb-4">
                <i data-lucide="${icon}" class="text-green-400"></i>
                <h4 class="text-xl font-bold text-white">${title}</h4>
             </div>
             <p class="text-gray-400 text-sm mb-6 leading-relaxed">
                ${desc}
             </p>
             <a href="${doc.link || '#'}" class="text-green-400 text-sm font-mono hover:underline flex items-center gap-2">
                ${linkText} <i data-lucide="arrow-right" class="w-4 h-4"></i>
             </a>
        </div>
        `;
    }).join('');
    
    lucide.createIcons();
}

// --- Interaction Functions ---

function updateLanguage(newLang) {
    state.lang = newLang;
    localStorage.setItem('lang', newLang);
    
    // Update Toggle Button
    const btn = document.getElementById('lang-toggle');
    if (newLang === 'pt') {
        btn.innerHTML = '<span class="text-green-400">PT</span> <span class="text-gray-600">/</span> <span class="text-gray-500 hover:text-white transition-colors">EN</span>';
    } else {
        btn.innerHTML = '<span class="text-gray-500 hover:text-white transition-colors">PT</span> <span class="text-gray-600">/</span> <span class="text-green-400">EN</span>';
    }

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (state.translations[newLang][key]) {
            el.innerText = state.translations[newLang][key];
        }
    });

    renderExperience();
    renderProjects();
    renderDocs();
}

function openModal(projectId) {
    // Use string comparison for safety with large IDs
    const project = state.projects.find(p => String(p.id) === String(projectId));
    if (!project) return;

    const lang = state.lang;
    const modal = document.getElementById('modal-overlay');
    const modalContent = document.getElementById('modal-content');
    
    // Populate without Image
    document.getElementById('modal-title').innerText = project.title?.[lang] || "Untitled";
    
    // Prioritize specific repository fields, fallback to generic link
    const repoLink = project.repository || project.repo || project.github || project.link || "#";
    document.getElementById('modal-link').href = repoLink;
    
    document.getElementById('modal-desc').innerText = project.fullDescription?.[lang] || project.shortDescription?.[lang] || "";
    
    const feats = document.getElementById('modal-features');
    const featuresList = project.features?.[lang] || []; 
    if (Array.isArray(featuresList) && featuresList.length > 0) {
         feats.innerHTML = '<h4 class="font-bold text-green-400 mb-2">Features:</h4><ul class="list-disc pl-4 text-gray-400 space-y-1">' + 
            featuresList.map(f => `<li>${f}</li>`).join('') + '</ul>';
         feats.style.display = 'block';
    } else {
        feats.style.display = 'none';
    }

    const tags = document.getElementById('modal-tags');
    tags.innerHTML = (project.tech || []).map(t => 
        `<span class="px-2 py-1 bg-white/10 text-xs text-green-400 font-mono">${t}</span>`
    ).join('');

    // Open & Animate
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';

    // GSAP Animation
    gsap.set(modal, { opacity: 0 });
    gsap.set(modalContent, { y: 50, opacity: 0 });
    
    gsap.to(modal, { opacity: 1, duration: 0.3 });
    gsap.to(modalContent, { 
        y: 0, 
        opacity: 1, 
        duration: 0.5, 
        ease: "power2.out", 
        delay: 0.1 
    });
}

function closeModal() {
    const modal = document.getElementById('modal-overlay');
    const modalContent = document.getElementById('modal-content');
    
    // Animate Out
    gsap.to(modalContent, { y: 20, opacity: 0, duration: 0.3 });
    gsap.to(modal, { 
        opacity: 0, 
        duration: 0.3, 
        delay: 0.1,
        onComplete: () => {
             modal.classList.add('hidden');
             document.body.style.overflow = '';
        }
    });
}

// --- Init ---

document.addEventListener('DOMContentLoaded', () => {
    // Lenis Smooth Scroll
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Sync Lenis scroll with standard anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            // Only intercept if it's still an anchor link (starts with #)
            if (targetId && targetId.startsWith('#')) {
                e.preventDefault();
                lenis.scrollTo(targetId, { offset: -100 });
            }
        });
    });

    // Event Listeners
    document.getElementById('lang-toggle').addEventListener('click', () => {
        const newLang = state.lang === 'pt' ? 'en' : 'pt';
        updateLanguage(newLang);
    });

    document.getElementById('modal-close').addEventListener('click', closeModal);
    document.getElementById('modal-overlay').addEventListener('click', (e) => {
        if (e.target.id === 'modal-overlay') closeModal();
    });

    document.getElementById('contact-form').addEventListener('submit', submitContact);

    // Initial Load
    updateLanguage(state.lang);
    fetchProjects();
    fetchDocs();
    fetchExperience();
    fetchGitHubStats();
    lucide.createIcons();
});

// Exposed for onclick in HTML
window.openModal = openModal;
