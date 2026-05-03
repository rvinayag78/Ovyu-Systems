import Link from "next/link";

const serif = "Georgia, serif";
const sans = "Helvetica Neue, Helvetica, Arial, sans-serif";

type HeaderProps = {
  variant?: "loggedOut" | "loggedIn";
  initial?: string;
};

export function Header({ variant = "loggedOut", initial }: HeaderProps) {
  return (
    <header style={{
      width: "100%",
      height: "103px",
      background: "#fff",
      borderBottom: "3px solid #e1e1e1",
      overflow: "hidden",
      flexShrink: 0,
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
            <Link href="/account" style={{
              width: "51px", height: "51px", background: "#4b3c5e",
              borderRadius: "50%", display: "flex", alignItems: "center",
              justifyContent: "center", textDecoration: "none",
            }}>
              <span style={{ fontFamily: serif, fontWeight: 400, fontSize: "32px", color: "#fff" }}>
                {(initial ?? "?").toUpperCase()}
              </span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
