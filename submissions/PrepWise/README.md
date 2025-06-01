## 📚 PrepWise: Personalized AI Exam Assistant

PrepWise is your AI-powered study companion built for students preparing for competitive exams like **NEET**, **JEE**, **UPSC**, and more. It generates personalized learning plans, explains topics, answers doubts in real time, and creates quizzes — all powered by **Agno**, **Mem0**, and **Groq**.

> 🌟 Made for the [Global Agent Hackathon – May 2025](https://github.com/agnoworks/global-agent-hackathon)

---

## 🔥 Key Features

* **📖 Personalized Study Plans** based on exam, subjects, and daily study time
* **🧠 Topic-wise Explanations** with memory-driven chat support
* **💬 Ask Doubts Freely** with context-aware answers using Groq
* **🧪 Quiz Generation** with 10–20 MCQs in valid JSON format
* **📝 Agent Memory** powered by Mem0 to track progress and goals
* **📱 Mobile & Web Support** via React Native + Expo

---

## 🛠 Tech Stack

| Layer      | Technology                         |
| ---------- | ---------------------------------- |
| Frontend   | React Native (Expo), Redux Toolkit |
| Backend    | FastAPI                            |
| AI Agent   | Agno, Groq, OpenAIChat             |
| Tools      | Firecrawl, Exa, ReasoningTools     |
| Memory     | Mem0                               |
| Deployment | Node.js, Python, MongoDB           |

---

## 📦 Monorepo Structure

```
prepwise/
├── frontend/
│   ├── app/
│   │   ├── (tabs)/
│   │   │   ├── _layout.tsx
│   │   │   ├── index.tsx
│   │   │   ├── profile.tsx
│   │   │   ├── quiz.tsx
│   │   ├── _layout.tsx
│   │   ├── +not-found.tsx
│   │   ├── setup.tsx
│   │   ├── welcome.tsx
│   ├── components/
│   │   ├── QuizCard.tsx
│   │   ├── ThemedText.tsx
│   │   ├── ThemedView.tsx
│   │   ├── TopicCard.tsx
│   ├── hooks/
│   │   ├── hooks.ts
│   │   ├── useColorScheme.ts
│   │   ├── useColorScheme.web.ts
│   │   ├── useThemeColor.ts
│   ├── store/
│   │   ├── slices/
│   │   │   ├── learningPlanSlice.ts
│   │   │   ├── userSlice.ts
│   │   ├── store.ts
│   ├── utils/
│   │   ├── api.ts
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py
│   │   ├── __pycache__/
│   │   │   ├── main.cpython-313.pyc
│   │   ├── agent/
│   │   │   ├── __init__.py
│   │   │   ├── exam_agent.py
│   │   │   ├── profile_setup.py
│   │   │   ├── quiz_agent.py
│   │   │   ├── __pycache__/
│   │   │   │   ├── __init__.cpython-313.pyc
│   │   │   │   ├── exam_agent.cpython-313.pyc
│   │   ├── core/
│   │   │   ├── __init__.py
│   │   │   ├── config.py
│   │   ├── routes/
│   │   │   ├── __init__.py
│   │   │   ├── agent_routes.py
│   │   │   ├── __pycache__/
│   │   │   │   ├── __init__.cpython-313.pyc
│   │   │   │   ├── agent_routes.cpython-313.pyc
│   │   ├── utils/
│   │   │   ├── __init__.py
│   │   │   ├── logger.py
```

---

## ⚙️ Setup

### Frontend (Expo React Native)

```bash
cd frontend
npm install
npm run start
```

### Backend (FastAPI)

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

---

## 🧠 How It Works

### 1. Onboarding

* User profile saved in memory via `profile_setup.py`

### 2. Learning Plan

* `exam_agent.py` + `generate_learning_plan()` use memory to create subject-wise roadmap

### 3. Topic Explanation & Chat

* Explanations stored in Redux
* Chat allows doubt resolution using Groq

### 4. Quiz Generator

* `quiz_agent.py` fetches memory, generates valid JSON quiz
* Supports 10-20 MCQs with answers and explanations

---

## 📺 Demo Video

🎥 [https://youtu.be/YOUR\_VIDEO\_LINK](https://youtu.be/YOUR_VIDEO_LINK) *(Replace with your link)*

---

## 👤 Team

**GitHub:** [@finney_solomon[](https://github.com/finney_solomon)](https://github.com/Finney-Solomon)

**Role:** Full Stack Engineer — Specialized in building full-stack mobile and web applications using React Native, MERN stack, Python (FastAPI), and AI agent frameworks like Agno. Skilled in creating end-to-end experiences from UI to intelligent backend agents.

---


---

## 📌 Notes

* Modular agent setup for learning plan, quiz, and profile
* Valid JSON responses for quiz and plan ensure robustness
* Built with future expandability (Socket.IO, voice input, etc.)

---

## ⭐️ Like it?

Star the repo and share with `#GlobalAgentHackathon`

---

PrepWise © 2025 — Made with ❤️ using Agno, Groq & Mem0
