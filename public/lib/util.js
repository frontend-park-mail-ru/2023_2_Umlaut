export function fromHTML(html, trim = true) {
    html = trim ? html : html.trim();
    if (!html) return null;

    const template = document.createElement('template');
    template.innerHTML = html;
    const result = template.content.children;

    if (result.length === 1) return result[0];
    return result;
}