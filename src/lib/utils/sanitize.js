export function sanitizeHtml(str) {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function sanitizeFileName(name) {
  if (!name) return "";
  return name.replace(/[^a-z0-9_.-]/gi, '_').toLowerCase();
}
