from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.routing import APIRoute
from pydantic import BaseModel


def custom_generate_unique_id(route: APIRoute) -> str:
    if route.operation_id:
        return route.operation_id

    name_parts = route.name.split("_")
    return name_parts[0] + "".join(part.capitalize() for part in name_parts[1:])


app = FastAPI(
    generate_unique_id_function=custom_generate_unique_id,
)

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


class User(BaseModel):
    name: str
    email: str


class UserResponse(BaseModel):
    message: str


@app.get("/")
async def root():
    # This endpoint is less relevant when running via Uvicorn directly on main:app
    return {"message": "Hello from FastAPI Backend (root of app object)!"}


@app.get("/hello")
async def hello_world():
    return {"message": "API says: Hello World, from Python!"}


@app.post("/users")
async def create_user(user: User) -> UserResponse:
    return UserResponse(message="User created successfully!")
