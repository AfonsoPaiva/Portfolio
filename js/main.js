const state = {
    lang: localStorage.getItem('portfolio_lang') || 'pt',
    data: null
};

async function loadData() {
    if (state.data) return state.data;
    const isSubFolder = window.location.pathname.includes('/blog/') || window.location.pathname.endsWith('/blog');
    const dataUrl = isSubFolder ? '../data.json' : 'data.json';
    try {
        const res = await fetch(dataUrl);
        if (!res.ok) throw new Error('Failed to load data.json');
        state.data = await res.json();
        return state.data;
    } catch (err) {
        console.error(err);
        return null;
    }
}

function t(key) {
    const trans = state.data?.translations;
    return trans?.[state.lang]?.[key] || trans?.['pt']?.[key] || key;
}

function getText(obj) {
    if (!obj) return '';
    if (typeof obj === 'string') return obj;
    return obj[state.lang] || obj['en'] || obj['pt'] || '';
}

function setLanguage(newLang) {
    state.lang = newLang;
    localStorage.setItem('portfolio_lang', newLang);
    document.documentElement.lang = newLang;
    applyLanguage();
}

function toggleLanguage() {
    setLanguage(state.lang === 'pt' ? 'en' : 'pt');
}

async function applyLanguage() {
    const data = await loadData();
    if (!data) return;

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        el.textContent = t(key);
    });

    const langBtn = document.getElementById('lang-toggle');
    if (langBtn) {
        langBtn.textContent = t('lang_btn');
    }

    renderCurrentPage();
}

async function renderCurrentPage() {
    const data = await loadData();
    if (!data) return;

    if (document.getElementById('experience-list')) {
        renderExperience(data.experience || []);
    }

    if (document.getElementById('projects-list')) {
        renderProjects(data.projects || []);
    }

    if (document.getElementById('docs-list')) {
        renderDocsList(data.docs || []);
    }

    if (document.getElementById('single-doc-content')) {
        renderSingleDoc(data.docs || []);
    }

    if (document.getElementById('blog-posts')) {
        renderBlogPosts();
    }
}

function renderExperience(list) {
    const container = document.getElementById('experience-list');
    if (!container) return;
    if (list.length === 0) {
        container.innerHTML = '<p>' + t('error') + '</p>';
        return;
    }

    container.innerHTML = list.map(item => {
        const role = getText(item.role);
        const company = getText(item.company);
        const period = getText(item.period);
        const desc = getText(item.description);
        const achievements = (item.achievements || []).map(a => `<li>${getText(a)}</li>`).join('');
        const tech = (item.tech || []).join(', ');

        return `
            <article>
                <h3>${role} - ${company}</h3>
                <p><strong>${t('period_label')}</strong> ${period}</p>
                <p>${desc}</p>
                ${achievements ? `<h4>${t('achievements_label')}</h4><ul>${achievements}</ul>` : ''}
                ${tech ? `<p><strong>${t('tech_label')}</strong> ${tech}</p>` : ''}
                <hr>
            </article>
        `;
    }).join('');
}

function renderProjects(list) {
    const container = document.getElementById('projects-list');
    if (!container) return;
    if (list.length === 0) {
        container.innerHTML = '<p>' + t('error') + '</p>';
        return;
    }

    container.innerHTML = list.map(item => {
        const title = getText(item.title);
        const status = item.status?.text || '';
        const shortDesc = getText(item.shortDescription);
        const fullDesc = getText(item.fullDescription);
        const features = (item.features?.[state.lang] || item.features?.['en'] || item.features?.['pt'] || [])
            .map(f => `<li>${f}</li>`).join('');
        const tech = (item.tech || []).join(', ');

        const links = [];
        if (item.githubUrl) links.push(`<a href="${item.githubUrl}" target="_blank">${t('code_link')}</a>`);
        if (item.siteUrl) links.push(`<a href="${item.siteUrl}" target="_blank">${t('site_link')}</a>`);
        if (item.videoUrl) links.push(`<a href="${item.videoUrl}" target="_blank">${t('video_link')}</a>`);

        return `
            <article>
                <h3>${title}</h3>
                ${status ? `<p><strong>${t('status_label')}</strong> ${status}</p>` : ''}
                <p>${fullDesc || shortDesc}</p>
                ${features ? `<h4>${t('features_label')}</h4><ul>${features}</ul>` : ''}
                ${tech ? `<p><strong>${t('tech_label')}</strong> ${tech}</p>` : ''}
                ${links.length > 0 ? `<p>${links.join(' | ')}</p>` : ''}
                <hr>
            </article>
        `;
    }).join('');
}

