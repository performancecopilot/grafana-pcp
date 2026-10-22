import { stripHtml } from './utils';

describe('stripHtml', () => {
    test('removes search highlights and decodes entities for metric navigation', () => {
        expect(stripHtml('<b>disk</b>.dev &lt;reads&gt;')).toBe('disk.dev <reads>');
    });

    test('discards executable markup from search results', () => {
        expect(stripHtml('<b>disk</b><img src=x onerror="alert(1)"><script>alert(1)</script>.dev')).toBe('disk.dev');
    });
});
