from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def root():
    return {"message": "Safe Me backend is ready!"}