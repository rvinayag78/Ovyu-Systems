import Link from "next/link";

const sans = "Helvetica Neue, Helvetica, Arial, sans-serif";

const navLinks = [
  { label: "Home", href: "/prototype" },
  { label: "Begin", href: "/prototype/begin" },
  { label: "Verified", href: "/prototype/email-verified" },
  { label: "Contract", href: "/prototype/contract" },
  { label: "Contract TC", href: "/prototype/contract/tc" },
  { label: "Contracts", href: "/prototype/contracts" },
  { label: "K.Contracts", href: "/prototype/contracts/keeper" },
  { label: "Account", href: "/prototype/account" },
  { label: "Plan", href: "/prototype/plan" },
  { label: "Contact", href: "/prototype/contact" },
  { label: "Logged out", href: "/prototype/logged-out" },
];

const emailLinks = [
  { label: "E:Keeper", href: "/prototype/emails/keeper" },
  { label: "E:TC", href: "/prototype/emails/tc" },
  { label: "E:TC→Maker", href: "/prototype/emails/tc-signed-maker" },
  { label: "E:TC→TC", href: "/prototype/emails/tc-signed-tc" },
];

export default function ProtoNav() {
  return (
    <div style={{
      position: "fixed",
      bottom: "20px",
      left: "50%",
      transform: "translateX(-50%)",
      background: "rgba(0,0,0,0.88)",
      borderRadius: "12px",
      padding: "10px 20px",
      display: "flex",
      gap: "12px",
      zIndex: 9999,
      alignItems: "center",
      flexWrap: "wrap",
      maxWidth: "1800px",
    }}>
      {navLinks.map((link) => (
        <Link key={link.href} href={link.href} style={{
          fontFamily: sans,
          fontWeight: 400,
          fontSize: "12px",
          color: "#f5f0e8",
          textDecoration: "none",
          whiteSpace: "nowrap",
        }}>{link.label}</Link>
      ))}
      <span style={{ fontFamily: sans, fontSize: "12px", color: "#888", padding: "0 4px" }}>|</span>
      {emailLinks.map((link) => (
        <Link key={link.href} href={link.href} style={{
          fontFamily: sans,
          fontWeight: 400,
          fontSize: "12px",
          color: "#c9a84c",
          textDecoration: "none",
          whiteSpace: "nowrap",
        }}>{link.label}</Link>
      ))}
    </div>
  );
}
