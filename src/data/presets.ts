export interface PresetItem {
  id: string;
  title: string;
  category: string;
  description: string;
  tone: string;
  intent: string;
  recipient: string;
  length: 'concise' | 'standard' | 'detailed';
  callToAction: string;
}

export const PRESET_EXAMPLES: PresetItem[] = [
  {
    id: 'delay-notice',
    title: 'Project Delay & Demo Offer',
    category: 'Engineering / Product',
    description: 'Tell Sarah from marketing that our Q3 roadmap will slip by 1 week because API auth changes took longer than planned. Emphasize that we have a working prototype ready to demo on Thursday to keep them unblocked.',
    tone: 'Diplomatic & Tactful',
    intent: 'Project Update / Delay',
    recipient: 'Sarah (Marketing Lead)',
    length: 'standard',
    callToAction: 'Confirm if Thursday 2:00 PM works for a 20-minute walkthrough.',
  },
  {
    id: 'polite-decline',
    title: 'Polite Vendor Proposal Decline',
    category: 'Operations & Procurement',
    description: 'Decline an expensive enterprise software pitch from Apex Analytics. Their tool looks powerful, but our budget for this fiscal year is strictly frozen. Thank them for the presentation and leave the door open for next year.',
    tone: 'Warm & Professional',
    intent: 'Decline / Saying No',
    recipient: 'Marcus Vance (Account Exec)',
    length: 'concise',
    callToAction: 'Keep us on your quarterly newsletter; reconnect in Q1 next fiscal year.',
  },
  {
    id: 'gentle-nudge',
    title: 'Gentle Invoice Follow-up',
    category: 'Finance & Billing',
    description: 'Follow up on invoice #INV-4092 sent 18 days ago (due 4 days ago) to Acme Studios. Keep it gracious in case it was caught in accounting review, but ask them to confirm payment schedule.',
    tone: 'Direct & Urgent',
    intent: 'Follow-up / Nudge',
    recipient: 'Finance Team (Acme Studios)',
    length: 'concise',
    callToAction: 'Confirm remittance advice or expected payment date by tomorrow.',
  },
  {
    id: 'raise-discussion',
    title: 'Request 1-on-1 for Compensation Review',
    category: 'Career & Management',
    description: 'Ask my manager Mark for dedicated time next week to discuss performance and compensation review. Mention recent milestones including delivering the Apollo migration 2 weeks ahead of schedule and onboarding 3 new engineers.',
    tone: 'Executive & Formal',
    intent: 'Request / Favor',
    recipient: 'Mark Reynolds (Engineering Director)',
    length: 'standard',
    callToAction: 'Let me know which 30-minute slot works best next Tuesday or Wednesday.',
  },
  {
    id: 'cold-outreach',
    title: 'High-Value Strategic Partnership',
    category: 'Business Development',
    description: 'Introduce our cloud security platform to David, VP of Infrastructure at FinTech Corp. Note their recent expansion into EU banking compliance. Suggest a 15-minute introductory coffee chat to share how we helped Stripe save 40% on audit overhead.',
    tone: 'Persuasive & Pitch',
    intent: 'Cold Outreach',
    recipient: 'David Chen (VP Infrastructure)',
    length: 'concise',
    callToAction: 'Are you open to a brief 10-minute intro call next Tuesday?',
  },
  {
    id: 'apology-outage',
    title: 'Incident Post-Mortem & Apology',
    category: 'Customer Success',
    description: 'Write an apology and update to enterprise customers regarding the 45-minute dashboard downtime this morning. Explain that an automated failover test caused latency, confirm all systems are fully restored, and mention credits will be applied automatically.',
    tone: 'Apologetic & Reassuring',
    intent: 'Apology / Remediation',
    recipient: 'Enterprise Customer Contacts',
    length: 'standard',
    callToAction: 'Reach out directly to your Dedicated CSM or review the live incident dashboard.',
  },
];

export const TONE_OPTIONS = [
  {
    id: 'Executive & Formal',
    name: 'Executive & Formal',
    icon: 'Briefcase',
    badge: 'C-Suite',
    color: 'from-slate-700 to-slate-900',
    description: 'Polished, authoritative, concise, and structured for senior leadership.',
  },
  {
    id: 'Warm & Professional',
    name: 'Warm & Professional',
    icon: 'Smile',
    badge: 'Popular',
    color: 'from-blue-600 to-indigo-700',
    description: 'Approachable, cordial, collaborative, and ideal for team members or clients.',
  },
  {
    id: 'Direct & Concise',
    name: 'Direct & Concise',
    icon: 'Zap',
    badge: 'Quick Read',
    color: 'from-amber-600 to-orange-700',
    description: 'Zero fluff, straight to the facts, immediate action items highlighted.',
  },
  {
    id: 'Diplomatic & Tactful',
    name: 'Diplomatic & Tactful',
    icon: 'ShieldCheck',
    badge: 'Delicate',
    color: 'from-emerald-600 to-teal-700',
    description: 'Softened language, constructive phrasing, ideal for negotiations or bad news.',
  },
  {
    id: 'Persuasive & Pitch',
    name: 'Persuasive & Pitch',
    icon: 'Sparkles',
    badge: 'High Impact',
    color: 'from-purple-600 to-violet-800',
    description: 'Value-first, engaging, clear hooks, and compelling call to action.',
  },
  {
    id: 'Urgent & Action-Focused',
    name: 'Urgent & Action-Focused',
    icon: 'ClockAlert',
    badge: 'Time Sensitive',
    color: 'from-rose-600 to-red-700',
    description: 'Highlights deadlines, business impact, and next critical milestones.',
  },
  {
    id: 'Appreciative & Grateful',
    name: 'Appreciative & Grateful',
    icon: 'HeartHandshake',
    badge: 'Team Morale',
    color: 'from-cyan-600 to-blue-700',
    description: 'Generous recognition, genuine gratitude, and positive reinforcement.',
  },
  {
    id: 'Custom Tone',
    name: 'Custom Tone',
    icon: 'Sliders',
    badge: 'Flexible',
    color: 'from-fuchsia-600 to-pink-700',
    description: 'Define your own unique tone of voice and persona instructions.',
  },
];

export const INTENT_OPTIONS = [
  'General Business',
  'Project Update / Delay',
  'Meeting Request / Scheduling',
  'Decline / Saying No',
  'Follow-up / Nudge',
  'Request / Favor',
  'Cold Outreach / Intro',
  'Apology / Remediation',
  'Feedback / Review',
  'Resignation / Formal Notice',
];

export const RECIPIENT_OPTIONS = [
  'Executive / C-Suite',
  'Client / Customer',
  'Teammate / Peer',
  'Manager / Director',
  'Vendor / Partner',
  'Hiring Manager / Recruiter',
  'Company-wide / Department',
];
