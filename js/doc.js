const API_BASE = 'https://portfolio-0fkz.onrender.com/api/v1';

const state = {
    lang: localStorage.getItem('lang') || 'pt',
    translations: {
        en: {
            "nav.back": "cd ..",
            "nav.return": "Back to Docs",
            "error.title": "Error 404",
            "error.desc": "Documentation not found.",
            "error.link": "Return to Docs"
        },
        pt: {
            "nav.back": "cd ..",
            "nav.return": "Voltar para Docs",
            "error.title": "Erro 404",
            "error.desc": "Documentação não encontrada.",
            "error.link": "Voltar para Docs"
        }
    }
};

async function fetchDoc(slug) {
    try {
        const res = await fetch(`${API_BASE}/docs/${slug}`);
        if (!res.ok) throw new Error('Not found');
        const json = await res.json();
        
        if (json.success) {
            renderDoc(json.data);
        } else {
            showError();
        }
    } catch (e) {
        console.error("Failed to fetch doc", e);
        showError();
    }
}

function renderDoc(doc) {
    const lang = state.lang;
    const loader = document.getElementById('loading');
    const wrapper = document.getElementById('content-wrapper');
    const errorMsg = document.getElementById('error-message');

    loader.style.display = 'none';
    errorMsg.classList.add('hidden');
    wrapper.classList.remove('hidden');

    // Back Button
    document.getElementById('back-btn-text').innerText = state.translations[lang]['nav.return'];

    // Title & Metadata
    document.title = `${doc.title[lang] || doc.title['en']} | Afonso Paiva`;
    document.getElementById('doc-title').textContent = doc.title[lang] || doc.title['en'];
    document.getElementById('doc-category').textContent = doc.category || "General";
    
    const date = new Date(doc.updatedAt || doc.createdAt);
    document.getElementById('doc-date').textContent = date.toLocaleDateString(lang === 'pt' ? 'pt-PT' : 'en-GB');

    // Render Markdown
    // We strip the first H1 if it matches the title to avoid duplication, 
    // but looking at the backend sample: content has "# Getting Started". 
    // We already display title in H1 text. So we might want to replace the first # line if it matches.
    let content = doc.content[lang] || doc.content['en'] || "";
    
    // Optional: Remove first H1 from markdown if we are displaying it separately
    // content = content.replace(/^#\s+.*$/m, '');

    document.getElementById('doc-body').innerHTML = marked.parse(content);

    lucide.createIcons();
}

function showError() {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('content-wrapper').classList.add('hidden');
    
    const errDiv = document.getElementById('error-message');
    errDiv.classList.remove('hidden');
    
    // Localize Error
    const lang = state.lang;
    const t = state.translations[lang];
    errDiv.querySelector('h2').textContent = t["error.title"];
    errDiv.querySelector('p').textContent = t["error.desc"];
    errDiv.querySelector('a').textContent = t["error.link"];
}

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

    // Refresh content if slug is present
    const urlParams = new URLSearchParams(window.location.search);
    const slug = urlParams.get('slug');
    if (slug) {
        fetchDoc(slug);
    }
    
    // Localize back button
    document.getElementById('back-btn-text').innerText = state.translations[newLang]['nav.return'];
}

document.addEventListener('DOMContentLoaded', () => {
    // Init Language
    const btn = document.getElementById('lang-toggle');
    // Set initial state matching main.js logic
    if (state.lang === 'pt') {
        btn.innerHTML = '<span class="text-green-400">PT</span> <span class="text-gray-600">/</span> <span class="text-gray-500 hover:text-white transition-colors">EN</span>';
    } else {
        btn.innerHTML = '<span class="text-gray-500 hover:text-white transition-colors">PT</span> <span class="text-gray-600">/</span> <span class="text-green-400">EN</span>';
    }

    btn.addEventListener('click', () => {
        const newLang = state.lang === 'pt' ? 'en' : 'pt';
        updateLanguage(newLang);
    });

    // Handle Slug
    const urlParams = new URLSearchParams(window.location.search);
    const slug = urlParams.get('slug');

    if (slug) {
        fetchDoc(slug);
    } else {
        showError();
    }
});
