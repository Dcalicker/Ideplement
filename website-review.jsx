import { useState, useEffect, useRef } from "react";

// ─────────────────────────────────────────────────────────────────
// ██  TESTING PHASE CONFIG — fill in these two lines only  ██
// ─────────────────────────────────────────────────────────────────
const RESEND_API_KEY = "re_Qn3o4ZMH_HwXwqT4Za73vBaDB3rEpgykV";
const YOUR_EMAIL     = "Dhcalicker@gmail.com";
// ─────────────────────────────────────────────────────────────────
// Get your free Resend key at: resend.com/api-keys (takes 2 min)
// NOTE: For testing only — move to backend before public launch
// ─────────────────────────────────────────────────────────────────

// ── Design tokens ────────────────────────────────────────────────
const C = {
  navy:    "#111111",
  navyMid: "#1A1A1A",
  blue:    "#C45000",
  sky:     "#F26419",
  skyLight:"#FEF0E6",
  slate:   "#555555",
  muted:   "#888888",
  border:  "#E0E0E0",
  offWhite:"#F8F8F8",
  white:   "#FFFFFF",
  green:   "#1A7A4A",
  greenL:  "#E8F5EE",
  amber:   "#B8640A",
  amberL:  "#FEF3E6",
  red:     "#B02020",
  redL:    "#FDECEC",
};

function scoreColor(s) {
  if (s >= 7) return { fg: C.green, bg: C.greenL };
  if (s >= 4) return { fg: C.amber, bg: C.amberL };
  return { fg: C.red, bg: C.redL };
}
function scoreLabel(s) {
  if (s >= 8) return "Strong";
  if (s >= 6) return "Decent";
  if (s >= 4) return "Weak";
  return "Critical";
}

// ── Email builders ───────────────────────────────────────────────

