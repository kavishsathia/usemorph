import { ExternalLink, AlertTriangle, Activity } from "lucide-react";

export default function RunbooksPage() {
  const behaviorRunbooks = [
    {
      title: "Socratic Questioning",
      description: "Agent provides direct answers instead of guiding questions",
      link: "https://github.com/kavishsathia/usemorph/wiki/Socratic-Questioning-Evaluation-Runbook",
    },
    {
      title: "Challenge Level",
      description: "Challenge difficulty doesn't match student knowledge level",
      link: "https://github.com/kavishsathia/usemorph/wiki/Challenge-Level-Evaluation-Runbook",
    },
    {
      title: "Goal Commitment",
      description: "Agent fails to guide students toward learning goals",
      link: "https://github.com/kavishsathia/usemorph/wiki/Goal-Commitment-Evaluation-Runbook",
    },
    {
      title: "Hint Frequency",
      description: "Hints provided too frequently or infrequently",
      link: "https://github.com/kavishsathia/usemorph/wiki/Hint-Frequency-Evaluation-Runbook",
    },
    {
      title: "Pacing",
      description: "Conversation pacing too rushed or too slow",
      link: "https://github.com/kavishsathia/usemorph/wiki/Pacing-Evaluation-Runbook",
    },
  ];

  const performanceRunbooks = [
    {
      title: "High Latency",
      description: "Response time degradation and API bottlenecks",
      link: "https://github.com/kavishsathia/usemorph/wiki/High-Latency-Runbook",
    },
  ];

  return (
    <main className="bg-morph-black min-h-screen text-morph-white">
      <div className="max-w-5xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="mb-12">
          <h1 className="font-display text-5xl font-medium tracking-tight mb-4">
            Operational Runbooks
          </h1>
          <p className="text-morph-white/70 text-lg max-w-2xl">
            Quick access to investigation and remediation guides for Datadog
            monitoring alerts.
          </p>
        </div>

        {/* Monitor Thresholds */}
        <div className="bg-morph-panel border border-morph-border p-6 mb-12">
          <h3 className="font-display text-sm font-medium text-morph-blue uppercase tracking-wider mb-3">
            Monitor Thresholds
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-morph-white/50">Critical:</span>{" "}
              <span className="text-morph-white">Pass rate &lt; 70%</span>
            </div>
            <div>
              <span className="text-morph-white/50">Warning:</span>{" "}
              <span className="text-morph-white">Pass rate &lt; 80%</span>
            </div>
          </div>
        </div>

        {/* Agent Behavior Verification */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <AlertTriangle className="w-5 h-5 text-morph-blue" />
            <h2 className="font-display text-2xl font-medium">
              Agent Behavior Verification
            </h2>
          </div>
          <div className="grid gap-3">
            {behaviorRunbooks.map((runbook) => (
              <a
                key={runbook.title}
                href={runbook.link}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-morph-panel border border-morph-border p-5 hover:border-morph-blue transition-colors group"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-display text-lg font-medium mb-1 group-hover:text-morph-blue transition-colors">
                      {runbook.title}
                    </h3>
                    <p className="text-morph-white/60 text-sm">
                      {runbook.description}
                    </p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-morph-white/40 group-hover:text-morph-blue transition-colors flex-shrink-0 mt-1" />
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Performance & Infrastructure */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <Activity className="w-5 h-5 text-morph-blue" />
            <h2 className="font-display text-2xl font-medium">
              Performance & Infrastructure
            </h2>
          </div>
          <div className="grid gap-3">
            {performanceRunbooks.map((runbook) => (
              <a
                key={runbook.title}
                href={runbook.link}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-morph-panel border border-morph-border p-5 hover:border-morph-blue transition-colors group"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-display text-lg font-medium mb-1 group-hover:text-morph-blue transition-colors">
                      {runbook.title}
                    </h3>
                    <p className="text-morph-white/60 text-sm">
                      {runbook.description}
                    </p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-morph-white/40 group-hover:text-morph-blue transition-colors flex-shrink-0 mt-1" />
                </div>
              </a>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
