from agno.agent import Agent
from agno.models.openai import OpenAIChat
from agno.tools.reasoning import ReasoningTools
from agno.tools.firecrawl import FirecrawlTools
from agno.tools.exa import ExaTools
from mem0 import MemoryClient
from app.core.config import get_env
from agno.tools.models.groq import GroqTools
import json

client = MemoryClient()

def build_exam_agent(
        session_id: str
        ) -> Agent:
    try:
        memory_data = client.get_all(user_id=session_id)
    except Exception as e:
        print(f"[Mem0] Failed to load memory for user {session_id}: {e}")
        memory_data = []

    return Agent(
        # model=OpenAIChat(id="gpt-4o", api_key=get_env("OPENAI_API_KEY")),


          model=OpenAIChat(id="gpt-4o-mini"),
        # tools=[ReasoningTools(add_instructions=True)],
        # tools=[GroqTools()],
        tools=[
            FirecrawlTools(api_key=get_env("FIRECRAWL_API_KEY")),
            ExaTools(api_key=get_env("EXA_API_KEY")),
            ReasoningTools(add_instructions=True),
            GroqTools()
        ],
        context={"memory": memory_data},  
        add_context=True,
        memory=True,
        show_tool_calls=True,
        markdown=True,
        instructions=[
            "You are an AI exam assistant who explains concepts clearly, generates multiple choice quizzes, creates study schedules, and summarizes learning material.",
            "Use Firecrawl for curriculum-related content.",
            "Use Exa for real-time, factual search results.",
            "Recall what the user has previously shared and learned.",
            "Show output in markdown or JSON where possible."
        ]
    )




def build_user_prompt(memory_data: list) -> str:
    memory_texts = [item["memory"] for item in memory_data if item.get("memory")]
    return "Here is what I know about the user:\n\n" + "\n".join(f"- {mem}" for mem in memory_texts) + \
           "\n\nUse this information to generate a personalized study plan."

def build_plan_agent(session_id: str, memory_data: list) -> Agent:
    user_context = build_user_prompt(memory_data)
    return Agent(
        # model=OpenAIChat(id="gpt-4o", api_key=get_env("OPENAI_API_KEY")),
        model=OpenAIChat(id="gpt-4o-mini"),
        tools=[ReasoningTools(add_instructions=True),GroqTools()],
        context={"memory": memory_data},
        add_context=True,
        memory=True,
        show_tool_calls=False,
        markdown=False,
        instructions=[
            "You are a study planner AI for competitive exams like NEET, JEE, etc.",
            "Given the user's exam, subjects, understanding level, and daily study time, create a focused learning plan.",
            "Respond only with JSON in this format:\n" +
            '{ "topics": [ { "id": "1", "title": "...", "subject": "..." }, ... ] }',
            "Choose important foundational topics from each subject the user has chosen.",
            user_context
        ]
    )


async def generate_learning_plan(session_id: str):
    try:
        memory_data = client.get_all(user_id=session_id)
        agent = build_plan_agent(session_id, memory_data)

        prompt = "Create a learning plan with topic suggestions for each subject based on my goals."
        result = agent.run(prompt)

        print(result, "result generate_learning_plan", prompt, memory_data)
        print("result generate_learning_plan prompt", memory_data,)
        # Strip any Markdown formatting like ```json ... ```
        cleaned = result.content.strip()
        if cleaned.startswith("```json"):
            cleaned = cleaned.replace("```json", "").strip()
        if cleaned.endswith("```"):
            cleaned = cleaned[:-3].strip()

        parsed = json.loads(cleaned)
        return parsed
    except Exception as e:
        print(f"[generate_learning_plan] Error: {e}")
        return {
            "topics": []
        }

