/**
 * PROTOTYPE — Figma 2026:696 "Sound of You / voice/profile"
 * Strictly from Figma node data. No API calls. Static layout only.
 *
 * SPEC FROM FIGMA 2026:696
 * ─────────────────────────────────────────────────────────────
 * Header:               real <Header /> component (1920px locked)
 * Back link (2026:705): left-110px top-134px → paddingTop:31px gives 103+31=134 ✓
 * Title    (2026:709):  left-110px, center-y 225.5px, w-1700px, Georgia Italic 64px #1a1a1a
 * Subtitle (2026:710):  left-110px, center-y 300px,   w-1256px, Helvetica Oblique 22px #888
 * Content  (2186:9002): left-110px top-375px, w-1673px h-697px, flex-col items-start justify-between
 *   Script row (2026:793): flex justify-between items-center w-full
 *     Left col  (2026:786): flex-col gap-10px
 *       Label (2026:787): Helvetica Bold 22px #6a4d7d whitespace-nowrap
 *       Text  (2026:788): Helvetica Oblique 16px #1a1a1a w-760px lineHeight 1.3
 *     Right col (2026:791): Helvetica Oblique 16px #1a1a1a w-800px lineHeight 1.3
 *   Start recording (2026:781): 214×49px bg #efeaf2 border #6a4d7d radius 15px
 *   Checkbox group  (2026:723): flex-col gap-19px items-center
 *     Row (2026:724): w-209px h-24px; checkbox 24px; label left-34px Oblique 16px #888
 *     Save (2040:1026): 304×48px bg #efeaf2 radius 8px
 * Hint text (2185:8047): left-50px Oblique 16px #888 (above YOU bar)
 * YOU bar:              real <YouBar /> component (locked state)
 * Footer:               real <Footer /> component
 *
 * VERTICAL SPACING (from Figma absolute top values):
 *   paddingTop: 31px on outer div  → back link at 134px (103 header + 31)
 *   back link marginBottom: 32px   → title top at ~187px
 *   title marginBottom: 10px       → subtitle top at ~274px (tight per Figma)
 *   subtitle marginBottom: 49px    → content top at 375px
 */

"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { YouBar } from "@/components/YouBar";
import Link from "next/link";

const serif = "Georgia, serif";
const sans = "Helvetica Neue, Helvetica, Arial, sans-serif";

const LEFT_PARAS = [
  "My name is [name]. I am recording this because I have chosen to leave a piece of myself behind for someone I love. When I pass, that person will be able to come here and have a conversation with what I have left: my voice, my stories, my memories, the way I think and talk and see the world. Ovyu holds all of it securely and delivers it to them when the time comes. Only they will ever have access to it.",
  "Once this recording is done, my full profile unlocks. And before I go further: I am just going to talk the way I normally talk. The more like myself I sound now, the more like myself I will sound to them later. So this is me, ordinary voice, no performance.",
  "My profile is built across eight dimensions, and together they add up to me. Voice is the one I am doing right now, the sound of how I actually talk. History is where I come from and the moments that changed things. Relationships is the people who shaped me, and how I am with them. How I think is the way I work things out. How I talk is my phrases, my humor, the words that are mine. How I live is what an ordinary day actually looks like. Beliefs is what I hold onto and will not apologize for. And Heart is what moves me, what I love, what I cannot stand. I can move through them in any order I like.",
  "Each one starts with a few quick questions, the things Ovyu wants to get right. I can edit any of those answers anytime. After that, I add as much as I want, recorded or written, whenever something comes to me. If I hit a wall and do not know what to add for an entry, I can refer to a rotating list of questions designed to open something up and get me thinking and talking within that dimension. They are specific to wherever I am in the upload.",
];

const RIGHT_PARAS = [
  "As I go, Ovyu will ask me small things: who was in this story, where it happened, when it was. All of it is optional, but the more I share, the fuller the picture becomes, and the more of me there is to find later.",
  "All of that is me, the eight dimensions, and that is what every person I leave something for will meet.",
  "Then there is the part I build for one person in particular. This works the same way, my own questions to answer, my own entries to add, the same small tags for the people and places and times that come up, but all of it is turned toward them. Everything I know and notice about who they are, and who they are becoming. A welcome, for the moment they arrive. Messages for the moments still ahead of them, the ones I will not be there for. What I want for them. What I want them to know. And my advice, for the times they will need it. This part is as deep as everything else, and it is built for them alone.",
  "And if there is more than one person I want to leave something for, I do not start over. The eight dimensions are already me, they carry across to everyone. For each new person, I just build their part, their questions, their entries, everything turned toward them. So the me stays the same. What I gather and say for each of them is theirs alone.",
  "One thing about these early recordings: while I am getting started, what I record also helps Ovyu learn the sound of my voice. So for now, it really does need to be me. No getting my brother to do it in a funny accent.",
  "Well. That was a lot to take in, and also a lot to say out loud. But I think I have a sense of what I am building here and why it matters. Time to begin.",
];

