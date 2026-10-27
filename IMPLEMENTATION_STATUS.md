@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

:root {
  --bg: #f5f4f2;
  --panel: #ffffff;
  --panel-soft: #f0efee;
  --sidebar: #f5f3f1;
  --border: rgba(15, 23, 42, 0.08);
  --text: #1f2427;
  --muted: #6b7280;
  --accent: #14171b;
  --accent-soft: rgba(20, 23, 27, 0.08);
  --hover: rgba(17, 24, 39, 0.04);
  --shadow: 0 16px 36px rgba(15, 23, 42, 0.08);
}

* {
  box-sizing: border-box;
}

html,
body,
#root {
  margin: 0;
  min-height: 100%;
  font-family: 'Inter', sans-serif;
  background: var(--bg);
  color: var(--text);
}

body {
  min-height: 100vh;
}

button,
input,
select,
textarea {
  font: inherit;
}

button {
  cursor: pointer;
}

.app-shell {
  display: flex;
  min-height: 100vh;
  background: linear-gradient(180deg, #f4f3f0 0%, #faf9f7 100%);
}

.sidebar {
  width: 300px;
  padding: 20px 14px 18px;
  background: var(--sidebar);
  border-right: 1px solid var(--border);
  transition: width 0.2s ease;
}

.sidebar.collapsed {
  width: 72px;
}

.sidebar.collapsed .sidebar-section,
.sidebar.collapsed .section-label,
.sidebar.collapsed .page-row,
.sidebar.collapsed h2,
.sidebar.collapsed .primary-button,
.sidebar.collapsed .page-stack,
.sidebar.collapsed .page-tree {
  display: none;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.eyebrow {
  margin: 0 0 4px;
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--muted);
}

.sidebar-header h2 {
  margin: 0;
  font-size: 1.1rem;
}

.icon-button,
.ghost-button,
.primary-button,
.nav-item,
.page-row,
.crumb,
.database-link,
.table-actions button,
.linked-page-chip,
.add-block-button {
  border: none;
  background: transparent;
  color: inherit;
}

.icon-button {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: var(--panel);
  border: 1px solid var(--border);
}

.primary-button {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--accent);
  color: #fff;
  padding: 11px 12px;
  border-radius: 10px;
  font-weight: 600;
  margin-bottom: 18px;
}

.sidebar-section {
  margin-bottom: 18px;
}

.section-label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--muted);
  margin-bottom: 8px;
}

.search-input {
  width: 100%;
  border: 1px solid var(--border);
  background: rgba(255, 255, 255, 0.6);
  border-radius: 10px;
  padding: 10px 12px;
  outline: none;
}

