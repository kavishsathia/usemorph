"""
Sophisticated traffic generator for Datadog monitoring demonstration.

Simulates realistic student interactions with multi-turn conversations,
different personas, and scenarios designed to test monitoring rules.

Run: python traffic_generator.py [pattern]
Examples:
    python traffic_generator.py demo
    python traffic_generator.py steady
    python traffic_generator.py burst
    python traffic_generator.py stress
    python traffic_generator.py monitor_test
"""

import asyncio
import uuid
import random
import time
from pathlib import Path
from dotenv import load_dotenv
from typing import Any
from collections import defaultdict

env_path = Path(__file__).parent.parent / ".env.local"
load_dotenv(env_path)

from run import run_conversation, Message
from contract import create_contract
from sworn import DatadogObservability
from traffic_seed import (
    STUDENT_PERSONAS,
    CONVERSATION_SCENARIOS,
    TRAFFIC_PATTERNS,
    ConversationScenario,
    TrafficPattern
)


class TrafficStats:
    """Tracks statistics during traffic generation."""

    def __init__(self):
        self.total_conversations = 0
        self.total_turns = 0
        self.successful = 0
        self.failed = 0
        self.scenarios_run: dict[str, int] = defaultdict(int)
        self.personas_used: dict[str, int] = defaultdict(int)
        self.expected_triggers: dict[str, int] = defaultdict(int)
        self.start_time = time.time()

    def record_conversation(
        self,
        scenario_title: str,
        persona: str,
        turns: int,
        expected_triggers: list[str],
        success: bool
    ):
        """Record statistics for a completed conversation."""
        self.total_conversations += 1
        self.total_turns += turns
        self.scenarios_run[scenario_title] += 1
        self.personas_used[persona] += 1

        for trigger in expected_triggers:
            self.expected_triggers[trigger] += 1

        if success:
            self.successful += 1
        else:
            self.failed += 1

    def print_summary(self):
        """Print a detailed summary of the traffic generation session."""
        duration = time.time() - self.start_time

        print("\n" + "="*70)
        print("TRAFFIC GENERATION SUMMARY")
        print("="*70)

        print(f"\n⏱️  Duration: {duration:.1f} seconds")
        print(f"\n📊 Overall Stats:")
        print(f"   Total Conversations: {self.total_conversations}")
        print(f"   Total Turns: {self.total_turns}")
        print(f"   Average Turns/Conversation: {self.total_turns / max(1, self.total_conversations):.1f}")
        print(f"   Successful: {self.successful} ✓")
        print(f"   Failed: {self.failed} ✗")

        if self.scenarios_run:
            print(f"\n🎬 Top Scenarios Run:")
            for scenario, count in sorted(
                self.scenarios_run.items(),
                key=lambda x: x[1],
                reverse=True
            )[:5]:
                print(f"   {scenario}: {count}x")

        if self.personas_used:
            print(f"\n👥 Student Personas Used:")
            for persona, count in sorted(
                self.personas_used.items(),
                key=lambda x: x[1],
                reverse=True
            ):
                persona_data = STUDENT_PERSONAS.get(persona, {})
                name = persona_data.get("name", persona)
                print(f"   {name}: {count}x")

        if self.expected_triggers:
            print(f"\n🚨 Expected Monitor Triggers:")
            print(f"   (Scenarios designed to potentially trigger these monitors)")
            for trigger, count in sorted(
                self.expected_triggers.items(),
                key=lambda x: x[1],
                reverse=True
            ):
                print(f"   {trigger}: {count} scenarios")

        print(f"\n💡 Next Steps:")
        print(f"   1. Check Datadog LLM Observability Dashboard")
        print(f"   2. Review traces for evaluation results")
        print(f"   3. Check if monitors triggered as expected")
        print(f"   4. Visit usemorph.ai/runbooks for investigation guides")

        print("\n" + "="*70)


