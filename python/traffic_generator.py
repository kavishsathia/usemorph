"""
Traffic generator for populating Datadog dashboards.
Runs varied conversations to generate telemetry data.

Run: python traffic_generator.py
"""

import asyncio
import uuid
import random
from pathlib import Path
from dotenv import load_dotenv

env_path = Path(__file__).parent.parent / ".env.local"
load_dotenv(env_path)

from run import run_conversation
from contract import create_contract
from sworn import DatadogObservability


SCENARIOS = [
    {
        "settings": {
            "pace": "slow",
            "challenge": "gentle",
            "hints": "often",
            "goal": "Understand basic algebra",
        },
        "message": "What is a variable in math?",
        "module": "Algebra Basics"
    },
    {
        "settings": {
            "pace": "fast",
            "challenge": "rigorous",
            "hints": "rarely",
            "goal": "Master calculus derivatives",
        },
        "message": "Explain the chain rule for derivatives",
        "module": "Calculus"
    },
    {
        "settings": {
            "pace": "medium",
            "challenge": "balanced",
            "hints": "sometimes",
            "goal": "Learn about photosynthesis",
        },
        "message": "How do plants convert sunlight into energy?",
        "module": "Biology 101"
    },
    {
        "settings": {
            "pace": "slow",
            "challenge": "gentle",
            "hints": "often",
            "goal": "Understand gravity",
        },
        "message": "Why do things fall down?",
        "module": "Physics Intro"
    },
    {
        "settings": {
            "pace": "fast",
            "challenge": "rigorous",
            "hints": "rarely",
            "goal": "Understand quantum mechanics",
        },
        "message": "Explain superposition in quantum mechanics",
        "module": "Quantum Physics"
    },
    {
        "settings": {
            "pace": "medium",
            "challenge": "balanced",
            "hints": "sometimes",
            "goal": "Learn Python programming",
        },
        "message": "How do I write a for loop?",
        "module": "Python 101"
    },
    # Edge case - might trigger commitment issues
    {
        "settings": {
            "pace": "fast",
            "challenge": "rigorous",
            "hints": "rarely",
            "goal": "Quick answer needed",
        },
        "message": "Just tell me the answer to 2+2",
        "module": None
    },
    {
        "settings": {
            "pace": "slow",
            "challenge": "gentle",
            "hints": "often",
            "goal": "Understand history",
        },
        "message": "When did World War 2 start?",
        "module": "History"
    },
]


async def run_scenario(scenario: dict, delay: float = 0):
    """Run a single scenario."""
    if delay > 0:
        await asyncio.sleep(delay)

    chat_id = str(uuid.uuid4())
    observer = DatadogObservability()
    contract = create_contract(scenario["settings"], observer)

    print(f"\n{'='*50}")
    print(f"Running: {scenario['message'][:50]}...")
    print(f"Module: {scenario.get('module', 'None')}")
    print(f"Settings: pace={scenario['settings']['pace']}, challenge={scenario['settings']['challenge']}")

    try:
        await run_conversation(
            contract=contract,
            settings=scenario["settings"],
            chat_id=chat_id,
            message=scenario["message"],
            history=[],
            module=scenario.get("module")
        )
        print(f"✓ Completed")
    except Exception as e:
        print(f"✗ Error: {e}")


async def generate_traffic(num_requests: int = 10, parallel: int = 1, delay: float = 2.0):
    """
    Generate traffic by running scenarios.

    Args:
        num_requests: Total number of requests to make
        parallel: Number of parallel requests (1 = sequential)
        delay: Delay between batches in seconds
    """
    print(f"Starting traffic generation: {num_requests} requests, {parallel} parallel, {delay}s delay")

    for i in range(0, num_requests, parallel):
        batch = []
        for j in range(parallel):
            if i + j < num_requests:
                scenario = random.choice(SCENARIOS)
                batch.append(run_scenario(scenario, delay=0))

        await asyncio.gather(*batch)

        if i + parallel < num_requests:
            print(f"\nWaiting {delay}s before next batch...")
            await asyncio.sleep(delay)

    print(f"\n{'='*50}")
    print(f"Traffic generation complete! {num_requests} requests sent.")


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description="Generate traffic for Datadog dashboards")
    parser.add_argument("-n", "--num", type=int, default=5, help="Number of requests")
    parser.add_argument("-p", "--parallel", type=int, default=1, help="Parallel requests")
    parser.add_argument("-d", "--delay", type=float, default=3.0, help="Delay between batches (seconds)")

    args = parser.parse_args()

    asyncio.run(generate_traffic(
        num_requests=args.num,
        parallel=args.parallel,
        delay=args.delay
    ))
