import Link from "next/link";

type HeaderProps = {
  variant?: "loggedOut" | "loggedIn";
  initial?: string;
};

export function Header({ variant = "loggedOut", initial }: HeaderProps) {
  return (
    <header className="ovyu-header">
      <Link href="/" className="ovyu-wordmark">
        ov<em style={{ fontStyle: "italic" }}>yu</em>
      </Link>
      <nav className="ovyu-header__nav">
        <Link href="/activate-transfer" className="ovyu-header__link">Activate Transfer</Link>
        {variant === "loggedOut" ? (
          <Link href="/login" className="ovyu-btn-login">Log In</Link>
        ) : (
          <button className="ovyu-avatar" aria-label="Account">
            {(initial ?? "?").toUpperCase()}
          </button>
        )}
      </nav>
    </header>
  );
}
