import React from 'react';

const InsightComponent = ({ insights }) => {
  return (
    <div className="insight-component">
      <h3>Insights:</h3>
      {insights.length > 0 ? (
        <ul>
          {insights.map((insight, index) => (
            <li key={index}>{insight}</li>
          ))}
        </ul>
      ) : (
        <p>Nenhum insight disponível no momento.</p>
      )}
    </div>
  );
};

export default InsightComponent;