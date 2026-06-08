import { useState, useEffect, useRef } from "react";

const PEPTIDES = [
  { id: "bpc157", name: "BPC-157", category: "Healing & Recovery", halfLife: "~4 hours", dose: "250–500 mcg/day", storage: "Refrigerate, use within 30 days", benefits: ["Tendon/ligament repair", "Gut healing", "Anti-inflammatory", "Neuroprotection"], stacks: ["TB-500", "GHK-Cu"] },
  { id: "tb500", name: "TB-500", category: "Healing & Recovery", halfLife: "Days (peptide fragment)", dose: "5–10 mg/week (loading), 2.5 mg/week (maintenance)", storage: "Refrigerate after reconstitution", benefits: ["Muscle repair", "Systemic healing", "Anti-inflammatory", "Flexibility"], stacks: ["BPC-157", "IGF-1 LR3"] },
  { id: "ghkcu", name: "GHK-Cu (Copper Peptide)", category: "Healing & Recovery", halfLife: "~30 minutes (topical), longer systemic", dose: "1–2 mg/day SubQ or topical", storage: "Cool, dark place", benefits: ["Collagen synthesis", "Wound healing", "Anti-aging", "Hair growth"], stacks: ["BPC-157", "Epithalon"] },
  { id: "ll37", name: "LL-37", category: "Healing & Recovery", halfLife: "Short (minutes to hours)", dose: "100–200 mcg/day", storage: "Freeze lyophilized, refrigerate reconstituted", benefits: ["Antimicrobial", "Immune modulation", "Wound healing", "Anti-biofilm"], stacks: ["Thymosin Alpha-1", "BPC-157"] },
  { id: "ipamorelin", name: "Ipamorelin", category: "GH Secretagogues", halfLife: "~2 hours", dose: "200–300 mcg 2–3x/day", storage: "Refrigerate after reconstitution", benefits: ["GH release", "Muscle growth", "Fat loss", "Sleep improvement"], stacks: ["CJC-1295", "Tesamorelin"] },
  { id: "tesamorelin", name: "Tesamorelin", category: "GH Secretagogues", halfLife: "~26–38 minutes", dose: "1–2 mg/day SubQ", storage: "Refrigerate", benefits: ["Visceral fat reduction", "GH stimulation", "Cognitive benefits", "Body composition"], stacks: ["Ipamorelin", "CJC-1295"] },
  { id: "igf1lr3", name: "IGF-1 LR3", category: "GH Secretagogues", halfLife: "~20–30 hours", dose: "20–50 mcg/day", storage: "Freeze lyophilized, refrigerate reconstituted", benefits: ["Muscle hypertrophy", "Fat metabolism", "Recovery", "Cell growth"], stacks: ["TB-500", "Ipamorelin"] },
  { id: "aod9604", name: "AOD-9604", category: "Fat Loss", halfLife: "~30 minutes", dose: "250–300 mcg/day fasted", storage: "Refrigerate after reconstitution", benefits: ["Fat metabolism", "Lipolysis", "No blood sugar impact", "Weight management"], stacks: ["Tesamorelin", "Ipamorelin"] },
  { id: "semaglutide", name: "Semaglutide", category: "Fat Loss", halfLife: "~7 days", dose: "0.25–2.4 mg/week SubQ", storage: "Refrigerate", benefits: ["Appetite suppression", "Weight loss", "Blood sugar control", "Cardiovascular benefits"], stacks: ["AOD-9604"] },
  { id: "epithalon", name: "Epithalon", category: "Longevity & Cellular", halfLife: "Unknown, likely short", dose: "5–10 mg/day for 10–20 day cycles", storage: "Freeze lyophilized", benefits: ["Telomere lengthening", "Anti-aging", "Sleep regulation", "Antioxidant"], stacks: ["GHK-Cu", "MOTS-C"] },
  { id: "motsc", name: "MOTS-C", category: "Longevity & Cellular", halfLife: "~3 hours", dose: "5–10 mg/week", storage: "Freeze lyophilized, refrigerate reconstituted", benefits: ["Metabolic regulation", "Insulin sensitivity", "Exercise performance", "Longevity"], stacks: ["Epithalon", "SS-31"] },
  { id: "ss31", name: "SS-31", category: "Longevity & Cellular", halfLife: "Short", dose: "1–3 mg/day", storage: "Refrigerate", benefits: ["Mitochondrial protection", "Anti-aging", "Cardioprotection", "Neuroprotection"], stacks: ["MOTS-C", "NAD+"] },
  { id: "nad", name: "NAD+", category: "Longevity & Cellular", halfLife: "Short (precursors last longer)", dose: "250–500 mg/day oral (NMN/NR) or 500 mg IV", storage: "Cool, dark, dry", benefits: ["Energy metabolism", "DNA repair", "Cognitive function", "Longevity"], stacks: ["SS-31", "Epithalon"] },
  { id: "ta1", name: "Thymosin Alpha-1", category: "Immune Support", halfLife: "~2 hours", dose: "1.6 mg 2x/week", storage: "Refrigerate after reconstitution", benefits: ["Immune modulation", "Antiviral", "Anti-tumor", "Autoimmune support"], stacks: ["LL-37", "BPC-157"] },
  { id: "pt141", name: "PT-141 (Bremelanotide)", category: "Performance & Libido", halfLife: "~120 minutes", dose: "1–2 mg SubQ 30–45 min before", storage: "Refrigerate after reconstitution", benefits: ["Sexual function", "Libido enhancement", "Erectile function", "Arousal"], stacks: [] },
  { id: "bpctb", name: "BPC-157 / TB-500 (Wolverine Stack)", category: "Stacks & Blends", halfLife: "Combined profile", dose: "250 mcg BPC-157 + 5 mg TB-500 per week", storage: "Refrigerate separately, mix at use", benefits: ["Accelerated healing", "Systemic recovery", "Injury repair", "Anti-inflammatory"], stacks: ["GHK-Cu", "Ipamorelin"] },
  { id: "cjcipamorelin", name: "CJC-1295 / Ipamorelin", category: "Stacks & Blends", halfLife: "CJC: ~6–8 days | Ipa: ~2 hours", dose: "100 mcg CJC + 200 mcg Ipamorelin 2–3x/day", storage: "Refrigerate after reconstitution", benefits: ["Sustained GH release", "Muscle growth", "Fat loss", "Recovery"], stacks: ["AOD-9604", "IGF-1 LR3"] },
  { id: "tesaipamorelin", name: "Tesamorelin / Ipamorelin", category: "Stacks & Blends", halfLife: "Combined profile", dose: "1 mg Tesamorelin + 200 mcg Ipamorelin/day", storage: "Refrigerate", benefits: ["Visceral fat reduction", "GH optimization", "Body recomposition", "Sleep quality"], stacks: ["AOD-9604"] },
  { id: "glow", name: "GLOW Blend (BPC-157 + GHK-Cu)", category: "Stacks & Blends", halfLife: "Combined profile", dose: "250 mcg BPC-157 + 1 mg GHK-Cu/day", storage: "Refrigerate", benefits: ["Skin health", "Collagen production", "Wound healing", "Anti-aging"], stacks: ["Epithalon", "NAD+"] },
  { id: "klow", name: "KLOW Blend (BPC-157 Stack)", category: "Stacks & Blends", halfLife: "Combined profile", dose: "Per product protocol", storage: "Refrigerate", benefits: ["Recovery optimization", "Joint health", "Inflammation reduction", "Systemic healing"], stacks: ["TB-500", "GHK-Cu"] },
];

