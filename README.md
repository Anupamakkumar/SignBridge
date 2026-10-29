# SignBridge — Accessible Communication Toolkit

SignBridge is a responsive Flask web application prototype designed to make everyday communication easier for deaf and hard-of-hearing users. It includes browser-based live speech captions, typed replies, text-to-speech, quick phrase cards, and an accessible interface.

## Features
- Live speech-to-text captions using the browser Web Speech Recognition API (where supported).
- Type a response and display it in large text.
- Text-to-speech using the browser's installed speech voices.
- Quick phrases for everyday, hospital, travel, college, and emergency contexts.
- English (India), Malayalam, English (US), Hindi, and Tamil language selections. Actual support and voice availability depend on the browser/device.
- High-contrast toggle, responsive layout, keyboard focus indicators, and skip link.
- No user accounts and no server-side conversation storage.
- Health endpoint at `/health`.

## Requirements
- Python 3.10 or newer recommended.
- Google Chrome or another browser supporting the relevant Web Speech APIs for live captions.
- Internet may be required by browser speech recognition. Browser providers may process speech externally; check your browser's privacy settings.
- Text-to-speech uses voices available on the device/browser.

## Run on Windows
1. Extract the ZIP file.
2. Open the extracted `SignBridge` folder in VS Code.
3. Open Terminal in that folder.
4. Create a virtual environment (recommended):
   ```powershell
   py -m venv .venv
   .\.venv\Scripts\Activate.ps1
   ```
   If PowerShell blocks activation, you can use Command Prompt and run:
   ```bat
   .venv\Scripts\activate.bat
   ```
5. Install dependencies:
   ```powershell
   python -m pip install -r requirements.txt
   ```
6. Start the app:
   ```powershell
   python app.py
   ```
7. Open `http://127.0.0.1:5000` in your browser.
8. For live captions, click **Start listening** and allow microphone access when prompted.

## Run on macOS/Linux
```bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
python app.py
```
Then open `http://127.0.0.1:5000`.

## Troubleshooting
- **Microphone denied:** Allow microphone access for the browser/site and check OS microphone permissions.
- **Live captions unavailable:** Try an up-to-date desktop Google Chrome. The browser Web Speech Recognition API is not supported in every browser.
- **No Malayalam voice:** Your device may not have a Malayalam text-to-speech voice installed. Install a supported voice or choose another language.
- **No speech detected:** Move closer to the speaker, reduce background noise, and select the correct language.
- **Port 5000 in use:** Stop the other process using that port, or change the port at the bottom of `app.py`.

## Important scope and safety notes
- This version does **not** recognize or translate sign language from camera input.
- It does not call emergency services, send location, or provide an interpreter.
- Do not rely on automated captions alone for medical, legal, or other high-stakes communication.
- Browser speech recognition may process audio using the browser provider's service. Conversations are not written to this application's database or sent to a SignBridge backend.
- This is a functional prototype, not a certified assistive technology product. Test with intended users and accessibility tools before real-world deployment.

## Project structure
```text
SignBridge/
├── app.py
├── requirements.txt
├── README.md
├── templates/
│   └── index.html
└── static/
    ├── app.js
    └── style.css
```
