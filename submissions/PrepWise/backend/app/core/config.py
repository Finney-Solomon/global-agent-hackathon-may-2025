from dotenv import load_dotenv
import os

load_dotenv()

def get_env(key: str, default: str = "") -> str:
    value = os.getenv(key, default)
    print(f"Loaded env key: {key} = {value}")  # ✅ Add this line for debugging
    return value
