# Observability Strategy

This document provides the technical rationale for Morph's observability architecture, explaining why each monitor and SLO exists and how it protects application quality.

## Table of Contents

- [Overview](#overview)
- [Detection Rules (Monitors)](#detection-rules-monitors)
  - [Behavioral Monitors](#behavioral-monitors)
  - [Performance Monitors](#performance-monitors)
- [Service Level Objectives (SLOs)](#service-level-objectives-slos)
- [Alert Thresholds](#alert-thresholds)
- [Integration Architecture](#integration-architecture)

---

## Overview

Morph's observability strategy is built on a dual-layer monitoring approach:

1. **Behavioral Verification**: Ensures the AI agent adheres to pedagogical principles using the Sworn framework
2. **System Reliability**: Tracks traditional SRE metrics (latency, errors, costs)

This combination guarantees both educational effectiveness and operational excellence.

**Alert Routing Strategy**: Performance monitors (latency, errors) route to incident management (`@incident-sev-3/4`) for immediate technical response, while behavioral monitors route to case management (`@case-morph`) for thoughtful investigation. Operational failures need firefighting; pedagogical quality degradation needs analysis.

---

## Detection Rules (Monitors)

### Behavioral Monitors

These monitors leverage Datadog's LLM Observability to track custom evaluations from the Sworn verification framework. Each evaluation runs in real-time as the agent processes student interactions.

#### 1. Socratic Questioning Verification

**File**: [`monitors/socratic-questioning-verification.json`](datadog/monitors/socratic-questioning-verification.json)

**Rationale**: Socratic questioning is the cornerstone of Morph's pedagogical approach. This monitor ensures the AI tutor guides students through strategic questions rather than providing direct answers.

**Why It Matters**:

- Students develop critical thinking skills through self-discovery
- Knowledge retention improves significantly when concepts are actively constructed versus passively received
- The platform's core value proposition depends on this teaching method

**What It Detects**:

- AI providing direct answers instead of guiding questions
- Insufficient use of leading questions and gentle nudges
- Over-reliance on declarative statements

**Thresholds**:

- Warning: < 80% pass rate (indicates methodology drift)
- Critical: < 70% pass rate (core principle compromised)

**Business Impact**: Failure here means the platform becomes just another AI chatbot, losing its differentiation and educational effectiveness.

---

#### 2. Challenge Level Verification

**File**: [`monitors/challenge-level-verification.json`](datadog/monitors/challenge-level-verification.json)

**Rationale**: Effective learning occurs in the "zone of proximal development" - challenge must align with current knowledge level to maintain engagement without causing frustration or boredom.

**Why It Matters**:

- Content too easy leads to disengagement and wasted time
- Content too difficult causes frustration and learning abandonment
- Adaptive difficulty is a key competitive advantage in personalized learning

**What It Detects**:

- Misalignment between student knowledge level and content difficulty
- Agent ignoring personalization settings (gentle/balanced/rigorous)
- Inconsistent challenge calibration across conversation turns

**Thresholds**:

- Warning: < 80% pass rate (personalization degrading)
- Critical: < 70% pass rate (adaptive learning failure)

**Business Impact**: Poor challenge alignment drives student attrition and negative satisfaction scores.

---

#### 3. Goal Commitment Verification

**File**: [`monitors/goal-commitment-verification.json`](datadog/monitors/goal-commitment-verification.json)

**Rationale**: Learning goals provide direction and purpose to educational interactions. The agent must maintain focus on helping students achieve their stated objectives through active discovery.

**Why It Matters**:

- Goal-oriented learning increases motivation and completion rates
- Students need scaffolded paths toward objectives, not tangential content
- Ensures the platform delivers measurable learning outcomes

**What It Detects**:

- Agent drifting off-topic or losing sight of learning objectives
- Passive instruction replacing guided discovery toward goals
- Insufficient scaffolding and incremental goal progression

**Thresholds**:

- Warning: < 80% pass rate (goal drift beginning)
- Critical: < 70% pass rate (objectives not being met)

**Business Impact**: Students without clear progress toward goals abandon sessions and report low value perception.

---

#### 4. Hint Frequency Verification

**File**: [`monitors/hint-frequency-verification.json`](datadog/monitors/hint-frequency-verification.json)

**Rationale**: "Productive struggle" is essential for deep learning. Hints must be timed to support students after reasonable attempts, balancing autonomy with guidance.

**Why It Matters**:

- Premature hints prevent the cognitive effort needed for retention
- Delayed hints cause frustration and demotivation
- Optimal hint timing is a researched pedagogical principle

**What It Detects**:

- Hints provided immediately without allowing student attempts
- Hints withheld too long, causing unnecessary frustration
- Misalignment between hint frequency settings and actual behavior

**Thresholds**:

- Warning: < 80% pass rate (hint timing degrading)
- Critical: < 70% pass rate (learning efficacy compromised)

**Business Impact**: Poor hint timing reduces learning effectiveness and student confidence, impacting retention and referrals.

---

#### 5. Pacing Verification

**File**: [`monitors/pacing-verification.json`](datadog/monitors/pacing-verification.json)

**Rationale**: Cognitive load management is critical in education. Information must be delivered at a moderate pace with balanced explanations to avoid overwhelming or under-engaging students.

**Why It Matters**:

- Information overload causes confusion and reduces comprehension
- Too-brief explanations leave knowledge gaps
- Pacing directly affects student engagement and session quality

**What It Detects**:

- Excessively verbose responses (information bombardment)
- Overly brief responses lacking sufficient depth
- Poor balance between agent explanation and student participation

**Thresholds**:

- Warning: < 80% pass rate (pacing imbalance)
- Critical: < 70% pass rate (engagement risk)

**Business Impact**: Poor pacing leads to session abandonment mid-conversation and negative user experience.

---

### Performance Monitors

These monitors track system health and operational reliability using standard SRE metrics.

#### 6. High Response Latency

**File**: [`monitors/high-response-latency.json`](datadog/monitors/high-response-latency.json)

**Rationale**: Real-time conversational flow is essential for effective tutoring. Delayed responses disrupt learning momentum and degrade user experience.

**Why It Matters**:

- Students expect near-instant feedback in conversational interfaces
- Latency > 15 seconds risks session timeout and abandonment
- High latency often indicates infrastructure or API issues requiring immediate action

**What It Detects**:

- LLM inference bottlenecks (Gemini API slowdowns)
- Evaluation overhead from Sworn verifiers
- Network connectivity issues
- Rate limiting or quota exhaustion

**Thresholds**:

- Warning: 15 seconds (user experience degrading)
- Critical: 20 seconds (session abandonment risk)

**Business Impact**: Each additional second of latency correlates with increased abandonment and reduced satisfaction scores.

---

#### 7. Error Rate

**File**: [`monitors/error-rate.json`](datadog/monitors/error-rate.json)

**Rationale**: Application errors directly translate to failed student interactions, lost learning sessions, and damaged trust in the platform.

**Why It Matters**:

- Each error represents a failed student interaction
- High error rates indicate systemic reliability issues
- Error recovery is difficult in educational contexts (lost conversation context)

**What It Detects**:

- Gemini API failures (rate limits, timeouts, invalid responses)
- Application exceptions during agent execution
- Contract verification failures
- Tool execution errors (simulation generation, database operations)

**Thresholds**:

- Warning: 2% error rate (reliability degrading)
- Critical: 5% error rate (service quality at risk)

**Business Impact**: Errors during active learning sessions cause immediate user frustration and platform distrust.

---

## Service Level Objectives (SLOs)

SLOs define reliability targets and drive operational priorities.

### 1. Latency SLO

**File**: [`slos/latency.png`](datadog/slos/latency.png)

**Objective**: 95% of requests complete within acceptable response time thresholds

**Rationale**: Establishes a reliability target for conversational responsiveness. The 95th percentile ensures most students experience fluid interactions while allowing occasional spikes.

**Why 95%**: Balances user experience (most students get fast responses) with operational pragmatism (allows headroom for LLM API variance).

**Error Budget**: 5% of requests can exceed threshold, providing runway for experimentation and API provider variance.

**Business Impact**: Meeting this SLO ensures consistent user satisfaction and prevents systematic latency issues from eroding trust.

---

### 2. Error Rate SLO

**File**: [`slos/error-rate.png`](datadog/slos/error-rate.png)

**Objective**: Maintain error rates below defined thresholds for consistent user experience

**Rationale**: Defines acceptable failure rate, acknowledging that perfect reliability is impossible but establishing quality standards.

**Why It Matters**: Provides measurable reliability target for engineering decisions, incident response prioritization, and capacity planning.

**Error Budget**: Quantifies acceptable downtime, enabling data-driven decisions about feature velocity versus stability.

**Business Impact**: Meeting this SLO ensures platform reliability doesn't degrade student outcomes and retention.

---

### 3. Cost Efficiency SLO

**File**: [`slos/cost-efficiency.png`](datadog/slos/cost-efficiency.png)

**Objective**: Monitor token usage and API costs to ensure sustainable operation

**Rationale**: LLM API costs scale with usage. Without monitoring, costs can spiral unexpectedly. This SLO ensures financial sustainability while maintaining quality.

**Why It Matters**:

- Gemini API charges per token (input + output)
- Sworn evaluations add LLM overhead (verifier calls)
- Uncontrolled costs threaten business viability

**What It Tracks**:

- Token consumption per conversation
- Cost per student interaction
- Evaluation overhead impact
- Trends indicating cost spikes

**Business Impact**: Meeting this SLO ensures the platform remains economically viable at scale while maintaining quality.
