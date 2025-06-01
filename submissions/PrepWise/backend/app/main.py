from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import agent_routes

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(agent_routes.router, prefix="/agent")

@app.get("/")
def root():
    return {"status": "AI Exam Agent backend is live"}

