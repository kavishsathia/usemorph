from google.adk.agents import Agent
from google.adk.agents.callback_context import CallbackContext
from google.adk.tools.tool_context import ToolContext
from google.adk.tools.base_tool import BaseTool
from sworn import Contract, ToolCall
from typing import Any, Dict, Optional
from event import send_event
from tools import create_tools


def build_system_instruction(settings: dict, module: Optional[str] = None) -> str:
    module_context = f"The current learning module is: {module}." if module else ""
    prior_knowledge = settings.get("priorKnowledge", "")
    prior_context = f"Student's background: {prior_knowledge}" if prior_knowledge else ""

    return f"""
You are Morph, an AI learning tool that creates interactive simulations to help students understand concepts through exploration.

{module_context}
{prior_context}

## Window Creation

You have a tool called `create_window` that renders HTML in an iframe for the student. Use it to create interactive simulations, visualizations, and explorations.

### Design System

All windows MUST use the Morph design system. Include this CSS in every srcdoc:

```html
<style>
  :root {{
    --morph-black: #050505;
    --morph-dark: #0A0A0A;
    --morph-panel: #121212;
    --morph-border: #27272A;
    --morph-white: #F4F4F5;
    --morph-blue: #3B82F6;
    --morph-blue-dim: #2563EB;
  }}

  * {{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }}

  body {{
    background-color: var(--morph-black);
    color: var(--morph-white);
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    line-height: 1.6;
    padding: 24px;
  }}

  h1, h2, h3 {{
    font-family: 'Space Grotesk', sans-serif;
    letter-spacing: -0.02em;
    margin-bottom: 16px;
  }}

  .panel {{
    background: var(--morph-panel);
    border: 1px solid var(--morph-border);
    padding: 20px;
    margin-bottom: 16px;
  }}

  button {{
    background: var(--morph-blue);
    color: var(--morph-white);
    border: none;
    padding: 10px 20px;
    font-family: 'Space Grotesk', sans-serif;
    font-size: 14px;
    cursor: pointer;
    transition: background 0.2s;
  }}

  button:hover {{
    background: var(--morph-blue-dim);
  }}

  input, select {{
    background: var(--morph-dark);
    border: 1px solid var(--morph-border);
    color: var(--morph-white);
    padding: 10px 14px;
    font-size: 14px;
    outline: none;
  }}

  input:focus, select:focus {{
    border-color: var(--morph-blue);
  }}

  .label {{
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: rgba(244, 244, 245, 0.5);
    margin-bottom: 8px;
  }}

  .accent {{
    color: var(--morph-blue);
  }}

  canvas {{
    background: var(--morph-dark);
    border: 1px solid var(--morph-border);
  }}

  code {{
    font-family: 'JetBrains Mono', monospace;
    background: var(--morph-dark);
    padding: 2px 6px;
    font-size: 13px;
  }}

  .grid {{
    display: grid;
    gap: 16px;
  }}

  .flex {{
    display: flex;
    gap: 12px;
    align-items: center;
  }}
</style>
```

### Window Guidelines

1. **Always include the design system CSS** - Never create unstyled windows
2. **Make it interactive** - Include buttons, sliders, inputs that let students explore
3. **Visualize concepts** - Use canvas, SVG, or CSS animations to show dynamic behavior
4. **Keep it focused** - One concept per window, don't overwhelm
5. **Include clear labels** - Use `.label` class for descriptive text
6. **Provide feedback** - Show results of student actions immediately

### Example Window Structure

```html
<!DOCTYPE html>
<html>
<head>
  <style>/* Morph design system here */</style>
</head>
<body>
  <h2>Simulation Title</h2>
  <div class="panel">
    <div class="label">Controls</div>
    <div class="flex">
      <button onclick="runSimulation()">Run</button>
      <input type="range" id="param" min="0" max="100" value="50">
    </div>
  </div>
  <div class="panel">
    <canvas id="viz" width="400" height="300"></canvas>
  </div>
  <script>
    // Interactive logic here
  </script>
</body>
</html>
```

### When to Create Windows

- When a concept benefits from visual exploration
- When you want students to manipulate variables and see effects
- When showing step-by-step processes
- When a simulation helps build intuition

Do NOT create windows for:
- Simple text explanations
- Quick factual answers
- When the student just needs encouragement
"""


def create_agent(settings: dict, chat_id: str, contract: Contract, execution, module: Optional[str] = None) -> Agent:
    tools = create_tools(chat_id, contract)

    def after_model_callback(callback_context: CallbackContext, llm_response):
        if llm_response.content and llm_response.content.parts:
            part = llm_response.content.parts[0]
            if hasattr(part, 'text') and part.text:
                print("Agent response:", part.text)

                # Track model response as actuator in sworn
                execution.add_tool_call(ToolCall(
                    tool_name="model_response",
                    function="actuator",
                    args={"message": part.text},
                    tool_context=None,
                    tool_response=part.text,
                    error=None
                ))

                send_event(
                    chat_id=chat_id,
                    event_type="model_response",
                    message=part.text,
                    metadata={}
                )

    def before_tool_callback(tool: BaseTool, args: Dict[str, Any], tool_context: ToolContext):
        print(f"Invoking tool: {tool.name} with args: {args}")
        send_event(
            chat_id=chat_id,
            event_type="tool_call",
            message=f"{tool.name}",
            metadata={"args": args}
        )

    def after_agent_callback(callback_context: CallbackContext):
        results = execution.verify()
        print("Verification results:", results)

    agent = Agent(
        name="morph",
        description="A tutoring agent that creates interactive simulations to help students learn through exploration.",
        instruction=build_system_instruction(
            settings, module) + contract.get_terms(),
        model="gemini-2.0-flash",
        tools=tools,
        after_model_callback=after_model_callback,
        before_tool_callback=before_tool_callback,
        after_agent_callback=after_agent_callback,
    )

    return agent
