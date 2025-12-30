# High Latency Runbook

## Alert Description
Agent response latency has exceeded acceptable thresholds (p95 > 5s).

## Severity
Medium

## Impact
- Poor user experience
- Students may abandon sessions
- Potential timeout errors

## Investigation Steps

### 1. Check Datadog APM
- Go to **APM → Traces**
- Filter by service: `morph`
- Sort by duration (descending)
- Look for slow spans

### 2. Identify the Bottleneck
Common causes:
- **Gemini API latency**: Check `google_genai.request` span duration
- **Verification overhead**: Check `sworn.verify` span duration
- **Tool execution**: Check `create_window` or other tool spans

### 3. Check Gemini Status
- Visit [Google Cloud Status](https://status.cloud.google.com/)
- Check for Vertex AI / Gemini incidents

### 4. Review Recent Changes
- Any new commitments added?
- Changes to system prompt length?
- New tools registered?

## Remediation

### If Gemini API is slow:
- Wait for Google to resolve (if outage)
- Consider switching to `gemini-1.5-flash` temporarily

### If verification is slow:
- Check `semantic_sampling_rate` settings
- Reduce number of commitments if possible

### If tools are slow:
- Check database connection (for `create_window`)
- Review tool implementation for inefficiencies

## Escalation
If unresolved after 15 minutes, escalate to on-call engineer.

## Related Links
- [Gemini API Docs](https://ai.google.dev/docs)
- [Sworn Library](https://github.com/your-repo/sworn)
