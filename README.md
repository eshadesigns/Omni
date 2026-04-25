# Omni 🎓
**Make the right school decisions before they shape your child's future.**

Omni is an AI-powered conversational decision simulator that helps parents understand the real consequences of academic choices — not just what to do, but *what happens if you do it*.

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env
# → Open .env and add your Anthropic API key

# 3. Run locally
npm run dev
```

---

## Project Structure

```
omni/
├── .env.example              ← Copy to .env, add your API key
├── .gitignore
├── src/
│   ├── App.jsx               ← Root router + data loading
│   ├── context/
│   │   └── AppContext.jsx    ← Global state (lang, userState)
│   ├── engines/
│   │   ├── api.js            ← Anthropic API client (key from env)
│   │   ├── simulationEngine.js   ← Generates 3-path simulation
│   │   ├── finalPlanEngine.js    ← Generates final plan summary
│   │   └── chatEngine.js         ← Chatbot + help system
│   ├── i18n/
│   │   └── translations.js   ← All EN/ES strings + helpContent
│   └── components/
│       ├── ui/
│       │   └── index.jsx     ← Shared UI: toggle, help, cards, etc.
│       └── screens/
│           ├── LandingScreen.jsx
│           ├── IntentScreen.jsx
│           ├── GradeScreen.jsx
│           ├── AcademicScreen.jsx
│           ├── InterestsScreen.jsx
│           ├── PreferenceScreen.jsx
│           ├── SimulationScreen.jsx
│           ├── ComparisonScreen.jsx
│           ├── ChatScreen.jsx
│           └── FinalScreen.jsx
```

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `VITE_ANTHROPIC_API_KEY` | ✅ | Your Anthropic API key |
| `VITE_CLAUDE_MODEL` | optional | Model name (default: `claude-sonnet-4-20250514`) |
| `VITE_DEBUG_API` | optional | Set `true` for verbose API logging |

**Never commit `.env` to git.** It's already in `.gitignore`.

---

## Roadmap — What Would Make This a Winning Project

### 🔒 Security (Critical for launch)
- [ ] **Move API calls to a backend proxy** (Express/Next.js API route) — never expose an API key in a frontend build, even with `VITE_`. Environment variables in Vite are bundled into client JS.
- [ ] Add rate limiting on the proxy (e.g., 10 requests/user/hour)
- [ ] Add input sanitization before sending to Claude

### 💾 Persistence
- [ ] **Save plan to PDF** — use `jsPDF` or a server-side renderer. This is the #1 parent request.
- [ ] **Email the plan** — integrate SendGrid/Resend so parents get a copy
- [ ] **User accounts** — Supabase or Firebase Auth so plans persist across sessions
- [ ] LocalStorage fallback for anonymous sessions

### 🧠 Intelligence Upgrades
- [ ] **Multi-step preference slider** — replace the binary stress/competitive choice with a 5-point spectrum; feeds into simulation weighting
- [ ] **School-specific context** — ask for state/district, cross-reference against known AP course availability
- [ ] **Sibling profiles** — let parents manage multiple children under one session
- [ ] **Yearly check-in mode** — return to Omni each year to update the plan as the child progresses

### 📊 Data & Visualization
- [ ] **Course timeline chart** — visual year-by-year roadmap using Recharts or D3
- [ ] **Radar chart** for path comparison (instead of static table)
- [ ] **"Students like yours" benchmark** — show aggregate anonymized data on path choices

### 🌐 Language & Accessibility
- [ ] Add Portuguese (large US immigrant population)
- [ ] WCAG 2.1 AA audit — screen reader support, focus management between screens
- [ ] Test with right-to-left layout for future Arabic/Farsi support

### 📱 Mobile
- [ ] Responsive layout audit — the grid screens need breakpoints for < 640px
- [ ] PWA manifest + offline support for areas with poor connectivity
- [ ] Native app (React Native) if usage justifies it

### 📈 Analytics & Product
- [ ] Track funnel drop-off per screen (Posthog or Mixpanel)
- [ ] A/B test CTA copy on landing screen
- [ ] NPS survey on the final screen
- [ ] Qualitative: record session replays (with consent) using Hotjar

### 🏫 Distribution
- [ ] **School district partnerships** — pitch to counselors as a free parent tool
- [ ] **Multilingual outreach** — target Spanish-language parent Facebook groups
- [ ] **Counselor dashboard** — let school counselors view/export student plans (B2B tier)
