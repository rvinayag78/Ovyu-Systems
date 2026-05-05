import Link from "next/link";

const sans = "Helvetica Neue, Helvetica, Arial, sans-serif";

const pages = [
  { label: "Home", href: "/prototype" },
  { label: "Begin", href: "/prototype/begin" },
  { label: "Begin (aware)", href: "/prototype/begin/aware" },
  { label: "Verified", href: "/prototype/email-verified" },
  { label: "Verified (TC)", href: "/prototype/email-verified/tc" },
  { label: "Contract", href: "/prototype/contract" },
  { label: "Contract (TC)", href: "/prototype/contract/tc" },
  { label: "TC Sign", href: "/prototype/contract/tc-sign" },
  { label: "TC Signed", href: "/prototype/contract/tc-signed" },
  { label: "Keeper Sign", href: "/prototype/contract/keeper" },
  { label: "Keeper Signed", href: "/prototype/contract/keeper-signed" },
  { label: "Contract View", href: "/prototype/contract/signed" },
  { label: "Contracts", href: "/prototype/contracts" },
  { label: "Maker (unsigned)", href: "/prototype/contracts/maker-not-signed" },
  { label: "Maker (K pending)", href: "/prototype/contracts/pending-keeper" },
  { label: "Maker (TC pending)", href: "/prototype/contracts/tc-pending" },
  { label: "Keeper (unsigned)", href: "/prototype/contracts/keeper-not-signed" },
  { label: "Keeper (signed)", href: "/prototype/contracts/keeper" },
  { label: "Account", href: "/prototype/account" },
  { label: "Plan", href: "/prototype/plan" },
  { label: "Contact", href: "/prototype/contact" },
  { label: "Logged out", href: "/prototype/logged-out" },
];

const emails = [
  { label: "E:Keeper", href: "/prototype/emails/keeper" },
  { label: "E:TC", href: "/prototype/emails/tc" },
  { label: "E:TC→Maker", href: "/prototype/emails/tc-signed-maker" },
  { label: "E:TC→TC", href: "/prototype/emails/tc-signed-tc" },
];

export default function ProtoNav() {
  return (
    <div style={{
      position: "fixed",
      bottom: "16px",
      left: "50%",
      transform: "translateX(-50%)",
      background: "rgba(0,0,0,0.92)",
      borderRadius: "12px",
      padding: "10px 20px",
      display: "flex",
      gap: "8px",
      zIndex: 9999,
      alignItems: "center",
      flexWrap: "wrap",
      maxWidth: "1860px",
    }}>
      {pages.map((p) => (
        <Link key={p.href} href={p.href} style={{
          fontFamily: sans,
          fontWeight: 400,
          fontSize: "12px",
          color: "#f5f0e8",
          textDecoration: "none",
          whiteSpace: "nowrap",
        }}>{p.label}</Link>
      ))}
      <span style={{ color: "#555", fontSize: "14px", padding: "0 4px" }}>|</span>
      {emails.map((p) => (
        <Link key={p.href} href={p.href} style={{
          fontFamily: sans,
          fontWeight: 400,
          fontSize: "12px",
          color: "#c9a84c",
          textDecoration: "none",
          whiteSpace: "nowrap",
        }}>{p.label}</Link>
      ))}
    </div>
  );
}