export default function VoiceProfilePrototype() {
  return (
    <div style={{ width: "1920px", background: "#f8f7f5", display: "flex", flexDirection: "column" }}>

      {/* Uses the real Header component — 1920px locked, no zoom drift */}
      <Header variant="loggedIn" initial="L" />

      <div style={{ flex: 1, paddingTop: "31px", paddingBottom: "30px" }}>
        {/* Container: marginLeft 110px per Figma absolute left-[110px] */}
        <div style={{ marginLeft: "110px", display: "flex", flexDirection: "column" }}>

          {/* Back link (2026:705) */}
          <Link href="/prototype" style={{
            display: "flex", alignItems: "center", gap: "10px",
            fontFamily: sans, fontSize: "16px", color: "#888", textDecoration: "none",
            marginBottom: "32px",
          }}>
            <span>‹</span>
            Your contracts
          </Link>

          {/* Title (2026:709) — w-1700px, Georgia Italic 64px, center-y 225.5px → marginBottom 10px */}
          <h1 style={{
            fontFamily: serif, fontStyle: "italic", fontWeight: 400,
            fontSize: "64px", color: "#1a1a1a",
            margin: 0, marginBottom: "10px",
            lineHeight: "normal", width: "1700px",
          }}>
            The sound of you
          </h1>

          {/* Subtitle (2026:710) — w-1256px, Oblique 22px #888, center-y 300px → marginBottom 49px */}
          <p style={{
            fontFamily: sans, fontStyle: "oblique", fontWeight: 400,
            fontSize: "22px", color: "#888",
            margin: 0, marginBottom: "49px",
            lineHeight: "normal", width: "1256px",
          }}>
            Read this aloud. Your voice, saying these words, is what we keep. And as you read, you&apos;ll learn exactly what you&apos;re building here.
            {" "}Speak at the pace you&apos;d use to tell a story to someone you trust. If you slow down, that&apos;s right. If you pause, that&apos;s right too.
          </p>

          {/* Content area (2186:9002) — w-1673px h-697px flex-col items-start justify-between */}
          <div style={{
            width: "1673px", height: "697px",
            display: "flex", flexDirection: "column",
            alignItems: "flex-start", justifyContent: "space-between",
          }}>

            {/* 1st child: script two-column row (2026:793) — flex justify-between items-center w-full */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>

              {/* Left col (2026:786) — flex-col gap-10px */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {/* Label (2026:787) — Helvetica Bold 22px #6a4d7d */}
                <p style={{ fontFamily: sans, fontWeight: 700, fontSize: "22px", color: "#6a4d7d", margin: 0, whiteSpace: "nowrap" }}>
                  READ THIS ALOUD
                </p>
                {/* Text (2026:788) — Oblique 16px #1a1a1a w-760px lineHeight 1.3 */}
                <div style={{ fontFamily: sans, fontStyle: "oblique", fontSize: "16px", color: "#1a1a1a", lineHeight: 1.3, width: "760px" }}>
                  {LEFT_PARAS.map((p, i) => (
                    <p key={i} style={{ margin: 0, marginBottom: i < LEFT_PARAS.length - 1 ? "1.3em" : 0 }}>{p}</p>
                  ))}
                </div>
              </div>

              {/* Right col (2026:791) — Oblique 16px #1a1a1a w-800px lineHeight 1.3 */}
              <div style={{ fontFamily: sans, fontStyle: "oblique", fontSize: "16px", color: "#1a1a1a", lineHeight: 1.3, width: "800px" }}>
                {RIGHT_PARAS.map((p, i) => (
                  <p key={i} style={{ margin: 0, marginBottom: i < RIGHT_PARAS.length - 1 ? "1.3em" : 0 }}>{p}</p>
                ))}
              </div>
            </div>

            {/* 2nd child: Start recording (2026:781) — 214×49px bg #efeaf2 border #6a4d7d radius 15px */}
            <div style={{
              width: "214px", height: "49px",
              background: "#efeaf2", border: "1px solid #6a4d7d", borderRadius: "15px",
              boxSizing: "border-box",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
              cursor: "default",
            }}>
              <span style={{ width: "13px", height: "13px", borderRadius: "50%", background: "#6a4d7d", display: "inline-block", flexShrink: 0 }} />
              <span style={{ fontFamily: sans, fontSize: "22px", color: "#6a4d7d" }}>Start recording</span>
            </div>

            {/* 3rd child: Checkbox + save (2026:723) — flex-col gap-19px items-center */}
            <div style={{ display: "flex", flexDirection: "column", gap: "19px", alignItems: "center" }}>
              {/* Checkbox row (2026:724) — w-209px h-24px */}
              <div style={{ width: "209px", height: "24px", position: "relative", flexShrink: 0 }}>
                <div style={{
                  position: "absolute", left: 0, top: 0,
                  width: "24px", height: "24px",
                  border: "1px solid #888", borderRadius: "4px", background: "#fff",
                }} />
                {/* Label (2026:726) — left-34px Oblique 16px #888 whitespace-nowrap */}
                <span style={{
                  position: "absolute", left: "34px", top: "50%", transform: "translateY(-50%)",
                  fontFamily: sans, fontStyle: "oblique", fontSize: "16px", color: "#888",
                  whiteSpace: "nowrap",
                }}>
                  I confirm this is my voice
                </span>
              </div>

              {/* Save button (2040:1026) — 304×48px bg #efeaf2 radius 8px */}
              <div style={{
                width: "304px", height: "48px",
                background: "#efeaf2", borderRadius: "8px",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <span style={{ fontFamily: sans, fontWeight: 700, fontSize: "16px", color: "#bababa" }}>
                  Save and continue →
                </span>
              </div>
            </div>

          </div>{/* end content area */}
        </div>
      </div>

      {/* Hint text (2185:8047) — left-50px Oblique 16px #888 */}
      <div style={{ paddingLeft: "50px", paddingBottom: "12px" }}>
        <p style={{ fontFamily: sans, fontStyle: "oblique", fontSize: "16px", color: "#888", margin: 0 }}>
          Complete your voice recording to unlock your profile.
        </p>
      </div>

      {/* Uses the real YouBar component — locked state */}
      <YouBar voiceComplete={false} />

      {/* Uses the real Footer component */}
      <Footer />

    </div>
  );
}
