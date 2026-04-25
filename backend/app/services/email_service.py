import boto3

from app.core.config import settings


class EmailService:
    def __init__(self):
        self.client = boto3.client("ses", region_name=settings.aws_region)
        self.sender = f"{settings.ses_from_name} <{settings.ses_from_email}>"

    def _send(self, to: str, subject: str, html: str, text: str = "") -> None:
        if not settings.ses_from_email:
            return  # skip in local dev
        self.client.send_email(
            Source=self.sender,
            Destination={"ToAddresses": [to]},
            Message={
                "Subject": {"Data": subject},
                "Body": {
                    "Html": {"Data": html},
                    **({"Text": {"Data": text}} if text else {}),
                },
            },
        )

    def send_maker_verification(self, maker_email: str, verify_url: str) -> None:
        html = f"""
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
          <div style="background:#1A1A1A;padding:32px;text-align:center">
            <span style="font-family:Georgia,serif;font-style:italic;font-size:48px;color:#F7F8F3">ovyu</span>
          </div>
          <div style="padding:48px 40px;background:#fff;text-align:center">
            <h1 style="font-family:Georgia,serif;font-size:32px;margin:0 0 16px">Confirm your email address</h1>
            <p style="font-size:16px;color:#555;margin:0 0 8px">You're one step away from starting your Ovyu.</p>
            <p style="font-size:16px;color:#555;margin:0 0 32px">
              Click the button below to verify your email. This link expires in 24 hours.<br>
              If you didn't create an Ovyu account, you can safely ignore this email.
            </p>
            <a href="{verify_url}" style="display:inline-block;background:#1A1A1A;color:#F5F0E8;font-size:16px;font-weight:700;padding:15px 48px;border-radius:8px;text-decoration:none">Verify my email</a>
          </div>
          <div style="background:#ddd;padding:20px;text-align:center;font-size:13px;color:#888">
            ovyu.com · This is a transactional email sent because you created an account.
          </div>
        </div>
        """
        self._send(maker_email, "Confirm your email — Ovyu", html)

    def send_invitation(self, invitee_email: str, invitee_name: str, maker_name: str, invite_url: str, role: str) -> None:
        subject = f"{maker_name} has invited you to Ovyu" if role == "keeper" else f"{maker_name} has named you as their Transfer Contact"
        html = f"""
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
          <div style="background:#1A1A1A;padding:32px;text-align:center">
            <span style="font-family:Georgia,serif;font-style:italic;font-size:48px;color:#F7F8F3">ovyu</span>
          </div>
          <div style="padding:48px 40px;background:#fff;text-align:center">
            <h1 style="font-family:Georgia,serif;font-size:32px;margin:0 0 16px">{subject}</h1>
            <p style="font-size:16px;color:#555;margin:0 0 32px">Review the agreement and sign if you're ready to accept.</p>
            <a href="{invite_url}" style="display:inline-block;background:#1A1A1A;color:#F5F0E8;font-size:16px;font-weight:700;padding:15px 48px;border-radius:8px;text-decoration:none">Review and sign the agreement</a>
          </div>
          <div style="background:#ddd;padding:20px;text-align:center;font-size:13px;color:#888">
            ovyu.com · This link expires in 7 days and is single-use.
          </div>
        </div>
        """
        self._send(invitee_email, subject, html)

    def send_magic_link(self, email: str, link_url: str, mode: str) -> None:
        if mode == "tc":
            subject = "Your Transfer Contact link — Ovyu"
            heading = "Activate the Transfer."
            body = "You've been named as a Transfer Contact. Click below to continue."
        else:
            subject = "Your sign-in link — Ovyu"
            heading = "Here's your sign-in link."
            body = "Click the button below to sign in. This link expires in 15 minutes and can only be used once."
        html = f"""
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
          <div style="background:#1A1A1A;padding:32px;text-align:center">
            <span style="font-family:Georgia,serif;font-style:italic;font-size:48px;color:#F7F8F3">ovyu</span>
          </div>
          <div style="padding:48px 40px;background:#fff;text-align:center">
            <h1 style="font-family:Georgia,serif;font-size:32px;margin:0 0 16px">{heading}</h1>
            <p style="font-size:16px;color:#555;margin:0 0 32px">{body}</p>
            <a href="{link_url}" style="display:inline-block;background:#1A1A1A;color:#F5F0E8;font-size:16px;font-weight:700;padding:15px 48px;border-radius:8px;text-decoration:none">Continue →</a>
          </div>
          <div style="background:#ddd;padding:20px;text-align:center;font-size:13px;color:#888">
            ovyu.com · If you didn't request this, you can safely ignore it.
          </div>
        </div>
        """
        self._send(email, subject, html)

    def send_contract_locked(self, maker_email: str, signer_name: str) -> None:
        html = f"""
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
          <div style="background:#1A1A1A;padding:32px;text-align:center">
            <span style="font-family:Georgia,serif;font-style:italic;font-size:48px;color:#F7F8F3">ovyu</span>
          </div>
          <div style="padding:48px 40px;background:#fff;text-align:center">
            <h1 style="font-family:Georgia,serif;font-size:32px;margin:0 0 16px">Your contract is locked.</h1>
            <p style="font-size:16px;color:#555;margin:0 0 8px">{signer_name} has signed. You're ready to begin.</p>
            <p style="font-size:16px;color:#555;margin:0 0 32px">When you're ready, start with a welcome message — a short video or voice recording that will be the first thing they receive.</p>
            <a href="{settings.frontend_url}/plan" style="display:inline-block;background:#1A1A1A;color:#F5F0E8;font-size:16px;font-weight:700;padding:15px 48px;border-radius:8px;text-decoration:none">Begin my upload</a>
          </div>
          <div style="background:#ddd;padding:20px;text-align:center;font-size:13px;color:#888">
            ovyu.com · You can return at any time by logging in.
          </div>
        </div>
        """
        self._send(maker_email, "Your contract is locked — Ovyu", html)
