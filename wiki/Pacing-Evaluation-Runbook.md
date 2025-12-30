# Pacing Evaluation Runbook

## Alert Description
The Pacing Verifier commitment has failed. The agent's tutoring pace did not match the user's preference (slow/medium/fast).

## Severity
Medium

## Impact
- Student experience mismatch
- Too fast: Student may feel overwhelmed
- Too slow: Student may feel bored or patronized

## Investigation Steps

### 1. Find the Failed Trace
- Go to **LLM Observability → Traces**
- Filter by evaluation: `Pacing Verifier = fail`
- Click on the failed trace

### 2. Check User's Pace Setting
Look at the session settings:
- `slow`: Detailed explanations, frequent understanding checks
- `medium`: Balanced explanations with student input opportunities
- `fast`: Key concepts only, encourage independent thinking

### 3. Review Agent Response
Compare the response against pace expectations:

| Pace | Expected Behavior |
|------|-------------------|
| Slow | Long explanations, multiple examples, "Does that make sense?" |
| Medium | Moderate detail, some questions back to student |
| Fast | Concise, assumes baseline knowledge, pushes forward |

### 4. Identify the Mismatch
- Was response too verbose for "fast" pace?
- Was response too brief for "slow" pace?
- Did agent skip understanding checks?

## Common Failure Patterns

### Pattern 1: Fast Setting, Slow Response
Agent gives lengthy explanation when user wanted quick pace.

**Fix**: Check if topic complexity triggered verbose mode. May need to weight pace setting higher.

### Pattern 2: Slow Setting, No Check-ins
Agent explains but doesn't pause to verify understanding.

**Fix**: Add explicit instruction for understanding checks in slow mode.

### Pattern 3: Inconsistent Pacing
Agent switches pace mid-conversation.

**Fix**: Review conversation history handling. Pace should persist.

## Remediation

### Immediate
- Review the specific session for patterns
- Check if pace setting was correctly passed to agent

### Long-term
- Strengthen pace instructions in commitment terms
- Add explicit examples of each pace level
- Consider pace-specific prompt templates

## Escalation
If affecting multiple users, notify product team.

## Related Links
- [Commitment Definition](../python/contract.py#L46-L55)
