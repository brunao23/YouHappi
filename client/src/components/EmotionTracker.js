import React from 'react';

const EmotionTracker = ({ emotion }) => {
  return (
    <div className="emotion-tracker">
      <h3>Seu estado emocional atual:</h3>
      <p>{emotion || "Não detectado"}</p>
    </div>
  );
};

export default EmotionTracker;