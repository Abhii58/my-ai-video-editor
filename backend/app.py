from flask import request, jsonify
from backend import app
from backend.transcribe import transcribe_audio
from backend.tagger import tag_images
from backend.image_tagger import tag_single_image
from backend.db import db
import os

@app.route('/upload', methods=['POST'])
def upload_media():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    if file:
        file_path = os.path.join('uploads', file.filename)
        file.save(file_path)

        # Check file type and process accordingly
        if file.filename.lower().endswith(('.mp4', '.avi', '.mov')):
            # Transcribe audio and tag images
            transcription = transcribe_audio(file_path)
            tags = tag_images(file_path)
            video_metadata = {
                "filename": file.filename,
                "transcription": transcription,
                "tags": tags
            }
            db.videos.insert_one(video_metadata)
            response = {"type": "video", "transcription": transcription, "tags": tags}
        elif file.filename.lower().endswith(('.jpg', '.jpeg', '.png')):
            # Tag single image
            tags = tag_single_image(file_path)
            image_metadata = {
                "filename": file.filename,
                "tags": tags
            }
            db.images.insert_one(image_metadata)
            response = {"type": "image", "tags": tags}
        else:
            return jsonify({"error": "Unsupported file type"}), 400

        return jsonify(response), 200

if __name__ == '__main__':
    app.run(debug=True)
