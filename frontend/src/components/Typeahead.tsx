"use client";

import { useMemo, useState } from "react";

const sans = "Helvetica Neue, Helvetica, Arial, sans-serif";

/**
 * Free-text input with a filtered suggestion dropdown. The user may pick a
 * suggestion or type their own value (suggestions are a convenience, not a
 * constraint). Used for Place of birth / Homes (City, Country) and Languages.
 */
export function Typeahead({
  value,
  onChange,
  options,
  placeholder,
  maxSuggestions = 8,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
  maxSuggestions?: number;
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  const matches = useMemo(() => {
    const q = value.trim().toLowerCase();
    if (!q) return [];
    return options
      .filter(o => o.toLowerCase().includes(q) && o.toLowerCase() !== q)
      .slice(0, maxSuggestions);
  }, [value, options, maxSuggestions]);

  const show = open && matches.length > 0;

  function pick(v: string) {
    onChange(v);
    setOpen(false);
  }

  return (
    <div style={{ position: "relative" }}>
      <input
        value={value}
        placeholder={placeholder}
        onChange={e => { onChange(e.target.value); setOpen(true); setActive(0); }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 120)}
        onKeyDown={e => {
          if (!show) return;
          if (e.key === "ArrowDown") { e.preventDefault(); setActive(a => Math.min(a + 1, matches.length - 1)); }
          else if (e.key === "ArrowUp") { e.preventDefault(); setActive(a => Math.max(a - 1, 0)); }
          else if (e.key === "Enter") { e.preventDefault(); pick(matches[active]); }
          else if (e.key === "Escape") { setOpen(false); }
        }}
        style={{ width: "100%", padding: "12px 16px", borderRadius: "8px", border: "1px solid #ccc", fontFamily: sans, fontSize: "16px", boxSizing: "border-box" }}
      />
      {show && (
        <ul style={{
          position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 20,
          listStyle: "none", margin: 0, padding: "4px", background: "white",
          border: "1px solid #ddd", borderRadius: "8px", boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
          maxHeight: "240px", overflowY: "auto",
        }}>
          {matches.map((m, i) => (
            <li
              key={m}
              onMouseDown={e => { e.preventDefault(); pick(m); }}
              onMouseEnter={() => setActive(i)}
              style={{
                padding: "10px 12px", borderRadius: "6px", cursor: "pointer",
                fontFamily: sans, fontSize: "15px", color: "#1a1a1a",
                background: i === active ? "#efeaf2" : "transparent",
              }}
            >
              {m}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