// Email YOU receive — full report, every field, consultation angle
function buildOwnerEmail({ name, email, company, url, report, timestamp }) {
  const s  = report.scores;
  const fr = report.fullReport;
  const scoreBox = (label, val) => {
    const { fg, bg } = scoreColor(val);
    return `
      <td style="padding:4px;">
        <div style="background:${bg};border-radius:6px;padding:10px 12px;text-align:center;min-width:80px;">
          <div style="font-size:20px;font-weight:700;color:${fg};font-family:Arial,sans-serif;">${val}<span style="font-size:11px;font-weight:400;color:#888;">/10</span></div>
          <div style="font-size:10px;color:#666;margin-top:2px;">${label}</div>
        </div>
      </td>`;
  };

  return `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f0f0f0;font-family:Arial,sans-serif;">
<div style="max-width:640px;margin:24px auto;border-radius:10px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.12);">

  <!-- Header -->
  <div style="background:#111;padding:22px 28px;">
    <div style="font-size:11px;color:#F26419;letter-spacing:.08em;font-weight:700;margin-bottom:6px;">IDEPLEMENT — NEW SITEGRADER LEAD</div>
    <div style="font-size:22px;font-weight:700;color:#fff;">${name}</div>
    <div style="font-size:12px;color:rgba(255,255,255,0.4);margin-top:4px;">${report.businessType} &nbsp;·&nbsp; Overall ${report.overallScore}/10 &nbsp;·&nbsp; ${timestamp}</div>
  </div>

  <div style="background:#f8f8f8;padding:24px 28px;">

    <!-- Prospect details -->
    <div style="background:#fff;border-radius:8px;padding:18px 20px;margin-bottom:16px;border:1px solid #e0e0e0;">
      <div style="font-size:11px;font-weight:700;color:#888;letter-spacing:.07em;margin-bottom:12px;">PROSPECT DETAILS</div>
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:6px 0;font-size:12px;color:#888;width:110px;">Name</td><td style="padding:6px 0;font-size:13px;font-weight:600;color:#111;">${name}</td></tr>
        <tr><td style="padding:6px 0;font-size:12px;color:#888;">Email</td><td style="padding:6px 0;font-size:13px;"><a href="mailto:${email}" style="color:#F26419;font-weight:600;">${email}</a></td></tr>
        <tr><td style="padding:6px 0;font-size:12px;color:#888;">Company</td><td style="padding:6px 0;font-size:13px;color:#111;">${company || "—"}</td></tr>
        <tr><td style="padding:6px 0;font-size:12px;color:#888;">Website</td><td style="padding:6px 0;font-size:13px;"><a href="${url}" style="color:#F26419;">${url}</a></td></tr>
        <tr><td style="padding:6px 0;font-size:12px;color:#888;">Business</td><td style="padding:6px 0;font-size:13px;color:#111;">${report.businessType}</td></tr>
      </table>
    </div>

    <!-- Scores -->
    <div style="background:#fff;border-radius:8px;padding:18px 20px;margin-bottom:16px;border:1px solid #e0e0e0;">
      <div style="font-size:11px;font-weight:700;color:#888;letter-spacing:.07em;margin-bottom:14px;">SCORE BREAKDOWN</div>
      <table style="border-collapse:collapse;width:100%;"><tr>
        ${scoreBox("Overall",      report.overallScore)}
        ${scoreBox("Lead capture", s.leadCapture)}
        ${scoreBox("Trust signals",s.trustSignals)}
        ${scoreBox("SEO",          s.seoReadiness)}
        ${scoreBox("CTA clarity",  s.ctaClarity)}
        ${scoreBox("Content",      s.contentDepth)}
      </tr></table>
      <div style="margin-top:14px;padding:12px;background:#f8f8f8;border-radius:6px;font-size:13px;color:#333;font-style:italic;">"${report.headline}"</div>
    </div>

    <!-- Full analysis -->
    <div style="background:#fff;border-radius:8px;padding:18px 20px;margin-bottom:16px;border:1px solid #e0e0e0;">
      <div style="font-size:11px;font-weight:700;color:#888;letter-spacing:.07em;margin-bottom:16px;">FULL ANALYSIS</div>

      <div style="margin-bottom:14px;">
        <div style="font-size:11px;font-weight:700;color:#F26419;letter-spacing:.06em;margin-bottom:5px;">LEAD CAPTURE</div>
        <p style="font-size:13px;color:#333;line-height:1.65;margin:0;">${fr.leadCaptureDetail}</p>
      </div>
      <div style="margin-bottom:14px;">
        <div style="font-size:11px;font-weight:700;color:#F26419;letter-spacing:.06em;margin-bottom:5px;">TRUST SIGNALS</div>
        <p style="font-size:13px;color:#333;line-height:1.65;margin:0;">${fr.trustSignalsDetail}</p>
      </div>
      <div style="margin-bottom:14px;">
        <div style="font-size:11px;font-weight:700;color:#F26419;letter-spacing:.06em;margin-bottom:5px;">SEO READINESS</div>
        <p style="font-size:13px;color:#333;line-height:1.65;margin:0;">${fr.seoDetail}</p>
      </div>
      <div style="margin-bottom:14px;">
        <div style="font-size:11px;font-weight:700;color:#F26419;letter-spacing:.06em;margin-bottom:5px;">CTA CLARITY</div>
        <p style="font-size:13px;color:#333;line-height:1.65;margin:0;">${fr.ctaDetail}</p>
      </div>
      <div style="margin-bottom:0;">
        <div style="font-size:11px;font-weight:700;color:#F26419;letter-spacing:.06em;margin-bottom:5px;">CONTENT DEPTH</div>
        <p style="font-size:13px;color:#333;line-height:1.65;margin:0;">${fr.contentDetail}</p>
      </div>
    </div>

    <!-- Priority actions -->
    <div style="background:#fff;border-radius:8px;padding:18px 20px;margin-bottom:16px;border:1px solid #e0e0e0;">
      <div style="font-size:11px;font-weight:700;color:#888;letter-spacing:.07em;margin-bottom:14px;">PRIORITY ACTION PLAN</div>
      ${fr.priorityActions.map((a, i) => `
        <div style="display:flex;gap:12px;margin-bottom:10px;align-items:flex-start;">
          <div style="width:22px;height:22px;min-width:22px;border-radius:50%;background:#F26419;color:#fff;font-size:10px;font-weight:700;text-align:center;line-height:22px;">${i + 1}</div>
          <p style="font-size:13px;color:#333;margin:2px 0 0;line-height:1.55;">${a}</p>
        </div>`).join("")}
    </div>

    <!-- Consultation angle -->
    <div style="background:#FEF0E6;border:1px solid #F26419;border-radius:8px;padding:16px 20px;margin-bottom:16px;">
      <div style="font-size:11px;font-weight:700;color:#F26419;letter-spacing:.07em;margin-bottom:6px;">YOUR CONSULTATION ANGLE</div>
      <p style="font-size:13px;color:#7A3000;line-height:1.65;margin:0;font-style:italic;">${fr.consultationAngle}</p>
    </div>

    <!-- CTA footer -->
    <div style="background:#111;border-radius:8px;padding:18px 20px;text-align:center;">
      <p style="font-size:12px;color:rgba(255,255,255,0.45);margin:0 0 12px;">Reply directly to reach this prospect</p>
      <a href="mailto:${email}?subject=Your%20Free%20Website%20Report%20is%20Ready&body=Hi%20${encodeURIComponent(name.split(" ")[0])}%2C%0A%0A"
         style="display:inline-block;background:#F26419;color:#fff;padding:11px 28px;border-radius:8px;text-decoration:none;font-weight:700;font-size:13px;">
        Email ${name.split(" ")[0]} Now →
      </a>
    </div>

  </div>
</div>
</body>
</html>`;
}

