"""
Quick test script for the agent.
Run: python test_agent.py
"""

import asyncio
from pathlib import Path
from dotenv import load_dotenv

# Load env vars BEFORE importing sworn (so DD_* vars are set when LLMObs.enable() runs)
env_path = Path(__file__).parent.parent / ".env.local"
load_dotenv(env_path)

from run import run_conversation
from contract import create_contract
from sworn import DatadogObservability


async def test():
    settings = {
        "pace": "moderate",
        "challenge": "balanced",
        "hints": "sometimes",
        "goal": "Understand how gravity works",
    }

    observer = DatadogObservability()
    contract = create_contract(settings, observer)

    print("Running agent...")
    await run_conversation(
        contract=contract,
        settings=settings,
        chat_id="4e706e5f-17d1-405e-acc6-01226179b9b0",
        message="Can you help me understand how gravity affects falling objects?",
        history=[],
        module="Physics 101"
    )
    print("Done! Check your database for any windows created.")

    # Give Datadog time to flush telemetry
    print("Waiting for Datadog to flush...")
    await asyncio.sleep(5)
    print("Flush complete.")


if __name__ == "__main__":
    asyncio.run(test())
