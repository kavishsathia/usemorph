# Hint Frequency Evaluation Runbook

## Alert Description
The Hint Frequency Verifier commitment has failed. Hints were provided too often or too rarely based on user preference (often/sometimes/rarely).

## Severity
Low-Medium

## Impact
- `often` violated: Student left struggling without needed help
- `rarely` violated: Student given answers too easily, reduced learning
- Affects student autonomy and learning depth

## Investigation Steps

### 1. Find the Failed Trace
- Go to **LLM Observability → Traces**
- Filter by evaluation: `Hint Frequency Verifier = fail`
- Click on the failed trace

### 2. Check User's Hint Setting
Look at the session settings:
- `often`: Proactive hints when student seems stuck
- `sometimes`: Hints after reasonable attempt
- `rarely`: Let student struggle longer before helping

### 3. Review Hint Behavior
Count hints given vs. expected:

| Setting | Expected Behavior |
|---------|-------------------|
| Often | Offer hints early, "Would you like a hint?" |
| Sometimes | Wait for attempt, then offer if stuck |
| Rarely | Only hint after extended struggle or request |

### 4. Analyze the Context
- How many turns before a hint was given?
- Did student explicitly ask for help?
- Was student clearly stuck?

## Common Failure Patterns

### Pattern 1: Rarely Setting, Early Hints
Agent provides hints too quickly when student wanted to figure it out.

**Fix**: Increase hint delay threshold. Add "let them struggle" instruction.

### Pattern 2: Often Setting, No Hints
Agent doesn't offer hints even when student is stuck.

**Fix**: Add proactive hint detection. Check for confusion signals.

### Pattern 3: Unsolicited Full Answers
Agent gives the answer instead of a hint.

**Fix**: Distinguish between hints (nudges) and answers (solutions).

## Remediation

### Immediate
- Review the conversation flow
- Check if student gave signals that were missed

### Long-term
- Define clearer hint vs. answer distinction
- Add turn-count based hint triggers
- Consider student frustration detection

## Escalation
Low priority unless combined with other commitment failures.

## Related Links
- [Commitment Definition](../python/contract.py#L70-L79)
