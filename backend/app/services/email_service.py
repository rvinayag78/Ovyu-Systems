import logging

import boto3

from app.core.config import settings

logger = logging.getLogger(__name__)


class EmailService:
    def __init__(self):
        self.client = boto3.client("ses", region_name=settings.aws_region)
        self.sender = f"{settings.ses_from_name} <{settings.ses_from_email}>"

    def _send(self, to: str, subject: str, html: str, text: str = "") -> None:
        if not settings.ses_from_email:
            logger.info("SES not configured — skipping email", extra={"to": to, "subject": subject})
            return
        logger.info("Sending email", extra={"to": to, "subject": subject, "from": self.sender})
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

    def send_keeper_verification(self, keeper_email: str, verify_url: str) -> None:
        html = f"""
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
          <div style="background:#1A1A1A;padding:32px;text-align:center">
            <span style="font-family:Georgia,serif;font-style:italic;font-size:48px;color:#F7F8F3">ovyu</span>
          </div>
          <div style="padding:48px 40px;background:#fff;text-align:center">
            <h1 style="font-family:Georgia,serif;font-size:32px;margin:0 0 16px">You're almost there.</h1>
            <p style="font-size:16px;color:#555;margin:0 0 32px">
              Click below to verify your email and review your agreement. This link expires in 24 hours.
            </p>
            <a href="{verify_url}" style="display:inline-block;background:#1A1A1A;color:#F5F0E8;font-size:16px;font-weight:700;padding:15px 48px;border-radius:8px;text-decoration:none">Verify my email →</a>
          </div>
          <div style="background:#ddd;padding:20px;text-align:center;font-size:13px;color:#888">
            ovyu.com · This is a transactional email sent because you were named as a Keeper.
          </div>
        </div>
        """
        self._send(keeper_email, "Verify your email — Ovyu", html)

    def send_invitation(self, invitee_email: str, invitee_name: str, maker_name: str, invite_url: str, role: str) -> None:
        if role == "tc":
            subject = f"{maker_name} has chosen you as their Transfer Contact"
            html = f"""
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#f8f7f5">
          <div style="background:#000;padding:40px;text-align:center">
            <span style="font-family:Georgia,serif;font-weight:700;font-size:48px;color:#fff">ov<em>yu</em></span>
          </div>
          <div style="padding:48px 40px;background:#f8f7f5">
            <h1 style="font-family:Georgia,serif;font-size:32px;color:#1a1a1a;text-align:center;margin:0 0 12px">{maker_name} has chosen you as their Transfer Contact.</h1>
            <p style="font-size:18px;color:#888;text-align:center;margin:0 0 28px">This comes with a responsibility. Please read carefully.</p>
            <p style="font-size:16px;color:#444;margin:0 0 12px">{maker_name} is using Ovyu to leave a piece of themselves for someone they love. They have named you as their Transfer Contact — the person responsible for initiating the Transfer when the time comes.</p>
            <p style="font-size:16px;color:#444;margin:0 0 20px">As Transfer Contact, your role is specific:</p>
            <div style="background:#f5edd6;border:3px solid #c9a84c;border-radius:16px;padding:28px 32px;margin:0 0 24px">
              <p style="font-size:15px;color:#444;margin:0 0 12px">1. &nbsp;When {maker_name} passes, provide Ovyu with evidence of their passing (such as a death certificate or official notice).</p>
              <p style="font-size:15px;color:#444;margin:0 0 12px">2. &nbsp;Confirm the Keeper's name and email so we can reach them.</p>
              <p style="font-size:15px;color:#444;margin:0">3. &nbsp;You have all the time you need.</p>
            </div>
            <p style="font-size:12px;color:#888;text-align:center;font-style:italic;margin:0 0 24px">By continuing you agree to Ovyu's Terms of Use and Privacy Policy.</p>
            <div style="text-align:center">
              <a href="{invite_url}" style="display:inline-block;background:#c9a84c;color:#fff;font-size:16px;font-weight:700;padding:16px 40px;border-radius:11px;text-decoration:none">Review the contract and accept this role</a>
            </div>
            <p style="font-size:12px;color:#888;text-align:center;font-style:italic;margin:24px 0 0">This button takes you to ovyu.com where you can read the full contract and sign.</p>
          </div>
          <div style="background:#d9d9d9;padding:20px;text-align:center;font-size:13px;color:#888">
            ovyu.com &nbsp;·&nbsp; You received this because {maker_name} named you as their Transfer Contact. If this is a mistake, you may decline.
          </div>
        </div>
            """
        else:
            subject = f"{maker_name} has created something for you"
            html = f"""
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#f8f7f5">
          <div style="background:#000;padding:40px;text-align:center">
            <span style="font-family:Georgia,serif;font-weight:700;font-size:48px;color:#fff">ov<em>yu</em></span>
          </div>
          <div style="padding:48px 40px;background:#f8f7f5;text-align:center">
            <h1 style="font-family:Georgia,serif;font-size:36px;color:#1a1a1a;margin:0 0 12px">{maker_name} has created something for you.</h1>
            <p style="font-size:20px;color:#888;margin:0 0 24px">They&apos;ve chosen you as their Keeper on Ovyu.</p>
            <p style="font-size:16px;color:#444;margin:0 0 16px;max-width:420px;display:inline-block;text-align:center">Ovyu is a private platform where a person leaves a piece of themselves — their voice, stories, and memories — for one person they love. {maker_name} chose you.</p>
            <p style="font-size:16px;color:#444;margin:0 0 28px;max-width:420px;display:inline-block;text-align:center">Before anything begins, you&apos;ll need to review and sign a short agreement. It explains what you&apos;re receiving, on what terms, and what it means to say yes.</p>
            <p style="font-size:12px;color:#888;font-style:italic;margin:0 0 24px">By continuing you agree to Ovyu&apos;s Terms of Use and Privacy Policy.</p>
            <a href="{invite_url}" style="display:inline-block;background:#c9a84c;color:#fff;font-size:16px;font-weight:700;padding:16px 40px;border-radius:11px;text-decoration:none">Review and sign the agreement</a>
            <p style="font-size:12px;color:#888;font-style:italic;margin:24px 0 0">This button takes you back to ovyu.com to confirm your account and continue.</p>
          </div>
          <div style="background:#d9d9d9;padding:20px;text-align:center;font-size:13px;color:#888">
            ovyu.com &nbsp;·&nbsp; You received this because someone named you as their Keeper. If this is a mistake, you may decline.
          </div>
        </div>
            """
        self._send(invitee_email, subject, html)

    def send_keeper_signed_confirmation(self, keeper_email: str, maker_name: str, login_url: str) -> None:
        subject = "Thank you for signing — Ovyu"
        html = f"""
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#f8f7f5">
          <div style="background:#000;padding:40px;text-align:center">
            <span style="font-family:Georgia,serif;font-weight:700;font-size:48px;color:#fff">ov<em>yu</em></span>
          </div>
          <div style="padding:56px 40px;background:#f8f7f5;text-align:center">
            <h1 style="font-family:Georgia,serif;font-style:italic;font-size:36px;color:#1a1a1a;margin:0 0 12px">Thank you for signing.</h1>
            <p style="font-size:20px;color:#444;margin:0 0 36px">{maker_name} has been notified.</p>
            <div style="text-align:left;max-width:480px;margin:0 auto">
              <p style="font-size:16px;color:#444;line-height:1.7;margin:0 0 16px">What you signed is now in place. {maker_name} will begin putting together what they want to leave for you, in their own time.</p>
              <p style="font-size:16px;color:#444;line-height:1.7;margin:0 0 36px">When {maker_name} passes, it will be on you to come back and activate the transfer. That&apos;s how you&apos;ll receive what they&apos;ve left. Nothing happens automatically.</p>
            </div>
            <a href="{login_url}" style="display:inline-block;background:#c9a84c;color:#fff;font-size:16px;font-weight:700;padding:16px 40px;border-radius:11px;text-decoration:none">Log in to view contract</a>
            <p style="font-size:12px;color:#888;font-style:italic;margin:16px 0 0">By continuing you agree to Ovyu&apos;s Terms of Use and Privacy Policy.<br>You can return to your agreement at any time by logging in to ovyu.com.</p>
          </div>
          <div style="background:#d9d9d9;padding:20px;text-align:center;font-size:13px;color:#888">
            ovyu.com &nbsp;·&nbsp; This is a transactional email sent because you signed your agreement.
          </div>
        </div>
        """
        self._send(keeper_email, subject, html)

    def send_tc_signed_confirmation(self, tc_email: str, maker_name: str, keeper_name: str) -> None:
        subject = f"Thank you for signing — Ovyu"
        html = f"""
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#f8f7f5">
          <div style="background:#000;padding:40px;text-align:center">
            <span style="font-family:Georgia,serif;font-weight:700;font-size:48px;color:#fff">ov<em>yu</em></span>
          </div>
          <div style="padding:56px 40px;background:#f8f7f5;text-align:center">
            <h1 style="font-family:Georgia,serif;font-style:italic;font-size:36px;color:#1a1a1a;margin:0 0 12px">Thank you for signing.</h1>
            <p style="font-size:20px;color:#444;margin:0 0 36px">{maker_name} has been notified.</p>
            <div style="text-align:left;max-width:520px;margin:0 auto">
              <p style="font-size:16px;color:#444;line-height:1.7;margin:0 0 16px">You've agreed to one thing: when {maker_name} passes, you'll let Ovyu know. That's what activates the transfer to {keeper_name}.</p>
              <p style="font-size:16px;color:#444;line-height:1.7;margin:0 0 16px">You won't see what {maker_name} is leaving. You won't be involved in what {keeper_name} receives. Your role begins and ends with that one notification.</p>
              <p style="font-size:16px;color:#444;line-height:1.7;margin:0 0 16px">{maker_name} is recording a welcome message for {keeper_name} that will play when the transfer begins. You don't need to explain anything to {keeper_name}, or speak with them at all. Once you've notified Ovyu, we take it from there.</p>
              <p style="font-size:16px;color:#444;line-height:1.7;margin:0 0 16px">A copy of what you signed is attached to this email. Please save it. You won't have an Ovyu account, so this is your record.</p>
              <p style="font-size:16px;color:#444;line-height:1.7;margin:0">Until {maker_name} passes, there's nothing you need to do.</p>
            </div>
          </div>
          <div style="background:#d9d9d9;padding:20px;text-align:center;font-size:13px;color:#888">
            ovyu.com &nbsp;·&nbsp; This is a transactional email sent because you signed as a Transfer Contact.
          </div>
        </div>
        """
        self._send(tc_email, subject, html)

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

    def send_contract_locked(self, maker_email: str, signer_name: str, is_tc: bool = False) -> None:
        role_label = "Transfer Contact" if is_tc else "Keeper"
        html = f"""
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#f8f7f5">
          <div style="background:#000;padding:40px;text-align:center">
            <span style="font-family:Georgia,serif;font-weight:700;font-size:48px;color:#fff">ov<em>yu</em></span>
          </div>
          <div style="padding:56px 40px;background:#f8f7f5;text-align:center">
            <h1 style="font-family:Georgia,serif;font-style:italic;font-size:36px;color:#1a1a1a;margin:0 0 12px">Your contract is locked.</h1>
            <p style="font-size:20px;color:#444;margin:0 0 8px">{signer_name} has signed. You&apos;re ready to begin.</p>
            <p style="font-size:16px;color:#888;margin:0 0 40px">Everything is in place. When you&apos;re ready, start with a welcome message — a short video or voice recording that will be the first thing they receive.</p>
            <a href="{settings.frontend_url}/login" style="display:inline-block;background:#c9a84c;color:#fff;font-size:16px;font-weight:700;padding:16px 40px;border-radius:11px;text-decoration:none">Begin my upload</a>
          </div>
          <div style="background:#d9d9d9;padding:20px;text-align:center;font-size:13px;color:#888">
            ovyu.com &nbsp;·&nbsp; You received this because your {role_label} completed the contract.
          </div>
        </div>
        """
        self._send(maker_email, "Your contract is locked — Ovyu", html)
