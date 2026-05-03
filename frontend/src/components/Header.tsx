import Link from "next/link";

type HeaderProps = {
  variant?: "loggedOut" | "loggedIn";
  initial?: string;
};

export function Header({ variant = "loggedOut", initial }: HeaderProps) {
  return (
    <header className="ovyu-header">
      <div className="ovyu-header__inner">
        <Link href="/" className="ovyu-wordmark" aria-label="ovyu home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/ovyu-wordmark.svg" alt="ovyu" height={24} style={{ width: "auto", display: "block" }} />
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
      </div>
    </header>
  );
}
