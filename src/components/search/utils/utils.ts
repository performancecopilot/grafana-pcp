import DOMPurify from 'dompurify';

const stripHtml = (html: string) => {
    const fragment = DOMPurify.sanitize(html, {
        ALLOWED_TAGS: [],
        ALLOWED_ATTR: [],
        RETURN_DOM_FRAGMENT: true,
    });
    return fragment.textContent || '';
};

export { stripHtml };
