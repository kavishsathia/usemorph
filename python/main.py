"""
Entry point for Trigger.dev Python task.

This script is called by Trigger.dev with JSON input via command line args.
It outputs JSON to stdout which Trigger.dev captures.

Usage (called by Trigger.dev):
    python main.py '{"message": "...", "history": [...], "settings": {...}}'
"""

import sys
import json
from typing import TypedDict
import asyncio
from pathlib import Path
from dotenv import load_dotenv

# Load env vars BEFORE importing sworn (so DD_* vars are set when LLMObs.enable() runs)
env_path = Path(__file__).parent.parent / ".env.local"
load_dotenv(env_path)

from sworn import DatadogObservability
from contract import create_contract
from run import run_conversation, Message


class TaskInput(TypedDict):
    message: str
    history: list[Message]
    settings: dict
    module: str | None
    chatId: str | None


class TaskOutput(TypedDict):
    status: str
    error: str | None


def parse_input() -> TaskInput:
    if len(sys.argv) < 2:
        raise ValueError("No input provided. Usage: python main.py '{...}'")

    try:
        data = json.loads(sys.argv[1])
    except json.JSONDecodeError as e:
        raise ValueError(f"Invalid JSON input: {e}")

    return {
        "message": data.get("message", ""),
        "history": data.get("history", []),
        "settings": data.get("settings", {}),
        "module": data.get("module"),
        "chatId": data.get("chatId"),
    }


async def main() -> None:
    try:
        input_data = parse_input()

        # Create observer for telemetry
        observer = DatadogObservability()

        # Create contract with commitments
        contract = create_contract(input_data["settings"], observer)

        # Run conversation (agent created inside with execution context)
        await run_conversation(
            contract=contract,
            settings=input_data["settings"],
            chat_id=input_data["chatId"],
            message=input_data["message"],
            history=input_data["history"],
            module=input_data.get("module")
        )

        # Give Datadog time to flush telemetry
        await asyncio.sleep(5)

        output: TaskOutput = {
            "status": "success",
            "error": None
        }
    except Exception as e:
        import traceback
        print(f"Error: {e}", file=sys.stderr)
        traceback.print_exc()
        output: TaskOutput = {
            "status": "failure",
            "error": str(e)
        }
        sys.exit(1)

    return output


if __name__ == "__main__":
    asyncio.run(main())
