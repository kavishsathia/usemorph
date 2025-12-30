# Challenge Level Evaluation Runbook

## Alert Description
The Challenge Level Verifier commitment has failed. The difficulty of questions posed to the student did not match their preference (gentle/balanced/rigorous).

## Severity
Medium

## Impact
- `gentle` violated: Student may feel discouraged or overwhelmed
- `rigorous` violated: Student may not be sufficiently challenged
- Poor learning outcomes

## Investigation Steps

### 1. Find the Failed Trace
- Go to **LLM Observability → Traces**
- Filter by evaluation: `Challenge Level Verifier = fail`
- Click on the failed trace

### 2. Check User's Challenge Setting
Look at the session settings:
- `gentle`: Encouraging, hints readily provided, softer questioning
- `balanced`: Mix of support and challenge
- `rigorous`: Deeper reasoning expected, fewer hints, more Socratic pressure

### 3. Review the Questions Asked
Evaluate the agent's questions/problems:

| Level | Question Style |
|-------|----------------|
| Gentle | "What do you think might happen?" (open, low pressure) |
| Balanced | "Can you explain why that works?" (requires reasoning) |
| Rigorous | "Prove this is true" or "What's the flaw in that logic?" |

### 4. Identify the Mismatch
- Was question too hard for "gentle" setting?
- Was question too easy for "rigorous" setting?
- Did agent provide too many/few hints?

## Common Failure Patterns

### Pattern 1: Gentle Setting, Hard Questions
Agent asks rigorous questions to a student who wanted gentle treatment.

**Fix**: Check if topic inherently complex. May need softer framing.

### Pattern 2: Rigorous Setting, Easy Questions
Agent asks basic questions when student wanted to be challenged.

**Fix**: May need stronger push toward deep reasoning in prompt.

### Pattern 3: Hint Mismatch
Agent gives hints when rigorous mode should withhold them.

**Fix**: Coordinate with Hint Frequency commitment. These should align.

## Remediation

### Immediate
- Review the specific failure case
- Check if challenge level was correctly passed to agent

### Long-term
- Add explicit examples of each challenge level
- Consider per-topic challenge calibration
- Link challenge level to hint frequency settings

## Escalation
If systematic failures on one challenge level, review commitment terms.

## Related Links
- [Commitment Definition](../python/contract.py#L58-L67)
