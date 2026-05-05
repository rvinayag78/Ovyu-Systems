"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

const serif = "Georgia, serif";
const sans = "Helvetica Neue, Helvetica, Arial, sans-serif";

type HeaderProps = {
  variant?: "loggedOut" | "loggedIn";
  initial?: string;
};

export function Header({ variant = "loggedOut", initial }: HeaderProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  function handleLogout() {
    setOpen(false);
    sessionStorage.clear();
    router.push("/logged-out");
  }

  return (
    <header style={{
      width: "100%",
      height: "103px",
      background: "#fff",
      borderBottom: "3px solid #e1e1e1",
      overflow: "visible",
      flexShrink: 0,
      position: "relative",
      zIndex: 100,
    }}>
      <div style={{
        maxWidth: "1800px",
        margin: "0 auto",
        height: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        <Link href="/" aria-label="ovyu home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/ovyu-wordmark.svg" alt="ovyu" width={113} height={32} style={{ display: "block" }} />
        </Link>

        <div style={{ display: "flex", gap: "117px", alignItems: "center" }}>
          <Link href="/activate-transfer" style={{
            fontFamily: sans, fontSize: "16px", fontWeight: 400,
            color: "#000", textDecoration: "none", width: "150px", textAlign: "center",
          }}>
            Activate Transfer
          </Link>

          {variant === "loggedOut" ? (
            <Link href="/login" style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              width: "136px", height: "52px", background: "#1a1a1a",
              borderRadius: "8px", fontFamily: sans, fontWeight: 700,
              fontSize: "16px", color: "#fff", textDecoration: "none",
            }}>
              Log In
            </Link>
          ) : (
            <div ref={menuRef} style={{ position: "relative" }}>
              {/* Avatar button */}
              <button
                onClick={() => setOpen(o => !o)}
                aria-label="Account menu"
                aria-haspopup="true"
                aria-expanded={open}
                style={{
                  width: "51px", height: "51px", background: "#4b3c5e",
                  borderRadius: "50%", display: "flex", alignItems: "center",
                  justifyContent: "center", border: "none", cursor: "pointer",
                  padding: 0,
                }}
              >
                <span style={{ fontFamily: serif, fontWeight: 400, fontSize: "32px", color: "#fff" }}>
                  {(initial ?? "?").toUpperCase()}
                </span>
              </button>

              {/* Dropdown */}
              {open && (
                <div
                  role="menu"
                  style={{
                    position: "absolute",
                    top: "calc(100% + 12px)",
                    right: 0,
                    background: "#fff",
                    border: "1px solid #e1e1e1",
                    borderRadius: "10px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.10)",
                    minWidth: "160px",
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                    zIndex: 200,
                  }}
                >
                  <Link
                    href="/account"
                    role="menuitem"
                    onClick={() => setOpen(false)}
                    style={{
                      fontFamily: sans, fontSize: "16px", fontWeight: 400,
                      color: "#1a1a1a", textDecoration: "none",
                      padding: "14px 20px", display: "block",
                      borderBottom: "1px solid #f0ede8",
                    }}
                  >
                    Account
                  </Link>
                  <Link
                    href="/contact"
                    role="menuitem"
                    onClick={() => setOpen(false)}
                    style={{
                      fontFamily: sans, fontSize: "16px", fontWeight: 400,
                      color: "#1a1a1a", textDecoration: "none",
                      padding: "14px 20px", display: "block",
                      borderBottom: "1px solid #f0ede8",
                    }}
                  >
                    Contact
                  </Link>
                  <button
                    role="menuitem"
                    onClick={handleLogout}
                    style={{
                      fontFamily: sans, fontSize: "16px", fontWeight: 400,
                      color: "#B4372C", background: "none", border: "none",
                      cursor: "pointer", padding: "14px 20px",
                      textAlign: "left", display: "block", width: "100%",
                    }}
                  >
                    Log Out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
