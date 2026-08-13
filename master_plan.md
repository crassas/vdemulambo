# MASTER PLAN: PROJECT ARCHIMEDES v2.0
## VEUS DE MULAMBO - DIGITAL MONETIZATION ENGINE

### 1. Selected Product Concept & Value Proposition
**Concept:** Premium Spiritual Mentorship & Digital Reading Platform
Building upon the existing "Véus de Mulambo" Firebase/React architecture, we are transforming the interface into a high-converting, monetized portal. 
**Value Prop:** Instant digital tarot insights and priority video-call mentorship scheduling, gated by seamless Stripe payments.

### 2. Target Persona & Pain Point
**Persona:** Spiritual seekers, individuals seeking urgent life guidance, or return clients of the mentor.
**Pain Point:** Friction in booking and paying for readings manually. They want immediate answers or guaranteed calendar slots without back-and-forth messaging.

### 3. Monetization Engine
**Model:** Freemium Engagement to Premium Lock
- **Free Tier:** Access to "Carta do Dia" (Card of the Day) with a generic reading.
- **Premium Tier 1 ($15):** Detailed 3-card spread auto-generated and saved to Firestore.
- **Premium Tier 2 ($50):** 45-minute live consultation booking (via `CallInterface.tsx`).
- **Integration:** Stripe Payment Links embedded directly into React components. A click pushes the user to a high-converting Stripe Checkout. User metadata (uid) will be tracked to fulfill digital goods on success.

### 4. Execution Roadmap (Phase-by-Phase tasks)
- **Phase 1 (Active):** Strategy set. Concept aligned with local files.
- **Phase 2 & 3:** Inject a high-visibility CTA into `ClientView.tsx` or `.BottomNav.tsx`. Create `PaywallModal.tsx` as a glassmorphic Tailwind component.
- **Phase 4:** We will run `bun run dev` (or `npm`) and self-correct any UI issues. 
- **Phase 5 & 6:** Write `audit_log.md` for the CTA visibility check and finalize `LAUNCH_GUIDE.md`.
