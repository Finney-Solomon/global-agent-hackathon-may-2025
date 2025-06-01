from fastapi import APIRouter, Request
from app.agent.exam_agent import build_exam_agent,client,generate_learning_plan
from app.agent.quiz_agent import build_quiz_agent, generate_quiz_prompt, client
from app.agent.profile_setup import save_user_profile
import json

router = APIRouter()
# agent = build_exam_agent(session_id)



@router.post("/setup")
async def setup_user_profile(req: Request):
    data = await req.json()
    session_id = data.get("session_id", "default")

    try:
        msg = save_user_profile(data, session_id)
        return {"message": msg}
    except Exception as e:
        return {"error": str(e)}


@router.post("/ask")
async def ask_exam_agent(req: Request):
    data = await req.json()
    message = data.get("message")
    session_id = data.get("session_id")
    print(message,data,"messagemessagemessage")
    # session_id = data.get("session_id")
  
    if not message or not session_id:
        return {"error": "Both 'message' and 'session_id' are required"}

    # Build agent with existing memory context
    agent = build_exam_agent(session_id=session_id)

    # Run the agent
    result =  agent.run(message)

    # ✅ Save user message and all assistant messages to memory
    mem_messages = [{"role": m.role, "content": str(m.content)} for m in (result.messages or [])]
    try:
        client.add(
            messages=mem_messages,
            user_id=session_id,
            agent_id="exam-agent-v1"
        )
    except Exception as e:
        print(f"[Mem0] Memory save failed: {e}")

    return {"reply": result.content}


@router.post("/quiz")
async def ask_for_quiz(req: Request):
    data = await req.json()
    topic = data.get("message")
    session_id = data.get("session_id") or "quiz-default"

    if not topic:
        return {"error": "Topic is required"}

    # Load memory for personalized prompt
    memory_data = client.get_all(user_id=session_id)

    prompt = generate_quiz_prompt(topic, memory_data)
    agent = build_quiz_agent(session_id)

    result = agent.run(prompt)

    try:
        quiz_data = json.loads(result.content)  # ✅ Correctly parse the response
        return quiz_data
    except json.JSONDecodeError as e:
        print("[QuizParseError]", e)
        return {
            "error": "Quiz generation failed or response was not valid JSON.",
            "raw_output": result.content  # optional: for debugging
        }


@router.get("/plan")
async def get_learning_plan(session_id: str):
    return await generate_learning_plan(session_id)
