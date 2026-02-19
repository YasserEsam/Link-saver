"use client";

import React, { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import LinkCard from "../components/LinkCard";
import AddEditModal from "../components/AddEditModal";
import ConfirmationModal from "../components/ConfirmationModal";
import LinkDetailModal from "../components/LinkDetailModal";
import EmptyState from "../components/EmptyState";
import SearchBar from "../components/SearchBar";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { Plus, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { db } from "../lib/firebase";
import {
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  query,
  orderBy
} from "firebase/firestore";

const PER_PAGE = 12;

function Pagination({ current, total, onPage, t, isRTL }) {
  const PrevIcon = isRTL ? ChevronRight : ChevronLeft;
  const NextIcon = isRTL ? ChevronLeft : ChevronRight;
  if (total <= 1) return null;

  const pages = [];
  const show = (n) => { if (!pages.includes(n)) pages.push(n); };

  show(1);
  if (current > 2) show(current - 1);
  show(current);
  if (current < total - 1) show(current + 1);
  show(total);

  const items = [];
  for (let i = 0; i < pages.length; i++) {
    if (i > 0 && pages[i] - pages[i - 1] > 1) {
      items.push(<span key={`dots-${i}`} style={{ padding: '0 0.2rem', color: 'var(--text-secondary)', fontSize: '0.85rem', userSelect: 'none' }}>…</span>);
    }
    const p = pages[i];
    items.push(
      <button
        key={p}
        onClick={() => onPage(p)}
        style={{
          width: '36px', height: '36px', borderRadius: '10px',
          border: p === current ? '1.5px solid var(--accent-color)' : '1px solid var(--glass-border)',
          background: p === current ? 'var(--accent-color)' : 'var(--bg-secondary)',
          color: p === current ? '#fff' : 'var(--text-primary)',
          fontWeight: '700', fontSize: '0.85rem',
          cursor: 'pointer', transition: 'all 0.15s',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        {p}
      </button>
    );
  }

  const btnStyle = (disabled) => ({
    display: 'flex', alignItems: 'center', gap: '0.3rem',
    padding: '0.45rem 0.85rem', borderRadius: '10px',
    border: '1px solid var(--glass-border)',
    background: 'var(--bg-secondary)', color: 'var(--text-primary)',
    fontWeight: '600', fontSize: '0.8rem',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.4 : 1,
    transition: 'all 0.15s',
  });

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      gap: '0.5rem', flexWrap: 'wrap', marginTop: '2rem', padding: '0 0.5rem',
    }}>
      <button onClick={() => onPage(current - 1)} disabled={current === 1} style={btnStyle(current === 1)}>
        <PrevIcon size={16} /> <span className="hide-sm">{t('prev')}</span>
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
        {items}
      </div>

      <button onClick={() => onPage(current + 1)} disabled={current === total} style={btnStyle(current === total)}>
        <span className="hide-sm">{t('next')}</span> <NextIcon size={16} />
      </button>
    </div>
  );
}

export default function Dashboard() {
  const { t, language } = useLanguage();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const topRef = useRef(null);

  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [detailItem, setDetailItem] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
    if (user) {
      const q = query(
        collection(db, `users/${user.uid}/links`),
        orderBy("createdAt", "desc")
      );
      const unsubscribe = onSnapshot(q, (snapshot) => {
        setLinks(snapshot.docs.map(d => ({ ...d.data(), id: d.id })));
        setLoading(false);
      });
      return () => unsubscribe();
    }
  }, [user, authLoading, router]);

  const totalPages = Math.max(1, Math.ceil(links.length / PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const pagedLinks = links.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  const goToPage = (p) => {
    const next = Math.max(1, Math.min(p, totalPages));
    setPage(next);
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleSave = async (formData) => {
    if (!user) return;
    try {
      if (currentItem) {
        await updateDoc(doc(db, `users/${user.uid}/links`, currentItem.id), {
          ...formData,
          updatedAt: new Date().toISOString(),
        });
      } else {
        await addDoc(collection(db, `users/${user.uid}/links`), {
          ...formData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error("Error saving link:", error);
    }
  };

  const handleEdit = (item) => {
    setCurrentItem(item);
    setIsAddEditOpen(true);
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!user || !deleteId) return;
    try {
      await deleteDoc(doc(db, `users/${user.uid}/links`, deleteId));
      setIsConfirmOpen(false);
    } catch (error) {
      console.error("Error deleting link:", error);
    }
  };

  const openDetail = (link) => {
    setDetailItem(link);
    setIsDetailOpen(true);
  };

  const openAdd = () => {
    setCurrentItem(null);
    setIsAddEditOpen(true);
  };

  if (authLoading || (user && loading)) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
        <Loader2 className="animate-spin" style={{ color: 'var(--accent-color)' }} size={40} />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar links={links} onSearchSelect={openDetail} />

      <main className="container" style={{ flex: 1, padding: '1.5rem', width: '100%' }}>
        {/* Scroll anchor */}
        <div ref={topRef} />

        {/* Header row */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <div>
            <h1 style={{ fontSize: "1.75rem", fontWeight: "800", letterSpacing: "-0.5px" }}>{t('dashboard')}</h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>{t('bottom_text')}</p>
          </div>
          <button onClick={openAdd} className="btn btn-primary" style={{ padding: "0.75rem 1.5rem", borderRadius: "10px", boxShadow: "0 4px 6px -1px rgba(59,130,246,0.3)" }}>
            <Plus size={20} /> {t('add_new')}
          </button>
        </div>

        {/* Mobile-only search */}
        {links.length > 0 && (
          <div className="show-mobile-only" style={{ marginBottom: '1.25rem' }}>
            <SearchBar links={links} onSelect={openDetail} />
          </div>
        )}

        {/* Content */}
        {links.length > 0 ? (
          <>
            <div className="card-grid">
              {pagedLinks.map(link => (
                <LinkCard
                  key={link.id}
                  item={link}
                  onEdit={handleEdit}
                  onDelete={handleDeleteClick}
                  onClick={openDetail}
                />
              ))}
            </div>

            <Pagination current={safePage} total={totalPages} onPage={goToPage} t={t} isRTL={language === 'ar'} />
          </>
        ) : (
          <EmptyState onAdd={openAdd} />
        )}
      </main>

      <AddEditModal
        isOpen={isAddEditOpen}
        onClose={() => setIsAddEditOpen(false)}
        initialData={currentItem}
        onSave={handleSave}
      />
      <ConfirmationModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmDelete}
        message={t('delete_confirm')}
      />
      <LinkDetailModal
        isOpen={isDetailOpen}
        item={detailItem}
        onClose={() => setIsDetailOpen(false)}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
      />

      <footer style={{ padding: "2rem", textAlign: "center", color: "var(--text-secondary)", fontSize: "0.9rem" }}>
        LinkSaver - Build By Yasser With Love {new Date().getFullYear()} ©
      </footer>
    </div>
  );
}
