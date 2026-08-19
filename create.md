# Task Specification: WhatsApp-Style Voice Message in Chat Typing Bar

## 1. Overview
Upgrade the messaging experience by removing the "Voice Note" option from the attachment clip popover and integrating a dedicated, interactive **Voice Recording Button** directly into the right corner of the chat typing bar. The user can press and hold (or tap) to record, view a live waveform and recording timer, review the audio preview before sending, and either send the voice note or cancel/delete it.

---

## 2. Detailed Task Breakdown

### Task 1: Clean Up Attachment Popover
- [x] Remove the `<button onClick={startVoiceRecord}><Mic /> Voice Note</button>` from the Paperclip attachment menu in `src/app/platform/messages/page.tsx`.
- [x] Retain camera, location, image, video, and document attachments in the popover.

---

### Task 2: Dynamic Right-Action Switcher (Mic vs. Send)
- [x] In `src/app/platform/messages/page.tsx`:
  - When `newMessage.trim() === ""` and no audio preview is active:
    - Display the **Mic Recording Button** in the right corner of the typing bar.
  - When `newMessage.trim() !== ""`:
    - Display the **Send Button** (`Send` icon).

---

### Task 3: Hold-to-Record & Tap-to-Record Engine
- [x] Implement `MediaRecorder` audio capture (`audio/webm` or `audio/mp4`).
- [x] Attach pointer/touch event handlers:
  - `onPointerDown` / `onTouchStart`: Request microphone permissions, start recording, trigger haptic vibration (`navigator.vibrate(40)`), and start recording timer.
  - `onPointerUp` / `onTouchEnd`: Stop recording, compile chunks into an audio Blob, generate preview URL, and transition into Preview Mode.
- [x] If recording duration is less than 0.5s (accidental tap), provide intuitive tap-to-record toggle so users can also tap once to record and tap stop.

---

### Task 4: Live Recording State UI
- [x] When `isRecording === true`:
  - Replace the text input with a live recording indicator:
    - Glowing red pulsing recording dot (`animate-ping` / `animate-pulse`).
    - Real-time timer (`0:01`, `0:02`, ...).
    - Animated soundwave bars (`animate-bounce` with staggered heights).
    - Slide-to-cancel or direct tap-to-cancel icon (`Trash2`).

---

### Task 5: Voice Note Preview & Review Bar
- [x] When recording stops and an `audioBlob` exists (`audioPreviewUrl`):
  - Replace the typing bar with a **Voice Note Preview Player**:
    - **Play / Pause Button**: Playback the recorded voice note with HTML5 Audio element.
    - **Live Audio Progress Bar**: Dynamic scrub/playback bar showing current time / total duration.
    - **Delete / Cancel Button (`Trash2`)**: Discards the recorded audio blob, revokes URL, and resets back to standard text input.
    - **Send Voice Note Button (`Send`)**: Uploads the audio blob to Supabase Storage (`resources` or `message-attachments`), sends message with `media_type: 'audio'`, and renders in chat history.

---

### Task 6: Custom Chat Message Audio Bubble Player
- [x] In `src/components/chat/MessageBubble.tsx`:
  - Enhance the voice message bubble with a custom WhatsApp-style player:
    - Play/Pause toggle button.
    - Soundwave bar visualization.
    - Duration timer and playback progress.
    - Delivery/Read status double ticks.

---

### Task 7: Verification & Build
- [x] Verify complete end-to-end functionality (record -> preview -> listen -> cancel OR send).
- [x] Run full Next.js production build (`npm run build`).
- [x] Commit and deploy to GitHub `main`.
