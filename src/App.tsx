import { useEffect, useMemo, useRef, useState } from 'react';

type BlockType =
  | 'paragraph'
  | 'heading1'
  | 'heading2'
  | 'bullet'
  | 'numbered'
  | 'checklist'
  | 'quote'
  | 'code'
  | 'divider';

type Block = {
  id: string;
  type: BlockType;
  content: string;
  checked?: boolean;
};

type Page = {
  id: string;
  title: string;
  icon: string;
  parentId: string | null;
  favorite: boolean;
  blocks: Block[];
  createdAt: string;
  updatedAt: string;
};

type WorkspaceState = {
  pages: Page[];
  currentPageId: string;
};

const STORAGE_KEY = 'notion-replica-v1';

const makeId = () => `${Math.random().toString(36).slice(2, 9)}-${Date.now().toString(36)}`;

const createBlock = (type: BlockType = 'paragraph', content = ''): Block => ({
  id: makeId(),
  type,
  content,
  ...(type === 'checklist' ? { checked: false } : {}),
});

const getDefaultPages = (): Page[] => {
  const now = new Date().toISOString();

  return [
    {
      id: 'welcome',
      title: 'Welcome',
      icon: '✨',
      parentId: null,
      favorite: true,
      blocks: [
        createBlock('heading1', 'Workspace overview'),
        createBlock('paragraph', 'Capture ideas, organize notes, and structure projects in one calm writing space.'),
        createBlock('bullet', 'Create nested pages for projects and teams'),
        createBlock('bullet', 'Use slash commands to add headings, quotes, and code blocks'),
        createBlock('checklist', 'Review the weekly plan'),
        createBlock('quote', 'Good systems turn scattered thinking into a practical workspace.'),
        createBlock('code', 'npm run dev'),
      ],
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'roadmap',
      title: 'Roadmap',
      icon: '🗺️',
      parentId: null,
      favorite: true,
      blocks: [
        createBlock('heading2', 'Q4 priorities'),
        createBlock('numbered', 'Finish high-signal writing workspace'),
        createBlock('numbered', 'Ship nested page navigation'),
        createBlock('numbered', 'Implement searchable database view'),
      ],
      createdAt: now,
      updatedAt: now,
    },
  ];
};

const readWorkspace = (): WorkspaceState => {
  if (typeof window === 'undefined') {
    const pages = getDefaultPages();
    return { pages, currentPageId: pages[0].id };
  }

  try {
    const rawValue = window.localStorage.getItem(STORAGE_KEY);
    if (!rawValue) {
      const pages = getDefaultPages();
      return { pages, currentPageId: pages[0].id };
    }

    const parsed = JSON.parse(rawValue) as Partial<WorkspaceState>;
    if (!Array.isArray(parsed.pages) || parsed.pages.length === 0) {
      const pages = getDefaultPages();
      return { pages, currentPageId: pages[0].id };
    }

    const pages = parsed.pages as Page[];
    return { pages, currentPageId: parsed.currentPageId ?? pages[0].id };
  } catch {
    const pages = getDefaultPages();
    return { pages, currentPageId: pages[0].id };
  }
};

const formatUpdated = (value: string): string =>
  new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value));

