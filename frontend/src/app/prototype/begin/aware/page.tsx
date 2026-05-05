import Link from "next/link";
import ProtoHeader from "../../_components/ProtoHeader";
import ProtoFooter from "../../_components/ProtoFooter";
import ProtoNav from "../../_components/ProtoNav";

const serif = "Georgia, serif";
const sans = "Helvetica Neue, Helvetica, Arial, sans-serif";

function InputField({ label, placeholder, width = 400 }: { label: string; placeholder: string; width?: number }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: `${width}px` }}>
      <label style={{ fontFamily: sans, fontWeight: 700, fontSize: "16px", color: "#444" }}>{label}</label>
      <input
        placeholder={placeholder}
        readOnly
        style={{
          height: "57px",
          background: "#fff",
          border: "1px solid #888",
          borderRadius: "10px",
          padding: "10px",
          fontFamily: sans,
          fontWeight: 400,
          fontSize: "14px",
          color: "#888",
          boxSizing: "border-box",
          width: "100%",
        }}
      />
    </div>
  );
}

export default function PrototypeBeginAware() {
  return (
    <div style={{
      width: "1920px",
      height: "1080px",
      background: "#f8f7f5",
      position: "relative",
      overflow: "hidden",
    }}>
      <ProtoHeader variant="loggedout" />

      <div style={{
        position: "absolute",
        left: "60px",
        top: "241px",
        width: "1800px",
        height: "666px",
      }}>
        <div style={{ position: "absolute", top: "9px" }}>
          <h1 style={{
            fontFamily: serif,
            fontSize: "64px",
            color: "#1a1a1a",
            whiteSpace: "nowrap",
            margin: 0,
            lineHeight: "normal",
          }}>
            <em style={{ fontWeight: 400 }}>Let&apos;s </em>
            <span style={{ fontStyle: "normal", fontWeight: 400 }}>get started.</span>
          </h1>
        </div>

        <div style={{ position: "absolute", top: "80px" }}>
          <p style={{ fontFamily: sans, fontWeight: 400, fontSize: "22px", color: "#444", margin: 0 }}>
            A little about you and who this is for.
          </p>
        </div>

        <div style={{ position: "absolute", top: "150px" }}>
          <p style={{ fontFamily: sans, fontWeight: 700, fontSize: "18px", color: "#c9a84c", margin: 0 }}>
            About You
          </p>
        </div>

        {/* Row 1 — 4 inputs */}
        <div style={{ position: "absolute", top: "185px", height: "92px" }}>
          {[
            { label: "First name", placeholder: "First name", left: 0 },
            { label: "Middle name (if applicable)", placeholder: "Middle name(s) or N/A", left: 414 },
            { label: "Last name", placeholder: "Last name", left: 828 },
            { label: "Your email", placeholder: "you@example.com", left: 1242 },
          ].map((f) => (
            <div key={f.label} style={{ position: "absolute", left: `${f.left}px` }}>
              <InputField label={f.label} placeholder={f.placeholder} />
            </div>
          ))}
        </div>

        {/* Divider */}
        <div style={{
          position: "absolute",
          top: "317px",
          width: "1800px",
          height: "3px",
          background: "#e1e1e1",
        }} />

        {/* Row 2 */}
        <div style={{ position: "absolute", top: "351px" }}>
          <div style={{ position: "absolute", left: "0px" }}>
            <InputField label="Keeper's full name" placeholder="First, middle, and last name" />
          </div>
          <div style={{ position: "absolute", left: "0px", top: "102px" }}>
            <InputField label="Keeper's email" placeholder="email@example.com" />
          </div>

          <div style={{ position: "absolute", left: "414px", display: "flex", flexDirection: "column", gap: "8px", width: "247px" }}>
            <label style={{ fontFamily: sans, fontWeight: 700, fontSize: "16px", color: "#444" }}>Your relationship to them</label>
            <div style={{
              height: "57px",
              background: "#fff",
              border: "1px solid #888",
              borderRadius: "8px",
              padding: "14px",
              display: "flex",
              alignItems: "center",
              fontFamily: sans,
              fontWeight: 400,
              fontSize: "14px",
              color: "#888",
            }}>
              Select Relationship
            </div>
          </div>
        </div>

        {/* Awareness — "Yes" selected */}
        <div style={{ position: "absolute", left: "696px", top: "351px" }}>
          <p style={{ fontFamily: sans, fontWeight: 700, fontSize: "16px", color: "#444", margin: "0 0 12px 0" }}>
            Does the Keeper know about this?
          </p>
          {/* Yes — checked */}
          <div style={{ display: "flex", flexDirection: "row", gap: "10px", alignItems: "center", marginBottom: "12px" }}>
            <div style={{
              width: "24px", height: "24px",
              background: "#444",
              borderRadius: "4px",
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: sans,
              fontWeight: 400,
              fontSize: "14px",
              color: "#f5f0e8",
            }}>✓</div>
            <span style={{ fontFamily: sans, fontWeight: 400, fontSize: "14px", color: "#444" }}>
              Yes, they know and we&apos;re doing this together.
            </span>
          </div>
          {/* No — unchecked */}
          <div style={{ display: "flex", flexDirection: "row", gap: "10px", alignItems: "center" }}>
            <div style={{
              width: "24px", height: "24px",
              background: "#fff",
              border: "1px solid #888",
              borderRadius: "4px",
              flexShrink: 0,
            }} />
            <span style={{ fontFamily: sans, fontWeight: 400, fontSize: "14px", color: "#444" }}>
              No, this is something I&apos;m doing privately.
            </span>
          </div>
        </div>

        {/* Continue button — links to email-verified (aware path) */}
        <Link href="/prototype/email-verified" style={{
          position: "absolute",
          left: "1496px",
          top: "618px",
          width: "304px",
          height: "48px",
          background: "#000",
          borderRadius: "8px",
          textDecoration: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: sans,
          fontWeight: 700,
          fontSize: "16px",
          color: "#f5f0e8",
        }}>
          Continue to verify email →
        </Link>
      </div>

      <ProtoFooter />
      <ProtoNav />
    </div>
  );
}
