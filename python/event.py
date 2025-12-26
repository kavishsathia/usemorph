import os
import requests


def send_event(chat_id, event_type, message=None, metadata=None):
    base_url = os.getenv("API_BASE_URL", "https://usemorph.ai")
    requests.post(
        f"{base_url}/api/events",
        json={
            "chatId": chat_id,
            "eventType": event_type,
            "content": message,
            "metadata": metadata
        },
        headers={"x-api-key": os.getenv("COMMS_API_KEY")}
    )