const CATEGORIES = ["All", ...new Set(PEPTIDES.map(p => p.category))];

const PROTOCOLS = [
  {
    id: "injury", name: "Injury & Recovery", icon: "🩹",
    description: "Accelerate healing from injuries, surgeries, or chronic pain.",
    peptides: ["BPC-157", "TB-500", "GHK-Cu"],
    schedule: [
      { day: "Daily AM", items: ["BPC-157 250 mcg SubQ near injury site"] },
      { day: "Daily PM", items: ["BPC-157 250 mcg SubQ (second dose)"] },
      { day: "Weekly", items: ["TB-500 5 mg SubQ (loading phase, weeks 1–4)", "GHK-Cu 1 mg SubQ or topical"] },
    ],
    cycle: "8–12 weeks loading, 4–6 weeks maintenance",
    notes: "Most effective when injections are near the site of injury. Combine with physical therapy for best results."
  },
  {
    id: "muscle", name: "Muscle & Strength", icon: "💪",
    description: "Maximize muscle hypertrophy, recovery, and performance.",
    peptides: ["CJC-1295/Ipamorelin", "IGF-1 LR3", "TB-500"],
    schedule: [
      { day: "Pre-bed", items: ["CJC-1295 100 mcg + Ipamorelin 200 mcg SubQ"] },
      { day: "Post-workout", items: ["IGF-1 LR3 40 mcg IM into trained muscle"] },
      { day: "Weekly", items: ["TB-500 2.5 mg SubQ (maintenance)"] },
    ],
    cycle: "12 weeks on, 4 weeks off",
    notes: "IGF-1 LR3 is most effective injected locally into the trained muscle group within 30 min post-workout."
  },
  {
    id: "fatloss", name: "Fat Loss", icon: "🔥",
    description: "Accelerate fat oxidation and improve body composition.",
    peptides: ["AOD-9604", "Tesamorelin/Ipamorelin", "Semaglutide"],
    schedule: [
      { day: "Fasted AM", items: ["AOD-9604 300 mcg SubQ (30 min before eating)"] },
      { day: "Pre-bed", items: ["Tesamorelin 1 mg + Ipamorelin 200 mcg SubQ"] },
      { day: "Weekly", items: ["Semaglutide 0.25–0.5 mg SubQ (titrate slowly)"] },
    ],
    cycle: "16 weeks, reassess body composition monthly",
    notes: "AOD-9604 requires a fasted state. Semaglutide titration is critical — start low to avoid GI side effects."
  },
  {
    id: "antiaging", name: "Anti-Aging & Longevity", icon: "⏳",
    description: "Target cellular health, telomere length, and longevity markers.",
    peptides: ["Epithalon", "MOTS-C", "SS-31", "NAD+"],
    schedule: [
      { day: "Daily", items: ["Epithalon 5 mg SubQ (10-day cycle, 2x/year)", "NAD+ 250 mg oral (daily)"] },
      { day: "Weekly", items: ["MOTS-C 5 mg SubQ", "SS-31 1 mg SubQ"] },
    ],
    cycle: "Ongoing with periodic cycling of Epithalon",
    notes: "Epithalon is typically run as a 10–20 day cycle twice per year. NAD+ can be taken continuously."
  },
  {
    id: "immune", name: "Immune Optimization", icon: "🛡️",
    description: "Strengthen immune response and reduce chronic inflammation.",
    peptides: ["Thymosin Alpha-1", "LL-37", "BPC-157"],
    schedule: [
      { day: "Mon / Thu", items: ["Thymosin Alpha-1 1.6 mg SubQ"] },
      { day: "Daily", items: ["BPC-157 250 mcg SubQ", "LL-37 100 mcg SubQ (acute phase only)"] },
    ],
    cycle: "6–12 weeks; LL-37 acute use only (1–2 weeks)",
    notes: "TA-1 is one of the most studied immunomodulators. LL-37 is potent — use sparingly and monitor for reactions."
  },
];

const GLOSSARY = [
  { term: "Peptide", def: "A short chain of amino acids (2–50) that act as signaling molecules in the body." },
  { term: "SubQ", def: "Subcutaneous injection — into the fat layer just beneath the skin." },
  { term: "IM", def: "Intramuscular injection — directly into muscle tissue." },
  { term: "Reconstitution", def: "The process of mixing lyophilized (freeze-dried) peptide powder with BAC water or sterile water." },
  { term: "BAC Water", def: "Bacteriostatic water — 0.9% benzyl alcohol in sterile water, used to reconstitute peptides safely." },
  { term: "Half-Life", def: "The time it takes for half of a substance to be eliminated from the body." },
  { term: "Lyophilized", def: "Freeze-dried — the standard storage form for most peptides before reconstitution." },
  { term: "GHRH", def: "Growth Hormone Releasing Hormone — signals the pituitary to release GH. CJC-1295 is a GHRH analog." },
  { term: "GHRP", def: "Growth Hormone Releasing Peptide — stimulates GH release via ghrelin receptor. Ipamorelin is a GHRP." },
  { term: "GHS", def: "Growth Hormone Secretagogue — umbrella term for peptides that stimulate GH release." },
  { term: "Bioavailability", def: "The fraction of a substance that reaches systemic circulation and is available to exert an effect." },
  { term: "Loading Phase", def: "An initial higher-dose period to saturate receptors or build tissue levels quickly." },
  { term: "Maintenance Phase", def: "A lower-dose ongoing phase after the loading phase to sustain effects." },
  { term: "COA", def: "Certificate of Analysis — third-party lab testing verifying purity and identity of a peptide." },
  { term: "HRV", def: "Heart Rate Variability — a key biomarker for recovery, stress, and autonomic nervous system function." },
  { term: "IGF-1", def: "Insulin-Like Growth Factor 1 — mediates many of GH's anabolic effects; key longevity and muscle marker." },
];

const METRIC_CATEGORIES = {
  "Energy": [
    { key: "energy", label: "Energy Level", unit: "/10", max: 10 },
    { key: "fatigue", label: "Fatigue", unit: "/10", max: 10 },
  ],
  "Sleep": [
    { key: "sleep_quality", label: "Sleep Quality", unit: "/10", max: 10 },
    { key: "sleep_hours", label: "Sleep Hours", unit: "hrs", max: 12 },
  ],
  "Body Composition": [
    { key: "weight", label: "Weight", unit: "lbs", max: 400 },
    { key: "body_fat", label: "Body Fat %", unit: "%", max: 50 },
  ],
  "Recovery": [
    { key: "recovery", label: "Recovery Score", unit: "/10", max: 10 },
    { key: "soreness", label: "Muscle Soreness", unit: "/10", max: 10 },
  ],
  "Mind & Mood": [
    { key: "mood", label: "Mood", unit: "/10", max: 10 },
    { key: "focus", label: "Mental Focus", unit: "/10", max: 10 },
    { key: "libido", label: "Libido", unit: "/10", max: 10 },
  ],
  "Hormonal Markers": [
    { key: "testosterone", label: "Testosterone", unit: "ng/dL", max: 1200 },
    { key: "igf1", label: "IGF-1", unit: "ng/mL", max: 400 },
  ],
};

