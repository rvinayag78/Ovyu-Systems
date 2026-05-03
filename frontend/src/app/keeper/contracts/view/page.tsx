"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { api } from "@/lib/api";

type Contract = {
  id: string; path: string; status: string;
  maker_name?: string; keeper_name?: string; tc_name?: string; relationship?: string;
  maker_signed_at?: string; locked_at?: string;
};

function fmt(iso?: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

function ContractViewInner() {
  const params = useSearchParams();
  const contractId = params.get("id") ?? sessionStorage.getItem("ovyu_contract_id") ?? "";

  const [contract, setContract] = useState<Contract | null>(null);
  const [error, setError] = useState("");
  const [initial, setInitial] = useState("?");

  useEffect(() => {
    const name = sessionStorage.getItem("ovyu_maker_name") ?? "";
    setInitial(name[0]?.toUpperCase() ?? "?");

    if (!contractId) return;
    api.getContract(contractId)
      .then(d => setContract(d as Contract))
      .catch(() => setError("Contract not found."));
  }, [contractId]);

  if (error) return (
    <div className="ovyu-page">
      <Header variant="loggedIn" initial={initial} />
      <main className="ovyu-main" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "var(--ovyu-error)" }}>{error}</p>
      </main>
      <Footer />
    </div>
  );

  if (!contract) return (
    <div className="ovyu-page">
      <Header variant="loggedIn" initial={initial} />
      <main className="ovyu-main" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "var(--ovyu-muted)" }}>Loading…</p>
      </main>
      <Footer />
    </div>
  );

  const maker = contract.maker_name ?? "the Maker";
  const keeper = contract.keeper_name ?? "the Keeper";
  const isPrivate = contract.path === "private";
  const tcName = contract.tc_name ?? "[Transfer Contact]";
  const makerSigned = fmt(contract.maker_signed_at);
  const keeperSigned = fmt(contract.locked_at);

  return (
    <div className="ovyu-page">
      <Header variant="loggedIn" initial={initial} />
      <main className="ovyu-main">
        {/* Title row */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontFamily: "var(--ovyu-font-serif)", fontSize: "clamp(36px,4vw,64px)", color: "var(--ovyu-ink)", margin: "0 0 8px" }}>
            <em>ovyu</em> Agreement
          </h1>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px 48px", alignItems: "center" }}>
            <span style={{ fontSize: 18, color: "var(--ovyu-ink)", fontStyle: "italic" }}>
              Between {maker} and {keeper}
            </span>
            {makerSigned && (
              <span style={{ fontSize: 16, color: "var(--ovyu-muted)", fontStyle: "italic" }}>
                Signed by {maker} on {makerSigned}
              </span>
            )}
            {keeperSigned && (
              <span style={{ fontSize: 16, color: "var(--ovyu-muted)", fontStyle: "italic" }}>
                Signed by {keeper} on {keeperSigned}
              </span>
            )}
            <button
              onClick={() => window.print()}
              style={{ fontSize: 16, color: "var(--ovyu-ink)", background: "none", border: "none", cursor: "pointer", padding: 0, marginLeft: "auto" }}
            >
              Download ⤓
            </button>
          </div>
        </div>

        {/* Contract body */}
        <div style={{ background: "#fff", padding: "40px 48px", display: "flex", gap: 66, flexWrap: "wrap" }}>
          {/* Left column */}
          <div style={{ flex: "1 1 500px", display: "flex", flexDirection: "column", gap: 20 }}>
            <Section title="What this is">
              {maker} has chosen to leave a piece of themselves — in their voice, stories, and memories — for {keeper} to receive after they&apos;re gone. Ovyu is the platform that holds it and delivers it. This agreement is between the two of them. Ovyu is a witness, not a party.
            </Section>

            <Section title={`What ${maker} is leaving for ${keeper}.`}>
              A private upload made by {maker}, in their own time. It may include their voice, recorded stories, written memories, and a welcome message recorded for {keeper}.<br /><br />
              The upload is created entirely by {maker}. Ovyu does not edit, alter, or generate content on their behalf. Their voice is cloned through ElevenLabs to allow {keeper} to have a conversation with what they&apos;ve left, using only the words and memories they chose to share.
            </Section>

            <Section title={`When ${keeper} receives it.`}>
              After {maker} passes, the transfer is activated by {isPrivate ? tcName : "the Transfer Contact"}, who {maker} has chosen for that role. Once activated, {keeper} is notified and can begin accessing what {maker} has left.<br /><br />
              The transfer does not happen automatically. It requires a human action from the Transfer Contact.
            </Section>

            <Section title={`What ${keeper} agrees to.`}>
              To receive what {maker} has left, privately, for themselves.<br /><br />
              Not to share, copy, distribute, or publish any part of the upload, including {maker}&apos;s voice, stories, or any conversation generated from their cloned voice.<br /><br />
              To treat what they receive as a private gift between two people.
            </Section>
          </div>

          {/* Right column */}
          <div style={{ flex: "1 1 500px", display: "flex", flexDirection: "column", gap: 20 }}>
            <Section title="Withdrawing.">
              Either {maker} or {keeper} may withdraw from this agreement at any time before the transfer is activated.<br /><br />
              If {maker} withdraws, the upload is deleted. {keeper} is told the agreement was withdrawn, but not why.<br /><br />
              If {keeper} withdraws, {maker} is told they&apos;ve stepped back, but not why. {maker} may choose to name a different Keeper, or stop entirely.<br /><br />
              After the transfer is activated, the upload belongs to {keeper}. They can stop using it at any time and can ask Ovyu to delete it.
            </Section>

            <Section title="What Ovyu does.">
              Stores the upload, the voice clone, and this agreement, securely.<br /><br />
              Delivers the upload to {keeper} when the transfer is activated, and not before.<br /><br />
              Does not share, sell, or retain personal data beyond what is required to operate this service.<br /><br />
              Does not access the contents of the upload except as required to deliver it.
            </Section>

            <Section title="What Ovyu does not do.">
              Notify anyone of {maker}&apos;s passing. That is the Transfer Contact&apos;s role.<br /><br />
              Verify the death of the Maker. Ovyu acts on the Transfer Contact&apos;s notification.<br /><br />
              Hold the upload indefinitely if the service ends. If Ovyu shuts down, both parties will be notified, and the upload will be made available for export before deletion.
            </Section>
          </div>
        </div>

        <p style={{ textAlign: "right", fontStyle: "italic", fontSize: 14, color: "var(--ovyu-muted)", marginTop: 16 }}>
          Your digital signature carries the same intent as a handwritten signature within the Ovyu platform.
        </p>
      </main>
      <Footer />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p style={{ fontWeight: 700, fontSize: 22, color: "var(--ovyu-gold)", textTransform: "uppercase", marginBottom: 10 }}>
        {title}
      </p>
      <p style={{ fontSize: 16, color: "#444", lineHeight: 1.7, margin: 0 }}>{children}</p>
    </div>
  );
}

export default function KeeperContractViewPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "var(--ovyu-cream)" }} />}>
      <ContractViewInner />
    </Suspense>
  );
}
