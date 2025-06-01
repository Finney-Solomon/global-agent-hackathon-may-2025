from mem0 import MemoryClient

client = MemoryClient()

def save_user_profile(data: dict, session_id: str) -> str:
    name = data.get("name")
    exam = data.get("exam")
    subjects = data.get("subjects", [])
    level = data.get("understanding_level")
    year = data.get("school_year")
    target = data.get("target_year")
    time = data.get("daily_study_time")

    profile_message = {
        "role": "user",
        "content": (
            f"My name is {name}. I'm preparing for {exam}. "
            f"My subjects are {', '.join(subjects)}. "
            f"I'm at a {level} level. "
            f"I'm in {year}, targeting {target}. "
            f"I can study {time} per day."
        )
    }

    client.add([profile_message], user_id=session_id)
    data={
      "status": 'success',
      "message": 'Profile created successfully',
    }
    return data
