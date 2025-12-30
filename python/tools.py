import requests
import os
from google.adk.tools import FunctionTool
from sworn import Contract


def create_tools(chat_id: str, contract: Contract) -> list:
    """Create tools with sworn actuator decorators applied."""
    base_url = os.getenv("API_BASE_URL", "https://usemorph.ai")
    headers = {"x-api-key": os.getenv("COMMS_API_KEY")}

    def _validate_response(response: requests.Response) -> dict:
        if response.status_code > 299:
            return {
                "status": "failure",
                "message": f"Tool API returned status code {response.status_code} with message: {response.text}"
            }
        return {
            "status": "success",
            "message": "Tool executed successfully."
        }

    def create_window(window_tag: str, srcdoc: str, title: str = "") -> dict:
        """Create a new window with HTML content."""
        print("Creating window with tag:", window_tag)
        response = requests.post(
            f"{base_url}/api/windows",
            json={
                "action": "create",
                "windowTag": window_tag,
                "srcdoc": srcdoc,
                "title": title,
                "chatId": chat_id
            },
            headers=headers
        )
        return _validate_response(response)

    def close_window(window_tag: str) -> dict:
        """Close an existing window."""
        response = requests.post(
            f"{base_url}/api/windows",
            json={
                "action": "close",
                "windowTag": window_tag,
                "chatId": chat_id
            },
            headers=headers
        )
        return _validate_response(response)

    def minimize_window(window_tag: str) -> dict:
        """Minimize a window."""
        response = requests.post(
            f"{base_url}/api/windows",
            json={
                "action": "minimize",
                "windowTag": window_tag,
                "chatId": chat_id
            },
            headers=headers
        )
        return _validate_response(response)

    def replace_src_in_window(window_tag: str, new_srcdoc: str, old_srcdoc: str) -> dict:
        """Replace the HTML content in an existing window."""
        response = requests.post(
            f"{base_url}/api/windows",
            json={
                "action": "replace_src",
                "windowTag": window_tag,
                "oldSrc": old_srcdoc,
                "newSrc": new_srcdoc,
                "chatId": chat_id
            },
            headers=headers
        )
        return _validate_response(response)

    # Apply sworn actuator decorator dynamically
    create_window = contract.actuator(create_window)
    close_window = contract.actuator(close_window)
    minimize_window = contract.actuator(minimize_window)
    replace_src_in_window = contract.actuator(replace_src_in_window)

    return [
        FunctionTool(create_window),
        FunctionTool(close_window),
        FunctionTool(minimize_window),
        FunctionTool(replace_src_in_window),
    ]
