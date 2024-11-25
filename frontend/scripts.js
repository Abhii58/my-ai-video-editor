document.getElementById('uploadForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const mediaUpload = document.getElementById('mediaUpload').files[0];
    const transcriptionDiv = document.getElementById('transcription');
    const tagsDiv = document.getElementById('tags');

    // Clear previous results
    transcriptionDiv.innerText = '';
    tagsDiv.innerText = '';

    if (mediaUpload) {
        // File type validation
        const validFileTypes = ['video/mp4', 'video/avi', 'video/mov', 'image/jpeg', 'image/png'];
        if (!validFileTypes.includes(mediaUpload.type)) {
            alert('Invalid file type. Please upload a video or image file.');
            return;
        }

        const formData = new FormData();
        formData.append('file', mediaUpload);

        // Show loading indicator
        transcriptionDiv.innerText = 'Processing...';
        tagsDiv.innerText = '';

        fetch('/upload', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to upload the file');
            }
            return response.json();
        })
        .then(data => {
            // Display results
            if (data.type === 'video') {
                transcriptionDiv.innerText = `Transcription: ${data.transcription}`;
            } else if (data.type === 'image') {
                transcriptionDiv.innerText = '';
            }
            tagsDiv.innerText = `Tags: ${data.tags.join(', ')}`;
        })
        .catch(error => {
            console.error('Error:', error);
            transcriptionDiv.innerText = 'An error occurred. Please try again.';
        });
    } else {
        alert('Please upload a video or image file.');
    }
});
