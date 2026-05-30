// ── 主题配色 ──────────────────────────────────────────────────

export const themes = {
  dark: {
    bg: '#21252b',
    text: '#abb2bf',
    textSecondary: '#7f848e',
    border: '#434343',
    hover: '#2c313a',
    accent: '#61afef',
    headerBg: '#282c34',
    variableBg: '#2c313a',
    fieldColor: '#61afef',
    methodColor: '#c678dd',
    typeColor: '#e5c07b',
    scrollThumb: '#4b5263',
  },
  light: {
    bg: '#ffffff',
    text: '#333333',
    textSecondary: '#888888',
    border: '#d9d9d9',
    hover: '#f0f0f0',
    accent: '#1677ff',
    headerBg: '#fafafa',
    variableBg: '#f5f5f5',
    fieldColor: '#1677ff',
    methodColor: '#722ed1',
    typeColor: '#d48806',
    scrollThumb: '#c1c1c1',
  },
} as const;

export interface ThemeColors {
  bg: string;
  text: string;
  textSecondary: string;
  border: string;
  hover: string;
  accent: string;
  headerBg: string;
  variableBg: string;
  fieldColor: string;
  methodColor: string;
  typeColor: string;
  scrollThumb: string;
}

// ── 滚动条 + 拖拽全局样式注入 ──────────────────────────────────

export const SCROLL_CLASS = 'se-type-panel-scroll';
const STYLE_ID = 'script-engine-type-panel-style';

export function ensureScrollbarStyle() {
  if (typeof document === 'undefined') return;
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    .${SCROLL_CLASS}::-webkit-scrollbar { width: 6px; }
    .${SCROLL_CLASS}::-webkit-scrollbar-thumb { background: #4b5263; border-radius: 3px; }
    .${SCROLL_CLASS}::-webkit-scrollbar-track { background: transparent; }
    body.se-panel-resizing { cursor: col-resize !important; user-select: none !important; }
    body.se-panel-resizing * { cursor: col-resize !important; user-select: none !important; }
    .se-desc-tip p { margin: 0 0 4px 0; }
    .se-desc-tip p:last-child { margin-bottom: 0; }
    .se-desc-tip code { font-family: Menlo, Consolas, monospace; font-size: 11px; }
  `;
  document.head.appendChild(style);
}