// Email the PROSPECT receives — teaser only, 1 quick win, consultation CTA
function buildProspectEmail({ name, url, report }) {
  const firstName = name.split(" ")[0];
  const s = report.scores;
  const { fg: ovFg, bg: ovBg } = scoreColor(report.overallScore);

  const miniScore = (label, val) => {
    const { fg, bg } = scoreColor(val);
    return `
      <td style="padding:4px;text-align:center;">
        <div style="background:${bg};border-radius:6px;padding:8px 10px;">
          <div style="font-size:17px;font-weight:700;color:${fg};font-family:Arial,sans-serif;">${val}<span style="font-size:10px;font-weight:400;">/10</span></div>
          <div style="font-size:10px;color:#666;margin-top:1px;">${label}</div>
        </div>
      </td>`;
  };

  return `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f0f0f0;font-family:Arial,sans-serif;">
<div style="max-width:600px;margin:24px auto;border-radius:10px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.1);">

  <!-- Header -->
  <div style="background:#111;padding:24px 28px;text-align:center;">
    <div style="font-family:Arial,sans-serif;font-size:20px;font-weight:800;color:#fff;">Site<span style="color:#F26419;">Grade</span></div>
    <div style="font-size:11px;color:rgba(255,255,255,0.4);letter-spacing:.07em;margin-top:4px;">YOUR FREE WEBSITE REPORT</div>
  </div>

  <div style="background:#f8f8f8;padding:24px 28px;">

    <!-- Greeting -->
    <p style="font-size:15px;color:#111;font-weight:600;margin:0 0 6px;">Hi ${firstName},</p>
    <p style="font-size:13px;color:#555;line-height:1.65;margin:0 0 20px;">Here's your free website grade for <a href="${url}" style="color:#F26419;">${url}</a>. We analyzed 5 key areas that directly impact how many leads your site generates.</p>

    <!-- Overall score -->
    <div style="background:#fff;border-radius:8px;padding:20px;margin-bottom:16px;border:1px solid #e0e0e0;text-align:center;">
      <div style="font-size:11px;font-weight:700;color:#888;letter-spacing:.07em;margin-bottom:10px;">OVERALL WEBSITE GRADE</div>
      <div style="font-size:52px;font-weight:800;color:${ovFg};font-family:Arial,sans-serif;line-height:1;">${report.overallScore}<span style="font-size:20px;font-weight:400;color:#aaa;">/10</span></div>
      <div style="display:inline-block;background:${ovBg};color:${ovFg};border-radius:5px;padding:4px 14px;font-size:12px;font-weight:700;margin:10px 0 8px;">${report.overallScore < 4 ? "Needs Urgent Attention" : report.overallScore < 7 ? "Room for Improvement" : "Performing Well"}</div>
      <div style="font-size:14px;color:#333;font-style:italic;margin-top:6px;">"${report.headline}"</div>
    </div>

    <!-- Score breakdown -->
    <div style="background:#fff;border-radius:8px;padding:18px 20px;margin-bottom:16px;border:1px solid #e0e0e0;">
      <div style="font-size:11px;font-weight:700;color:#888;letter-spacing:.07em;margin-bottom:14px;">SCORE BREAKDOWN</div>
      <table style="width:100%;border-collapse:collapse;"><tr>
        ${miniScore("Lead capture", s.leadCapture)}
        ${miniScore("Trust signals", s.trustSignals)}
        ${miniScore("SEO", s.seoReadiness)}
        ${miniScore("CTA clarity", s.ctaClarity)}
        ${miniScore("Content", s.contentDepth)}
      </tr></table>
    </div>

    <!-- #1 Quick win -->
    <div style="background:#E8F5EE;border:1.5px solid #1A7A4A;border-radius:8px;padding:18px 20px;margin-bottom:16px;">
      <div style="display:flex;gap:12px;align-items:flex-start;">
        <div style="width:32px;height:32px;min-width:32px;background:#1A7A4A;border-radius:7px;text-align:center;line-height:32px;font-size:15px;">💡</div>
        <div>
          <div style="font-size:11px;font-weight:700;color:#1A7A4A;letter-spacing:.07em;margin-bottom:5px;">YOUR #1 QUICK WIN</div>
          <p style="font-size:13px;color:#0F4A2A;line-height:1.65;margin:0;font-weight:500;">${report.topOpportunity}</p>
        </div>
      </div>
    </div>

    <!-- Teaser / locked -->
    <div style="background:#fff;border-radius:8px;padding:18px 20px;margin-bottom:16px;border:1px solid #e0e0e0;">
      <div style="font-size:11px;font-weight:700;color:#888;letter-spacing:.07em;margin-bottom:10px;">WHAT ELSE WE FOUND</div>
      <div style="background:#FEF3E6;border:1px solid #B8640A;border-radius:6px;padding:13px 15px;">
        <p style="font-size:13px;color:#7A4500;font-weight:600;margin:0 0 4px;">🔒 ${report.teaser}</p>
        <p style="font-size:12px;color:#9A5800;margin:0;">The full breakdown is waiting for you in a free 20-minute consultation.</p>
      </div>
    </div>

    <!-- Consultation CTA -->
    <div style="background:#111;border-radius:8px;padding:22px 20px;text-align:center;">
      <div style="font-size:11px;color:#F26419;font-weight:700;letter-spacing:.07em;margin-bottom:8px;">FREE 20-MINUTE CONSULTATION</div>
      <p style="font-size:14px;color:#fff;font-weight:700;margin:0 0 8px;line-height:1.35;">See the full report &amp; get your custom action plan</p>
      <p style="font-size:12px;color:rgba(255,255,255,0.5);margin:0 0 18px;line-height:1.6;">We'll walk through every finding, tell you exactly what to fix first, and give you a clear roadmap — no obligation.</p>
      <a href="mailto:${YOUR_EMAIL}?subject=Consultation%20Request%20from%20${encodeURIComponent(firstName)}"
         style="display:inline-block;background:#F26419;color:#fff;padding:13px 28px;border-radius:8px;text-decoration:none;font-weight:700;font-size:14px;">
        Book My Free Consultation →
      </a>
      <p style="font-size:11px;color:rgba(255,255,255,0.3);margin:14px 0 0;">No obligation · No sales pressure · Genuinely useful regardless</p>
    </div>

    <p style="font-size:11px;color:#aaa;text-align:center;margin:16px 0 0;line-height:1.6;">
      You received this because you used the free SiteGrade tool at Ideplement.<br>
      Questions? Reply to this email.
    </p>

  </div>
</div>
</body>
</html>`;
}