const ALL_METRICS = Object.values(METRIC_CATEGORIES).flat();

export default function App() {
  const [tab, setTab] = useState("home");
  const [onboarded, setOnboarded] = useState(() => !!localStorage.getItem("helix_onboarded"));
  const [onboardStep, setOnboardStep] = useState(0);
  const [userName, setUserName] = useState(() => localStorage.getItem("helix_name") || "");
  const [userGoals, setUserGoals] = useState(() => JSON.parse(localStorage.getItem("helix_goals") || "[]"));
  const [baseline, setBaseline] = useState(() => JSON.parse(localStorage.getItem("helix_baseline") || "{}"));
  const [logs, setLogs] = useState(() => JSON.parse(localStorage.getItem("helix_logs") || "[]"));
  const [doses, setDoses] = useState(() => JSON.parse(localStorage.getItem("helix_doses") || "[]"));
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [selectedPeptide, setSelectedPeptide] = useState(null);
  const [selectedProtocol, setSelectedProtocol] = useState(null);
  const [librarySearch, setLibrarySearch] = useState("");
  const [libraryFilter, setLibraryFilter] = useState("All");
  const [glossarySearch, setGlossarySearch] = useState("");
  const [showGlossary, setShowGlossary] = useState(false);
  const [logMode, setLogMode] = useState("outcomes");
  const [newDose, setNewDose] = useState({ peptide: "", dose: "", unit: "mcg", site: "", notes: "" });
  const [newMetrics, setNewMetrics] = useState({});
  const [calcVial, setCalcVial] = useState("");
  const [calcWater, setCalcWater] = useState("");
  const [calcDose, setCalcDose] = useState("");
  const chatEndRef = useRef(null);

  useEffect(() => { localStorage.setItem("helix_logs", JSON.stringify(logs)); }, [logs]);
  useEffect(() => { localStorage.setItem("helix_doses", JSON.stringify(doses)); }, [doses]);
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chatMessages]);

  const saveOnboarding = () => {
    localStorage.setItem("helix_onboarded", "1");
    localStorage.setItem("helix_name", userName);
    localStorage.setItem("helix_goals", JSON.stringify(userGoals));
    localStorage.setItem("helix_baseline", JSON.stringify(baseline));
    setOnboarded(true);
  };

  const GOALS = ["Fat Loss", "Muscle & Strength", "Injury Recovery", "Anti-Aging", "Sleep Optimization", "Immune Health", "Cognitive Performance", "General Wellness"];

  const toggleGoal = (g) => setUserGoals(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g]);

  const todayStr = new Date().toISOString().split("T")[0];
  const todayDoses = doses.filter(d => d.date === todayStr);
  const todayLogs = logs.filter(l => l.date === todayStr);

  const getMetricTrend = (key) => {
    const recent = logs.slice(-7).map(l => l.metrics?.[key]).filter(v => v !== undefined);
    return recent;
  };

  const getMetricDelta = (key) => {
    const base = baseline[key];
    const recent = logs.slice(-3).map(l => l.metrics?.[key]).filter(v => v !== undefined);
    if (!base || recent.length === 0) return null;
    const avg = recent.reduce((a, b) => a + b, 0) / recent.length;
    return ((avg - base) / base * 100).toFixed(1);
  };

  const calcMl = () => {
    if (!calcVial || !calcWater || !calcDose) return null;
    const concMcgPerMl = (parseFloat(calcVial) * 1000) / parseFloat(calcWater);
    const ml = parseFloat(calcDose) / concMcgPerMl;
    const units = ml * 100;
    return { ml: ml.toFixed(3), units: units.toFixed(1) };
  };

  const saveLog = () => {
    if (Object.keys(newMetrics).length === 0) return;
    const entry = { date: todayStr, time: new Date().toLocaleTimeString(), metrics: { ...newMetrics } };
    setLogs(prev => [...prev, entry]);
    setNewMetrics({});
  };

  const saveDose = () => {
    if (!newDose.peptide || !newDose.dose) return;
    const entry = { ...newDose, date: todayStr, time: new Date().toLocaleTimeString(), id: Date.now() };
    setDoses(prev => [...prev, entry]);
    setNewDose({ peptide: "", dose: "", unit: "mcg", site: "", notes: "" });
  };

  const sendChat = async (msg) => {
    const text = msg || chatInput.trim();
    if (!text) return;
    setChatInput("");
    const userMsg = { role: "user", content: text };
    const updatedHistory = [...chatMessages, userMsg];
    setChatMessages(updatedHistory);
    setChatLoading(true);
    try {
      const recentLogs = logs.slice(-7);
      const activePeptides = [...new Set(doses.slice(-20).map(d => d.peptide))];
      const systemPrompt = `You are HELIX AI — a knowledgeable peptide and biohacking advisor for the fitness and longevity community. You are embedded in the HELIX app.

User Profile:
- Name: ${userName || "User"}
- Goals: ${userGoals.join(", ") || "Not specified"}
- Active peptides (recent): ${activePeptides.join(", ") || "None logged"}
- Recent outcome logs: ${JSON.stringify(recentLogs.slice(-3))}

Peptide database: ${JSON.stringify(PEPTIDES.map(p => ({ name: p.name, dose: p.dose, halfLife: p.halfLife, benefits: p.benefits, stacks: p.stacks })))}

Give direct, practical, protocol-level advice. Reference their actual data when relevant. Be concise but thorough. Do not add medical disclaimers to every message — users understand these are research compounds.`;

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: systemPrompt,
          messages: updatedHistory,
        }),
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text || "Unable to get a response.";
      setChatMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setChatMessages(prev => [...prev, { role: "assistant", content: "Connection error. Please try again." }]);
    }
    setChatLoading(false);
  };

  const filteredPeptides = PEPTIDES.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(librarySearch.toLowerCase()) || p.benefits.some(b => b.toLowerCase().includes(librarySearch.toLowerCase()));
    const matchFilter = libraryFilter === "All" || p.category === libraryFilter;
    return matchSearch && matchFilter;
  });

  // ─── Onboarding ───
  if (!onboarded) {
    return (
      <div style={{ minHeight: "100vh", background: "#080c10", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px", fontFamily: "'Outfit', sans-serif", color: "#e8f4f0" }}>
        <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Outfit:wght@300;400;500;600&display=swap" rel="stylesheet" />
        <div style={{ width: "100%", maxWidth: "420px" }}>
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <svg width="56" height="56" viewBox="0 0 56 56" style={{ marginBottom: "12px" }}>
              <rect width="56" height="56" rx="14" fill="#080c10" stroke="#00ffc8" strokeWidth="1.5" />
              <path d="M20 14 C20 14 28 22 28 28 C28 34 20 42 20 42" stroke="#00ffc8" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <path d="M36 14 C36 14 28 22 28 28 C28 34 36 42 36 42" stroke="#f0c040" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              {[18, 24, 30, 36].map((y, i) => <line key={i} x1="20" y1={y} x2="36" y2={y} stroke={i % 2 === 0 ? "#00ffc8" : "#f0c040"} strokeWidth="1.5" opacity="0.5" />)}
            </svg>
            <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "28px", fontWeight: "900", letterSpacing: "4px", color: "#00ffc8" }}>HELIX</div>
            <div style={{ color: "#4a7a6a", fontSize: "12px", letterSpacing: "2px", marginTop: "4px" }}>TRACK YOUR EVOLUTION</div>
          </div>

          <div style={{ display: "flex", gap: "8px", marginBottom: "32px", justifyContent: "center" }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{ width: i === onboardStep ? "24px" : "8px", height: "8px", borderRadius: "4px", background: i <= onboardStep ? "#00ffc8" : "#1a2a22", transition: "all 0.3s" }} />
            ))}
          </div>

          {onboardStep === 0 && (
            <div>
              <h2 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "18px", marginBottom: "8px" }}>What should we call you?</h2>
              <p style={{ color: "#4a7a6a", fontSize: "14px", marginBottom: "24px" }}>HELIX personalizes your AI advisor and progress tracking.</p>
              <input value={userName} onChange={e => setUserName(e.target.value)} placeholder="Enter your name" style={{ width: "100%", padding: "14px 16px", background: "#0d1a14", border: "1px solid #1a3a2a", borderRadius: "10px", color: "#e8f4f0", fontSize: "16px", outline: "none", boxSizing: "border-box" }} />
              <button onClick={() => userName && setOnboardStep(1)} style={{ width: "100%", marginTop: "16px", padding: "14px", background: userName ? "#00ffc8" : "#1a2a22", color: userName ? "#080c10" : "#4a7a6a", border: "none", borderRadius: "10px", fontFamily: "'Orbitron', sans-serif", fontSize: "13px", fontWeight: "700", letterSpacing: "2px", cursor: userName ? "pointer" : "default" }}>CONTINUE →</button>
            </div>
          )}

          {onboardStep === 1 && (
            <div>
              <h2 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "18px", marginBottom: "8px" }}>What are your goals?</h2>
              <p style={{ color: "#4a7a6a", fontSize: "14px", marginBottom: "20px" }}>Select all that apply. This shapes your protocol recommendations.</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "24px" }}>
                {GOALS.map(g => (
                  <button key={g} onClick={() => toggleGoal(g)} style={{ padding: "12px 8px", background: userGoals.includes(g) ? "#001a12" : "#0d1a14", border: `1px solid ${userGoals.includes(g) ? "#00ffc8" : "#1a3a2a"}`, borderRadius: "8px", color: userGoals.includes(g) ? "#00ffc8" : "#4a7a6a", fontSize: "12px", cursor: "pointer", transition: "all 0.2s" }}>{g}</button>
                ))}
              </div>
              <button onClick={() => userGoals.length > 0 && setOnboardStep(2)} style={{ width: "100%", padding: "14px", background: userGoals.length > 0 ? "#00ffc8" : "#1a2a22", color: userGoals.length > 0 ? "#080c10" : "#4a7a6a", border: "none", borderRadius: "10px", fontFamily: "'Orbitron', sans-serif", fontSize: "13px", fontWeight: "700", letterSpacing: "2px", cursor: userGoals.length > 0 ? "pointer" : "default" }}>CONTINUE →</button>
            </div>
          )}

          {onboardStep === 2 && (
            <div>
              <h2 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "18px", marginBottom: "8px" }}>Set your baseline</h2>
              <p style={{ color: "#4a7a6a", fontSize: "14px", marginBottom: "20px" }}>Rate yourself right now. This is your starting point — every improvement is measured from here.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "24px" }}>
                {[{ key: "energy", label: "Energy Level" }, { key: "sleep_quality", label: "Sleep Quality" }, { key: "recovery", label: "Recovery" }, { key: "mood", label: "Mood" }, { key: "focus", label: "Mental Focus" }].map(m => (
                  <div key={m.key}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px", fontSize: "13px", color: "#8ab0a0" }}>
                      <span>{m.label}</span><span style={{ color: "#00ffc8" }}>{baseline[m.key] || 5}/10</span>
                    </div>
                    <input type="range" min="1" max="10" value={baseline[m.key] || 5} onChange={e => setBaseline(prev => ({ ...prev, [m.key]: parseInt(e.target.value) }))} style={{ width: "100%", accentColor: "#00ffc8" }} />
                  </div>
                ))}
              </div>
              <button onClick={saveOnboarding} style={{ width: "100%", padding: "14px", background: "#00ffc8", color: "#080c10", border: "none", borderRadius: "10px", fontFamily: "'Orbitron', sans-serif", fontSize: "13px", fontWeight: "700", letterSpacing: "2px", cursor: "pointer" }}>LAUNCH HELIX →</button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ─── MAIN APP ───
  const TAB_CONFIG = [
    { id: "home", icon: "⬡", label: "HOME" },
    { id: "library", icon: "◈", label: "LIBRARY" },
    { id: "protocols", icon: "◎", label: "PROTOCOLS" },
    { id: "log", icon: "⊕", label: "LOG" },
    { id: "progress", icon: "△", label: "PROGRESS" },
    { id: "calc", icon: "⊟", label: "CALC" },
    { id: "ai", icon: "✦", label: "AI" },
  ];

  const styles = {
    app: { minHeight: "100vh", background: "#080c10", color: "#e8f4f0", fontFamily: "'Outfit', sans-serif", paddingBottom: "80px" },
    nav: { position: "fixed", bottom: 0, left: 0, right: 0, background: "rgba(8,12,16,0.96)", backdropFilter: "blur(20px)", borderTop: "1px solid #1a2a22", display: "flex", zIndex: 100, padding: "8px 0 4px" },
    navBtn: (active) => ({ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "2px", background: "none", border: "none", color: active ? "#00ffc8" : "#2a4a3a", cursor: "pointer", padding: "6px 2px", transition: "all 0.2s" }),
    navIcon: (active) => ({ fontSize: "18px", opacity: active ? 1 : 0.6 }),
    navLabel: (active) => ({ fontSize: "8px", fontFamily: "'Orbitron', sans-serif", letterSpacing: "1px", color: active ? "#00ffc8" : "#2a4a3a" }),
    header: { padding: "20px 20px 0", display: "flex", justifyContent: "space-between", alignItems: "center" },
    title: { fontFamily: "'Orbitron', sans-serif", fontSize: "11px", letterSpacing: "3px", color: "#4a7a6a" },
    pageTitle: { fontFamily: "'Orbitron', sans-serif", fontSize: "20px", fontWeight: "900", color: "#00ffc8", letterSpacing: "2px" },
    section: { padding: "16px 20px" },
    card: { background: "#0d1a14", border: "1px solid #1a3a2a", borderRadius: "12px", padding: "16px", marginBottom: "12px" },
    statCard: { background: "#0d1a14", border: "1px solid #1a3a2a", borderRadius: "12px", padding: "14px", flex: 1 },
    input: { width: "100%", padding: "12px 14px", background: "#0d1a14", border: "1px solid #1a3a2a", borderRadius: "8px", color: "#e8f4f0", fontSize: "14px", outline: "none", boxSizing: "border-box", fontFamily: "'Outfit', sans-serif" },
    btn: (variant = "primary") => ({ padding: "12px 20px", background: variant === "primary" ? "#00ffc8" : variant === "gold" ? "#f0c040" : "#1a3a2a", color: variant === "primary" ? "#080c10" : variant === "gold" ? "#080c10" : "#00ffc8", border: "none", borderRadius: "8px", fontFamily: "'Orbitron', sans-serif", fontSize: "11px", fontWeight: "700", letterSpacing: "1.5px", cursor: "pointer" }),
    tag: (color = "#00ffc8") => ({ display: "inline-block", padding: "3px 10px", background: color + "18", border: `1px solid ${color}40`, borderRadius: "20px", fontSize: "11px", color, marginRight: "6px", marginBottom: "6px" }),
    label: { fontSize: "11px", color: "#4a7a6a", fontFamily: "'Orbitron', sans-serif", letterSpacing: "1.5px", marginBottom: "8px", display: "block" },
  };

  return (
    <div style={styles.app}>
      <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Outfit:wght@300;400;500;600&display=swap" rel="stylesheet" />

      {/* ─── HOME ─── */}
      {tab === "home" && !showGlossary && (
        <div>
          <div style={{ padding: "24px 20px 16px", background: "linear-gradient(180deg, #001a12 0%, transparent 100%)" }}>
            <div style={styles.title}>HELIX DASHBOARD</div>
            <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "22px", fontWeight: "900", color: "#e8f4f0", marginTop: "4px" }}>
              Welcome back, <span style={{ color: "#00ffc8" }}>{userName}</span>
            </div>
            <div style={{ color: "#4a7a6a", fontSize: "13px", marginTop: "4px" }}>{new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</div>
          </div>

          <div style={{ padding: "0 20px 16px" }}>
            <div style={{ display: "flex", gap: "10px" }}>
              <div style={{ ...styles.statCard, textAlign: "center" }}>
                <div style={{ fontSize: "28px", fontFamily: "'Orbitron', sans-serif", fontWeight: "900", color: "#00ffc8" }}>{todayDoses.length}</div>
                <div style={{ fontSize: "10px", color: "#4a7a6a", fontFamily: "'Orbitron', sans-serif", letterSpacing: "1px" }}>TODAY'S DOSES</div>
              </div>
              <div style={{ ...styles.statCard, textAlign: "center" }}>
                <div style={{ fontSize: "28px", fontFamily: "'Orbitron', sans-serif", fontWeight: "900", color: "#f0c040" }}>{logs.length}</div>
                <div style={{ fontSize: "10px", color: "#4a7a6a", fontFamily: "'Orbitron', sans-serif", letterSpacing: "1px" }}>TOTAL LOGS</div>
              </div>
              <div style={{ ...styles.statCard, textAlign: "center" }}>
                <div style={{ fontSize: "28px", fontFamily: "'Orbitron', sans-serif", fontWeight: "900", color: "#00ffc8" }}>{new Set(doses.map(d => d.date)).size}</div>
                <div style={{ fontSize: "10px", color: "#4a7a6a", fontFamily: "'Orbitron', sans-serif", letterSpacing: "1px" }}>DAY STREAK</div>
              </div>
            </div>
          </div>

          <div style={styles.section}>
            <div style={styles.label}>OUTCOME SCORES</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              {[{ key: "energy", label: "Energy" }, { key: "sleep_quality", label: "Sleep" }, { key: "recovery", label: "Recovery" }, { key: "mood", label: "Mood" }].map(m => {
                const delta = getMetricDelta(m.key);
                const recent = getMetricTrend(m.key);
                const last = recent[recent.length - 1];
                return (
                  <div key={m.key} style={styles.card}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div style={{ fontSize: "12px", color: "#8ab0a0" }}>{m.label}</div>
                      {delta !== null && <div style={{ fontSize: "11px", color: parseFloat(delta) >= 0 ? "#00ffc8" : "#ff4466", background: parseFloat(delta) >= 0 ? "#00ffc820" : "#ff446620", padding: "2px 6px", borderRadius: "4px" }}>{parseFloat(delta) >= 0 ? "+" : ""}{delta}%</div>}
                    </div>
                    <div style={{ fontSize: "26px", fontFamily: "'Orbitron', sans-serif", fontWeight: "900", color: "#e8f4f0", margin: "4px 0" }}>{last || baseline[m.key] || "—"}</div>
                    <div style={{ fontSize: "10px", color: "#4a7a6a" }}>vs baseline: {baseline[m.key] || "—"}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={styles.section}>
            <div style={styles.label}>YOUR GOALS</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {userGoals.map(g => <span key={g} style={styles.tag("#00ffc8")}>{g}</span>)}
            </div>
          </div>

          <div style={styles.section}>
            <div style={styles.label}>QUICK ACCESS</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
              {[
                { label: "Library", icon: "◈", t: "library" },
                { label: "Protocols", icon: "◎", t: "protocols" },
                { label: "Log Today", icon: "⊕", t: "log" },
                { label: "Progress", icon: "△", t: "progress" },
                { label: "Calc", icon: "⊟", t: "calc" },
                { label: "Glossary", icon: "⊞", t: "glossary" },
              ].map(item => (
                <button key={item.label} onClick={() => item.t === "glossary" ? setShowGlossary(true) : setTab(item.t)} style={{ background: "#0d1a14", border: "1px solid #1a3a2a", borderRadius: "10px", padding: "14px 8px", cursor: "pointer", textAlign: "center" }}>
                  <div style={{ fontSize: "20px", marginBottom: "4px" }}>{item.icon}</div>
                  <div style={{ fontSize: "10px", fontFamily: "'Orbitron', sans-serif", color: "#4a7a6a", letterSpacing: "1px" }}>{item.label.toUpperCase()}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── GLOSSARY OVERLAY ─── */}
      {showGlossary && (
        <div>
          <div style={{ ...styles.header, paddingTop: "24px" }}>
            <div>
              <div style={styles.title}>HELIX</div>
              <div style={styles.pageTitle}>GLOSSARY</div>
            </div>
            <button onClick={() => setShowGlossary(false)} style={{ background: "#1a3a2a", border: "none", color: "#00ffc8", borderRadius: "8px", padding: "8px 14px", cursor: "pointer", fontFamily: "'Orbitron', sans-serif", fontSize: "11px" }}>← BACK</button>
          </div>
          <div style={styles.section}>
            <input value={glossarySearch} onChange={e => setGlossarySearch(e.target.value)} placeholder="Search terms..." style={styles.input} />
          </div>
          <div style={{ padding: "0 20px" }}>
            {GLOSSARY.filter(g => g.term.toLowerCase().includes(glossarySearch.toLowerCase()) || g.def.toLowerCase().includes(glossarySearch.toLowerCase())).map(g => (
              <div key={g.term} style={{ ...styles.card, marginBottom: "8px" }}>
                <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "13px", color: "#00ffc8", marginBottom: "6px" }}>{g.term}</div>
                <div style={{ fontSize: "13px", color: "#8ab0a0", lineHeight: "1.5" }}>{g.def}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── LIBRARY ─── */}
      {tab === "library" && !selectedPeptide && (
        <div>
          <div style={{ ...styles.header, paddingTop: "24px" }}>
            <div><div style={styles.title}>HELIX</div><div style={styles.pageTitle}>LIBRARY</div></div>
            <div style={{ fontSize: "12px", color: "#4a7a6a" }}>{filteredPeptides.length} compounds</div>
          </div>
          <div style={styles.section}>
            <input value={librarySearch} onChange={e => setLibrarySearch(e.target.value)} placeholder="Search by name or benefit..." style={{ ...styles.input, marginBottom: "12px" }} />
            <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "8px" }}>
              {CATEGORIES.map(c => (
                <button key={c} onClick={() => setLibraryFilter(c)} style={{ padding: "6px 14px", background: libraryFilter === c ? "#00ffc8" : "#0d1a14", color: libraryFilter === c ? "#080c10" : "#4a7a6a", border: `1px solid ${libraryFilter === c ? "#00ffc8" : "#1a3a2a"}`, borderRadius: "20px", fontSize: "11px", whiteSpace: "nowrap", cursor: "pointer", fontFamily: "'Orbitron', sans-serif", letterSpacing: "1px" }}>{c}</button>
              ))}
            </div>
          </div>
          <div style={{ padding: "0 20px" }}>
            {filteredPeptides.map(p => (
              <div key={p.id} onClick={() => setSelectedPeptide(p)} style={{ ...styles.card, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "14px", color: "#e8f4f0", marginBottom: "4px" }}>{p.name}</div>
                  <div style={{ fontSize: "11px", color: "#4a7a6a", fontFamily: "'Orbitron', sans-serif", letterSpacing: "1px" }}>{p.category}</div>
                  <div style={{ marginTop: "8px" }}>
                    {p.benefits.slice(0, 2).map(b => <span key={b} style={styles.tag("#00ffc8")}>{b}</span>)}
                  </div>
                </div>
                <div style={{ color: "#00ffc8", fontSize: "20px", marginLeft: "12px" }}>›</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "library" && selectedPeptide && (
        <div>
          <div style={{ ...styles.header, paddingTop: "24px" }}>
            <div><div style={styles.title}>COMPOUND PROFILE</div><div style={styles.pageTitle}>{selectedPeptide.name}</div></div>
            <button onClick={() => setSelectedPeptide(null)} style={{ background: "#1a3a2a", border: "none", color: "#00ffc8", borderRadius: "8px", padding: "8px 14px", cursor: "pointer", fontFamily: "'Orbitron', sans-serif", fontSize: "11px" }}>← BACK</button>
          </div>
          <div style={styles.section}>
            <div style={styles.label}>CATEGORY</div>
            <span style={styles.tag("#f0c040")}>{selectedPeptide.category}</span>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "16px" }}>
              <div style={styles.card}><div style={styles.label}>HALF-LIFE</div><div style={{ fontSize: "13px", color: "#e8f4f0" }}>{selectedPeptide.halfLife}</div></div>
              <div style={styles.card}><div style={styles.label}>STORAGE</div><div style={{ fontSize: "13px", color: "#e8f4f0" }}>{selectedPeptide.storage}</div></div>
            </div>

            <div style={styles.card}><div style={styles.label}>DOSING PROTOCOL</div><div style={{ fontSize: "14px", color: "#00ffc8" }}>{selectedPeptide.dose}</div></div>

            <div style={styles.card}>
              <div style={styles.label}>BENEFITS</div>
              <div>{selectedPeptide.benefits.map(b => <span key={b} style={styles.tag("#00ffc8")}>{b}</span>)}</div>
            </div>

            {selectedPeptide.stacks.length > 0 && (
              <div style={styles.card}>
                <div style={styles.label}>STACKS WELL WITH</div>
                <div>{selectedPeptide.stacks.map(s => <span key={s} style={styles.tag("#f0c040")}>{s}</span>)}</div>
              </div>
            )}

            <button onClick={() => { setTab("log"); setNewDose(d => ({ ...d, peptide: selectedPeptide.name })); setSelectedPeptide(null); }} style={{ ...styles.btn("primary"), width: "100%", marginTop: "8px" }}>LOG A DOSE →</button>
          </div>
        </div>
      )}

      {/* ─── PROTOCOLS ─── */}
      {tab === "protocols" && !selectedProtocol && (
        <div>
          <div style={{ ...styles.header, paddingTop: "24px" }}>
            <div><div style={styles.title}>HELIX</div><div style={styles.pageTitle}>PROTOCOLS</div></div>
          </div>
          <div style={{ padding: "12px 20px 4px", color: "#4a7a6a", fontSize: "13px" }}>Goal-based stacks built for results.</div>
          <div style={{ padding: "12px 20px" }}>
            {PROTOCOLS.map(p => (
              <div key={p.id} onClick={() => setSelectedProtocol(p)} style={{ ...styles.card, cursor: "pointer", display: "flex", gap: "14px", alignItems: "flex-start" }}>
                <div style={{ fontSize: "32px" }}>{p.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "14px", color: "#e8f4f0", marginBottom: "4px" }}>{p.name}</div>
                  <div style={{ fontSize: "13px", color: "#4a7a6a", lineHeight: "1.5" }}>{p.description}</div>
                  <div style={{ marginTop: "8px" }}>
                    {p.peptides.slice(0, 3).map(pe => <span key={pe} style={styles.tag("#00ffc8")}>{pe}</span>)}
                  </div>
                </div>
                <div style={{ color: "#00ffc8", fontSize: "20px" }}>›</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "protocols" && selectedProtocol && (
        <div>
          <div style={{ ...styles.header, paddingTop: "24px" }}>
            <div><div style={styles.title}>PROTOCOL</div><div style={styles.pageTitle}>{selectedProtocol.icon} {selectedProtocol.name}</div></div>
            <button onClick={() => setSelectedProtocol(null)} style={{ background: "#1a3a2a", border: "none", color: "#00ffc8", borderRadius: "8px", padding: "8px 14px", cursor: "pointer", fontFamily: "'Orbitron', sans-serif", fontSize: "11px" }}>← BACK</button>
          </div>
          <div style={styles.section}>
            <div style={{ ...styles.card, borderColor: "#00ffc840" }}>
              <div style={{ fontSize: "13px", color: "#8ab0a0", lineHeight: "1.6" }}>{selectedProtocol.description}</div>
            </div>
            <div style={styles.label}>INJECTION SCHEDULE</div>
            {selectedProtocol.schedule.map((s, i) => (
              <div key={i} style={styles.card}>
                <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "11px", color: "#f0c040", marginBottom: "8px" }}>{s.day}</div>
                {s.items.map((item, j) => (
                  <div key={j} style={{ fontSize: "13px", color: "#e8f4f0", padding: "6px 0", borderBottom: j < s.items.length - 1 ? "1px solid #1a3a2a" : "none" }}>• {item}</div>
                ))}
              </div>
            ))}
            <div style={styles.card}>
              <div style={styles.label}>CYCLE LENGTH</div>
              <div style={{ fontSize: "14px", color: "#00ffc8" }}>{selectedProtocol.cycle}</div>
            </div>
            <div style={styles.card}>
              <div style={styles.label}>COACH NOTES</div>
              <div style={{ fontSize: "13px", color: "#8ab0a0", lineHeight: "1.6" }}>{selectedProtocol.notes}</div>
            </div>
          </div>
        </div>
      )}

      {/* ─── LOG ─── */}
      {tab === "log" && (
        <div>
          <div style={{ ...styles.header, paddingTop: "24px" }}>
            <div><div style={styles.title}>HELIX</div><div style={styles.pageTitle}>LOG</div></div>
          </div>
          <div style={{ display: "flex", margin: "16px 20px 0", background: "#0d1a14", borderRadius: "10px", padding: "4px", border: "1px solid #1a3a2a" }}>
            {["outcomes", "dose"].map(m => (
              <button key={m} onClick={() => setLogMode(m)} style={{ flex: 1, padding: "10px", background: logMode === m ? "#00ffc8" : "transparent", color: logMode === m ? "#080c10" : "#4a7a6a", border: "none", borderRadius: "7px", fontFamily: "'Orbitron', sans-serif", fontSize: "10px", letterSpacing: "1px", cursor: "pointer" }}>
                {m === "outcomes" ? "OUTCOMES" : "DOSE"}
              </button>
            ))}
          </div>

          {logMode === "outcomes" && (
            <div style={styles.section}>
              {Object.entries(METRIC_CATEGORIES).map(([cat, metrics]) => (
                <div key={cat} style={{ marginBottom: "20px" }}>
                  <div style={styles.label}>{cat.toUpperCase()}</div>
                  {metrics.map(m => (
                    <div key={m.key} style={{ ...styles.card, marginBottom: "8px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                        <span style={{ fontSize: "13px", color: "#8ab0a0" }}>{m.label}</span>
                        <span style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "14px", color: "#00ffc8" }}>{newMetrics[m.key] ?? "—"} {m.unit}</span>
                      </div>
                      <input type="range" min="0" max={m.max} step={m.max > 20 ? 1 : 0.5} value={newMetrics[m.key] ?? m.max / 2} onChange={e => setNewMetrics(prev => ({ ...prev, [m.key]: parseFloat(e.target.value) }))} style={{ width: "100%", accentColor: "#00ffc8" }} />
                    </div>
                  ))}
                </div>
              ))}
              <button onClick={saveLog} style={{ ...styles.btn("primary"), width: "100%" }}>SAVE TODAY'S LOG →</button>
            </div>
          )}

          {logMode === "dose" && (
            <div style={styles.section}>
              <div style={styles.label}>PEPTIDE</div>
              <select value={newDose.peptide} onChange={e => setNewDose(d => ({ ...d, peptide: e.target.value }))} style={{ ...styles.input, marginBottom: "12px" }}>
                <option value="">Select compound...</option>
                {PEPTIDES.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
              </select>
              <div style={{ display: "flex", gap: "10px", marginBottom: "12px" }}>
                <div style={{ flex: 2 }}>
                  <div style={styles.label}>DOSE</div>
                  <input value={newDose.dose} onChange={e => setNewDose(d => ({ ...d, dose: e.target.value }))} placeholder="Amount" style={styles.input} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={styles.label}>UNIT</div>
                  <select value={newDose.unit} onChange={e => setNewDose(d => ({ ...d, unit: e.target.value }))} style={styles.input}>
                    <option>mcg</option><option>mg</option><option>IU</option>
                  </select>
                </div>
              </div>
              <div style={styles.label}>INJECTION SITE</div>
              <select value={newDose.site} onChange={e => setNewDose(d => ({ ...d, site: e.target.value }))} style={{ ...styles.input, marginBottom: "12px" }}>
                <option value="">Select site...</option>
                {["Abdomen", "Glute", "Thigh", "Deltoid", "Near injury", "Subcutaneous", "IM"].map(s => <option key={s}>{s}</option>)}
              </select>
              <div style={styles.label}>NOTES</div>
              <input value={newDose.notes} onChange={e => setNewDose(d => ({ ...d, notes: e.target.value }))} placeholder="Optional notes..." style={{ ...styles.input, marginBottom: "16px" }} />
              <button onClick={saveDose} style={{ ...styles.btn("primary"), width: "100%" }}>LOG DOSE →</button>

              {todayDoses.length > 0 && (
                <div style={{ marginTop: "24px" }}>
                  <div style={styles.label}>TODAY'S DOSES</div>
                  {todayDoses.map(d => (
                    <div key={d.id} style={{ ...styles.card, display: "flex", justifyContent: "space-between" }}>
                      <div>
                        <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "13px", color: "#e8f4f0" }}>{d.peptide}</div>
                        <div style={{ fontSize: "12px", color: "#4a7a6a", marginTop: "2px" }}>{d.dose} {d.unit} · {d.site}</div>
                      </div>
                      <div style={{ fontSize: "11px", color: "#4a7a6a" }}>{d.time}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ─── PROGRESS ─── */}
      {tab === "progress" && (
        <div>
          <div style={{ ...styles.header, paddingTop: "24px" }}>
            <div><div style={styles.title}>HELIX</div><div style={styles.pageTitle}>PROGRESS</div></div>
          </div>
          <div style={styles.section}>
            {logs.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 20px" }}>
                <div style={{ fontSize: "40px", marginBottom: "12px" }}>△</div>
                <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "14px", color: "#4a7a6a" }}>NO DATA YET</div>
                <div style={{ fontSize: "13px", color: "#2a4a3a", marginTop: "8px" }}>Start logging outcomes to see your progress here.</div>
                <button onClick={() => setTab("log")} style={{ ...styles.btn("primary"), marginTop: "20px" }}>LOG TODAY →</button>
              </div>
            ) : (
              <>
                <div style={styles.label}>METRIC TRENDS</div>
                {ALL_METRICS.filter(m => getMetricTrend(m.key).length > 0).map(m => {
                  const trend = getMetricTrend(m.key);
                  const delta = getMetricDelta(m.key);
                  const max = Math.max(...trend, baseline[m.key] || 0, 1);
                  return (
                    <div key={m.key} style={{ ...styles.card, marginBottom: "10px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                        <span style={{ fontSize: "13px", color: "#8ab0a0" }}>{m.label}</span>
                        {delta !== null && <span style={{ fontSize: "12px", color: parseFloat(delta) >= 0 ? "#00ffc8" : "#ff4466", fontFamily: "'Orbitron', sans-serif" }}>{parseFloat(delta) >= 0 ? "+" : ""}{delta}%</span>}
                      </div>
                      <div style={{ display: "flex", alignItems: "flex-end", gap: "4px", height: "48px" }}>
                        {baseline[m.key] && <div style={{ width: "8px", background: "#f0c04060", borderRadius: "2px 2px 0 0", height: `${(baseline[m.key] / max) * 100}%`, flexShrink: 0 }} />}
                        {trend.map((v, i) => (
                          <div key={i} style={{ flex: 1, background: `linear-gradient(180deg, #00ffc8 0%, #00ffc840 100%)`, borderRadius: "2px 2px 0 0", height: `${(v / max) * 100}%`, minWidth: "6px" }} />
                        ))}
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "#2a4a3a", marginTop: "4px" }}>
                        <span>BASE</span><span>LAST {trend.length} LOGS</span>
                      </div>
                    </div>
                  );
                })}

                <div style={{ marginTop: "20px" }}>
                  <div style={styles.label}>PROTOCOL ATTRIBUTION</div>
                  <div style={styles.card}>
                    <div style={{ fontSize: "13px", color: "#4a7a6a", lineHeight: "1.7" }}>
                      {doses.length > 0 ? (
                        <>
                          <div style={{ color: "#8ab0a0", marginBottom: "8px" }}>Active compounds this cycle:</div>
                          {[...new Set(doses.slice(-30).map(d => d.peptide))].map(p => (
                            <div key={p} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #1a3a2a" }}>
                              <span style={{ color: "#00ffc8", fontFamily: "'Orbitron', sans-serif", fontSize: "12px" }}>{p}</span>
                              <span>{doses.filter(d => d.peptide === p).length} doses</span>
                            </div>
                          ))}
                        </>
                      ) : "Log doses to see protocol attribution here."}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ─── CALC ─── */}
      {tab === "calc" && (
        <div>
          <div style={{ ...styles.header, paddingTop: "24px" }}>
            <div><div style={styles.title}>HELIX</div><div style={styles.pageTitle}>RECONSTITUTION CALC</div></div>
          </div>
          <div style={styles.section}>
            <div style={styles.card}>
              <div style={styles.label}>VIAL SIZE (mg)</div>
              <input value={calcVial} onChange={e => setCalcVial(e.target.value)} placeholder="e.g. 5" type="number" style={{ ...styles.input, marginBottom: "14px" }} />
              <div style={styles.label}>BAC WATER ADDED (mL)</div>
              <input value={calcWater} onChange={e => setCalcWater(e.target.value)} placeholder="e.g. 2" type="number" style={{ ...styles.input, marginBottom: "14px" }} />
              <div style={styles.label}>DESIRED DOSE (mcg)</div>
              <input value={calcDose} onChange={e => setCalcDose(e.target.value)} placeholder="e.g. 250" type="number" style={styles.input} />
            </div>

            {calcMl() && (
              <div style={{ ...styles.card, borderColor: "#00ffc840", background: "#001a12", textAlign: "center", marginTop: "16px" }}>
                <div style={styles.label}>DRAW VOLUME</div>
                <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "36px", fontWeight: "900", color: "#00ffc8" }}>{calcMl().ml} mL</div>
                <div style={{ fontSize: "13px", color: "#4a7a6a", marginTop: "4px" }}>{calcMl().units} units on U100 syringe</div>
                <div style={{ fontSize: "12px", color: "#2a4a3a", marginTop: "12px" }}>
                  Concentration: {((parseFloat(calcVial) * 1000) / parseFloat(calcWater)).toFixed(0)} mcg/mL
                </div>
                <div style={{ fontSize: "12px", color: "#2a4a3a", marginTop: "4px" }}>
                  Doses per vial: {Math.floor((parseFloat(calcVial) * 1000) / parseFloat(calcDose))}
                </div>
              </div>
            )}

            <div style={{ marginTop: "20px" }}>
              <div style={styles.label}>QUICK FILL</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {PEPTIDES.slice(0, 8).map(p => (
                  <button key={p.id} onClick={() => {
                    const doseMatch = p.dose.match(/(\d+)/);
                    if (doseMatch) setCalcDose(doseMatch[1]);
                  }} style={{ padding: "8px 14px", background: "#0d1a14", border: "1px solid #1a3a2a", borderRadius: "20px", color: "#4a7a6a", fontSize: "11px", cursor: "pointer", fontFamily: "'Orbitron', sans-serif" }}>{p.name}</button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── AI ─── */}
      {tab === "ai" && (
        <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
          <div style={{ ...styles.header, paddingTop: "24px", paddingBottom: "16px", flexShrink: 0 }}>
            <div>
              <div style={styles.title}>HELIX</div>
              <div style={styles.pageTitle}>AI ADVISOR</div>
            </div>
            <button onClick={() => setChatMessages([])} style={{ background: "#1a3a2a", border: "none", color: "#4a7a6a", borderRadius: "8px", padding: "8px 14px", cursor: "pointer", fontFamily: "'Orbitron', sans-serif", fontSize: "10px" }}>CLEAR</button>
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: "0 20px 16px" }}>
            {chatMessages.length === 0 && (
              <div>
                <div style={{ ...styles.card, borderColor: "#00ffc820", background: "#001a12", marginBottom: "16px" }}>
                  <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "12px", color: "#00ffc8", marginBottom: "6px" }}>✦ HELIX AI</div>
                  <div style={{ fontSize: "13px", color: "#8ab0a0", lineHeight: "1.6" }}>
                    I'm your personal peptide advisor. I know your goals ({userGoals.join(", ") || "not set"}), your logged data, and your active compounds. Ask me anything.
                  </div>
                </div>
                <div style={styles.label}>SUGGESTED QUESTIONS</div>
                {["What's the best stack for my goals?", "How do I reconstitute BPC-157?", "What time should I inject Ipamorelin?", "Compare AOD-9604 vs Semaglutide for fat loss", "What bloodwork should I track?", "How long before I see results from TB-500?"].map(q => (
                  <button key={q} onClick={() => sendChat(q)} style={{ ...styles.card, width: "100%", textAlign: "left", cursor: "pointer", color: "#8ab0a0", fontSize: "13px", marginBottom: "8px" }}>{q}</button>
                ))}
              </div>
            )}
            {chatMessages.map((m, i) => (
              <div key={i} style={{ marginBottom: "14px", display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
                <div style={{ maxWidth: "85%", padding: "12px 16px", background: m.role === "user" ? "#00ffc8" : "#0d1a14", color: m.role === "user" ? "#080c10" : "#e8f4f0", borderRadius: m.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px", border: m.role === "assistant" ? "1px solid #1a3a2a" : "none", fontSize: "14px", lineHeight: "1.6", whiteSpace: "pre-wrap" }}>
                  {m.content}
                </div>
              </div>
            ))}
            {chatLoading && (
              <div style={{ display: "flex", gap: "6px", padding: "12px 16px", background: "#0d1a14", borderRadius: "16px 16px 16px 4px", width: "fit-content", border: "1px solid #1a3a2a" }}>
                {[0, 1, 2].map(i => <div key={i} style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#00ffc8", animation: "pulse 1.2s ease-in-out infinite", animationDelay: `${i * 0.2}s` }} />)}
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div style={{ flexShrink: 0, padding: "12px 20px 20px", borderTop: "1px solid #1a3a2a", background: "rgba(8,12,16,0.98)", display: "flex", gap: "10px" }}>
            <input value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendChat()} placeholder="Ask your AI advisor..." style={{ ...styles.input, flex: 1 }} />
            <button onClick={() => sendChat()} style={{ ...styles.btn("primary"), padding: "12px 16px", flexShrink: 0 }}>✦</button>
          </div>

          <style>{`@keyframes pulse { 0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); } 40% { opacity: 1; transform: scale(1); } }`}</style>
        </div>
      )}

      {/* ─── BOTTOM NAV ─── */}
      {!showGlossary && (
        <nav style={styles.nav}>
          {TAB_CONFIG.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={styles.navBtn(tab === t.id)}>
              <span style={styles.navIcon(tab === t.id)}>{t.icon}</span>
              <span style={styles.navLabel(tab === t.id)}>{t.label}</span>
            </button>
          ))}
        </nav>
      )}
    </div>
  );
}
