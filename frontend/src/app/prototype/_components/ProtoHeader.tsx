import Link from "next/link";
import Image from "next/image";

const serif = "Georgia, serif";
const sans = "Helvetica Neue, Helvetica, Arial, sans-serif";

export default function ProtoHeader({ variant }: { variant: "loggedout" | "loggedin" }) {
  return (
    <div style={{
      width: "1924px",
      height: "103px",
      background: "#fff",
      borderBottom: "3px solid #e1e1e1",
      overflow: "hidden",
      position: "absolute",
      top: 0,
      left: 0,
    }}>
      <div style={{
        maxWidth: "1800px",
        margin: "0 auto",
        height: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        paddingLeft: "0px",
        paddingRight: "0px",
      }}>
        <Link href="/prototype">
          <Image src="/ovyu-wordmark.svg" alt="ovyu" width={113} height={32} style={{ display: "block" }} />
        </Link>
        <div style={{ display: "flex", gap: "117px", alignItems: "center" }}>
          <Link href="/prototype" style={{
            fontFamily: sans,
            fontSize: "16px",
            fontWeight: 400,
            color: "#000",
            textDecoration: "none",
            width: "150px",
            textAlign: "center",
          }}>
            Activate Transfer
          </Link>
          {variant === "loggedout" ? (
            <Link href="/prototype/begin" style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "136px",
              height: "52px",
              background: "#1a1a1a",
              borderRadius: "8px",
              fontFamily: sans,
              fontWeight: 700,
              fontSize: "16px",
              color: "#fff",
              textDecoration: "none",
            }}>
              Log In
            </Link>
          ) : (
            <Link href="/prototype/account" style={{
              width: "51px",
              height: "51px",
              background: "#4b3c5e",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textDecoration: "none",
            }}>
              <span style={{
                fontFamily: serif,
                fontWeight: 400,
                fontSize: "32px",
                color: "#fff",
              }}>L</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
