// Simplified Main JS
const DATA_URL = 'data.json';
let _dataCache = null;

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
            "hero.last_updated": "LAST_UPDATED::2026-10-26",
            "section.about": "About Me",
            "about.text1": "Backend engineer focused on Java and Spring Boot, with experience in REST APIs and microservices, and production experience in Go, Python and Angular. Currently a Part-Time Backend Developer at INESC-TEC, working on the Python to Go backend migration.",
            "about.text2": "Author of Ariadne, an open-source JVM agent that restores caller context lost across thread boundaries in asynchronous Java code, and founder of SkillBridge, a non-profit full-stack platform in production.",
            "about.education": "Education",
            "about.msc": "M.Sc. in Computer Engineering",
            "about.msc_period": "Expected 2028",
            "about.degree": "B.Sc. in Digital Games Engineering",
            "about.uni": "IPCA, Braga",
            "about.edu_period": "2023 - Jun 2026",
            "about.stack": "Tech Stack",
            "about.github": "GitHub Stats",
            "section.experience": "Experience",
            "section.projects": "Projects",
            "section.docs": "Documentation",
            "contact.title": "Get In Touch",
            "contact.desc": "Currently looking for new opportunities. Whether you have a question or just want to say hi, I'll try my best to get back to you!",
            "contact.btn": "SEND_MESSAGE",
            "modal.repo": "VIEW REPOSITORY",
            "modal.site": "VISIT SITE",
            "modal.video": "WATCH DEMO",
            "docs.read_more": "READ_MORE",
            "nav.robotics": "./ROBOTICS",
            "section.robotics": "Robotics & Electronics",
            "hero.cv": "DOWNLOAD_CV.PDF",
            "robotics.watch": "WATCH"
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
            "hero.last_updated": "ULTIMA_ATUALIZAÇÃO::26-10-2026",
            "section.about": "Sobre Mim",
            "about.text1": "Engenheiro Backend focado em Java e Spring Boot, com experiência em APIs REST e microsserviços, e experiência em produção com Go, Python e Angular. Atualmente Backend Developer (Part-Time) no INESC-TEC, na migração do backend de Python para Go.",
            "about.text2": "Autor do Ariadne, um agente JVM open-source que restaura o contexto de chamada entre threads em código Java assíncrono, e fundador da SkillBridge, plataforma full-stack sem fins lucrativos em produção.",
            "about.education": "Educação",
            "about.msc": "Mestrado em Engenharia Informática",
            "about.msc_period": "Previsto 2028",
            "about.degree": "Licenciatura em Engenharia de Jogos Digitais",
            "about.uni": "IPCA, Braga",
            "about.edu_period": "2023 - Jun 2026",
            "about.stack": "Stack Tecnológica",
            "about.github": "Estatísticas GitHub",
            "section.experience": "Experiência",
            "section.docs": "Documentação",
            "section.projects": "Projetos",
            "contact.title": "Entre em Contato",
            "contact.desc": "Atualmente em busca de novas oportunidades. Se tiver uma pergunta ou apenas quiser dizer olá, tentarei responder o mais rápido possível!",
            "contact.btn": "ENVIAR_MENSAGEM",
            "modal.repo": "VER REPOSITÓRIO",
            "modal.site": "VISITAR SITE",
            "modal.video": "VER DEMO",
            "docs.read_more": "LER_MAIS",
            "nav.robotics": "./ROBÓTICA",
            "section.robotics": "Robótica & Eletrotécnica",
            "hero.cv": "DOWNLOAD_CV.PDF",
            "robotics.watch": "VER"
        }
    }
};

// --- Data Functions ---

async function loadData() {
    if (_dataCache) return _dataCache;
    const res = await fetch(DATA_URL);
    if (!res.ok) throw new Error('Failed to load data.json');
    _dataCache = await res.json();
    return _dataCache;
}

