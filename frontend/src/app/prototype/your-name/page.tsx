"use client";

/**
 * PROTOTYPE — Your Name page
 * Figma 2026:583 "Profile Dashboard"
 *
 * Content container: left-209px, top-134px (103+31), width-1500px, gap-34px
 * Left col: w-432px Georgia Italic 22px lineHeight 44px
 * Right col: w-554px — white card 327px h-50px pad + checkbox group
 * White card: bg white, border 1px #bababa, radius 15px, padding 50px, gap 19px
 * Start recording: 214×49px bg #efeaf2 border #6a4d7d radius 15px
 * Checkbox row: w-209px h-24px, checkbox 24px left, label left-34px Oblique 16px #888
 * Save button: 304×48px bg #efeaf2 radius 8px, text Helvetica Bold 16px #bababa (greyed)
 */

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { YouBar } from "@/components/YouBar";
import Link from "next/link";

const serif = "Georgia, serif";
const sans = "Helvetica Neue, Helvetica, Arial, sans-serif";

export default function YourNamePrototype() {
  return (
    <div style={{ width: "1920px", background: "#f8f7f5", display: "flex", flexDirection: "column" }}>
      <Header variant="loggedIn" initial="L" />

      <div style={{ flex: 1, paddingTop: "31px", paddingBottom: "30px" }}>
        {/* left-209px, width-1500px per Figma 2026:591 */}
        <div style={{ marginLeft: "209px", width: "1500px", display: "flex", flexDirection: "column", gap: "34px" }}>

          {/* Back link */}
          <Link href="/prototype" style={{
            display: "flex", alignItems: "center", gap: "10px",
            fontFamily: sans, fontSize: "16px", color: "#888", textDecoration: "none",
          }}>
            <span style={{ display: "inline-block", transform: "scaleX(-1)" }}>›</span>
            Your contracts
          </Link>

          {/* Heading — gap-13px between title and subtitle */}
          <div style={{ display: "flex", flexDirection: "column", gap: "13px" }}>
            {/* Title w-1700px per Figma (wider than 1500px container — intentional) */}
            <h1 style={{
              fontFamily: serif, fontStyle: "italic", fontWeight: 400,
              fontSize: "64px", color: "#1a1a1a",
              margin: 0, lineHeight: "normal", width: "1700px",
            }}>
              Your name
            </h1>
            <p style={{
              fontFamily: sans, fontStyle: "oblique", fontWeight: 400,
              fontSize: "22px", color: "#888",
              margin: 0, lineHeight: "normal", whiteSpace: "nowrap",
            }}>
              Say it the way the people who love you say it.
            </p>
          </div>

          {/* Content row: left col 432px + right col 554px, justify-between */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", width: "100%" }}>

            {/* Left col: Georgia Italic 22px #1a1a1a lineHeight 44px, w-432px */}
            <div style={{
              fontFamily: serif, fontStyle: "italic", fontWeight: 400,
              fontSize: "22px", color: "#1a1a1a",
              lineHeight: "44px", width: "432px",
            }}>
              Before you begin, we need to hear your name. Not performed. Not spelled out. Just said, the way you actually say it. Read each line aloud, naturally, at your own pace.
            </div>

            {/* Right col: w-554px, flex-col gap-20px items-center */}
            <div style={{ display: "flex", flexDirection: "column", gap: "20px", alignItems: "center", width: "554px" }}>

              {/* White card: bg white, border 1px #bababa, radius 15px, h-327px, padding 50px */}
              <div style={{
                width: "100%", height: "327px",
                background: "#fff", border: "1px solid #bababa", borderRadius: "15px",
                padding: "50px", boxSizing: "border-box",
                display: "flex", flexDirection: "column", justifyContent: "center",
              }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "19px", alignItems: "flex-start" }}>

                  {/* Label: Helvetica Bold 22px #6a4d7d */}
                  <p style={{ fontFamily: sans, fontWeight: 700, fontSize: "22px", color: "#6a4d7d", margin: 0, whiteSpace: "nowrap" }}>
                    READ THIS ALOUD
                  </p>

                  {/* Script: Helvetica Oblique 16px #1a1a1a lineHeight 2 (32px) */}
                  <div style={{ fontFamily: sans, fontStyle: "oblique", fontSize: "16px", color: "#1a1a1a", lineHeight: 2 }}>
                    <p style={{ margin: 0 }}>My name is [full name].</p>
                    <p style={{ margin: 0 }}>Most people call me [preferred name or nickname].</p>
                    <p style={{ margin: 0 }}>Some people also call me [alternative nickname, if any].</p>
                    <p style={{ margin: 0 }}>When I introduce myself, I usually say: hi, I&apos;m [name].</p>
                  </div>

                  {/* Start recording: 214×49px bg #efeaf2 border #6a4d7d radius 15px */}
                  <div style={{
                    width: "214px", height: "49px",
                    background: "#efeaf2", border: "1px solid #6a4d7d", borderRadius: "15px",
                    boxSizing: "border-box",
                    display: "flex", alignItems: "center", gap: "10px",
                    paddingLeft: "23px", cursor: "default",
                  }}>
                    <span style={{ width: "13px", height: "13px", borderRadius: "50%", background: "#6a4d7d", display: "inline-block", flexShrink: 0 }} />
                    <span style={{ fontFamily: sans, fontSize: "22px", color: "#6a4d7d" }}>Start recording</span>
                  </div>

                </div>
              </div>

              {/* Checkbox group: flex-col gap-19px items-center */}
              <div style={{ display: "flex", flexDirection: "column", gap: "19px", alignItems: "center" }}>

                {/* Checkbox row: w-209px h-24px */}
                <div style={{ width: "209px", height: "24px", position: "relative", flexShrink: 0 }}>
                  <div style={{
                    position: "absolute", left: 0, top: 0,
                    width: "24px", height: "24px",
                    border: "1px solid #888", borderRadius: "4px", background: "#fff",
                  }} />
                  <span style={{
                    position: "absolute", left: "34px", top: "50%", transform: "translateY(-50%)",
                    fontFamily: sans, fontStyle: "oblique", fontSize: "16px", color: "#888",
                    whiteSpace: "nowrap",
                  }}>
                    I confirm this is my voice
                  </span>
                </div>

                {/* Save button: 304×48px bg #efeaf2 radius 8px, text #bababa (greyed — checkbox not checked) */}
                <div style={{
                  width: "304px", height: "48px",
                  background: "#efeaf2", borderRadius: "8px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "default",
                }}>
                  <span style={{ fontFamily: sans, fontWeight: 700, fontSize: "16px", color: "#bababa" }}>
                    Save and continue →
                  </span>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Hint text above locked YOU bar */}
      <div style={{ paddingLeft: "50px", paddingBottom: "12px" }}>
        <p style={{ fontFamily: sans, fontStyle: "oblique", fontSize: "16px", color: "#888", margin: 0 }}>
          Complete your voice recording to unlock your profile.
        </p>
      </div>

      <YouBar voiceComplete={false} />
      <Footer />
    </div>
  );
}
