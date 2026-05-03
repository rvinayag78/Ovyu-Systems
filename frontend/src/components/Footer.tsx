export function Footer() {
  return (
    <footer className="ovyu-footer">
      <div className="ovyu-footer__inner">
        <nav className="ovyu-footer__nav">
          <a href="/contact">CONTACT</a>
          <a href="/about">ABOUT</a>
        </nav>
        <p className="ovyu-footer__notice">
          OVYU DOES NOT SHARE, SELL, OR RETAIN PERSONAL DATA, INCLUDING UPLOAD, CONTRACT,
          AND CONVERSATIONS, BEYOND WHAT IS REQUIRED TO OPERATE THIS SERVICE.
        </p>
        <div className="ovyu-footer__legal">
          <span>@ 2026 OVYU</span>
          <a href="/cookies">MANAGE COOKIES</a>
          <span className="ovyu-footer__sep" aria-hidden="true" />
          <a href="/legal">LEGAL</a>
          <span className="ovyu-footer__sep" aria-hidden="true" />
          <a href="/privacy">PRIVACY</a>
        </div>
      </div>
    </footer>
  );
}
