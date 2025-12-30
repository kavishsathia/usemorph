from google.adk import Runner
from google.adk.sessions import InMemorySessionService
from google.genai import types
from sworn import Contract
from typing import TypedDict

from agent import create_agent


class Message(TypedDict):
    event_type: str
    content: str
    metadata: dict


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
    contract: Contract,
    settings: dict,
    chat_id: str,
    message: str,
    history: list[Message],
    module: str | None = None
):
    agent_history = format_history_for_agent(history)

    session = InMemorySessionService()

    await session.create_session(
        app_name="agent",
        user_id="user",
        session_id="session"
    )

    msg = types.Content(role='user', parts=[
        types.Part(text=f"""
                    {agent_history}
                    User: {message}
                    """)])

    # Run agent within sworn's execution context
    with contract.execution() as execution:
        agent = create_agent(
            settings=settings,
            chat_id=chat_id,
            contract=contract,
            execution=execution,
            module=module
        )

        runner = Runner(agent=agent, session_service=session, app_name="agent")

        async for e in runner.run_async(
            user_id="user", session_id="session", new_message=msg
        ):
            print(e)
