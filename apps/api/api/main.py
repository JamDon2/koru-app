from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# --- CORS Configuration ---
origins = [
    "http://localhost:3000",  # Next.js default dev port
    "http://localhost:8081",  # Expo web default dev port
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def read_root():
    # This endpoint is less relevant when running via Uvicorn directly on main:app
    return {"message": "Hello from FastAPI Backend (root of app object)!"}


@app.get("/hello")
async def read_api_hello():
    return {"message": "API says: Hello World, from Python!"}
