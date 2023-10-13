# Cough Detector #

I developed a web-based cough detection app which is available at [https://cough-detector.onrender.com/](https://cough-detector.onrender.com/).

The code for the web app can be found at [https://github.com/AVS1508/cough_detector](https://github.com/AVS1508/cough_detector).

**NOTE:** I have deployed the app on Render under their free plan so if the web dyno spins down after inactivity, it may take up to 5 minutes for the app to spin up due to low CPU resources provisioned.

**Due to the unreliable nature of the spin-up/spin-down mechanism, I have recorded a demonstration video of the app available at [https://youtu.be/JdT60zeE36I](https://youtu.be/JdT60zeE36I)**

## Implementation Details ##

1. The overall app is built using Flask with the main app file being `app.py` which is served on a remote server using the `server.py` file.
2. The learned cough detection models are stored in a `.npz` structure and the best model (regular model with $\lambda = 6$) is fetched from that structure in `predict.py`. The file also contains the necessary code for sparsifying the input features and model weights with threshold $\theta^i < 0.01$, for extracting features using `librosa.feature.melspectrogram` and for making predictions using the prediction function.
3. The app records an audio sample from any available user media device using `static/js/main.js` and then sends it over to an endpoint for the Flask app which then extracts features, applies the model, and returns the prediction. This prediction is then qualitatively presented on the user interface for the user to detect the presence of coughs.
