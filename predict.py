import numpy as np
import librosa as lb

y, sr = lb.load(lb.ex('trumpet'))

class CoughPredictor:
    def __init__(self, best_lambda) -> None:
        self.model = None
        self.best_lambda = best_lambda

    def load_model_and_sparsify(self) -> None:
        optimal_thetas = dict(np.load('./static/data/optimal_thetas.npz'))[str(self.best_lambda)]
        optimal_thetas[np.abs(optimal_thetas) < 0.01] = 0
        self.model = optimal_thetas # (129, 1)

    def process_features_and_sparsify(self, audio_file):
        audio, sample_rate = lb.load(audio_file)
        mel_spectrogram = lb.feature.melspectrogram(y=audio, sr=sample_rate)
        time_averaged_ms = np.mean(mel_spectrogram, axis=1).reshape((1, -1))
        return time_averaged_ms # (1, 128)

    def predict(self, x):
        x_bias_absorbed = np.hstack((x, np.ones((1, 1))))
        prediction = np.sign(np.sum(x_bias_absorbed.T * self.model)) # Shape: ()
        # Converting all predictions on the decision boundary to +1 label
        if prediction == 0:
            return 1
        return int(prediction)