// ── Send via Resend ───────────────────────────────────────────────
async function sendEmail({ to, subject, html, replyTo }) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: "SiteGrade by Ideplement <onboarding@resend.dev>",
      to,
      subject,
      html,
      ...(replyTo ? { reply_to: replyTo } : {}),
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Resend error: ${err}`);
  }
  return res.json();
}

// ── Radial gauge ─────────────────────────────────────────────────
function Gauge({ score, size = 110 }) {
  const [animScore, setAnimScore] = useState(0);
  useEffect(() => {
    let start = null;
    const dur = 1400;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setAnimScore(ease * score);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [score]);
  const r = 40, cx = 55, cy = 55;
  const circumference = 2 * Math.PI * r;
  const arc = (animScore / 10) * circumference * 0.75;
  const { fg } = scoreColor(score);
  return (
    <svg width={size} height={size} viewBox="0 0 110 110">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.border} strokeWidth="8"
        strokeDasharray={`${circumference * 0.75} ${circumference}`}
        strokeDashoffset={circumference * 0.125}
        strokeLinecap="round" transform={`rotate(135 ${cx} ${cy})`} />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={fg} strokeWidth="8"
        strokeDasharray={`${arc} ${circumference}`}
        strokeDashoffset={circumference * 0.125}
        strokeLinecap="round" transform={`rotate(135 ${cx} ${cy})`}
        style={{ transition: "stroke-dasharray 0.05s" }} />
      <text x={cx} y={cy - 4} textAnchor="middle" dominantBaseline="middle"
        style={{ fontFamily: "'Syne', sans-serif", fontSize: 26, fontWeight: 800, fill: fg }}>{Math.round(animScore)}</text>
      <text x={cx} y={cy + 16} textAnchor="middle"
        style={{ fontFamily: "system-ui", fontSize: 10, fill: C.muted }}>/10</text>
    </svg>
  );
}

// ── Score bar ─────────────────────────────────────────────────────
function ScoreBar({ label, score, delay = 0 }) {
  const [width, setWidth] = useState(0);
  const { fg } = scoreColor(score);
  useEffect(() => {
    const t = setTimeout(() => setWidth(score * 10), delay + 200);
    return () => clearTimeout(t);
  }, [score]);
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 13, color: C.slate, fontWeight: 500 }}>{label}</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: fg }}>{score}/10 <span style={{ fontWeight: 400, fontSize: 11, color: C.muted }}>{scoreLabel(score)}</span></span>
      </div>
      <div style={{ height: 7, borderRadius: 4, background: C.border, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${width}%`, background: fg, borderRadius: 4, transition: "width 1s cubic-bezier(0.22,1,0.36,1)" }} />
      </div>
    </div>
  );
}