async function fetchProjects() {
    try {
        const data = await loadData();
        state.projects = (data.projects || []).sort((a, b) => b.id - a.id);
        renderProjects();
    } catch (e) {
        console.error("Failed to load projects", e);
        document.getElementById('projects-grid').innerHTML = '<p class="text-red-500">Error loading projects.</p>';
    }
}

async function fetchExperience() {
    try {
        const data = await loadData();
        state.experience = data.experience || [];
        renderExperience();
    } catch (e) {
        console.error("Failed to load experience", e);
        document.getElementById('experience-list').innerHTML = '<p class="text-red-500">Error loading experience.</p>';
    }
}

async function fetchDocs() {
    try {
        const data = await loadData();
        state.docs = data.docs || [];
        renderDocs();
    } catch (e) {
        console.error("Failed to load docs", e);
        document.getElementById('docs-grid').innerHTML = '<p class="text-red-500">Error loading docs.</p>';
    }
}

async function fetchGitHubStats() {
    const container = document.getElementById('github-stats');
    if (!container) return;

    try {
        const [userRes, eventsRes, reposRes] = await Promise.all([
            fetch('https://api.github.com/users/AfonsoPaiva'),
            fetch('https://api.github.com/users/AfonsoPaiva/events?per_page=100'),
            fetch('https://api.github.com/users/AfonsoPaiva/repos?per_page=100&sort=updated')
        ]);

        const user = await userRes.json();
        const events = await eventsRes.json();
        const repos = await reposRes.json();

        // 1. Counts
        const reposCount = user.public_repos || 0;
        const followersCount = user.followers || 0;

        // 2. Total stars
        const totalStars = Array.isArray(repos) ? repos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0) : 0;

        // 3. Last Commit
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

        // 4. Activity graph (last 21 days)
        const activityMap = {};
        if (Array.isArray(events)) {
             events.forEach(e => {
                if (e.type === 'PushEvent') {
                    const dateStr = new Date(e.created_at).toISOString().split('T')[0];
                    activityMap[dateStr] = true;
                }
            });
        }

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
            <a href="https://github.com/AfonsoPaiva?tab=repositories" target="_blank" class="p-3 border border-white/10 bg-white/5 hover:border-green-400 transition-colors group block">
                <div class="text-xs text-gray-500 mb-1 font-mono">PUBLIC_REPOS</div>
                <div class="text-2xl font-bold text-white group-hover:text-green-400 font-mono">${reposCount}</div>
            </a>
            <a href="https://github.com/AfonsoPaiva?tab=followers" target="_blank" class="p-3 border border-white/10 bg-white/5 hover:border-green-400 transition-colors group block">
                <div class="text-xs text-gray-500 mb-1 font-mono">FOLLOWERS</div>
                <div class="text-2xl font-bold text-white group-hover:text-green-400 font-mono">${followersCount}</div>
            </a>
            <a href="${lastCommitLink}" target="_blank" class="p-3 border border-white/10 bg-white/5 hover:border-green-400 transition-colors group block">
                <div class="text-xs text-gray-500 mb-1 font-mono">LAST_COMMIT</div>
                <div class="text-sm font-bold text-white group-hover:text-green-400 font-mono truncate" title="${lastCommitRepo}">${lastCommitRepo}</div>
                <div class="text-xs text-gray-500 font-mono mt-1">${lastCommitDate}</div>
            </a>
            <a href="https://github.com/AfonsoPaiva" target="_blank" class="p-3 border border-white/10 bg-white/5 hover:border-green-400 transition-colors group flex flex-col justify-between block">
                <div class="flex justify-between items-start">
                    <div class="text-xs text-gray-500 font-mono">TOTAL_STARS</div>
                    <div class="text-xl font-bold text-white group-hover:text-green-400 font-mono">${totalStars}</div>
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
        <div class="group relative pl-6 md:pl-8 border-l border-white/10 hover:border-green-400 transition-colors duration-300">
            <div class="flex flex-col md:flex-row md:items-start md:justify-between mb-2 gap-2">
                <div>
                    <h4 class="text-lg md:text-xl font-bold text-white group-hover:text-green-400 transition-colors">${role}</h4>
                    <p class="text-sm text-green-400 font-mono mb-1">${company}</p>
                </div>
                <div class="text-xs text-gray-500 font-mono border border-white/10 px-2 py-1 self-start">${period}</div>
            </div>

            <div class="grid md:grid-cols-[1fr_90px] gap-4">
                <div>
                    <p class="text-gray-400 text-xs sm:text-sm leading-relaxed mb-3">${desc}</p>
                    ${achievements.length > 0 ? `
                    <ul class="space-y-1 mb-3">
                        ${achievements.map(a => `
                            <li class="flex items-start gap-2 text-xs sm:text-sm text-gray-500">
                                <span class="text-green-400 mt-0.5">›</span>
                                <span>${a[lang] || a}</span>
                            </li>
                        `).join('')}
                    </ul>
                    ` : ''}
                    <div class="flex flex-wrap gap-2">
                        ${(exp.tech || []).map(t => `<span class="text-xs text-gray-500 border border-white/10 px-2 py-1">${t}</span>`).join('')}
                    </div>
                </div>
                ${exp.logo ? `
                <div class="hidden md:flex items-center justify-center p-2 bg-white/5 rounded border border-white/10 h-20 w-20">
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

        let imgUrl = project.image || '';
        if (imgUrl.includes('github.com/') && imgUrl.includes('/blob/') && !imgUrl.includes('?raw=true')) {
            imgUrl += '?raw=true';
        }
        const isSvgLogo = imgUrl.toLowerCase().includes('.svg');
        const imgFitClass = isSvgLogo ? 'object-contain p-3 bg-[#080808]' : 'object-cover';

        return `
        <div class="group border-2 border-white/10 bg-black hover:border-green-400 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col" onclick="openModal('${project.id}')">
            <div class="h-36 md:h-40 overflow-hidden relative border-b-2 border-white/10 shrink-0">
                <img src="${imgUrl}" alt="${title}" class="w-full h-full ${imgFitClass} transition-all duration-500">
                <div class="absolute top-2 right-2 bg-black/80 backdrop-blur px-2 py-1 text-[10px] font-bold border border-white/20 ${statusColor}">
                    ${status}
                </div>
            </div>
            <div class="p-4 md:p-5 flex flex-col flex-grow justify-between">
                <div>
                    <h3 class="text-base md:text-lg font-bold text-white mb-1.5 group-hover:text-green-400 transition-colors line-clamp-1">${title}</h3>
                    <p class="text-gray-500 text-xs md:text-sm mb-3 line-clamp-2 min-h-[36px]">${shortDesc}</p>
                </div>
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
    
    if (!state.docs || state.docs.length === 0) {
        grid.innerHTML = '<p class="col-span-full text-center text-gray-500">No documentation data.</p>';
        return;
    }

    grid.innerHTML = state.docs.map(doc => {
        const title = doc.title?.[lang] || "Untitled Doc";
        
        // Handle markdown content -> plain text description
        const content = doc.content?.[lang] || "";
        const plainContent = content.replace(/^#+\s+/gm, '') // headings
                                  .replace(/(\*\*|__)(.*?)\1/g, '$2') // bold
                                  .replace(/(\*|_)(.*?)\1/g, '$2') // italic
                                  .replace(/`([^`]+)`/g, '$1') // code
                                  .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // links
                                  .split('\n').filter(line => line.trim() !== '').join(' ');
        
        const desc = plainContent.length > 150 ? plainContent.substring(0, 150) + "..." : (plainContent || "No content available.");
        
        const category = doc.category || "General";
        const icon = category.toLowerCase().includes('guide') ? 'book-open' : 'file-text';
        
        // Localization for Read More
        const linkText = state.translations[lang]["docs.read_more"] || "READ_MORE";

        // Construct slug link
        const link = doc.slug ? `doc.html?slug=${doc.slug}` : '#';

        return `
        <div class="p-6 border border-white/10 bg-white/5 hover:border-green-400 transition-colors group flex flex-col h-full">
             <div class="flex items-center gap-4 mb-4">
                <i data-lucide="${icon}" class="text-green-400 shrink-0"></i>
                <div>
                     <div class="text-xs text-green-400 font-mono mb-1 uppercase">${category}</div>
                     <h4 class="text-xl font-bold text-white leading-tight">${title}</h4>
                </div>
             </div>
             <p class="text-gray-400 text-sm mb-6 leading-relaxed flex-grow">
                ${desc}
             </p>
             <a href="${link}" class="text-green-400 text-sm font-mono hover:underline flex items-center gap-2 mt-auto">
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
    
    // GitHub button
    const githubUrl = project.githubUrl || '';
    const modalGithubBtn = document.getElementById('modal-github-btn');
    if (githubUrl) {
        modalGithubBtn.href = githubUrl;
        modalGithubBtn.classList.remove('hidden');
        modalGithubBtn.querySelector('[data-i18n="modal.repo"]').textContent = state.translations[lang]['modal.repo'] || 'VIEW REPOSITORY';
    } else {
        modalGithubBtn.classList.add('hidden');
    }

    // Site button
    const siteUrl = project.siteUrl || '';
    const modalSiteBtn = document.getElementById('modal-site-btn');
    if (siteUrl) {
        modalSiteBtn.href = siteUrl;
        modalSiteBtn.classList.remove('hidden');
        modalSiteBtn.querySelector('[data-i18n="modal.site"]').textContent = state.translations[lang]['modal.site'] || 'VISIT SITE';
    } else {
        modalSiteBtn.classList.add('hidden');
    }

    // Video button
    const videoUrl = project.videoUrl || '';
    const modalVideoBtn = document.getElementById('modal-video-btn');
    if (videoUrl) {
        modalVideoBtn.href = videoUrl;
        modalVideoBtn.classList.remove('hidden');
        modalVideoBtn.querySelector('[data-i18n="modal.video"]').textContent = state.translations[lang]['modal.video'] || 'WATCH DEMO';
    } else {
        modalVideoBtn.classList.add('hidden');
    }
    
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
    const isMobile = window.innerWidth < 768;

    // GSAP Animation (faster on mobile than the 0.45s page transition)
    gsap.set(modal, { opacity: 0 });
    gsap.set(modalContent, { y: isMobile ? 20 : 50, opacity: 0 });
    
    gsap.to(modal, { opacity: 1, duration: isMobile ? 0.15 : 0.3 });
    gsap.to(modalContent, { 
        y: 0, 
        opacity: 1, 
        duration: isMobile ? 0.2 : 0.5, 
        ease: "power2.out", 
        delay: isMobile ? 0 : 0.1 
    });
}

function closeModal() {
    const modal = document.getElementById('modal-overlay');
    const modalContent = document.getElementById('modal-content');
    const isMobile = window.innerWidth < 768;
    
    // Animate Out
    gsap.to(modalContent, { y: 20, opacity: 0, duration: isMobile ? 0.14 : 0.3 });
    gsap.to(modal, { 
        opacity: 0, 
        duration: isMobile ? 0.16 : 0.3, 
        delay: isMobile ? 0 : 0.1,
        onComplete: () => {
             modal.classList.add('hidden');
        }
    });
}

// --- Init & GNOME Coverflow Alt-Tab 3D Controller (GPU-Optimized) ---

let currentPageIndex = 0;
let isPageAnimating = false;
let settleTimeout = null;
let panels = [];

function isOverlayOpen() {
    const modal = document.getElementById('modal-overlay');
    const mobileMenu = document.getElementById('mobile-menu');
    return (modal && !modal.classList.contains('hidden')) ||
           (mobileMenu && !mobileMenu.classList.contains('hidden'));
}

function updateActiveUI(index) {
    const progressBar = document.getElementById('scroll-progress');
    if (progressBar && panels.length > 1) {
        gsap.to(progressBar, {
            scaleX: index / (panels.length - 1),
            duration: 0.45,
            ease: 'power2.out',
            overwrite: true
        });
    }

    const activePanel = panels[index];
    const activeId = activePanel ? activePanel.id : null;

    document.querySelectorAll('.nav-link').forEach(link => {
        const href = link.getAttribute('href');
        if (activeId && href === `#${activeId}`) {
            link.classList.add('text-green-400');
        } else {
            link.classList.remove('text-green-400');
        }
    });

    const sectionNames = ['HERO', 'ABOUT', 'EXP', 'PROJECTS', 'DOCS', 'CONTACT'];
    const edgeLeft = document.getElementById('edge-left');
    const edgeRight = document.getElementById('edge-right');
    const edgeLeftLabel = document.getElementById('edge-left-label');
    const edgeRightLabel = document.getElementById('edge-right-label');

    if (edgeLeft) {
        if (index <= 0) {
            edgeLeft.classList.add('is-disabled');
        } else {
            edgeLeft.classList.remove('is-disabled');
            if (edgeLeftLabel) edgeLeftLabel.textContent = sectionNames[index - 1] || 'PREV';
        }
    }
    if (edgeRight) {
        if (index >= panels.length - 1) {
            edgeRight.classList.add('is-disabled');
        } else {
            edgeRight.classList.remove('is-disabled');
            if (edgeRightLabel) edgeRightLabel.textContent = sectionNames[index + 1] || 'NEXT';
        }
    }
}

function renderCoverflowState(activeIndex, mode = 'focused', immediate = false) {
    const isMobile = window.innerWidth < 768;
    const isSwitching = mode === 'coverflow';

    panels.forEach((card, i) => {
        const offset = i - activeIndex;
        const absOffset = Math.abs(offset);
        const sign = Math.sign(offset);
        const body = card.querySelector('.deck-card-body');

        if (offset === 0) {
            card.classList.add('is-active');
            card.style.pointerEvents = 'auto';
            card.style.zIndex = 50;
            if (body && isSwitching) body.scrollTop = 0;

            gsap.to(card, {
                xPercent: 0,
                y: isSwitching ? -8 : 0,
                z: 0,
                rotationY: 0,
                rotationX: 0,
                scale: isSwitching ? (isMobile ? 0.84 : 0.78) : 1,
                autoAlpha: 1,
                force3D: true,
                duration: immediate ? 0 : 0.45,
                ease: 'power3.out',
                overwrite: true
            });
        } else {
            card.classList.remove('is-active');
            card.style.zIndex = 50 - absOffset;

            // Only render immediate neighbors (absOffset <= 2) during Coverflow switch;
            // hide all non-active cards completely (visibility: hidden via autoAlpha: 0) when focused
            const isVisibleWing = isSwitching && absOffset <= 2;
            card.style.pointerEvents = isVisibleWing ? 'auto' : 'none';

            const wingSpreadBase = isMobile ? 38 : 44;
            const wingSpreadStep = isMobile ? 10 : 12;
            const wingAngle = isMobile ? 48 : 55;

            const targetXPercent = isSwitching
                ? sign * (wingSpreadBase + (absOffset - 1) * wingSpreadStep)
                : sign * 65;

            const targetZ = isSwitching
                ? -160 - (absOffset - 1) * 90
                : -260;

            const targetRotY = -sign * wingAngle;
            const targetScale = isSwitching
                ? (isMobile ? 0.72 : 0.68) - (absOffset - 1) * 0.05
                : 0.7;
            const targetAlpha = isVisibleWing
                ? (absOffset === 1 ? 0.85 : 0.45)
                : 0;

            gsap.to(card, {
                xPercent: targetXPercent,
                y: 0,
                z: targetZ,
                rotationY: targetRotY,
                rotationX: 0,
                scale: targetScale,
                autoAlpha: targetAlpha,
                force3D: true,
                duration: immediate ? 0 : 0.45,
                ease: 'power3.out',
                overwrite: true
            });
        }
    });
}

function goToPage(targetIndex, immediate = false, keepCoverflowOpen = false) {
    if (panels.length === 0) return;

    const clampedIndex = Math.max(0, Math.min(panels.length - 1, targetIndex));
    if (clampedIndex === currentPageIndex && !immediate) return;
    if (isPageAnimating && !immediate) return;

    currentPageIndex = clampedIndex;
    updateActiveUI(currentPageIndex);

    if (immediate) {
        renderCoverflowState(currentPageIndex, 'focused', true);
        return;
    }

    isPageAnimating = true;
    setTimeout(() => {
        isPageAnimating = false;
    }, 360);

    // 1. Enter GNOME Coverflow 3D Alt-Tab mode and flip to the selected window
    renderCoverflowState(currentPageIndex, 'coverflow', false);

    // 2. If not holding cursor at the screen edge, zoom forward into full-page focus after flip
    if (settleTimeout) clearTimeout(settleTimeout);
    if (!keepCoverflowOpen) {
        settleTimeout = setTimeout(() => {
            renderCoverflowState(currentPageIndex, 'focused', false);
        }, 560);
    }
}

function scrollToSection(targetSelector) {
    if (!targetSelector || targetSelector === '#top' || targetSelector === '#hero') {
        goToPage(0);
        return;
    }

    const id = targetSelector.replace('#', '');
    const index = panels.findIndex(p => p.id === id);
    if (index !== -1) {
        goToPage(index);
    }
}

function initDeckController() {
    const container = document.getElementById('deck-container');
    if (!container) return;

    panels = Array.from(container.querySelectorAll('.deck-card'));
    panels.forEach((card, idx) => {
        card.addEventListener('click', (e) => {
            if (idx !== currentPageIndex) {
                e.stopPropagation();
                goToPage(idx);
            }
        });
    });

    window.addEventListener('resize', () => {
        renderCoverflowState(currentPageIndex, 'focused', true);
    });

    updateActiveUI(currentPageIndex);
    renderCoverflowState(currentPageIndex, 'focused', true);

    // Desktop Mouse Proximity Edge Navigation (Left / Right screen edges trigger Coverflow switch)
    let activeEdgeSide = null; // 'left' | 'right' | null
    let edgeRepeatInterval = null;
    const edgeLeftEl = document.getElementById('edge-left');
    const edgeRightEl = document.getElementById('edge-right');

    function clearEdgeTrigger() {
        if (edgeRepeatInterval) {
            clearInterval(edgeRepeatInterval);
            edgeRepeatInterval = null;
        }
        if (edgeLeftEl) edgeLeftEl.classList.remove('is-triggered');
        if (edgeRightEl) edgeRightEl.classList.remove('is-triggered');

        if (activeEdgeSide !== null) {
            activeEdgeSide = null;
            if (settleTimeout) clearTimeout(settleTimeout);
            settleTimeout = setTimeout(() => {
                renderCoverflowState(currentPageIndex, 'focused', false);
            }, 350);
        }
    }

    window.addEventListener('mousemove', (e) => {
        if (isOverlayOpen() || window.innerWidth < 768) return;

        // Ignore top navbar area so clicking nav buttons doesn't trigger edge flip
        if (e.clientY <= 64) {
            clearEdgeTrigger();
            return;
        }

        const edgeThreshold = Math.min(110, Math.max(64, window.innerWidth * 0.065));
        const isLeftEdge = e.clientX <= edgeThreshold;
        const isRightEdge = e.clientX >= window.innerWidth - edgeThreshold;

        if (isRightEdge && currentPageIndex < panels.length - 1) {
            if (activeEdgeSide !== 'right') {
                clearEdgeTrigger();
                activeEdgeSide = 'right';
                if (edgeRightEl) edgeRightEl.classList.add('is-triggered');
                goToPage(currentPageIndex + 1, false, true);

                edgeRepeatInterval = setInterval(() => {
                    if (currentPageIndex < panels.length - 1) {
                        goToPage(currentPageIndex + 1, false, true);
                    } else {
                        clearEdgeTrigger();
                    }
                }, 950);
            }
        } else if (isLeftEdge && currentPageIndex > 0) {
            if (activeEdgeSide !== 'left') {
                clearEdgeTrigger();
                activeEdgeSide = 'left';
                if (edgeLeftEl) edgeLeftEl.classList.add('is-triggered');
                goToPage(currentPageIndex - 1, false, true);

                edgeRepeatInterval = setInterval(() => {
                    if (currentPageIndex > 0) {
                        goToPage(currentPageIndex - 1, false, true);
                    } else {
                        clearEdgeTrigger();
                    }
                }, 950);
            }
        } else {
            clearEdgeTrigger();
        }
    });

    document.addEventListener('mouseleave', () => {
        clearEdgeTrigger();
    });

    // Mobile Touch Swipe handler (horizontal swipe triggers 3D Coverflow on touch devices)
    let touchStartX = 0;
    let touchStartY = 0;

    window.addEventListener('touchstart', (e) => {
        if (isOverlayOpen() || !e.touches.length) return;
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    }, { passive: true });

    window.addEventListener('touchend', (e) => {
        if (isOverlayOpen() || isPageAnimating || !e.changedTouches.length) return;
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;

        const deltaX = touchStartX - touchEndX;
        const deltaY = touchStartY - touchEndY;

        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 45) {
            if (deltaX > 0) {
                goToPage(currentPageIndex + 1);
            } else {
                goToPage(currentPageIndex - 1);
            }
        }
    }, { passive: true });

    // Keyboard Arrows (Left / Right)
    window.addEventListener('keydown', (e) => {
        if (isOverlayOpen() || isPageAnimating) return;
        if (e.key === 'ArrowRight') {
            e.preventDefault();
            goToPage(currentPageIndex + 1);
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            goToPage(currentPageIndex - 1);
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initDeckController();

    // Logo scroll to start
    const navLogo = document.getElementById('nav-logo');
    if (navLogo) {
        navLogo.addEventListener('click', () => scrollToSection('#hero'));
    }

    // Sync horizontal scroll with anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId && targetId.startsWith('#') && targetId.length > 1) {
                e.preventDefault();
                scrollToSection(targetId);
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

    // Mobile Menu (faster than the 0.45s page transition on mobile)
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuClose = document.getElementById('mobile-menu-close');
    
    if (mobileMenuBtn && mobileMenu && mobileMenuClose) {
        mobileMenuBtn.addEventListener('click', () => {
             mobileMenu.classList.remove('hidden');
             gsap.fromTo(mobileMenu, { x: '100%' }, { x: '0%', duration: 0.18, ease: 'power3.out' });
        });

        const closeMenu = (onDone) => {
             gsap.to(mobileMenu, { 
                x: '100%', 
                duration: 0.16, 
                ease: 'power3.in', 
                onComplete: () => {
                    mobileMenu.classList.add('hidden');
                    if (typeof onDone === 'function') onDone();
                }
             });
        };

        mobileMenuClose.addEventListener('click', () => closeMenu());

        // Close on link click rapidly so the overlay clears faster than the page change animation
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', (e) => {
                const targetId = link.getAttribute('href');
                e.preventDefault();
                closeMenu();
                if (targetId && targetId.startsWith('#')) {
                    scrollToSection(targetId);
                }
            });
        });
    }

    // Initial Load
    updateLanguage(state.lang);
    
    // Fetch all data
    Promise.all([
        fetchProjects(),
        fetchExperience(),
        fetchDocs(),
        fetchGitHubStats()
    ]).then(() => {
        lucide.createIcons();
        if (window.location.hash) {
            scrollToSection(window.location.hash);
        }
    });
});

// Exposed for onclick in HTML
window.openModal = openModal;
