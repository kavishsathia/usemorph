# Morph Wiki

Welcome to the Morph operational documentation. This wiki contains runbooks for investigating and resolving alerts from the Datadog monitoring system.

## Overview

Morph uses Datadog LLM Observability to monitor AI agent behavior and ensure adherence to teaching principles. When detection rules trigger, these runbooks provide structured investigation and remediation steps.

## Operational Runbooks

### Agent Behavior Verification

These runbooks address alerts when the AI agent violates its committed teaching principles:

- **[Socratic Questioning Evaluation Runbook](https://github.com/kavishsathia/usemorph/wiki/Socratic-Questioning-Evaluation-Runbook)**
  Investigates failures when the agent provides direct answers instead of guiding questions.

- **[Challenge Level Evaluation Runbook](https://github.com/kavishsathia/usemorph/wiki/Challenge-Level-Evaluation-Runbook)**
  Addresses issues where challenge difficulty doesn't match student knowledge level.

- **[Goal Commitment Evaluation Runbook](https://github.com/kavishsathia/usemorph/wiki/Goal-Commitment-Evaluation-Runbook)**
  Handles cases where the agent fails to guide students toward learning goals effectively.

- **[Hint Frequency Evaluation Runbook](https://github.com/kavishsathia/usemorph/wiki/Hint-Frequency-Evaluation-Runbook)**
  Investigates inappropriate hint timing - too frequent or too infrequent.

- **[Pacing Evaluation Runbook](https://github.com/kavishsathia/usemorph/wiki/Pacing-Evaluation-Runbook)**
  Addresses pacing issues where conversations are too rushed or too slow.

### Performance & Infrastructure

These runbooks address system performance and reliability issues:

- **[High Latency Runbook](https://github.com/kavishsathia/usemorph/wiki/High-Latency-Runbook)**
  Investigates response time degradation and API bottlenecks.

## Quick Reference

### Monitor Thresholds

All evaluation-based monitors use consistent thresholds:
- **Critical**: Pass rate < 70%
- **Warning**: Pass rate < 80%

### Escalation Policy

If any evaluation monitor shows failure rate > 20% over 1 hour, escalate to engineering lead.

### Related Resources

- **LLM Observability Dashboard**: [Datadog LLM Dashboard](https://us5.datadoghq.com/llm)
- **Code Repository**: [github.com/kavishsathia/usemorph](https://github.com/kavishsathia/usemorph)
- **Sworn Framework**: [github.com/kavishsathia/sworn](https://github.com/kavishsathia/sworn)
- **Commitment Definitions**: [contract.py](https://github.com/kavishsathia/usemorph/blob/main/python/contract.py)

## Contributing

To add or update runbooks:
1. Create markdown files in the `/wiki` directory
2. Follow the existing runbook template structure
3. Update this Home page with links to new runbooks
