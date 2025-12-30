# Socratic Questioning Evaluation Runbook

## Alert Description
The Socratic Questioning commitment verification has failed. The agent provided direct answers instead of guiding the student through discovery.

## Severity
High - Core pedagogical principle violated

## Impact
- Student misses learning opportunity
- Defeats purpose of Socratic tutoring method
- May indicate prompt drift or model behavior change

## Investigation Steps

### 1. Find the Failed Trace
- Go to **LLM Observability → Traces**
- Filter by evaluation: `Socratic Questioning = fail`
- Click on the failed trace

### 2. Review the Conversation
- What did the student ask?
- What did the agent respond?
- Was the response a direct answer or guided question?

### 3. Check the Verification Details
Look at the `VerificationResult`:
- `actual`: What the agent did
- `expected`: What was expected
- `reasoning`: Why it failed

### 4. Analyze the Context
- Was this an advanced/PhD-level question? (exceptions allowed)
- Was the student explicitly frustrated?
- Was this a simple factual lookup?

## Common Failure Patterns

### Pattern 1: Direct Answer Given
**Example**: Student asks "What is 2+2?" and agent says "4" instead of guiding.

**Fix**: This may be acceptable for trivial questions. Review if the commitment terms need adjustment for simple factual queries.

### Pattern 2: No Questions Asked
**Example**: Agent explains a concept without checking student understanding.

**Fix**: Review system prompt emphasis on questioning. May need stronger instruction.

### Pattern 3: Expert-Level Override Missed
**Example**: PhD student asks technical question, agent still uses basic Socratic method.

**Fix**: The commitment allows direct responses for advanced queries. Check if detection is working.

## Remediation

### Immediate
- If systematic: Review recent prompt changes
- If one-off: Monitor for recurrence

### Long-term
- Adjust commitment terms if too strict
- Add examples to system prompt
- Consider context-aware commitment (student level)

## Escalation
If failure rate > 20% over 1 hour, escalate to engineering lead.

## Related Links
- [Commitment Definition](../python/contract.py#L4-L43)
- [Socratic Method Overview](https://en.wikipedia.org/wiki/Socratic_method)