function renderDocsList(list) {
    const container = document.getElementById('docs-list');
    if (!container) return;

    container.innerHTML = list.map(item => {
        const title = getText(item.title);
        const category = item.category || 'General';
        const link = item.url || (item.slug ? `doc.html?slug=${item.slug}` : '#');
        const targetAttr = item.url ? 'target="_blank" rel="noopener noreferrer"' : '';

        return `
            <article>
                <h3>${title}</h3>
                <p><strong>Categoria:</strong> ${category}</p>
                <p><a href="${link}" ${targetAttr}>${t('read_more')}</a></p>
                <hr>
            </article>
        `;
    }).join('');
}

function renderSingleDoc(list) {
    const container = document.getElementById('single-doc-content');
    if (!container) return;

    const params = new URLSearchParams(window.location.search);
    let slug = params.get('slug');
    if (!slug && list.length > 0) {
        slug = list[0].slug;
    }
    const doc = list.find(d => d.slug === slug);

    if (!doc) {
        container.innerHTML = `<p>${t('doc_not_found')}</p><p><a href="docs.html">${t('back_docs')}</a></p>`;
        return;
    }

    const title = getText(doc.title);
    const content = getText(doc.content);

    let htmlContent = '';
    if (typeof marked !== 'undefined' && marked.parse) {
        htmlContent = marked.parse(content);
    } else {
        htmlContent = `<pre style="white-space: pre-wrap; font-family: inherit;">${content}</pre>`;
    }

    container.innerHTML = `
        <article>
            <p><a href="docs.html">${t('back_docs')}</a></p>
            <h2>${title}</h2>
            <p><strong>Categoria:</strong> ${doc.category || 'General'}</p>
            <hr>
            <div>${htmlContent}</div>
        </article>
    `;
}

function formatMarkdown(text) {
    if (!text) return '';
    let html = text.replace(/\r\n/g, '\n');

    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/(?<!\*)\*(?!\*)(.*?)(?<!\*)\*(?!\*)/g, '<em>$1</em>');
    html = html.replace(/_([^_]+)_/g, '<em>$1</em>');

    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, txt, url) => {
        const href = /^https?:\/\//i.test(url) ? url : `https://${url}`;
        return `<a href="${href}" target="_blank" rel="noopener noreferrer">${txt}</a>`;
    });

    const blocks = html.split(/\n{2,}/);
    return blocks.map(block => {
        block = block.trim();
        if (!block) return '';
        const lines = block.split('\n');

        if (lines.length > 0 && lines.every(l => /^\d+\.\s+/.test(l))) {
            return `<ol>${lines.map(l => `<li>${l.replace(/^\d+\.\s+/, '')}</li>`).join('')}</ol>`;
        }
        if (lines.length > 0 && lines.every(l => /^[-*]\s+/.test(l))) {
            return `<ul>${lines.map(l => `<li>${l.replace(/^[-*]\s+/, '')}</li>`).join('')}</ul>`;
        }

        return `<p>${block.replace(/\n/g, '<br>')}</p>`;
    }).join('');
}

const translationCache = new Map();

async function translateText(text, targetLang) {
    if (!text || targetLang === 'en') return text;
    const cacheKey = `${targetLang}:${text}`;
    if (translationCache.has(cacheKey)) return translationCache.get(cacheKey);

    try {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
        const res = await fetch(url);
        if (!res.ok) return text;
        const data = await res.json();
        const translated = (data[0] || []).map(item => item[0]).join('') || text;
        translationCache.set(cacheKey, translated);
        return translated;
    } catch {
        return text;
    }
}

async function renderBlogPosts() {
    const container = document.getElementById('blog-posts');
    if (!container) return;

    try {
        const res = await fetch('https://api.github.com/repos/AfonsoPaiva/Portfolio/events', { cache: 'no-store' });
        if (!res.ok) throw new Error('API error');
        const events = await res.json();

        const seen = new Set();
        const posts = [];

        for (const ev of events) {
            if (ev.type === 'DiscussionEvent' && ev.payload?.discussion) {
                const disc = ev.payload.discussion;
                if (!seen.has(disc.id)) {
                    seen.add(disc.id);
                    posts.push(disc);
                }
            }
        }

        if (posts.length === 0) {
            container.innerHTML = `<p>${t('blog_empty')}</p>`;
            return;
        }

        const lang = state.lang;
        const rendered = await Promise.all(posts.map(async post => {
            const title = (lang === 'pt') ? await translateText(post.title, 'pt') : post.title;
            const body = (lang === 'pt') ? await translateText(post.body, 'pt') : post.body;
            const date = new Date(post.created_at).toLocaleDateString(lang === 'pt' ? 'pt-PT' : 'en-GB');

            return `
                <article>
                    <h2>${title}</h2>
                    <p><em>${date}</em></p>
                    <div>${formatMarkdown(body)}</div>
                    <hr>
                </article>
            `;
        }));

        container.innerHTML = rendered.join('');

    } catch (err) {
        console.error(err);
        container.innerHTML = `<p>${t('error')}</p>`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    applyLanguage();
});
