"use client";

import { useEffect, useState } from "react";

export default function MakerEmailSentPage() {
  const [email, setEmail] = useState("");

  useEffect(() => {
    const stored = sessionStorage.getItem("ovyu_pending_email");
    if (stored) setEmail(stored);
  }, []);

  return (
    <div className="ovyu-email-preview">
      {/* Black header band — the "email header" */}
      <div className="ovyu-email-preview__header">
        <span className="ovyu-email-preview__logo">
          ov<em>yu</em>
        </span>
      </div>

      {/* Email body */}
      <div className="ovyu-email-preview__body">
        <h1 className="ovyu-email-preview__heading">
          <em>Confirm</em> your email address
        </h1>
        <p className="ovyu-email-preview__sub">
          You&apos;re one step away from starting your Ovyu.
        </p>
        <p className="ovyu-email-preview__p">
          Click the button below to verify your email. This link expires in 24 hours.
          If you didn&apos;t create an Ovyu account, you can safely ignore this email.
          {email && (
            <> We sent it to <strong>{email}</strong>.</>
          )}
        </p>
        <p className="ovyu-email-preview__legal">
          By continuing you agree to Ovyu&apos;s Terms of Use and Privacy Policy.
        </p>
        {/* In production this is the real link in the email — shown here as a note */}
        <button
          className="ovyu-btn ovyu-btn--gold"
          disabled
          title="Check your actual inbox and click the link in the email"
        >
          Verify my email
        </button>
        <p className="ovyu-email-preview__legal">
          Check your inbox for the real link. This page is a preview of the email we sent.
        </p>
      </div>

      {/* Footer band */}
      <div className="ovyu-email-preview__footer">
        ovyu.com &nbsp;·&nbsp; This is a transactional email. You are receiving this because you created an account.
      </div>
    </div>
  );
}
