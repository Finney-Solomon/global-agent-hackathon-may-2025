from agno.agent import Agent
from agno.models.openai import OpenAIChat
from agno.tools.models.groq import GroqTools
from agno.tools.reasoning import ReasoningTools
from mem0 import MemoryClient
from app.core.config import get_env

client = MemoryClient()

# 📌 1. Build user prompt from memory
def build_user_prompt(memory_data: list) -> str:
    memory_texts = [item.get("memory") for item in memory_data if item.get("memory")]
    if not memory_texts:
        return "No specific user context provided."

    return (
        "Here is what I know about the user:\n\n"
        + "\n".join(f"- {mem}" for mem in memory_texts)
        + "\n\nUse this information to generate a personalized quiz."
    )

# 📌 2. Generate quiz prompt including context
def generate_quiz_prompt(topic: str, memory_data: list) -> str:
    user_context = build_user_prompt(memory_data)

    return f"""\
{user_context}

Now generate a quiz on the topic: "{topic}".

Respond only with valid JSON in the following format:

{{
  "topic": "{topic}",
  "questions": [
    {{
      "id": "1",
      "question": "Sample question?",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": "Correct Option",
      "explanation": "Explain the correct answer."
    }},
    ...
  ]
}}

Make sure to generate between 10 to 20 questions.
Avoid extra commentary, explanation, or markdown formatting.
"""

# 📌 3. Build quiz agent with memory context
def build_quiz_agent(session_id: str) -> Agent:
    try:
        memory_data = client.get_all(user_id=session_id)
    except Exception as e:
        print(f"[Mem0] Failed to fetch memory for quiz agent (session {session_id}): {e}")
        memory_data = []

    user_context = build_user_prompt(memory_data)

    return Agent(
        # model=OpenAIChat(id="gpt-4o", api_key=get_env("OPENAI_API_KEY")),
        model=OpenAIChat(id="gpt-4o-mini"),
        # tools=[ReasoningTools(add_instructions=True)],
        tools=[GroqTools()],
        context={"memory": memory_data},
        add_context=True,
        memory=False,  # Only reads memory
        show_tool_calls=False,
        markdown=False,
        instructions=[
            "You are a quiz generator for academic subjects like Biology, Physics, Chemistry, and more.",
            "Return only valid JSON in this format:",
            '''{
  "topic": "Topic Name",
  "questions": [
    {
      "id": "1",
      "question": "...",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": "A",
      "explanation": "..."
    },
    ...
  ]
}''',
            "Include 10 to 20 questions max.",
            "Avoid any commentary, extra text, or markdown formatting.",
            user_context
        ]
    )
