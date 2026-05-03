import Link from "next/link";
import ProtoHeader from "../_components/ProtoHeader";
import ProtoFooter from "../_components/ProtoFooter";
import ProtoNav from "../_components/ProtoNav";

const serif = "Georgia, serif";
const sans = "Helvetica Neue, Helvetica, Arial, sans-serif";

export default function PrototypeEmailVerified() {
  return (
    <div style={{
      width: "1920px",
      height: "1080px",
      background: "#f8f7f5",
      position: "relative",
      overflow: "hidden",
    }}>
      <ProtoHeader variant="loggedin" />

      {/* Content block */}
      <div style={{
        position: "absolute",
        left: "575px",
        top: "238px",
        width: "770px",
        display: "flex",
        flexDirection: "column",
        gap: "47px",
        alignItems: "center",
      }}>
        {/* Purple checkmark circle */}
        <div style={{
          width: "123px",
          height: "123px",
          background: "#4b3c5e",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <span style={{
            fontFamily: serif,
            fontStyle: "italic",
            fontWeight: 400,
            fontSize: "64px",
            color: "#fff",
          }}>✓</span>
        </div>

        {/* Text block */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: "42px",
          alignItems: "center",
          width: "100%",
        }}>
          {/* H1 */}
          <div style={{ textAlign: "center" }}>
            <p style={{
              fontFamily: serif,
              fontWeight: 400,
              fontSize: "64px",
              color: "#1a1a1a",
              margin: 0,
              textAlign: "center",
              lineHeight: "normal",
            }}>Your email is verified.</p>
            <p style={{
              fontFamily: serif,
              fontStyle: "italic",
              fontWeight: 400,
              fontSize: "64px",
              color: "#1a1a1a",
              margin: 0,
              textAlign: "center",
              lineHeight: "normal",
            }}>Let&apos;s review your contract.</p>
          </div>

          {/* Subtitle */}
          <p style={{
            fontFamily: sans,
            fontWeight: 400,
            fontSize: "22px",
            color: "#444",
            textAlign: "center",
            margin: 0,
          }}>
            Your account is set up. Below is your contract — read it carefully, then sign to lock everything in place.
          </p>

          {/* CTA */}
          <Link href="/prototype/contract" style={{
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
            Review my contract →
          </Link>

          {/* Footer note */}
          <p style={{
            fontFamily: sans,
            fontStyle: "italic",
            fontWeight: 400,
            fontSize: "16px",
            color: "#444",
            textAlign: "center",
            margin: 0,
          }}>
            Once both you and your Keeper have signed, the contract is locked and you can begin your upload.
          </p>
        </div>
      </div>

      <ProtoFooter />
      <ProtoNav />
    </div>
  );
}
