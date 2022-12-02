import { useEffect, useState } from 'react';

export const useRecorder = () => {
  const [audioURL, setAudioURL] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recorder, setRecorder] = useState<any>(null);
  const [audioData, setAudioData] = useState<any>();
  useEffect(() => {
    // Lazily obtain recorder first time we're recording.
    if (recorder === null) {
      if (isRecording) {
        requestRecorder().then(setRecorder, console.error);
      }
      return;
    }

    // Manage recorder state.
    if (isRecording) {
      recorder.start();
    } else {
      recorder.stop();
    }

    // Obtain the audio when ready.
    const handleData = (e: any) => {
      setAudioData(e.data);
      setAudioURL(URL.createObjectURL(e.data));
    };

    recorder.addEventListener('dataavailable', handleData);
    return () => recorder.removeEventListener('dataavailable', handleData);
  }, [recorder, isRecording]);

  const startRecording = () => {
    setIsRecording(true);
  };

  const stopRecording = () => {
    setIsRecording(false);
  };
  return { audioData, audioURL, isRecording, startRecording, stopRecording };
};
async function requestRecorder() {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  return new MediaRecorder(stream);
}