// ── Step indicator ────────────────────────────────────────────────
function Steps({ current }) {
  const steps = ["Enter URL", "Your Info", "Your Report"];
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0, marginBottom: 36 }}>
      {steps.map((s, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <div style={{
              width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
              background: i <= current ? C.sky : C.border,
              color: i <= current ? C.white : C.muted,
              fontSize: 12, fontWeight: 700, transition: "all 0.3s"
            }}>{i < current ? "✓" : i + 1}</div>
            <span style={{ fontSize: 11, color: i <= current ? C.sky : C.muted, whiteSpace: "nowrap", fontWeight: i === current ? 600 : 400 }}>{s}</span>
          </div>
          {i < steps.length - 1 && (
            <div style={{ width: 60, height: 2, background: i < current ? C.sky : C.border, margin: "0 8px", marginTop: -16, transition: "background 0.3s" }} />
          )}
        </div>
      ))}
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────
export default function WebsiteGrader() {
  const [step, setStep]         = useState(0);
  const [url, setUrl]           = useState("");
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [company, setCompany]   = useState("");
  const [report, setReport]     = useState(null);
  const [urlError, setUrlError] = useState("");
  const [infoError, setInfoError] = useState("");
  const [typingText, setTypingText] = useState("");
  const msgRef = useRef(0);

  const messages = [
    "Fetching your website...",
    "Analyzing lead capture elements...",
    "Evaluating trust signals...",
    "Checking SEO fundamentals...",
    "Reviewing CTA effectiveness...",
    "Assessing content depth...",
    "Calculating your scores...",
    "Preparing your report...",
  ];

  useEffect(() => {
    if (step !== 2) return;
    setTypingText(messages[0]);
    const iv = setInterval(() => {
      msgRef.current = (msgRef.current + 1) % messages.length;
      setTypingText(messages[msgRef.current]);
    }, 2000);
    return () => clearInterval(iv);
  }, [step]);

  function validateUrl() {
    const val = url.trim();
    if (!val) { setUrlError("Please enter a website URL."); return false; }
    try {
      const u = new URL(val.startsWith("http") ? val : "https://" + val);
      setUrl(u.href); setUrlError(""); return true;
    } catch { setUrlError("Please enter a valid URL, e.g. yoursite.com"); return false; }
  }

  function validateInfo() {
    if (!name.trim() || !email.trim()) { setInfoError("Please enter your name and email."); return false; }
    if (!/\S+@\S+\.\S+/.test(email)) { setInfoError("Please enter a valid email address."); return false; }
    setInfoError(""); return true;
  }

  async function analyzeWebsite() {
    setStep(2);

    // ── 1. Build the AI prompt (requests fullReport) ──────────────
    const prompt = `You are a website conversion expert. Analyze the website: ${url}
Business owner: ${name}, Company: ${company || "not provided"}.

Respond ONLY with valid JSON, no other text:
{
  "businessName": "short name from URL/domain",
  "businessType": "type of business in 4 words",
  "overallScore": <1-10>,
  "scores": {
    "leadCapture": <1-10>,
    "trustSignals": <1-10>,
    "seoReadiness": <1-10>,
    "ctaClarity": <1-10>,
    "contentDepth": <1-10>
  },
  "topOpportunity": "One specific actionable improvement starting with a verb. Max 28 words. Specific to this business.",
  "teaser": "Hint at 2-3 critical issues without revealing them. Start with: We also identified... Max 32 words.",
  "headline": "6-8 word punchy verdict on the site.",
  "fullReport": {
    "leadCaptureDetail": "2-3 sentences on lead capture issues and fixes.",
    "trustSignalsDetail": "2-3 sentences on trust signal gaps and what to add.",
    "seoDetail": "2-3 sentences on SEO gaps — local pages, keywords, structure.",
    "ctaDetail": "2-3 sentences on CTA problems — placement, copy, urgency.",
    "contentDetail": "2-3 sentences on content gaps — thin pages, missing FAQs, weak copy.",
    "priorityActions": [
      "First thing to fix — highest impact",
      "Second priority action",
      "Third priority action",
      "Fourth priority action",
      "Fifth priority action"
    ],
    "competitiveNote": "1-2 sentences comparing this site to competitors in this space.",
    "consultationAngle": "1-2 sentences on why a consultation makes sense for this specific business."
  }
}`;

    let parsed;
    try {
      const aiRes = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1500,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const aiData = await aiRes.json();
      const text   = aiData.content?.find(b => b.type === "text")?.text || "";
      parsed       = JSON.parse(text.replace(/```json|```/g, "").trim());
    } catch (e) {
      setInfoError("Analysis failed — please check the URL and try again.");
      setStep(1);
      return;
    }

    const timestamp = new Date().toLocaleString("en-US", {
      month: "short", day: "numeric", year: "numeric",
      hour: "numeric", minute: "2-digit", hour12: true
    });

    // ── 2. Fire both emails simultaneously ────────────────────────
    // Neither blocks the UI — errors are caught silently so the
    // prospect still sees their report even if email fails.
    const ownerHtml = buildOwnerEmail({ name, email, company, url, report: parsed, timestamp });
    const prospectHtml = buildProspectEmail({ name, url, report: parsed });

    Promise.all([
      // Email to YOU — full report
      sendEmail({
        to: YOUR_EMAIL,
        subject: `New lead: ${name} — ${parsed.businessType} — ${parsed.overallScore}/10`,
        html: ownerHtml,
        replyTo: email,
      }),
      // Email to PROSPECT — teaser + 1 quick win
      sendEmail({
        to: email,
        subject: `${name.split(" ")[0]}, your free website grade is ready`,
        html: prospectHtml,
        replyTo: YOUR_EMAIL,
      }),
    ]).catch(err => console.warn("Email send issue:", err));

    // ── 3. Show report in the tool ────────────────────────────────
    setReport({ ...parsed, url, name, email, company });
    setStep(3);
  }

  const inputStyle = {
    width: "100%", padding: "13px 16px", fontSize: 15,
    border: `1.5px solid ${C.border}`, borderRadius: 10,
    background: C.white, color: C.navy, fontFamily: "inherit",
    outline: "none", transition: "border-color 0.2s", boxSizing: "border-box",
  };
  const btnPrimary = {
    width: "100%", padding: "15px 24px", fontSize: 15, fontWeight: 700,
    background: C.sky, color: C.white, border: "none", borderRadius: 10,
    cursor: "pointer", fontFamily: "inherit", transition: "background 0.2s",
  };

  return (
    <div style={{ minHeight: "100vh", background: C.navy, fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {/* Topbar */}
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 18, color: C.white }}>Site<span style={{ color: C.sky }}>Grade</span></span>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginLeft: 10, letterSpacing: "0.08em" }}>FREE WEBSITE ANALYZER</span>
        </div>
        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>Powered by Ideplement</span>
      </div>

      <div style={{ maxWidth: 560, margin: "0 auto", padding: "40px 20px 60px" }}>

        {/* Hero */}
        {step <= 1 && (
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <div style={{ display: "inline-block", background: "rgba(242,100,25,0.15)", border: "1px solid rgba(242,100,25,0.3)", borderRadius: 20, padding: "4px 14px", fontSize: 12, color: C.sky, fontWeight: 600, letterSpacing: "0.06em", marginBottom: 16 }}>
              FREE · INSTANT · NO CREDIT CARD
            </div>
            <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 34, fontWeight: 800, color: C.white, lineHeight: 1.15, margin: "0 0 14px" }}>
              Is your website<br /><span style={{ color: C.sky }}>losing you leads?</span>
            </h1>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.55)", lineHeight: 1.65, margin: 0 }}>
              Get an instant AI-powered grade across 5 key areas. See exactly where you're leaving money on the table.
            </p>
          </div>
        )}

        {step <= 1 && <Steps current={step} />}

        {/* Step 0 — URL */}
        {step === 0 && (
          <div style={{ background: C.white, borderRadius: 16, padding: "28px 28px 24px", boxShadow: "0 20px 60px rgba(0,0,0,0.25)" }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: C.slate, marginBottom: 8, letterSpacing: "0.04em" }}>YOUR WEBSITE URL</label>
            <input style={inputStyle} placeholder="https://yourbusiness.com" value={url}
              onChange={e => { setUrl(e.target.value); setUrlError(""); }}
              onKeyDown={e => e.key === "Enter" && validateUrl() && setStep(1)}
              onFocus={e => e.target.style.borderColor = C.sky}
              onBlur={e => e.target.style.borderColor = C.border} />
            {urlError && <p style={{ color: C.red, fontSize: 12, margin: "8px 0 0" }}>{urlError}</p>}
            <button style={{ ...btnPrimary, marginTop: 16 }} onClick={() => validateUrl() && setStep(1)}
              onMouseEnter={e => e.target.style.background = C.blue}
              onMouseLeave={e => e.target.style.background = C.sky}>
              Grade My Website →
            </button>
            <p style={{ textAlign: "center", fontSize: 12, color: C.muted, marginTop: 14 }}>Takes about 15 seconds · Used by 500+ business owners</p>
          </div>
        )}

        {/* Step 1 — Info gate */}
        {step === 1 && (
          <div style={{ background: C.white, borderRadius: 16, padding: "28px 28px 24px", boxShadow: "0 20px 60px rgba(0,0,0,0.25)" }}>
            <p style={{ fontSize: 13, color: C.slate, marginBottom: 6 }}>Analyzing: <span style={{ color: C.sky, fontWeight: 600, wordBreak: "break-all" }}>{url}</span></p>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 800, color: C.navy, margin: "0 0 6px" }}>Where should we send your report?</h2>
            <p style={{ fontSize: 13, color: C.muted, margin: "0 0 20px", lineHeight: 1.5 }}>Enter your info to unlock your grade, your #1 quick win, and a copy of this report in your inbox.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <input style={inputStyle} placeholder="Your name" value={name}
                onChange={e => { setName(e.target.value); setInfoError(""); }}
                onFocus={e => e.target.style.borderColor = C.sky}
                onBlur={e => e.target.style.borderColor = C.border} />
              <input style={inputStyle} placeholder="Business email" type="email" value={email}
                onChange={e => { setEmail(e.target.value); setInfoError(""); }}
                onFocus={e => e.target.style.borderColor = C.sky}
                onBlur={e => e.target.style.borderColor = C.border} />
              <input style={inputStyle} placeholder="Company name (optional)" value={company}
                onChange={e => setCompany(e.target.value)}
                onFocus={e => e.target.style.borderColor = C.sky}
                onBlur={e => e.target.style.borderColor = C.border} />
            </div>
            {infoError && <p style={{ color: C.red, fontSize: 12, margin: "10px 0 0" }}>{infoError}</p>}
            <button style={{ ...btnPrimary, marginTop: 16 }}
              onClick={() => validateInfo() && analyzeWebsite()}
              onMouseEnter={e => e.target.style.background = C.blue}
              onMouseLeave={e => e.target.style.background = C.sky}>
              Unlock My Free Report →
            </button>
            <p style={{ textAlign: "center", fontSize: 11, color: C.muted, marginTop: 12, lineHeight: 1.5 }}>
              🔒 No spam. Your report will be emailed to you instantly.
            </p>
          </div>
        )}

        {/* Step 2 — Analyzing */}
        {step === 2 && (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <div style={{ width: 80, height: 80, borderRadius: "50%", border: "3px solid rgba(242,100,25,0.2)", borderTop: `3px solid ${C.sky}`, animation: "spin 1s linear infinite", margin: "0 auto 28px" }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 800, color: C.white, margin: "0 0 12px" }}>Analyzing your website...</h2>
            <p style={{ color: C.sky, fontSize: 14, fontWeight: 500, minHeight: 22 }}>{typingText}</p>
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 12, marginTop: 20 }}>This takes about 15 seconds</p>
          </div>
        )}

        {/* Step 3 — Report */}
        {step === 3 && report && <Report report={report} />}

      </div>
    </div>
  );
}

