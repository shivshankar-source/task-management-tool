import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Search, X } from 'lucide-react';

export default function SearchableSelect({
  value,
  onChange,
  options = [],
  placeholder = 'Select',
  searchPlaceholder = 'Search...',
  required = false,
  className = '',
  disabled = false,
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [menuStyle, setMenuStyle] = useState({});
  const rootRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleOutside = (event) => {
      if (rootRef.current?.contains(event.target) || menuRef.current?.contains(event.target)) return;
      setOpen(false);
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const normalizedOptions = useMemo(() => options.filter(Boolean).map(option => ({
    value: String(option.value ?? ''),
    label: String(option.label ?? option.value ?? ''),
    secondary: option.secondary ? String(option.secondary) : '',
  })), [options]);

  const selected = normalizedOptions.find(option => option.value === String(value ?? ''));
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return normalizedOptions;
    return normalizedOptions.filter(option =>
      `${option.label} ${option.secondary}`.toLowerCase().includes(q)
    );
  }, [normalizedOptions, query]);

  const updateMenuPosition = () => {
    const rect = rootRef.current?.getBoundingClientRect();
    if (!rect) return;
    const gap = 6;
    const viewportPadding = 10;
    const preferredHeight = Math.min(390, Math.max(180, window.innerHeight * 0.48));
    const roomBelow = window.innerHeight - rect.bottom - viewportPadding;
    const roomAbove = rect.top - viewportPadding;
    const openAbove = roomBelow < 230 && roomAbove > roomBelow;
    const available = Math.max(150, Math.min(preferredHeight, openAbove ? roomAbove - gap : roomBelow - gap));
    setMenuStyle({
      position: 'fixed',
      left: `${Math.max(viewportPadding, rect.left)}px`,
      width: `${rect.width}px`,
      ...(openAbove
        ? { bottom: `${Math.max(viewportPadding, window.innerHeight - rect.top + gap)}px` }
        : { top: `${Math.min(window.innerHeight - viewportPadding, rect.bottom + gap)}px` }),
      maxHeight: `${available}px`,
    });
  };

  useEffect(() => {
    if (!open) return undefined;
    updateMenuPosition();
    const handleReposition = () => updateMenuPosition();
    window.addEventListener('resize', handleReposition);
    document.addEventListener('scroll', handleReposition, true);
    return () => {
      window.removeEventListener('resize', handleReposition);
      document.removeEventListener('scroll', handleReposition, true);
    };
  }, [open, filtered.length]);

  const selectOption = (option) => {
    onChange(option.value);
    setOpen(false);
    setQuery('');
  };

  const menu = open && typeof document !== 'undefined' ? createPortal(
    <div ref={menuRef} style={menuStyle} className="searchable-select-menu z-[10000] rounded-xl border border-white/15 bg-slate-950/95 shadow-[0_24px_70px_rgba(0,0,0,.55)] backdrop-blur-xl overflow-hidden">
      <div className="p-2 border-b border-white/10 bg-slate-950/95">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/45" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={event => setQuery(event.target.value)}
            onKeyDown={event => event.stopPropagation()}
            placeholder={searchPlaceholder}
            className="w-full pl-9 pr-9 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-emerald-400/60"
          />
          {query && <button type="button" className="absolute right-2 top-1/2 -translate-y-1/2 text-white/40 hover:text-white" onClick={() => setQuery('')}><X className="w-4 h-4" /></button>}
        </div>
      </div>
      <div className="searchable-select-options p-1" style={{ maxHeight: 'calc(100% - 72px)', overflowY: 'auto' }} role="listbox">
        {filtered.map(option => (
          <button
            type="button"
            key={option.value}
            role="option"
            aria-selected={option.value === String(value ?? '')}
            className={`w-full text-left px-3 py-2.5 rounded-lg hover:bg-emerald-500/10 transition-colors ${option.value === String(value ?? '') ? 'bg-emerald-500/15 text-emerald-300' : 'text-white'}`}
            onClick={() => selectOption(option)}
          >
            <span className="block font-medium truncate">{option.label}</span>
            {option.secondary && <span className="block text-xs text-white/40 truncate mt-0.5">{option.secondary}</span>}
          </button>
        ))}
        {!filtered.length && <p className="px-3 py-4 text-sm text-white/50">No results found.</p>}
      </div>
      {!!filtered.length && <div className="px-3 py-2 text-xs text-white/35 border-t border-white/10">{filtered.length} option{filtered.length === 1 ? '' : 's'}</div>}
    </div>,
    document.body
  ) : null;

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="w-full p-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-left flex items-center justify-between gap-2 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:border-emerald-500/50 transition-colors"
        onClick={() => !disabled && setOpen(current => !current)}
      >
        <span className={selected ? 'truncate' : 'text-white/40 truncate'}>{selected?.label || placeholder}</span>
        <ChevronDown className={`w-4 h-4 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {required && <input tabIndex={-1} aria-hidden="true" className="absolute w-px h-px opacity-0 pointer-events-none" required={!value} value={value || ''} onChange={() => {}} />}
      {menu}
    </div>
  );
}
