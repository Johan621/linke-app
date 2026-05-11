"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import styles from "./page.module.css";
import db from "@/lib/db";
import * as store from "@/lib/store";
import { createClient } from "@/lib/supabase/client";
import { syncData } from "@/lib/sync";

/* ─── Icons ─── */
const I = {
  search: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  plus: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  link: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>,
  folder: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>,
  trash: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
  menu: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  x: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  clip: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>,
  zap: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  cloud: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>,
  check: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  user: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  folderPlus: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/><line x1="12" y1="11" x2="12" y2="17"/><line x1="9" y1="14" x2="15" y2="14"/></svg>,
  logOut: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
};

function getDomain(url) {
  try { return new URL(url).hostname.replace("www.", ""); } catch { return url; }
}

function timeAgo(date) {
  const d = typeof date === "string" ? new Date(date) : date;
  const days = Math.floor((Date.now() - d) / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

export default function Home() {
  const [links, setLinks] = useState([]);
  const [folders, setFolders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFolder, setActiveFolder] = useState("all");
  
  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  // Form states
  const [newUrl, setNewUrl] = useState("");
  const [newTags, setNewTags] = useState("");
  const [selectedFolder, setSelectedFolder] = useState("");
  const [newFolderName, setNewFolderName] = useState("");
  
  // Auth Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  
  // App states
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [dbReady, setDbReady] = useState(false);
  const [user, setUser] = useState(null);
  
  const urlInputRef = useRef(null);
  const supabase = createClient();

  // Load Data
  const loadData = useCallback(async () => {
    const [f, l] = await Promise.all([store.getAllFolders(), store.getAllLinks()]);
    setFolders(f);
    setLinks(l);
  }, []);

  // Init
  useEffect(() => {
    async function init() {
      await store.seedDefaults();
      await loadData();
      
      // Check auth session
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        runSync();
      } else {
        setShowAuthModal(true);
      }
      
      setDbReady(true);
    }
    init();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }

    // Share target
    const params = new URLSearchParams(window.location.search);
    const sharedUrl = params.get("url") || params.get("text");
    if (sharedUrl) {
      setNewUrl(sharedUrl);
      setShowAddModal(true);
      window.history.replaceState({}, "", "/");
    }

    return () => subscription.unsubscribe();
  }, [loadData, supabase.auth]);

  const runSync = async () => {
    setIsSyncing(true);
    await syncData();
    await loadData();
    setIsSyncing(false);
  };

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  // Auth Handlers
  const handleAuth = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        showToast("Logged in successfully");
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        showToast("Account created successfully");
      }
      setShowAuthModal(false);
      setEmail("");
      setPassword("");
      runSync();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    showToast("Logged out");
  };

  // Filter
  const filteredLinks = links.filter((link) => {
    const matchFolder = activeFolder === "all" || link.folderId === activeFolder;
    if (!searchQuery) return matchFolder;
    const q = searchQuery.toLowerCase();
    return matchFolder && (
      link.title?.toLowerCase().includes(q) ||
      link.description?.toLowerCase().includes(q) ||
      link.url?.toLowerCase().includes(q) ||
      link.tags?.some((t) => t.toLowerCase().includes(q))
    );
  });

  const folderCounts = links.reduce((acc, l) => {
    const fid = l.folderId || "default";
    acc[fid] = (acc[fid] || 0) + 1;
    return acc;
  }, {});

  const getFolderName = (folderId) => {
    if (!folderId || folderId === "default") return "Uncategorized";
    const f = folders.find((x) => x.id === folderId);
    return f ? f.name : "Uncategorized";
  };

  // Add Link
  const handleAddLink = useCallback(async (e) => {
    e.preventDefault();
    if (!newUrl.trim()) return;
    setIsLoading(true);
    try {
      let url = newUrl.trim();
      if (!url.startsWith("http")) url = "https://" + url;
      
      let meta = { url, title: getDomain(url), description: "", favicon: "", preview: null };
      try {
        const res = await fetch("/api/metadata", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
        });
        if (res.ok) meta = await res.json();
      } catch { /* offline */ }

      const tags = newTags.trim() ? newTags.split(",").map((t) => t.trim()).filter(Boolean) : [];
      await store.addLink({
        url: meta.url || url,
        title: meta.title,
        description: meta.description,
        favicon: meta.favicon || `https://www.google.com/s2/favicons?domain=${getDomain(url)}&sz=64`,
        preview: meta.preview,
        folderId: selectedFolder || folders[0]?.id || "default",
        tags,
      });
      
      await loadData();
      setNewUrl("");
      setNewTags("");
      setSelectedFolder("");
      setShowAddModal(false);
      showToast("Link saved!");
      
      // Attempt sync if online
      if (user) runSync();
      
    } catch (err) {
      showToast("Failed to save link", "error");
    }
    setIsLoading(false);
  }, [newUrl, newTags, selectedFolder, folders, loadData, showToast, user]);

  const handleDeleteLink = useCallback(async (id) => {
    await store.deleteLink(id);
    if (user) {
      await supabase.from("links").delete().eq("id", id);
    }
    await loadData();
    showToast("Link removed");
    if (user) runSync();
  }, [loadData, showToast, user]);

  const handleAddFolder = useCallback(async (e) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    await store.addFolder(newFolderName.trim());
    await loadData();
    setNewFolderName("");
    setShowFolderModal(false);
    showToast("Folder created!");
    if (user) runSync();
  }, [newFolderName, loadData, showToast, user]);

  const handleDeleteFolder = useCallback(async (id) => {
    await store.deleteFolder(id);
    if (user) {
      await supabase.from("folders").delete().eq("id", id);
    }
    if (activeFolder === id) setActiveFolder("all");
    await loadData();
    showToast("Folder deleted");
    if (user) runSync();
  }, [activeFolder, loadData, showToast, user]);

  const handlePaste = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text && (text.startsWith("http") || text.includes("."))) setNewUrl(text);
    } catch {}
  }, []);

  // Keybindings
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setShowAddModal(true); }
      if (e.key === "Escape") { setShowAddModal(false); setSidebarOpen(false); setShowFolderModal(false); setShowAuthModal(false); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (showAddModal && urlInputRef.current) setTimeout(() => urlInputRef.current?.focus(), 100);
  }, [showAddModal]);

  if (!dbReady) {
    return <div className={styles.app}><div className={styles.loadingScreen}><div className={styles.logoIcon}>{I.link}</div><p>Loading Linke...</p></div></div>;
  }

  return (
    <div className={styles.app}>
      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ""}`}>
        <div className={styles.sidebarHeader}>
          <div className={styles.logo}>
            <img src="/icons/icon-192.png" alt="Linke Logo" className={styles.logoIcon} style={{ background: 'transparent', boxShadow: 'none' }} />
            <h1 className={styles.logoText}>Linke</h1>
          </div>
          <button className={styles.sidebarClose} onClick={() => setSidebarOpen(false)}>{I.x}</button>
        </div>
        <nav className={styles.sidebarNav}>
          <div className={styles.sidebarSection}>
            <div className={styles.sidebarLabelRow}>
              <span className={styles.sidebarLabel}>Folders</span>
              <button className={styles.addFolderBtn} onClick={() => setShowFolderModal(true)} title="New folder">{I.folderPlus}</button>
            </div>
            <button className={`${styles.folderItem} ${activeFolder === "all" ? styles.folderActive : ""}`} onClick={() => { setActiveFolder("all"); setSidebarOpen(false); }}>
              <span className={styles.folderIcon}>{I.folder}</span>
              <span className={styles.folderName}>All Links</span>
              <span className={styles.folderCount}>{links.length}</span>
            </button>
            {folders.map((f) => (
              <div key={f.id} className={styles.folderRow}>
                <button className={`${styles.folderItem} ${activeFolder === f.id ? styles.folderActive : ""}`} onClick={() => { setActiveFolder(f.id); setSidebarOpen(false); }}>
                  <span className={styles.folderIcon}>{I.folder}</span>
                  <span className={styles.folderName}>{f.name}</span>
                  <span className={styles.folderCount}>{folderCounts[f.id] || 0}</span>
                </button>
                <button className={styles.folderDeleteBtn} onClick={() => handleDeleteFolder(f.id)} title="Delete folder">{I.x}</button>
              </div>
            ))}
          </div>
        </nav>
        
        {/* Auth Footer */}
        <div className={styles.sidebarFooter}>
          {user ? (
            <div className={styles.authInfo}>
              <div className={styles.syncStatus} title={isSyncing ? "Syncing..." : "Cloud Synced"}>
                {isSyncing ? <span className={styles.spinner} style={{width:14, height:14, borderWidth:1}} /> : I.cloud}
                <span style={{overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '140px'}}>
                  {user.email}
                </span>
              </div>
              <button className={styles.folderDeleteBtn} onClick={handleLogout} title="Sign Out">
                {I.logOut}
              </button>
            </div>
          ) : (
            <button className={styles.loginBtn} onClick={() => setShowAuthModal(true)}>
              {I.user} Sign In to Sync
            </button>
          )}
        </div>
      </aside>

      {sidebarOpen && <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <main className={styles.main}>
        <header className={styles.header}>
          <button className={styles.menuButton} onClick={() => setSidebarOpen(true)}>{I.menu}</button>
          <div className={styles.searchContainer}>
            <span className={styles.searchIcon}>{I.search}</span>
            <input type="text" className={styles.searchInput} placeholder="Search links, tags, domains..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} id="search-input" />
            {searchQuery && <button className={styles.searchClear} onClick={() => setSearchQuery("")}>{I.x}</button>}
          </div>
          <button className={styles.addButton} onClick={() => setShowAddModal(true)} id="add-link-button">
            {I.plus}<span className={styles.addButtonText}>Add Link</span><kbd className={styles.kbd}>⌘K</kbd>
          </button>
        </header>

        <div className={styles.pageHeader}>
          <h2 className={styles.pageTitle}>
            {activeFolder === "all" ? "All Links" : getFolderName(activeFolder)}
            <span className={styles.pageTitleCount}>{filteredLinks.length}</span>
          </h2>
        </div>

        {filteredLinks.length > 0 ? (
          <div className={styles.linkGrid}>
            {filteredLinks.map((link, i) => (
              <article key={link.id} className={styles.linkCard} style={{ animationDelay: `${i * 50}ms` }}>
                <div className={styles.cardHeader}>
                  <div className={styles.cardFavicon}>
                    <img src={link.favicon || `https://www.google.com/s2/favicons?domain=${getDomain(link.url)}&sz=64`} alt="" width={20} height={20} onError={(e) => { e.target.style.display = "none"; }} />
                  </div>
                  <span className={styles.cardDomain}>{getDomain(link.url)}</span>
                  <span className={styles.cardFolder}>{getFolderName(link.folderId)}</span>
                  <div className={styles.cardActions}>
                    <button className={styles.deleteButton} onClick={() => handleDeleteLink(link.id)} title="Delete">{I.trash}</button>
                  </div>
                </div>
                <a href={link.url} target="_blank" rel="noopener noreferrer" className={styles.cardBody}>
                  <h3 className={styles.cardTitle}>{link.title}</h3>
                  {link.description && <p className={styles.cardDescription}>{link.description}</p>}
                </a>
                <div className={styles.cardFooter}>
                  <div className={styles.cardTags}>
                    {link.tags?.map((tag) => <span key={tag} className={styles.tagPill}>{tag}</span>)}
                  </div>
                  <span className={styles.cardDate}>{timeAgo(link.createdAt)}</span>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>{I.link}</div>
            <h3>{searchQuery ? "No links found" : "No links yet"}</h3>
            <p>{searchQuery ? "Try a different search term" : "Paste a URL to save your first link"}</p>
            {!searchQuery && <button className={styles.emptyAction} onClick={() => setShowAddModal(true)}>{I.plus} Add your first link</button>}
          </div>
        )}
      </main>

      {/* Add Link Modal */}
      {showAddModal && (
        <div className={styles.modalOverlay} onClick={() => setShowAddModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>{I.zap} Save a Link</h3>
              <button onClick={() => setShowAddModal(false)}>{I.x}</button>
            </div>
            <form onSubmit={handleAddLink} className={styles.modalForm}>
              <div className={styles.urlInputWrapper}>
                <input ref={urlInputRef} type="text" className={styles.urlInput} placeholder="Paste any URL..." value={newUrl} onChange={(e) => setNewUrl(e.target.value)} id="url-input" />
                <button type="button" className={styles.pasteButton} onClick={handlePaste} title="Paste">{I.clip}</button>
              </div>
              <div className={styles.formRow}>
                <select className={styles.folderSelect} value={selectedFolder} onChange={(e) => setSelectedFolder(e.target.value)}>
                  <option value="">Select folder...</option>
                  {folders.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
                </select>
              </div>
              <div className={styles.urlInputWrapper}>
                <input type="text" className={styles.urlInput} placeholder="Tags (comma-separated)..." value={newTags} onChange={(e) => setNewTags(e.target.value)} />
              </div>
              <p className={styles.modalHint}>Title, description & preview will be auto-fetched from the URL.</p>
              <button type="submit" className={styles.saveButton} disabled={!newUrl.trim() || isLoading}>
                {isLoading ? <span className={styles.spinner} /> : <>{I.check} Save Link</>}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Folder Modal */}
      {showFolderModal && (
        <div className={styles.modalOverlay} onClick={() => setShowFolderModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>{I.folderPlus} New Folder</h3>
              <button onClick={() => setShowFolderModal(false)}>{I.x}</button>
            </div>
            <form onSubmit={handleAddFolder} className={styles.modalForm}>
              <div className={styles.urlInputWrapper}>
                <input type="text" className={styles.urlInput} placeholder="Folder name..." value={newFolderName} onChange={(e) => setNewFolderName(e.target.value)} autoFocus />
              </div>
              <button type="submit" className={styles.saveButton} disabled={!newFolderName.trim()}>
                {I.check} Create Folder
              </button>
            </form>
          </div>
        </div>
      )}
      
      {/* Auth Modal */}
      {showAuthModal && (
        <div className={styles.modalOverlay} onClick={() => setShowAuthModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>{I.user} {isLogin ? "Sign In" : "Create Account"}</h3>
              <button onClick={() => setShowAuthModal(false)}>{I.x}</button>
            </div>
            <form onSubmit={handleAuth} className={styles.modalForm}>
              <div className={styles.formRow}>
                <div className={styles.urlInputWrapper}>
                  <input type="email" required className={styles.urlInput} placeholder="Email address..." value={email} onChange={(e) => setEmail(e.target.value)} autoFocus />
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.urlInputWrapper}>
                  <input type="password" required className={styles.urlInput} placeholder="Password..." value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
              </div>
              <button type="submit" className={styles.saveButton} disabled={!email || !password || isLoading}>
                {isLoading ? <span className={styles.spinner} /> : <>{isLogin ? "Sign In" : "Sign Up"}</>}
              </button>
              <p className={styles.modalHint} style={{textAlign: 'center', marginTop: '16px'}}>
                {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                <button type="button" onClick={() => setIsLogin(!isLogin)} style={{color: 'var(--accent-secondary)', textDecoration: 'underline'}}>
                  {isLogin ? "Sign up" : "Sign in"}
                </button>
              </p>
            </form>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && <div className={`${styles.toast} ${styles[toast.type]}`}>{toast.type === "success" && I.check}{toast.message}</div>}
    </div>
  );
}
