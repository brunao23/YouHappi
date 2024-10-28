const axios = require('axios');

const HEYGEN_API_KEY = process.env.HEYGEN_API_KEY;
const HEYGEN_API_URL = 'https://api.heygen.com';

const heygenService = {
  generateResponse: async (message) => {
    try {
      const response = await axios.post(`${HEYGEN_API_URL}/generate`, 
        { message },
        {
          headers: {
            'Authorization': `Bearer ${HEYGEN_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data.response;
    } catch (error) {
      console.error('Error generating response:', error);
      throw error;
    }
  },

  generateInsights: async (message, emotion) => {
    try {
      const response = await axios.post(`${HEYGEN_API_URL}/insights`, 
        { message, emotion },
        {
          headers: {
            'Authorization': `Bearer ${HEYGEN_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data.insights;
    } catch (error) {
      console.error('Error generating insights:', error);
      throw error;
    }
  }
};

module.exports = heygenService;