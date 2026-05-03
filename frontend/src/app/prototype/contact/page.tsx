import Link from "next/link";
import ProtoHeader from "../_components/ProtoHeader";
import ProtoFooter from "../_components/ProtoFooter";
import ProtoNav from "../_components/ProtoNav";

const serif = "Georgia, serif";
const sans = "Helvetica Neue, Helvetica, Arial, sans-serif";

export default function PrototypeContact() {
  return (
    <div style={{
      width: "1920px",
      height: "1080px",
      background: "#f8f7f5",
      position: "relative",
      overflow: "hidden",
    }}>
      <ProtoHeader variant="loggedin" />

      <div style={{
        position: "absolute",
        left: "210px",
        top: "185px",
        width: "1500px",
        display: "flex",
        flexDirection: "column",
        gap: "51px",
      }}>
        {/* Title block */}
        <div style={{ width: "1029px", display: "flex", flexDirection: "column", gap: "12px" }}>
          <h1 style={{
            fontFamily: serif, fontWeight: 400, fontSize: "64px", color: "#1a1a1a",
            margin: 0, lineHeight: "normal",
          }}>Contact.</h1>
          <p style={{
            fontFamily: serif, fontStyle: "italic", fontWeight: 400,
            fontSize: "30px", color: "#1a1a1a", margin: 0,
          }}>
            We read every message. We&apos;ll get back to you within two business days.
          </p>
        </div>

        {/* Two columns */}
        <div style={{ display: "flex", flexDirection: "row", gap: "211px", width: "1500px" }}>
          {/* Left: form */}
          <div style={{ width: "920px", display: "flex", flexDirection: "column", gap: "30px" }}>
            <p style={{ fontFamily: sans, fontWeight: 700, fontSize: "18px", color: "#c9a84c", margin: 0 }}>
              SEND A MESSAGE
            </p>

            {/* Name + Email row */}
            <div style={{ display: "flex", flexDirection: "row", gap: "35px" }}>
              {[
                { label: "Name", placeholder: "First, middle, and last name" },
                { label: "Email", placeholder: "you@example.com" },
              ].map((f) => (
                <div key={f.label} style={{ display: "flex", flexDirection: "column", gap: "8px", width: "400px" }}>
                  <label style={{ fontFamily: sans, fontWeight: 700, fontSize: "16px", color: "#444" }}>{f.label}</label>
                  <input readOnly placeholder={f.placeholder} style={{
                    height: "57px", background: "#fff", border: "1px solid #888", borderRadius: "10px",
                    padding: "10px", fontFamily: sans, fontWeight: 400, fontSize: "14px", color: "#888",
                    boxSizing: "border-box", width: "100%",
                  }} />
                </div>
              ))}
            </div>

            {/* Message area */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", width: "920px" }}>
              <label style={{ fontFamily: sans, fontWeight: 700, fontSize: "16px", color: "#444" }}>Message</label>
              <textarea readOnly placeholder="Tell us what's on your mind" style={{
                width: "920px", height: "178px",
                background: "#fff", border: "1px solid #888", borderRadius: "10px",
                padding: "20px", fontFamily: sans, fontWeight: 400, fontSize: "14px", color: "#888",
                boxSizing: "border-box", resize: "none",
              }} />
              <p style={{ fontFamily: sans, fontWeight: 400, fontSize: "18px", color: "#888", margin: 0 }}>
                If your message is about an active contract or transfer, please include the name on the agreement so we can find it.
              </p>
            </div>

            {/* Send button */}
            <Link href="/prototype/contact/sent" style={{
              width: "158px", height: "57px",
              background: "#000",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: sans, fontWeight: 400, fontSize: "22px", color: "#f5f0e8",
              textDecoration: "none",
            }}>Send</Link>
          </div>

          {/* Right: direct email */}
          <div style={{ width: "300px", display: "flex", flexDirection: "column", gap: "30px" }}>
            <p style={{ fontFamily: sans, fontWeight: 700, fontSize: "18px", color: "#c9a84c", margin: 0 }}>
              OR EMAIL US DIRECTLY
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <p style={{ fontFamily: serif, fontStyle: "italic", fontWeight: 400, fontSize: "30px", color: "#000", margin: 0 }}>
                hello@ovyu.com
              </p>
              <div style={{ height: "1px", background: "#000", width: "100%" }} />
              <p style={{ fontFamily: sans, fontWeight: 400, fontSize: "18px", color: "#888", margin: 0 }}>
                Either reaches the same place.
              </p>
            </div>
          </div>
        </div>
      </div>

      <ProtoFooter />
      <ProtoNav />
    </div>
  );
}
