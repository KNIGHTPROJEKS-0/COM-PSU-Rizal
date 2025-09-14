from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, EmailStr
from typing import List, Optional
import uvicorn
from starlette.middleware.cors import CORSMiddleware

app = FastAPI(
    title="COM-PSU-Rizal API",
    description="Backend API for COM-PSU-Rizal application",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3001", "http://localhost:3002"],  # Next.js and Electron ports
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class User(BaseModel):
    id: Optional[int] = None
    email: EmailStr
    name: str
    role: str = "student"

class UserCreate(BaseModel):
    email: EmailStr
    name: str
    password: str

class UserResponse(BaseModel):
    id: int
    email: EmailStr
    name: str
    role: str

# In-memory storage (replace with database in production)
users_db = []
user_id_counter = 1

@app.get("/")
async def root():
    return {"message": "COM-PSU-Rizal API", "status": "running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.post("/users", response_model=UserResponse)
async def create_user(user: UserCreate):
    global user_id_counter

    # Check if user already exists
    for existing_user in users_db:
        if existing_user["email"] == user.email:
            raise HTTPException(status_code=400, detail="User already exists")

    new_user = {
        "id": user_id_counter,
        "email": user.email,
        "name": user.name,
        "role": "student"
    }

    users_db.append(new_user)
    user_id_counter += 1

    return UserResponse(**new_user)

@app.get("/users", response_model=List[UserResponse])
async def get_users():
    return [UserResponse(**user) for user in users_db]

@app.get("/users/{user_id}", response_model=UserResponse)
async def get_user(user_id: int):
    for user in users_db:
        if user["id"] == user_id:
            return UserResponse(**user)
    raise HTTPException(status_code=404, detail="User not found")

@app.put("/users/{user_id}", response_model=UserResponse)
async def update_user(user_id: int, user_update: User):
    for i, user in enumerate(users_db):
        if user["id"] == user_id:
            updated_user = {**user, **user_update.dict(exclude_unset=True)}
            users_db[i] = updated_user
            return UserResponse(**updated_user)
    raise HTTPException(status_code=404, detail="User not found")

@app.delete("/users/{user_id}")
async def delete_user(user_id: int):
    for i, user in enumerate(users_db):
        if user["id"] == user_id:
            deleted_user = users_db.pop(i)
            return {"message": "User deleted", "user": UserResponse(**deleted_user)}
    raise HTTPException(status_code=404, detail="User not found")

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )