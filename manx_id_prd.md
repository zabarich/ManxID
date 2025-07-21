# Product Requirements Document (PRD)

**Project Title:** Manx ID – Demo / Mock‑up App & Portal for Young Citizens

**Prepared for:** Government Technology Services (GTS) & Dev Partner *Cursor*

**Prepared by:** Rich Corlett – Chairman, ETHOS Limited

**Version:** 1.0  
**Date:** 22/07/2025

---

## 1  Purpose
Create a working demo of a mobile‑first Manx ID wallet and web portal that proves identity, surfaces key government records, and enables a “Tell Us Once” change‑of‑address flow. The demo will be used to showcase the vision to senior government stakeholders and to validate technical choices with citizens aged 16‑29.

## 2  Scope
* **In‑scope** – Single sign‑on, basic e‑KYC onboarding, dashboard cards (Tax, Vehicle, Licences, Benefits, Health), editable profile, address change propagating to mocked APIs, proof‑of‑age QR credential, responsive web view, deployment on Vercel.
* **Out‑of‑scope** – Production‑grade security certifications, integration to live government back‑ends, legacy data migration, payments, accessibility audits to WCAG AA level (may be considered later).

## 3  Objectives
1. Show an end‑to‑end “one login, one update” journey within three clicks or taps.  
2. Provide a tangible artefact to satisfy the 2016 “single resident record” pledge and 2022 digital‑ID commitment.  
3. Collect feedback from at least 30 young citizens within four weeks of demo launch.

## 4  Target Audience
* **Primary:** Isle of Man residents aged 16‑29 who interact regularly with government for tax, education grants, driving licences and leisure activities.  
* **Secondary:** Cabinet Office, GTS senior management, and Tynwald Members evaluating further investment.

## 5  Assumptions & Constraints
* Existing GTS Azure AD B2C tenant is available for demo use.  
* No personal data leaves the EU/UK data region.  
* Demo must run cost‑free under Vercel’s hobby tier where possible.

## 6  Personas
| Persona | Key Drivers | Pain Points |
|---------|-------------|-------------|
| **Emily (18, student)** | Needs proof‑of‑age, driving licence updates, tax refund claim | Re‑entering the same data across forms, losing physical documents |
| **Adam (24, trainee pilot)** | Renewal of vehicle licence, address changes after moving between flats | Long queues, paper forms, no single view of status |

## 7  User Stories (MVP)
1. *As Emily* I want to enrol with biometric scan and passport so that I receive a digital proof‑of‑age credential.
2. *As Adam* I want to update my address once and have all departments recognise it so that I avoid repeat paperwork.
3. *As any user* I want to see my vehicle licence expiry date in one tap so that I stay compliant.
4. *As a government agent* I want to scan a QR code to confirm a user’s age so that I can grant entry quickly.

## 8  Feature List
| ID | Feature | Priority |
|----|---------|----------|
| F01 | Biometric + document onboarding (SDK stub) | Must |
| F02 | Azure AD B2C / OpenID‑Connect login | Must |
| F03 | Dashboard with five service cards | Must |
| F04 | Tell‑Us‑Once form (address, phone) | Must |
| F05 | Event propagation to mock APIs (via webhooks) | Should |
| F06 | Proof‑of‑age QR with offline validation string | Must |
| F07 | Responsive web shell | Should |
| F08 | Light / dark mode toggle | Could |

## 9  Non‑Functional Requirements
* **Performance:** Menu to first contentful paint <1.5 s on 4G.  
* **Security:** JWT tokens stored in http‑only cookies; no PII in localStorage.  
* **Privacy:** Demo data reset nightly; mask real names during public demos.  
* **Accessibility:** Meet WCAG AA for colour‑contrast; VoiceOver tabbable routes.

## 10  Technical Approach
| Layer | Technology | Reason |
|-------|------------|--------|
| Front‑end | Next.js 14 + React (App Router) | Seamless Vercel deploy, SEO |
| Mobile | React Native WebView wrapper | One codebase, stores on‑device |
| Auth | Azure AD B2C (password‑less + FIDO2) | Re‑use GTS tenancy |
| Data | Mock service layer via Next.js API routes | Fast, no live integration |
| QR | `react‑qr‑code` (SVG) | Lightweight |
| CI/CD | Vercel Git integration | Auto‑deploy from GitHub PR |
| IaC | Vercel project config file | Repeatable |

## 11  Delivery Milestones
| Date (DD/MM/YYYY) | Milestone | Owner |
|-------------------|-----------|-------|
| 05/08/2025 | Sprint 0 completed – repo, CI, skeleton app | Cursor |
| 19/08/2025 | F01–F03 functional | Cursor & GTS |
| 09/09/2025 | F04–F06 functional, mobile wrapper ready | Cursor |
| 23/09/2025 | Public demo link on Vercel, user testing starts | Cursor & ETHOS |
| 07/10/2025 | Feedback incorporated, v1.0 tag | Cursor |

## 12  Acceptance Criteria (excerpt)
* AC‑01: User can complete onboarding in <3 minutes with dummy passport.  
* AC‑02: After address update the mock Vehicle and Tax APIs show new address within 5 seconds.  
* AC‑03: QR scanned by validator page returns “Verified — age over 18”.

## 13  Success Metrics
* 90 % of test users rate the demo ≥4/5 for ease of use.  
* Address‑change journey accomplished in ≤90 seconds by 80 % of testers.  
* Stakeholder sign‑off from Cabinet Office and GTS by 31/10/2025.

## 14  Risks & Mitigations
| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Azure B2C config delay | Medium | Medium | Pre‑provision tenant, use social login fallback |
| QR scan reliability | Low | Medium | Provide fallback human‑readable code |
| Scope creep | High | High | Freeze feature list after Sprint 1 |

## 15  Dependencies
* Access to a domain email inbox for Magic Link sending and OAuth client IDs.  
* Cursor dev team availability from 05/08/2025.  
* ETHOS product owner time for weekly reviews.

## 16  Open Questions
1. Should demo contain a genuine payment prototype (e.g. vehicle tax renewal)?  
2. Is dark mode needed for first demo?  
3. Branding guidelines from Cabinet Office?  

---

**End of Document**

