import React from 'react';

const AvatarComponent = ({ response }) => {
  // Aqui você integraria com a API da HeyGen para renderizar o avatar
  // Por enquanto, vamos usar um placeholder

  return (
    <div className="avatar-component">
      <div className="avatar-placeholder">
        {/* Placeholder para o avatar */}
        <img src="/avatar-placeholder.png" alt="AI Avatar" />
      </div>
      <div className="avatar-response">
        <p>{response || "Olá! Como posso ajudar você hoje?"}</p>
      </div>
    </div>
  );
};

export default AvatarComponent;