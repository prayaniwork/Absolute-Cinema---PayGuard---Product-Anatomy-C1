# Absolute Cinema — Product Requirements Document (PRD)

**Document Date:** September 22, 2026  
**Status:** Approved Final PRD  
**Author:** Product & Engineering Team  
**Product Hub:** Absolute Cinema (Project & Milestone Trust Hub for Freelancers & Clients)

---

## 1. Overview & Problem Statement

Freelancers today run their business across 5 to 6 disconnected tools:
* **Communication:** WhatsApp, Slack, or Email
* **Deliverables & Files:** Google Drive, Dropbox, or Figma
* **Billing:** Standalone invoicing apps (Zoho, QuickBooks, Invoicely)
* **Settlement:** Payment apps (UPI, Stripe, PayPal, Razorpay)

**The Core Failure:** Nothing is linked. A milestone discussed in chat has no audit trail tying it to the deliverable preview, the invoice raised for it, or the payment that eventually clears against it.

**The Solution:**  
**Absolute Cinema** is a shared project hub for clients and freelancers—one single workspace that carries a project from first files through milestones, protected previews, approvals, invoices, payments, and receipts. The goal is a single, unambiguous chain of custody for every unit of work:
> **One project → One place → One clear transaction → One clear deliverable.**

### Positioning
The product is deliberately positioned around the **freelancer's side** of this relationship:
* Professional freelancers already earning consistently (₹1L+/month or comparable volume).
* Managing 5–15+ clients simultaneously.
* Currently looking less organized than their work deserves, not because their craft is lacking, but because their tooling is fragmented.

---

## 2. Goals and Success Metrics

### MVP Goal
Prove that a client and freelancer can move a real milestone from signup to paid, approved delivery without ever leaving the platform for chat, files, invoicing, or payment.

* **MVP Success Metric:** 1 full milestone cycle (Fund $\rightarrow$ Deliver $\rightarrow$ Approve $\rightarrow$ Release $\rightarrow$ Receipt) completed with real money, with zero off-platform steps.
* **Freelancer-Advantage Positioning:** Fee split and dispute defaults lean toward the freelancer, roughly a **55/45** balance.
* **Post-MVP Success Metrics:**
  * Shorter time-to-payment than WhatsApp + manual invoicing.
  * Near-zero disputes compared to chat-based handoffs.
  * Freelancers choosing Absolute Cinema over ad-hoc tools for repeat clients.

---

## 3. Target Users

### Primary: Established Independent Freelancers & Solo Professionals
* **Profile:** Full-time independent designers, developers, marketers, consultants, video editors, photographers, writers.
* **Earnings:** Consistent ₹1L+ / month (~$1,500+ / mo).
* **Workload:** Managing 5–15+ active client relationships.
* **Need:** Look instantly professional, protect deliverables, and eliminate payment chasing without hiring an assistant.

### Secondary: Clients & Small Businesses Hiring Freelancers
* **Profile:** Startup founders, SMB owners, marketing/design directors, agency project managers.
* **Behavior:** Suffer from "portal fatigue"; they do **not** want to manage yet another complex software account.
* **Need:** Frictionless, guest-friendly interaction—one-click review, clear watermarked preview, seamless checkout, instant tax invoice/receipt.

---

## 4. Competitive Landscape & Whitespace

| Platform | Business Model | Freelancer Fee | Client Fee | Trust / Escrow Mechanism | Limitations |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Upwork** | Marketplace Commission | Variable (0–15%) | Up to ~8% | Funded escrow, 14-day auto-release | High fees, walled garden, forces discovery |
| **Fiverr** | Marketplace Commission | Flat 20% | 5.5% | Funded milestone, 8-day approval window | Heavy freelancer penalty (20%), commoditized |
| **Bonsai** | SaaS Subscription | ~$19/mo | None | None built-in (direct Stripe processing) | No deliverable locking, freelancer bears chargeback risk |
| **HoneyBook** | SaaS Subscription | ~$29/mo | None | None built-in (direct merchant account) | No escrow/funding gate, portal fatigue |
| **Absolute Cinema** | **Transaction / Milestone Mediation** | **Lower % cut** | **Slightly higher %** | **Funded milestone + Watermarked preview release** | **Zero off-platform friction, 55/45 freelancer bias** |

**The Whitespace:** Escrow-grade payment trust combined with a frictionless shared project workspace in one unified product.

---

## 5. Product Phasing

### Phase 1: MVP (Week 1 Build)
1. **Milestone Structure:** Client and freelancer define named milestones with scope, amount, due date, and revision limit during project setup.
2. **Submit & Approve Workflow:** Formal actions (`Submit for Approval`, `Approve`, `Request Changes`) with revision count tracking—not casual chat messages.
3. **Protected Deliverable Preview:** Watermarked, tamper-resistant, view-only file viewer upon submission; download/asset extraction disabled until payment release.
4. **Payment Collection:** Direct hosted checkout links (Stripe / Razorpay) generated per milestone under the freelancer’s account (so funds do not touch the platform’s balance sheet).
5. **Auto-Generated Invoice & Receipt:** Automatically compiled from milestone parameters, client billing details, and payment confirmation.
6. **Clickwrap Terms of Service:** Boilerplate agreement establishing platform role, work acceptance terms, and chargeback waivers.

