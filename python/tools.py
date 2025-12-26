import requests
import os
from google.adk.tools import FunctionTool


class Tools:
    def __init__(self, chat_id: str):
        self.chat_id = chat_id
        self.base_url = os.getenv("API_BASE_URL", "https://usemorph.ai")

    def create_window(self, window_tag: str, srcdoc: str, title: str = "") -> dict:
        print("Creating window with tag:", window_tag)
        response = requests.post(
            f"{self.base_url}/api/windows",
            json={
                "action": "create",
                "windowTag": window_tag,
                "srcdoc": srcdoc,
                "title": title,
                "chatId": self.chat_id
            },
            headers={"x-api-key": os.getenv("COMMS_API_KEY")}
        )

        return self._validate_response(response)

    def close_window(self, window_tag: str) -> dict:
        response = requests.post(
            f"{self.base_url}/api/windows",
            json={
                "action": "close",
                "windowTag": window_tag,
                "chatId": self.chat_id
            },
            headers={"x-api-key": os.getenv("COMMS_API_KEY")}
        )

        return self._validate_response(response)

    def minimize_window(self, window_tag: str) -> dict:
        response = requests.post(
            f"{self.base_url}/api/windows",
            json={
                "action": "minimize",
                "windowTag": window_tag,
                "chatId": self.chat_id
            },
            headers={"x-api-key": os.getenv("COMMS_API_KEY")}
        )

        return self._validate_response(response)

    def replace_src_in_window(self, window_tag: str, new_srcdoc: str, old_srcdoc: str) -> dict:
        response = requests.post(
            f"{self.base_url}/api/windows",
            json={
                "action": "replace_src",
                "windowTag": window_tag,
                "oldSrc": old_srcdoc,
                "newSrc": new_srcdoc,
                "chatId": self.chat_id
            },
            headers={"x-api-key": os.getenv("COMMS_API_KEY")}
        )

        return self._validate_response(response)

    def _validate_response(self, response: requests.Response) -> dict:
        if response.status_code > 299:
            return {
                "status": "failure",
                "message": f"Tool API returned status code {response.status_code} with message: {response.text}"
            }
        else:
            return {
                "status": "success",
                "message": "Tool executed successfully."
            }

    def get_tools(self) -> list:
        return [
            FunctionTool(self.create_window),
            FunctionTool(self.close_window),
            FunctionTool(self.minimize_window),
            FunctionTool(self.replace_src_in_window),
        ]
