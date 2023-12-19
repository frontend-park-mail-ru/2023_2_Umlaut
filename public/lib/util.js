export function fromHTML(html, trim = true) {
    html = trim ? html : html.trim();
    if (!html) return null;

    const template = document.createElement('template');
    template.innerHTML = html;
    const result = template.content.children;

    if (result.length === 1) return result[0];
    return result;
}

/**
 * Обрезает строку по подстроке и возвращает индекс конкретного по счету
 * @param {String} str - строка которую нужно обрезать
 * @param {String} pat - подстрока по которой нужно обрезать
 * @param {Int} n - номер символа индекс которого нужно вернуть
 * @return {Int} - индекс нужного символа
 */
export function nthIndex(str, pat, n) {
    const L = str.length; let i = -1;
    while (n-- && i++ < L) {
        i = str.indexOf(pat, i);
        if (i < 0) break;
    }
    return i;
}

