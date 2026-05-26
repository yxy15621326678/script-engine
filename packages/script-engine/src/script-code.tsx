import React, { useEffect, useRef, useState } from 'react';
import { Compartment, EditorState, type Extension } from '@codemirror/state';
import {
  crosshairCursor,
  drawSelection,
  dropCursor,
  EditorView,
  highlightActiveLine,
  highlightActiveLineGutter,
  highlightSpecialChars,
  keymap,
  lineNumbers,
  placeholder as cmPlaceholder,
  rectangularSelection,
} from '@codemirror/view';
import {
  defaultKeymap,
  history,
  historyKeymap,
  indentWithTab,
} from '@codemirror/commands';
import {
  bracketMatching,
  defaultHighlightStyle,
  foldGutter,
  foldKeymap,
  HighlightStyle,
  indentOnInput,
  syntaxHighlighting,
} from '@codemirror/language';
import { java } from '@codemirror/lang-java';
import { oneDark } from '@codemirror/theme-one-dark';
import { tags } from '@lezer/highlight';
import {
  autocompletion,
  completionKeymap,
} from '@codemirror/autocomplete';
import { ScriptCodeEditorProps } from './types';
import { createGroovyCompletionSource, createGroovyKeywordSource } from './autocomplete';
import { TypePanel } from './type-panel';
import { Toolbar } from './components/toolbar';
import { ExpandSidebarButton } from './components/expand-sidebar-button';

const darkHighlightStyle = HighlightStyle.define([
  { tag: tags.keyword, color: '#c678dd' },
  { tag: tags.operator, color: '#56b6c2' },
  { tag: tags.variableName, color: '#e5c07b' },
  { tag: tags.string, color: '#98c379' },
  { tag: tags.comment, color: '#5c6370', fontStyle: 'italic' },
  { tag: tags.number, color: '#d19a66' },
  { tag: tags.bool, color: '#d19a66' },
  { tag: tags.null, color: '#d19a66' },
  { tag: tags.propertyName, color: '#e06c75' },
  { tag: tags.function(tags.variableName), color: '#61afef' },
  { tag: tags.definition(tags.variableName), color: '#e5c07b' },
  { tag: tags.typeName, color: '#e5c07b' },
  { tag: tags.className, color: '#e5c07b' },
  { tag: tags.annotation, color: '#d19a66' },
]);

function buildThemeExtensions(theme: 'dark' | 'light'): Extension[] {
  const isDark = theme === 'dark';
  const exts: Extension[] = [];

  if (isDark) {
    exts.push(oneDark);
    exts.push(syntaxHighlighting(darkHighlightStyle));
  } else {
    exts.push(syntaxHighlighting(defaultHighlightStyle));
  }

  exts.push(
    EditorView.theme({
      '.cm-tooltip.cm-tooltip-autocomplete': {
        backgroundColor: isDark ? '#21252b' : '#ffffff',
        borderColor: isDark ? '#434343' : '#d9d9d9',
        borderRadius: '4px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        overflow: 'hidden',
      },
      '.cm-tooltip-autocomplete > ul > li': {
        padding: '4px 8px',
        color: isDark ? '#abb2bf' : '#333',
      },
      '.cm-tooltip-autocomplete > ul > li[aria-selected]': {
        backgroundColor: isDark ? '#2c313a' : '#e6f4ff',
        color: isDark ? '#fff' : '#000',
      },
      '.cm-completionLabel': { fontFamily: 'monospace' },
      '.cm-completionDetail': {
        color: isDark ? '#7f848e' : '#888',
        fontStyle: 'normal',
        marginLeft: '8px',
      },
      '.cm-completionInfo': {
        backgroundColor: isDark ? '#282c34' : '#fafafa',
        borderColor: isDark ? '#434343' : '#d9d9d9',
        color: isDark ? '#abb2bf' : '#333',
        padding: '6px 8px',
      },
      '.cm-completionIcon': { width: '1.2em', fontSize: '0.9em', paddingRight: '4px' },
      '.cm-completionIcon-property::after': { content: '"F"', color: '#61afef' },
      '.cm-completionIcon-function::after': { content: '"M"', color: '#c678dd' },
      '.cm-completionIcon-variable::after': { content: '"V"', color: '#e5c07b' },
      '.cm-completionIcon-keyword::after': { content: '"K"', color: '#56b6c2' },
    })
  );

  return exts;
}

function buildAutocompleteExt(metadata: ScriptCodeEditorProps['metadata']): Extension {
  return metadata
    ? autocompletion({
        override: [createGroovyCompletionSource(metadata)],
        activateOnTyping: true,
        icons: true,
      })
    : autocompletion({
        override: [createGroovyKeywordSource()],
        activateOnTyping: true,
        icons: true,
      });
}

