from observable_agent import ObservableAgent
from typing import TypedDict
from google.adk import Runner
from google.genai import types
from google.adk.sessions import InMemorySessionService


class Message(TypedDict):
    event_type: str
    content: str
    metadata: dict


class RunResult(TypedDict):
    response: str
    verification_passed: bool
    verification_details: dict


def format_history_for_agent(history: list[Message]) -> str:
    formatted = ""
    for event in history:
        event_type = event["event_type"]
        content = event["content"]
        metadata = event["metadata"]

        if event_type == "user_input":
            formatted += f"User: {content}\n"
        elif event_type == "model_response":
            formatted += f"Morph: {content}\n"
        elif event_type == "tool_call":
            formatted += f"Tool call: {content}({metadata})\n"
        elif event_type == "tool_result":
            formatted += f"Tool result: {content}\n"
    return formatted


async def run_conversation(
    agent: ObservableAgent,
    message: str,
    history: list[Message]
) -> RunResult:
    agent_history = format_history_for_agent(history)

    session = InMemorySessionService()

    await session.create_session(
        app_name="agent",
        user_id="user",
        session_id="session"
    )

    runner = Runner(agent=agent, session_service=session, app_name="agent")

    msg = types.Content(role='user', parts=[
        types.Part(text=f"""
                    {agent_history}
                    User: {message}
                    """)])

    async for e in runner.run_async(
        user_id="user", session_id="session", new_message=msg
    ):
        print(e)