async def run_multi_turn_conversation(
    scenario: ConversationScenario,
    pattern: TrafficPattern,
    stats: TrafficStats
) -> bool:
    """
    Run a multi-turn conversation scenario.

    Returns True if successful, False if error occurred.
    """
    chat_id = str(uuid.uuid4())
    persona = STUDENT_PERSONAS[scenario["persona"]]

    print(f"\n{'─'*70}")
    print(f"🎭 Scenario: {scenario['title']}")
    print(f"👤 Persona: {persona['name']}")
    print(f"📚 Module: {scenario.get('module', 'General')}")
    print(f"💬 Turns: {len(scenario['turns'])}")

    if scenario['expected_triggers']:
        print(f"⚠️  Expected Triggers: {', '.join(scenario['expected_triggers'])}")

    try:
        # Create observer and contract once per conversation
        observer = DatadogObservability()
        contract = create_contract(persona["settings"], observer)

        # Simulate multi-turn conversation
        history: list[Message] = []

        for turn_idx, user_message in enumerate(scenario["turns"], 1):
            print(f"\n  Turn {turn_idx}/{len(scenario['turns'])}: {user_message[:60]}...")

            await run_conversation(
                contract=contract,
                settings=persona["settings"],
                chat_id=chat_id,
                message=user_message,
                history=history,
                module=scenario.get("module")
            )

            # Add this turn to history for next turn's context
            # Note: In a real system, we'd capture the agent's response
            # For traffic generation, we just track user messages
            history.append({
                "event_type": "user_input",
                "content": user_message,
                "metadata": {}
            })

            # Delay between turns in the same conversation
            if turn_idx < len(scenario["turns"]):
                await asyncio.sleep(pattern["delay_between_turns"])

        print(f"  ✓ Completed successfully")

        stats.record_conversation(
            scenario_title=scenario["title"],
            persona=persona["name"],
            turns=len(scenario["turns"]),
            expected_triggers=scenario["expected_triggers"],
            success=True
        )

        return True

    except Exception as e:
        print(f"  ✗ Error: {str(e)[:100]}")

        stats.record_conversation(
            scenario_title=scenario["title"],
            persona=persona["name"],
            turns=len(scenario["turns"]),
            expected_triggers=scenario["expected_triggers"],
            success=False
        )

        return False


