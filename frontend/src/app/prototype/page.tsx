import Link from "next/link";
import Image from "next/image";
import ProtoHeader from "./_components/ProtoHeader";
import ProtoFooter from "./_components/ProtoFooter";
import ProtoNav from "./_components/ProtoNav";

const serif = "Georgia, serif";
const sans = "Helvetica Neue, Helvetica, Arial, sans-serif";

export default function PrototypeHome() {
  return (
    <div style={{
      width: "1920px",
      height: "1080px",
      background: "#f8f7f5",
      position: "relative",
      overflow: "hidden",
    }}>
      <ProtoHeader variant="loggedout" />

      {/* Main content */}
      <div style={{
        position: "absolute",
        left: "179px",
        top: "148px",
        width: "1500px",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        {/* Left side */}
        <div style={{ width: "532px", display: "flex", flexDirection: "column", gap: "25px" }}>
          <h1 style={{
            fontFamily: serif,
            fontSize: "88px",
            color: "#1a1a1a",
            whiteSpace: "nowrap",
            margin: 0,
            lineHeight: "normal",
          }}>
            <span style={{ fontWeight: 400 }}>A bit</span>
            <em style={{ fontWeight: 400 }}> of you.</em>
          </h1>
          <p style={{
            fontFamily: sans,
            fontWeight: 400,
            fontSize: "22px",
            color: "#444",
            margin: 0,
          }}>
            Keep yourself for the one person who needs you most.
          </p>
          <p style={{
            fontFamily: sans,
            fontWeight: 300,
            fontSize: "18px",
            color: "#888",
            width: "473px",
            margin: 0,
            lineHeight: "normal",
          }}>
            Ovyu lets you leave a piece of yourself — your voice, your stories, your presence — for the one person who will need it most when you are gone.
          </p>
          <Link href="/prototype/begin" style={{
            width: "263px",
            height: "63px",
            background: "#c9a84c",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: sans,
            fontWeight: 400,
            fontSize: "22px",
            color: "#fff",
            textDecoration: "none",
          }}>
            Begin  →
          </Link>
        </div>

        {/* Sidebar */}
        <div style={{
          width: "378px",
          height: "783px",
          background: "#fff",
          border: "1.666px solid #ddd",
          padding: "41px 35px",
          display: "flex",
          flexDirection: "column",
          gap: "50px",
          alignItems: "center",
          boxSizing: "border-box",
        }}>
          {/* Step 1 */}
          <div style={{ height: "154px", display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "center" }}>
            <Image src="/ovyu-01-contract.svg" alt="01 The Contract" width={302} height={46} />
            <p style={{
              fontFamily: sans,
              fontStyle: "italic",
              fontWeight: 400,
              fontSize: "16px",
              color: "#888",
              width: "309px",
              textAlign: "center",
              margin: 0,
            }}>
              You and your Keeper agree on the terms before anything begins.
            </p>
          </div>

          <div style={{ width: "284px", height: "2.5px", background: "#d9d9d9" }} />

          {/* Step 2 */}
          <div style={{ height: "153px", display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "center" }}>
            <Image src="/ovyu-02-upload.svg" alt="02 The Upload" width={281} height={46} />
            <p style={{
              fontFamily: sans,
              fontStyle: "italic",
              fontWeight: 400,
              fontSize: "16px",
              color: "#888",
              width: "286px",
              textAlign: "center",
              margin: 0,
            }}>
              You share your voice, memories, and stories at your own pace.
            </p>
          </div>

          <div style={{ width: "284px", height: "2.5px", background: "#d9d9d9" }} />

          {/* Step 3 */}
          <div style={{ height: "153px", display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "center" }}>
            <Image src="/ovyu-03-transfer.svg" alt="03 The Transfer" width={301} height={59} />
            <p style={{
              fontFamily: sans,
              fontStyle: "italic",
              fontWeight: 400,
              fontSize: "16px",
              color: "#888",
              width: "286px",
              textAlign: "center",
              margin: 0,
            }}>
              When the time comes, your Keeper receives what you left for them.
            </p>
          </div>
        </div>
      </div>

      <ProtoFooter />
      <ProtoNav />
    </div>
  );
}
