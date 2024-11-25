from pymongo import MongoClient
from backend.config import MONGODB_URI

client = MongoClient(MONGODB_URI)
db = client.video_editing_db
