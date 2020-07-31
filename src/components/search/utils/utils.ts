// Use only when you trust HTML source!
const stripHtml = (html: string) => {
    const el = document.createElement('div');
    el.innerHTML = html;
    return el.textContent || el.innerText || '';
};

export { stripHtml };