export const ScriptCodeEditor: React.FC<ScriptCodeEditorProps> = (props) => {
  const {
    value,
    readonly = false,
    onChange,
    onCompile,
    onThemeChange,
    placeholder = '请输入 Groovy 脚本...',
    theme = 'dark',
    title,
    metadata,
    defaultSidebarOpen,
    options = {},
  } = props;

  const { fontSize = 14, minHeight = 300, maxHeight = 300 } = options;

  const editorContainerRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const themeCompartmentRef = useRef(new Compartment());
  const autocompleteCompartmentRef = useRef(new Compartment());

  // 用 ref 持有回调，避免闭包过期
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const metadataRef = useRef(metadata);
  metadataRef.current = metadata;

  // 侧边栏状态
  const [sidebarOpen, setSidebarOpen] = useState(
    defaultSidebarOpen ?? (metadata != null)
  );
  const [panelWidth, setPanelWidth] = useState(300);

  // ── 创建编辑器（仅在首次挂载和布局属性变化时） ──────────
  useEffect(() => {
    if (!editorContainerRef.current) return;

    const themeCompartment = themeCompartmentRef.current;
    const acCompartment = autocompleteCompartmentRef.current;

    const extensions: Extension[] = [
      lineNumbers(),
      highlightActiveLineGutter(),
      highlightSpecialChars(),
      history(),
      foldGutter(),
      drawSelection(),
      dropCursor(),
      EditorState.allowMultipleSelections.of(true),
      indentOnInput(),
      bracketMatching(),
      rectangularSelection(),
      crosshairCursor(),
      highlightActiveLine(),
      keymap.of([
        ...defaultKeymap,
        ...historyKeymap,
        ...foldKeymap,
        ...completionKeymap,
        indentWithTab,
      ]),
      java(),
      cmPlaceholder(placeholder),
      EditorView.updateListener.of((update) => {
        if (update.docChanged && onChangeRef.current) {
          onChangeRef.current(update.state.doc.toString());
        }
      }),
      EditorView.theme({
        '&': { fontSize: `${fontSize}px` },
        '.cm-scroller': {
          overflow: 'auto',
          minHeight: `${minHeight}px`,
          maxHeight: `${maxHeight}px`,
        },
        '.cm-content': { fontFamily: 'monospace', minHeight: `${minHeight}px` },
        '.cm-gutters': { minHeight: `${minHeight}px` },
      }),
      // 主题相关扩展放入 compartment，热更新不重建编辑器
      themeCompartment.of(buildThemeExtensions(theme)),
      // 自动补全放入 compartment
      acCompartment.of(buildAutocompleteExt(metadataRef.current)),
    ];

    if (readonly) {
      extensions.push(EditorState.readOnly.of(true));
    }

    const state = EditorState.create({ doc: value, extensions });
    const view = new EditorView({ state, parent: editorContainerRef.current });
    viewRef.current = view;

    return () => { view.destroy(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fontSize, minHeight, maxHeight, placeholder, readonly]);

  // ── 同步外部 value 变化 ──────────────────────────────────
  useEffect(() => {
    if (viewRef.current && value !== viewRef.current.state.doc.toString()) {
      viewRef.current.dispatch({
        changes: {
          from: 0,
          to: viewRef.current.state.doc.length,
          insert: value,
        },
      });
    }
  }, [value]);

  // ── theme 变化时热更新（不重建编辑器） ──────────────────
  useEffect(() => {
    if (!viewRef.current) return;
    viewRef.current.dispatch({
      effects: themeCompartmentRef.current.reconfigure(
        buildThemeExtensions(theme)
      ),
    });
  }, [theme]);

  // ── metadata 变化时热更新补全源 ──────────────────────────
  useEffect(() => {
    if (!viewRef.current) return;
    viewRef.current.dispatch({
      effects: autocompleteCompartmentRef.current.reconfigure(
        buildAutocompleteExt(metadata)
      ),
    });
  }, [metadata]);

  // ── 渲染 ──────────────────────────────────────────────────
  const isDark = theme === 'dark';
  const borderColor = isDark ? '#434343' : '#d9d9d9';
  const expandBtnBg = isDark ? '#2c313a' : '#f0f0f0';
  const expandBtnColor = isDark ? '#abb2bf' : '#666';

  const handleCompile = () => {
    if (onCompile && viewRef.current) {
      onCompile(viewRef.current.state.doc.toString());
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {/* ── 工具栏 ─────────────────────────────────────── */}
      <Toolbar
        title={title}
        theme={theme}
        onThemeChange={onThemeChange}
        onCompile={onCompile ? handleCompile : undefined}
      />

      {/* ── 编辑器 + 侧边栏 ───────────────────────────── */}
      <div
        style={{
          display: 'flex',
          border: `1px solid ${borderColor}`,
          borderTop: 'none',
          borderRadius: '0 0 6px 6px',
          overflow: 'hidden',
        }}
      >
        <div style={{ flex: 1, minWidth: 0, position: 'relative' }}>
          {metadata && !sidebarOpen && (
            <ExpandSidebarButton
              borderColor={borderColor}
              expandBtnColor={expandBtnColor}
              expandBtnBg={expandBtnBg}
              onClick={() => setSidebarOpen(true)}
            />
          )}
          <div ref={editorContainerRef} />
        </div>
        {metadata && sidebarOpen && (
          <TypePanel
            metadata={metadata}
            theme={theme}
            minHeight={minHeight}
            maxHeight={maxHeight}
            width={panelWidth}
            onWidthChange={setPanelWidth}
            onCollapse={() => setSidebarOpen(false)}
          />
        )}
      </div>
    </div>
  );
};
