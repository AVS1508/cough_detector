let recordingStatus = document.getElementById('recording-status');
let recordingButton = document.getElementById('toggle-record');

if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    console.log("SUCCESS: getUserMedia supported.");
    navigator.mediaDevices.getUserMedia({ audio: true })
    .then(function (stream) {
        const mediaRecorder = new MediaRecorder(stream);
        let chunks = [];
        recordingButton.onclick = () => {
            if (mediaRecorder.state === 'inactive') {
                recordingButton.innerHTML = `<i class="fa-solid fa-stop"></i>`;
                mediaRecorder.start();
                recordingStatus.innerHTML = 'Recording...';
            } else {
                recordingButton.innerHTML = `<i class="fa-solid fa-play"></i>`;
                mediaRecorder.stop();
                recordingStatus.innerHTML = 'Recording stopped. Processing audio...';
            }
        };
        mediaRecorder.ondataavailable = (e) => {
            chunks.push(e.data);
        };
        mediaRecorder.onstop = (e) => {
            const audioBlob = new Blob(chunks, { 'type': 'audio/wav' });
            chunks = [];
            sendAudio(audioBlob);
            audioURL = URL.createObjectURL(audioBlob);
            audio = new Audio(audioURL);
            audio.play();
        };
    })
    .catch(function (err) {
        console.error("ERROR: The following getUserMedia error occurred: " + err);
    });
} else {
    console.error("ERROR: getUserMedia not supported on your browser!");
}

function sendAudio(audioBlob) {
    let formData = new FormData();
    formData.append('file', audioBlob, 'file');
    fetch('/predict', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(response => {
        console.log(response);
        if (parseInt(response.prediction) !== 0) {
            recordingStatus.innerHTML = response.prediction === 1 ? 'Cough detected!' : 'Cough not detected!';
        } else {
            recordingStatus.innerHTML = 'Prediction failed.';
        }
    })
    .catch(error => {console.error('ERROR: ', error);});
}