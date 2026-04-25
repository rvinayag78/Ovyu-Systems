import Link from "next/link";

export function Header({ variant = "loggedOut" }: { variant?: "loggedOut" | "loggedIn" }) {
  return (
    <header className="ovyu-header">
      <Link href="/" className="ovyu-wordmark">ovyu</Link>
      <nav className="ovyu-header__nav">
        <Link href="/activate-transfer" className="ovyu-header__link">Activate Transfer</Link>
        {variant === "loggedOut" && (
          <Link href="/login" className="ovyu-btn-login">Log In</Link>
        )}
      </nav>
    </header>
  );
}
