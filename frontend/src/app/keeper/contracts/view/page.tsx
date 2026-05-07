"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { api } from "@/lib/api";

const serif = "Georgia, serif";
const sans = "Helvetica Neue, Helvetica, Arial, sans-serif";

type Contract = {
  id: string; path: string; status: string;
  maker_name?: string; keeper_name?: string; tc_name?: string; relationship?: string;
  maker_signed_at?: string; locked_at?: string;
};

function fmt(iso?: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p style={{ fontFamily: sans, fontWeight: 700, fontSize: "22px", color: "#c9a84c", textTransform: "uppercase", marginBottom: "10px", margin: "0 0 10px" }}>
        {title}
      </p>
      <p style={{ fontFamily: sans, fontSize: "16px", color: "#444", lineHeight: "1.5", margin: 0 }}>{children}</p>
    </div>
  );
}

function ContractViewInner() {
  const params = useSearchParams();
  const contractId = params.get("id") ?? sessionStorage.getItem("ovyu_contract_id") ?? "";
  const autoPrint = params.get("print") === "1";

  const [contract, setContract] = useState<Contract | null>(null);
  const [error, setError] = useState("");
  const [initial, setInitial] = useState("?");

  useEffect(() => {
    const name = sessionStorage.getItem("ovyu_keeper_name") ?? sessionStorage.getItem("ovyu_maker_name") ?? "";
    setInitial(name[0]?.toUpperCase() ?? "?");

    if (!contractId) return;
    api.getContract(contractId)
      .then(d => setContract(d as Contract))
      .catch(() => setError("Contract not found."));
  }, [contractId]);

  useEffect(() => {
    if (autoPrint && contract) window.print();
  }, [autoPrint, contract]);

  if (error) return (
    <div style={{ minWidth: "1920px", background: "#f8f7f5", display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header variant="loggedIn" initial={initial} />
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ fontFamily: sans, fontSize: "18px", color: "#B4372C" }}>{error}</p>
      </div>
      <Footer />
    </div>
  );

  if (!contract) return (
    <div style={{ minWidth: "1920px", background: "#f8f7f5", display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header variant="loggedIn" initial={initial} />
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ fontFamily: sans, fontSize: "18px", color: "#888" }}>Loading…</p>
      </div>
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
    <div style={{ minWidth: "1920px", background: "#f8f7f5", display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header variant="loggedIn" initial={initial} />

      <div style={{ flex: 1, paddingTop: "40px", paddingBottom: "40px" }}>
        <div style={{ margin: "0 auto", width: "1804px", display: "flex", flexDirection: "column", gap: "23px" }}>
          {/* Title row */}
          <div>
            <h1 style={{ fontFamily: serif, fontWeight: 400, fontSize: "64px", color: "#1a1a1a", margin: "0 0 8px" }}>
              ov<em>yu</em> Agreement
            </h1>
            <div style={{ display: "flex", gap: "48px", alignItems: "center", flexWrap: "wrap" }}>
              <span style={{ fontFamily: sans, fontSize: "22px", color: "#1a1a1a", fontStyle: "italic" }}>
                Between {maker} and {keeper}
              </span>
              {makerSigned && (
                <span style={{ fontFamily: sans, fontSize: "18px", color: "#888", fontStyle: "italic" }}>
                  Signed by {maker} on {makerSigned}
                </span>
              )}
              {keeperSigned && (
                <span style={{ fontFamily: sans, fontSize: "18px", color: "#888", fontStyle: "italic" }}>
                  Signed by {keeper} on {keeperSigned}
                </span>
              )}
              <button
                onClick={() => window.print()}
                style={{ fontFamily: sans, fontSize: "18px", color: "#1a1a1a", background: "none", border: "none", cursor: "pointer", padding: 0, marginLeft: "auto" }}
              >
                Download ⤓
              </button>
            </div>
          </div>

          {/* Contract body */}
          <div style={{ background: "#fff", padding: "40px", display: "flex", gap: "66px", alignItems: "flex-start", borderRadius: "8px" }}>
            {/* Left column — 760px */}
            <div style={{ width: "760px", flexShrink: 0, display: "flex", flexDirection: "column", gap: "14px" }}>
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

            {/* Right column — 888px */}
            <div style={{ width: "888px", flexShrink: 0, display: "flex", flexDirection: "column", gap: "21px" }}>
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

          <p style={{ fontFamily: sans, fontStyle: "italic", fontSize: "14px", color: "#888", margin: 0, textAlign: "right" }}>
            Your digital signature carries the same intent as a handwritten signature within the Ovyu platform.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default function KeeperContractViewPage() {
  return (
    <Suspense fallback={
      <div style={{ minWidth: "1920px", background: "#f8f7f5", display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <Header variant="loggedIn" initial="?" />
        <div style={{ flex: 1 }} />
        <Footer />
      </div>
    }>
      <ContractViewInner />
    </Suspense>
  );
}