// ── Report component ──────────────────────────────────────────────
function Report({ report }) {
  const { overallScore, scores, topOpportunity, teaser, name, url } = report;
  const overall = scoreColor(overallScore);
  const [showCal, setShowCal] = useState(false);
  const categories = [
    { key: "leadCapture",  label: "Lead capture" },
    { key: "trustSignals", label: "Trust signals" },
    { key: "seoReadiness", label: "SEO readiness" },
    { key: "ctaClarity",   label: "CTA clarity" },
    { key: "contentDepth", label: "Content depth" },
  ];
  const card = { background: "#fff", borderRadius: 14, padding: "22px 24px", marginBottom: 14 };

  return (
    <div style={{ animation: "fadeUp 0.5s ease both" }}>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        .book-btn:hover { background: #155c38 !important; }
      `}</style>

      {/* Email sent confirmation banner */}
      <div style={{ background: C.greenL, border: `1px solid ${C.green}`, borderRadius: 10, padding: "11px 16px", marginBottom: 14, display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 16 }}>✉️</span>
        <p style={{ fontSize: 13, color: "#0F4A2A", margin: 0, fontWeight: 500 }}>
          Your report has been emailed to <strong>{report.email}</strong>
        </p>
      </div>

      {/* Overall score */}
      <div style={{ ...card, textAlign: "center", boxShadow: "0 20px 60px rgba(0,0,0,0.18)" }}>
        <p style={{ fontSize: 12, color: C.muted, letterSpacing: "0.07em", fontWeight: 600, marginBottom: 4 }}>WEBSITE GRADE FOR</p>
        <p style={{ fontSize: 13, color: C.sky, fontWeight: 700, marginBottom: 16, wordBreak: "break-all" }}>{url}</p>
        <Gauge score={overallScore} size={130} />
        <div style={{ marginTop: 10, marginBottom: 8 }}>
          <span style={{ display: "inline-block", background: overall.bg, color: overall.fg, borderRadius: 6, padding: "4px 14px", fontSize: 13, fontWeight: 700 }}>
            {overallScore < 4 ? "Needs Urgent Attention" : overallScore < 7 ? "Room for Improvement" : "Performing Well"}
          </span>
        </div>
        <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 17, fontWeight: 800, color: C.navy, margin: "10px 0 0", lineHeight: 1.35 }}>"{report.headline}"</p>
      </div>

      {/* Scores */}
      <div style={{ ...card }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: C.muted, letterSpacing: "0.07em", marginBottom: 16 }}>SCORE BREAKDOWN</p>
        {categories.map((c, i) => <ScoreBar key={c.key} label={c.label} score={scores[c.key]} delay={i * 120} />)}
      </div>

      {/* #1 Quick win */}
      <div style={{ background: C.greenL, border: `1.5px solid ${C.green}`, borderRadius: 14, padding: "20px 22px", marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
          <div style={{ width: 34, height: 34, borderRadius: 8, background: C.green, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 16 }}>💡</div>
          <div>
            <p style={{ fontSize: 12, fontWeight: 700, color: C.green, letterSpacing: "0.07em", marginBottom: 4 }}>YOUR #1 QUICK WIN</p>
            <p style={{ fontSize: 14, color: "#0F4A2A", lineHeight: 1.6, margin: 0, fontWeight: 500 }}>{topOpportunity}</p>
          </div>
        </div>
      </div>

      {/* Cliffhanger / gate */}
      <div style={{ background: C.white, borderRadius: 14, padding: "22px 24px", marginBottom: 14, position: "relative", overflow: "hidden", minHeight: 180 }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.97) 55%)", zIndex: 1 }} />
        <p style={{ fontSize: 12, fontWeight: 700, color: C.muted, letterSpacing: "0.07em", marginBottom: 12 }}>FULL ANALYSIS — 18 ADDITIONAL FINDINGS</p>
        {["Critical: No click-to-call phone number visible above the fold","High: Missing testimonials and social proof on key pages","High: No city-specific SEO landing pages for your area","Medium: Page load speed issues detected — impacting rankings","Medium: No FAQ page — missing high-intent search traffic"]
          .map((item, i) => (
            <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10, filter: `blur(${i === 0 ? 2 : 4}px)`, userSelect: "none" }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: i === 0 ? C.red : C.amber, marginTop: 6, flexShrink: 0 }} />
              <span style={{ fontSize: 13, color: C.slate }}>{item}</span>
            </div>
          ))}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 2, padding: "16px 22px 20px", textAlign: "center" }}>
          <div style={{ background: C.amberL, border: `1px solid ${C.amber}`, borderRadius: 10, padding: "13px 16px" }}>
            <p style={{ fontSize: 13, color: C.amber, fontWeight: 700, margin: "0 0 3px" }}>🔒 {teaser}</p>
            <p style={{ fontSize: 12, color: "#7A4500", margin: 0 }}>Unlock the full report in a free 20-minute consultation.</p>
          </div>
        </div>
      </div>

      {/* Consultation CTA */}
      <div style={{ background: C.navy, border: "1px solid rgba(242,100,25,0.3)", borderRadius: 16, padding: "26px 24px", textAlign: "center" }}>
        <p style={{ fontSize: 12, color: C.sky, fontWeight: 700, letterSpacing: "0.07em", marginBottom: 8 }}>FREE 20-MINUTE CONSULTATION</p>
        <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 800, color: C.white, margin: "0 0 10px", lineHeight: 1.3 }}>
          See the full report &amp; get your custom game plan
        </h3>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", margin: "0 0 20px", lineHeight: 1.6 }}>
          {name ? `${name.split(" ")[0]}, we` : "We"} found specific opportunities on your site. In 20 minutes we'll walk through every one and give you a clear, no-obligation action plan.
        </p>
        <button className="book-btn"
          style={{ width: "100%", padding: "15px 24px", fontSize: 15, fontWeight: 700, background: C.green, color: C.white, border: "none", borderRadius: 10, cursor: "pointer", fontFamily: "inherit", marginBottom: 10, transition: "background 0.2s" }}
          onClick={() => setShowCal(true)}>
          Book My Free Consultation →
        </button>
        {showCal && (
          <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "20px", marginBottom: 10, textAlign: "left" }}>
            <p style={{ color: C.white, fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Choose a time:</p>
            {["Tomorrow, 10:00 AM", "Tomorrow, 2:00 PM", "Thu, 9:00 AM", "Thu, 3:00 PM", "Fri, 11:00 AM"].map(t => (
              <div key={t} onClick={() => alert(`Selected: ${t}. Connect your Calendly link here.`)}
                style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.8)", fontSize: 13, cursor: "pointer", marginBottom: 6 }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                📅 {t}
              </div>
            ))}
          </div>
        )}
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", margin: 0 }}>No obligation · No sales pressure · Genuinely useful regardless</p>
      </div>

      <div style={{ textAlign: "center", marginTop: 20 }}>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", lineHeight: 1.6 }}>★★★★★ Trusted by 500+ business owners · Powered by Ideplement</p>
      </div>
    </div>
  );
}
