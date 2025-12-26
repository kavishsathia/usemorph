"""
Quick test script for the agent.
Run: python test_agent.py
"""

from run import run_conversation
from agent import create_agent
from contract import create_contract
import asyncio
from pathlib import Path
from dotenv import load_dotenv

# Load env vars from .env.local in project root
env_path = Path(__file__).parent.parent / ".env.local"
load_dotenv(env_path)


async def test():
    settings = {
        "pace": "moderate",
        "challenge": "balanced",
        "hints": "sometimes",
        "goal": "Understand how gravity works",
    }

    contract = create_contract(settings)
    agent = create_agent(
        contract=contract,
        settings=settings,
        chat_id="4e706e5f-17d1-405e-acc6-01226179b9b0",
        module="Physics 101"
    )

    print("Running agent...")
    await run_conversation(
        agent=agent,
        message="Can you help me understand how gravity affects falling objects?",
        history=[]
    )
    print("Done! Check your database for any windows created.")


if __name__ == "__main__":
    asyncio.run(test())