export default function App() {
  const workspace = useMemo(() => readWorkspace(), []);
  const [pages, setPages] = useState<Page[]>(workspace.pages);
  const [currentPageId, setCurrentPageId] = useState(workspace.currentPageId);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [recentPages, setRecentPages] = useState<string[]>([]);
  const [tableSort, setTableSort] = useState<'updated' | 'title' | 'status'>('updated');
  const [tableFilter, setTableFilter] = useState<'all' | 'favorite' | 'active'>('all');
  const textRefs = useRef<Record<string, HTMLTextAreaElement | null>>({});

  const currentPage = useMemo(
    () => pages.find((page) => page.id === currentPageId) ?? pages[0],
    [pages, currentPageId],
  );

  useEffect(() => {
    if (!currentPage && pages.length > 0) {
      setCurrentPageId(pages[0].id);
    }
  }, [currentPage, pages]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ pages, currentPageId }));
    }
  }, [pages, currentPageId]);

  useEffect(() => {
    if (!currentPage) return;
    setRecentPages((existing) => [currentPage.id, ...existing.filter((id) => id !== currentPage.id)].slice(0, 6));
  }, [currentPage]);

  const updatePage = (pageId: string, updates: Partial<Page>) => {
    setPages((previousPages) =>
      previousPages.map((page) =>
        page.id === pageId
          ? {
              ...page,
              ...updates,
              updatedAt: new Date().toISOString(),
            }
          : page,
      ),
    );
  };

  const updateBlock = (pageId: string, blockId: string, nextValue: string) => {
    setPages((previousPages) =>
      previousPages.map((page) => {
        if (page.id !== pageId) return page;

        return {
          ...page,
          blocks: page.blocks.map((block) =>
            block.id === blockId
              ? {
                  ...block,
                  content: nextValue,
                }
              : block,
          ),
          updatedAt: new Date().toISOString(),
        };
      }),
    );
  };

  const toggleChecklist = (pageId: string, blockId: string) => {
    setPages((previousPages) =>
      previousPages.map((page) => {
        if (page.id !== pageId) return page;

        return {
          ...page,
          blocks: page.blocks.map((block) =>
            block.id === blockId
              ? {
                  ...block,
                  checked: !Boolean(block.checked),
                }
              : block,
          ),
          updatedAt: new Date().toISOString(),
        };
      }),
    );
  };

  const insertBlockAfter = (pageId: string, targetId: string | null, type: BlockType = 'paragraph', content = '') => {
    const nextBlock = createBlock(type, content);

    setPages((previousPages) =>
      previousPages.map((page) => {
        if (page.id !== pageId) return page;

        const nextBlocks = [...page.blocks];
        if (targetId) {
          const index = nextBlocks.findIndex((block) => block.id === targetId);
          if (index >= 0) {
            nextBlocks.splice(index + 1, 0, nextBlock);
          } else {
            nextBlocks.push(nextBlock);
          }
        } else {
          nextBlocks.push(nextBlock);
        }

        return {
          ...page,
          blocks: nextBlocks,
          updatedAt: new Date().toISOString(),
        };
      }),
    );

    requestAnimationFrame(() => {
      textRefs.current[nextBlock.id]?.focus();
    });
  };

  const createNewPage = (parentId: string | null = null) => {
    const nextTitle = `Untitled ${pages.length + 1}`;
    const createdPage: Page = {
      id: makeId(),
      title: nextTitle,
      icon: '📄',
      parentId,
      favorite: false,
      blocks: [createBlock('heading1', nextTitle), createBlock('paragraph', 'Write something brilliant...')],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setPages((previousPages) => [...previousPages, createdPage]);
    setCurrentPageId(createdPage.id);
  };

  const duplicatePage = (pageId: string) => {
    const source = pages.find((page) => page.id === pageId);
    if (!source) return;

    const duplicated: Page = {
      ...source,
      id: makeId(),
      title: `${source.title} copy`,
      blocks: source.blocks.map((block) => ({ ...block, id: makeId() })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      favorite: false,
    };

    setPages((previousPages) => [...previousPages, duplicated]);
    setCurrentPageId(duplicated.id);
  };

  const deletePage = (pageId: string) => {
    if (pages.length <= 1) {
      setPages((previousPages) =>
        previousPages.map((page) =>
          page.id === pageId
            ? {
                ...page,
                title: 'Untitled page',
                blocks: [createBlock('paragraph', 'Start writing...')],
              }
            : page,
        ),
      );
      return;
    }

    const remainingPages = pages.filter((page) => page.id !== pageId);
    setPages(remainingPages);
    setCurrentPageId(remainingPages[0].id);
  };

  const toggleFavorite = (pageId: string) => {
    const current = pages.find((page) => page.id === pageId);
    if (!current) return;
    updatePage(pageId, { favorite: !current.favorite });
  };

  const filteredPages = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return pages;

    return pages.filter((page) => {
      const titleMatch = page.title.toLowerCase().includes(query);
      const contentMatch = page.blocks.some((block) => block.content.toLowerCase().includes(query));
      return titleMatch || contentMatch;
    });
  }, [pages, searchTerm]);

  const tableRows = useMemo(() => {
    const rows = [...pages].filter((page) => {
      if (tableFilter === 'favorite') return page.favorite;
      if (tableFilter === 'active') return !page.favorite;
      return true;
    });

    rows.sort((left, right) => {
      if (tableSort === 'title') return left.title.localeCompare(right.title);
      if (tableSort === 'status') return Number(right.favorite) - Number(left.favorite);
      return new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime();
    });

    return rows;
  }, [pages, tableSort, tableFilter]);

  if (!currentPage) {
    return <div className="empty-shell">Loading workspace…</div>;
  }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <div>
            <p className="eyebrow">Workspace</p>
            <h2>Notion Replica</h2>
          </div>
          <button type="button" className="icon-button" onClick={() => setSidebarCollapsed((value) => !value)}>
            {sidebarCollapsed ? '→' : '←'}
          </button>
        </div>

        <button type="button" className="primary-button" onClick={() => createNewPage()}>
          + New page
        </button>

        <div className="sidebar-section">
          <div className="section-label">Search</div>
          <input
            className="search-input"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search pages or notes"
          />
        </div>

        <div className="sidebar-section">
          <div className="section-label">Favorites</div>
          <div className="page-stack">
            {pages.filter((page) => page.favorite).map((page) => (
              <button
                key={page.id}
                type="button"
                className={`nav-item ${currentPageId === page.id ? 'active' : ''}`}
                onClick={() => setCurrentPageId(page.id)}
              >
                <span>{page.icon}</span>
                {page.title}
              </button>
            ))}
          </div>
        </div>

        <div className="sidebar-section">
          <div className="section-label">Recent</div>
          <div className="page-stack">
            {recentPages
              .map((pageId) => pages.find((page) => page.id === pageId))
              .filter((page): page is Page => Boolean(page))
              .map((page) => (
                <button
                  key={page.id}
                  type="button"
                  className={`nav-item ${currentPageId === page.id ? 'active' : ''}`}
                  onClick={() => setCurrentPageId(page.id)}
                >
                  <span>{page.icon}</span>
                  {page.title}
                </button>
              ))}
          </div>
        </div>

        <div className="sidebar-section">
          <div className="section-label">Pages</div>
          <div className="page-tree">
            {pages
              .filter((page) => page.parentId === null)
              .map((page) => (
                <div key={page.id} className="page-node">
                  <button
                    type="button"
                    className={`page-row ${currentPageId === page.id ? 'active' : ''}`}
                    onClick={() => setCurrentPageId(page.id)}
                  >
                    <span>{page.icon}</span>
                    <span>{page.title}</span>
                    {page.favorite ? <span className="star">★</span> : null}
                  </button>
                </div>
              ))}
          </div>
        </div>
      </aside>

      <main className="content-panel">
        <header className="topbar">
          <nav className="breadcrumbs" aria-label="Breadcrumbs">
            <button type="button" className="crumb" onClick={() => setCurrentPageId(currentPage.id)}>
              {currentPage.title}
            </button>
          </nav>

          <div className="topbar-actions">
            <button type="button" className="ghost-button" onClick={() => createNewPage(currentPage.id)}>
              + Child page
            </button>
            <button type="button" className="ghost-button" onClick={() => toggleFavorite(currentPage.id)}>
              {currentPage.favorite ? '★ Favorite' : '☆ Favorite'}
            </button>
          </div>
        </header>

        <div className="editor-surface">
          <div className="page-header">
            <button
              type="button"
              className="icon-picker"
              onClick={() =>
                updatePage(currentPage.id, {
                  icon: window.prompt('Choose an icon', currentPage.icon) ?? currentPage.icon,
                })
              }
            >
              {currentPage.icon}
            </button>
            <input
              className="page-title"
              value={currentPage.title}
              onChange={(event) => updatePage(currentPage.id, { title: event.target.value || 'Untitled page' })}
            />
          </div>

          <div className="metadata-row">
            <span>Updated {formatUpdated(currentPage.updatedAt)}</span>
            <span>{currentPage.blocks.length} blocks</span>
          </div>

          <div className="page-editor">
            {currentPage.blocks.map((block) => (
              <div key={block.id} className="block-wrap">
                {block.type === 'divider' ? (
                  <div className="divider-block" aria-label="Divider block" />
                ) : block.type === 'checklist' ? (
                  <div className="checklist-row">
                    <input
                      type="checkbox"
                      checked={Boolean(block.checked)}
                      onChange={() => toggleChecklist(currentPage.id, block.id)}
                    />
                    <textarea
                      ref={(element) => {
                        textRefs.current[block.id] = element;
                      }}
                      value={block.content}
                      onChange={(event) => updateBlock(currentPage.id, block.id, event.target.value)}
                      className="block-input"
                      data-type={block.type}
                    />
                  </div>
                ) : (
                  <textarea
                    ref={(element) => {
                      textRefs.current[block.id] = element;
                    }}
                    value={block.content}
                    onChange={(event) => updateBlock(currentPage.id, block.id, event.target.value)}
                    className={`block-input ${block.type === 'heading1' ? 'heading-one' : ''}`}
                    data-type={block.type}
                  />
                )}
              </div>
            ))}

            <button
              type="button"
              className="add-block-button"
              onClick={() => insertBlockAfter(currentPage.id, currentPage.blocks[currentPage.blocks.length - 1]?.id ?? null, 'paragraph')}
            >
              + Add block
            </button>
          </div>
        </div>

        <section className="database-panel">
          <div className="database-header">
            <div>
              <p className="eyebrow">Database</p>
              <h3>Page index</h3>
            </div>
            <div className="database-controls">
              <select value={tableFilter} onChange={(event) => setTableFilter(event.target.value as 'all' | 'favorite' | 'active')}>
                <option value="all">All</option>
                <option value="favorite">Favorites</option>
                <option value="active">Active</option>
              </select>
              <select value={tableSort} onChange={(event) => setTableSort(event.target.value as 'updated' | 'title' | 'status')}>
                <option value="updated">Updated</option>
                <option value="title">Title</option>
                <option value="status">Status</option>
              </select>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tableRows.map((page) => (
                <tr key={page.id}>
                  <td>
                    <button type="button" className="database-link" onClick={() => setCurrentPageId(page.id)}>
                      {page.icon} {page.title}
                    </button>
                  </td>
                  <td>{page.favorite ? 'Favorite' : 'Active'}</td>
                  <td>{formatUpdated(page.updatedAt)}</td>
                  <td className="table-actions">
                    <button type="button" onClick={() => duplicatePage(page.id)}>
                      Duplicate
                    </button>
                    <button type="button" onClick={() => deletePage(page.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}