async def generate_traffic(
    pattern_name: str = "demo",
    scenario_filter: str | None = None
):
    """
    Generate traffic using the specified pattern.

    Args:
        pattern_name: Name of traffic pattern from TRAFFIC_PATTERNS
        scenario_filter: Optional filter for scenario selection
            - "passing": Only scenarios that should pass all checks
            - "failing": Only scenarios expected to trigger monitors
            - "phd": Only PhD-level scenarios
            - None: All scenarios
    """
    if pattern_name not in TRAFFIC_PATTERNS:
        print(f"❌ Unknown pattern: {pattern_name}")
        print(f"Available patterns: {', '.join(TRAFFIC_PATTERNS.keys())}")
        return

    pattern = TRAFFIC_PATTERNS[pattern_name]
    stats = TrafficStats()

    # Filter scenarios based on criteria
    scenarios = CONVERSATION_SCENARIOS.copy()

    if scenario_filter == "passing":
        scenarios = [s for s in scenarios if not s["expected_triggers"]]
        print(f"🎯 Filter: Only scenarios that should pass all checks")
    elif scenario_filter == "failing":
        scenarios = [s for s in scenarios if s["expected_triggers"]]
        print(f"🎯 Filter: Only scenarios expected to trigger monitors")
    elif scenario_filter == "phd":
        scenarios = [s for s in scenarios if "phd" in s["persona"].lower()]
        print(f"🎯 Filter: Only PhD-level scenarios")

    if not scenarios:
        print(f"❌ No scenarios match filter: {scenario_filter}")
        return

    print("\n" + "="*70)
    print(f"🚀 STARTING TRAFFIC GENERATION")
    print("="*70)
    print(f"\nPattern: {pattern['name']}")
    print(f"Description: {pattern['description']}")
    print(f"Conversations: {pattern['num_conversations']}")
    print(f"Parallel: {pattern['parallel']}")
    print(f"Available Scenarios: {len(scenarios)}")
    print(f"Delay Between Batches: {pattern['delay_between_batches']}s")
    print(f"Delay Between Turns: {pattern['delay_between_turns']}s")

    # Generate traffic in batches
    num_conversations = pattern["num_conversations"]
    parallel = pattern["parallel"]

    for batch_idx in range(0, num_conversations, parallel):
        batch_num = (batch_idx // parallel) + 1
        total_batches = (num_conversations + parallel - 1) // parallel

        print(f"\n{'='*70}")
        print(f"📦 Batch {batch_num}/{total_batches}")
        print(f"{'='*70}")

        # Select scenarios for this batch
        batch_tasks = []
        for i in range(parallel):
            if batch_idx + i < num_conversations:
                scenario = random.choice(scenarios)
                batch_tasks.append(
                    run_multi_turn_conversation(scenario, pattern, stats)
                )

        # Run batch in parallel
        await asyncio.gather(*batch_tasks, return_exceptions=True)

        # Delay before next batch (except for last batch)
        if batch_idx + parallel < num_conversations:
            print(f"\n⏳ Waiting {pattern['delay_between_batches']}s before next batch...")
            await asyncio.sleep(pattern["delay_between_batches"])

    # Wait for Datadog to flush telemetry
    print(f"\n⏳ Waiting 5 seconds for Datadog to flush telemetry...")
    await asyncio.sleep(5)

    # Print summary
    stats.print_summary()


async def list_patterns():
    """Display available traffic patterns."""
    print("\n" + "="*70)
    print("AVAILABLE TRAFFIC PATTERNS")
    print("="*70)

    for name, pattern in TRAFFIC_PATTERNS.items():
        print(f"\n📊 {name}")
        print(f"   {pattern['description']}")
        print(f"   Conversations: {pattern['num_conversations']}")
        print(f"   Parallel: {pattern['parallel']}")
        print(f"   Batch Delay: {pattern['delay_between_batches']}s")

    print("\n" + "="*70)
    print("Usage: python traffic_generator.py [pattern] [filter]")
    print("Example: python traffic_generator.py demo")
    print("Example: python traffic_generator.py steady passing")
    print("Example: python traffic_generator.py monitor_test failing")
    print("="*70 + "\n")


async def show_scenarios():
    """Display all available scenarios."""
    print("\n" + "="*70)
    print("AVAILABLE SCENARIOS")
    print("="*70)

    grouped = defaultdict(list)
    for scenario in CONVERSATION_SCENARIOS:
        if scenario["expected_triggers"]:
            grouped["⚠️  Likely to Trigger Monitors"].append(scenario)
        else:
            grouped["✅ Should Pass All Checks"].append(scenario)

    for group_name, scenarios in grouped.items():
        print(f"\n{group_name}:")
        for scenario in scenarios:
            persona = STUDENT_PERSONAS[scenario["persona"]]
            print(f"\n  🎬 {scenario['title']}")
            print(f"     Persona: {persona['name']}")
            print(f"     Module: {scenario.get('module', 'General')}")
            print(f"     Turns: {len(scenario['turns'])}")
            if scenario["expected_triggers"]:
                print(f"     Expected Triggers: {', '.join(scenario['expected_triggers'])}")

    print("\n" + "="*70 + "\n")


if __name__ == "__main__":
    import sys

    if len(sys.argv) > 1:
        command = sys.argv[1].lower()

        if command == "list":
            asyncio.run(list_patterns())
        elif command == "scenarios":
            asyncio.run(show_scenarios())
        elif command in TRAFFIC_PATTERNS:
            # Optional filter as second argument
            filter_arg = sys.argv[2] if len(sys.argv) > 2 else None
            asyncio.run(generate_traffic(command, filter_arg))
        else:
            print(f"❌ Unknown command or pattern: {command}")
            print("\nTry:")
            print("  python traffic_generator.py list       - Show available patterns")
            print("  python traffic_generator.py scenarios  - Show all scenarios")
            print(f"  python traffic_generator.py demo       - Run demo pattern")
    else:
        # Default: run demo pattern
        asyncio.run(generate_traffic("demo"))
