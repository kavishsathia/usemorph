# Goal Commitment Evaluation Runbook

## Alert Description
The Goal Commitment verification has failed. The agent is not effectively guiding the student toward their stated learning goal.

## Severity
High - Impacts learning outcomes

## Impact
- Student may not achieve their learning objective
- Session feels unfocused or off-topic
- Wasted tutoring time

## Investigation Steps

### 1. Find the Failed Trace
- Go to **LLM Observability → Traces**
- Filter by evaluation: `Goal Commitment = fail`
- Click on the failed trace

### 2. Check the Student's Goal
Look at the session settings for the `goal` field.
Example: "Understand how gravity works"

### 3. Review Conversation Relevance
- Is the discussion related to the goal?
- Is the agent tracking progress toward the goal?
- Are there progress signposts ("This understanding of X helps with Y")?

### 4. Identify the Deviation
- Did agent go off-topic?
- Did agent fail to connect content to goal?
- Did agent miss opportunity to advance toward goal?

## Common Failure Patterns

### Pattern 1: Topic Drift
Conversation wandered away from the stated goal.

**Example**: Goal is "understand gravity" but agent is discussing unrelated physics.

**Fix**: Add periodic goal check-ins to the prompt.

### Pattern 2: No Progress Tracking
Agent teaches relevant content but doesn't acknowledge progress.

**Fix**: Add explicit instruction to signpost progress.

### Pattern 3: Student Derailed
Student asked off-topic question and agent followed.

**Fix**: Agent should gently redirect: "That's interesting! Let's note that and come back to our goal of..."

### Pattern 4: Goal Too Vague
Goal like "learn physics" is hard to track progress against.

**Fix**: Prompt agent to clarify vague goals at session start.

## Remediation

### Immediate
- Review if goal was achievable in context
- Check if agent had goal in system prompt

### Long-term
- Add goal-progress checkpoints
- Implement explicit progress percentage tracking
- Add goal-relevance scoring per response

## Escalation
If goal failures correlate with specific topics, review topic coverage.

## Related Links
- [Commitment Definition](../python/contract.py#L82-L108)
