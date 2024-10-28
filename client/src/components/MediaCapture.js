import React, { useRef, useState, useEffect } from 'react';

const MediaCapture = ({ onEmotionDetected }) => {
  const videoRef = useRef(null);
  const [isCapturing, setIsCapturing] = useState(false);

  useEffect(() => {
    let stream = null;

    const startCapture = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setIsCapturing(true);
        // Aqui você pode adicionar lógica para detectar emoções
        // Por exemplo, usando uma biblioteca de reconhecimento facial
        // e chamando onEmotionDetected com a emoção detectada
      } catch (err) {
        console.error("Erro ao acessar mídia: ", err);
      }
    };

    startCapture();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [onEmotionDetected]);

  return (
    <div className="media-capture">
      <video ref={videoRef} autoPlay muted />
      {isCapturing ? (
        <p>Capturando vídeo e áudio...</p>
      ) : (
        <p>Iniciando captura...</p>
      )}
    </div>
  );
};

export default MediaCapture;