.page-stack,
.page-tree {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.nav-item,
.page-row {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  text-align: left;
  padding: 8px 10px;
  border-radius: 8px;
  color: var(--text);
  transition: background 0.15s ease;
}

.nav-item:hover,
.page-row:hover,
.crumb:hover,
.database-link:hover,
.table-actions button:hover,
.linked-page-chip:hover,
.add-block-button:hover,
.ghost-button:hover,
.icon-button:hover {
  background: var(--hover);
}

.nav-item.active,
.page-row.active {
  background: var(--accent-soft);
  font-weight: 600;
}

.page-node {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.page-children {
  margin-left: 12px;
  border-left: 1px solid var(--border);
  padding-left: 8px;
}

.star {
  margin-left: auto;
  color: #fbbf24;
}

.content-panel {
  flex: 1;
  padding: 24px 28px 40px;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
}

.breadcrumbs {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  padding: 8px 6px;
}

.crumb {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border-radius: 8px;
  padding: 4px 6px;
  color: var(--muted);
}

.topbar-actions {
  display: flex;
  gap: 10px;
}

.ghost-button {
  background: var(--panel);
  border: 1px solid var(--border);
  padding: 8px 12px;
  border-radius: 10px;
  color: var(--text);
}

.editor-surface,
.database-panel {
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid var(--border);
  border-radius: 18px;
  box-shadow: var(--shadow);
}

.editor-surface {
  padding: 22px 28px 26px;
}

.page-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.icon-picker {
  width: 48px;
  height: 48px;
  font-size: 1.7rem;
  border-radius: 14px;
  background: var(--panel-soft);
  border: 1px solid var(--border);
}

.page-title {
  flex: 1;
  border: none;
  font-size: clamp(2rem, 3vw, 2.8rem);
  font-weight: 700;
  background: transparent;
  color: var(--text);
  outline: none;
}

.metadata-row {
  display: flex;
  gap: 16px;
  color: var(--muted);
  font-size: 0.85rem;
  margin-bottom: 18px;
}

.page-editor {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 880px;
}

.block-wrap {
  position: relative;
}

.block-input {
  width: 100%;
  min-height: 54px;
  resize: none;
  border: 1px solid transparent;
  border-radius: 12px;
  background: transparent;
  padding: 12px 14px;
  line-height: 1.6;
  color: var(--text);
  outline: none;
}

.block-input:hover {
  background: rgba(17, 24, 39, 0.01);
}

.block-input:focus {
  border-color: rgba(17, 24, 39, 0.12);
  background: rgba(255, 255, 255, 0.8);
}

.block-input.heading-one {
  font-size: 2.1rem;
  font-weight: 700;
  min-height: 64px;
}

.block-input[data-type='quote'] {
  border-left: 3px solid rgba(20, 23, 27, 0.3);
  background: rgba(17, 24, 39, 0.02);
  padding-left: 20px;
}

.block-input[data-type='code'],
.block-input.code-block {
  border: 1px solid var(--border);
  background: #171b21;
  color: #e5e7eb;
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  font-size: 0.9rem;
}

.checklist-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.checklist-row input {
  width: 18px;
  height: 18px;
  accent-color: #111827;
}

.divider-block {
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, rgba(17, 24, 39, 0.12), rgba(17, 24, 39, 0.06), rgba(17, 24, 39, 0.12));
  margin: 18px 0;
}

.link-preview {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 6px;
  padding-left: 4px;
}

.linked-page-chip,
.unlinked-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8rem;
  background: rgba(17, 24, 39, 0.05);
  border: 1px solid var(--border);
  border-radius: 999px;
  padding: 5px 10px;
}

.slash-command-menu {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  position: relative;
  margin-top: 10px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 10px;
  box-shadow: var(--shadow);
  max-width: 520px;
}

.slash-command-menu button {
  border: none;
  background: #f7f7f6;
  border-radius: 10px;
  padding: 7px 10px;
  font-size: 0.8rem;
}

.add-block-button {
  align-self: flex-start;
  margin-top: 8px;
  background: rgba(17, 24, 39, 0.04);
  padding: 10px 12px;
  border-radius: 10px;
  color: var(--text);
}

.database-panel {
  margin-top: 20px;
  padding: 18px 22px 10px;
}

.database-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 14px;
}

.database-header h3 {
  margin: 0;
}

.database-controls {
  display: flex;
  gap: 10px;
}

.database-controls select {
  border: 1px solid var(--border);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.8);
  padding: 8px 10px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead th {
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--muted);
  text-align: left;
  padding: 10px 12px;
  border-bottom: 1px solid var(--border);
}

tbody td {
  padding: 12px;
  border-bottom: 1px solid var(--border);
}

.database-link {
  font-weight: 600;
  color: var(--text);
}

.table-actions {
  display: flex;
  gap: 8px;
}

.table-actions button {
  color: var(--muted);
  padding: 6px 8px;
  border-radius: 8px;
}

.empty-shell {
  display: grid;
  place-items: center;
  min-height: 100vh;
  font-size: 1.1rem;
  color: var(--muted);
}

@media (max-width: 840px) {
  .app-shell {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid var(--border);
  }

  .content-panel {
    padding: 18px 16px 24px;
  }

  .topbar {
    flex-direction: column;
    align-items: flex-start;
  }

  .database-header {
    flex-direction: column;
    align-items: flex-start;
  }
}