### Phase 2: Post-MVP (Real Users, Scaled Runway)
1. **Held-Funds Escrow:** Automated delayed payouts via Stripe Connect Custom / Razorpay Route.
2. **Auto-Release Timers:** Milestone funds automatically release if the client is unresponsive within an agreed window (e.g., 72 hours or 7 days).
3. **In-Product Dispute Mediation:** Structured mediation flow replacing basic support fallback.
4. **Advanced Revision Management:** Side-by-side diffing, annotated feedback pins on design/code/copy.
5. **Multi-Milestone Automation & Subcontractor Payouts:** Cascading milestone triggers and split payouts.

### Permanently Out of Scope (Skipped by Design)
* **RBI Payment Aggregator / Money Transmitter License:** Strictly avoided by never holding funds on the platform's balance sheet.
* **Custom Escrow Ledger or Stored Wallet Balance:** The platform is a mediator and workflow engine, not a bank.
* **Full AML/KYC Banking Compliance:** Delegated to underlying payment infrastructure (Stripe/Razorpay).
* **Direct PCI DSS Card Data Handling:** Handled exclusively via hosted checkouts and secure tokenization.

---

## 6. Core User Flow & State Machine

```mermaid
flowchart TD
    A[Sign up & Accept Clickwrap ToS] --> B[Create Project & Define Milestones]
    B --> C[Client Funds Milestone via Hosted Checkout]
    C --> D[Milestone Status: Funded & In Progress]
    D --> E[Freelancer Uploads Deliverable]
    E --> F[Deliverable Processed: Watermarked & View-Only]
    F --> G[Freelancer Submits for Approval]
    G --> H{Client Reviews Preview}
    H -->|Approve| I[Release Milestone & Unlock Original Asset]
    I --> J[Generate Automated Tax Invoice & Receipt]
    H -->|Request Changes| K{Revision Limit Exceeded?}
    K -->|No (Revisions Left)| L[Increment Revision Counter & Freelancer Updates]
    L --> E
    K -->|Yes (Exceeded)| M[Prompt Scope Amendment / Escalate to Support]
```

### Trust & Protection Mechanics (Three Choke Points)
1. **Funding before work starts:** Money is committed upfront, protecting the freelancer's labor and time.
2. **Watermarked, view-only preview:** Protects freelancer IP; client can inspect quality thoroughly without being able to harvest the asset before release.
3. **Formal approval before final release:** Protects the client; funds are only released upon explicit sign-off or transparent criteria.

---

## 7. Monetization & Split Model

* **Commission-Based Split:** Mediation of transactions with real legal and deliverable protection.
* **55/45 Freelancer-Advantage Positioning:**
  * Freelancer pays a lower commission (e.g., ~3% - 5%).
  * Client pays a platform mediation fee (e.g., ~5% - 7%).
  * Contrasts sharply with marketplace models like Fiverr (which takes 20% from the freelancer and 5.5% from the client).

---

## 8. Compliance & Legal Framework (India Focus)

### Phase 1 Compliance
* Registered business entity (for live payment gateway integration).
* Sub-account/Direct payment link architecture (funds flow merchant $\rightarrow$ freelancer or via compliant marketplace gateway routes).
* DPDP Act 2023 compliant data protection and consent modal.
* Clickwrap ToS with intellectual property conditional assignment upon payment release.

### Phase 2 Compliance
* Section 194-O TDS withholding compliance (0.1% on e-commerce operator facilitation once ₹5L threshold is reached).
* GST billing engine (handling SAC codes, 18% GST on platform commission fees once ₹20L services threshold is crossed).

---

## 9. Open Questions & Implementation Decisions

1. **Exact Commission Split:** Decide default fee percentages (e.g., 3.5% freelancer / 5.5% client vs. flat split).
2. **Revision Limits:** Default revision allowance per milestone (e.g., 2 standard revisions included).
3. **Watermarking Engine:** Approach per media format:
   * *Images (PNG, JPG, SVG, WebP):* Canvas / Server-rendered dynamic diagonal overlay + metadata scrub.
   * *PDF / Documents:* Watermarked render via PDF.js / canvas rasterization with locked download.
   * *Video / Audio:* Lower-res transcoded stream with burnt-in watermark banner.
   * *Code / Text:* Redacted snippets / read-only sandbox viewer.
4. **Client Auth Friction:** Guest magic links vs. lightweight passwordless authentication to prevent portal fatigue.
