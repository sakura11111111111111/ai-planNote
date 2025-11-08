import axios from 'axios';

/**
 * Fetch AI-generated summary from OpenAI API
 * @param {string} content - The note content to summarize
 * @returns {Promise<string>} The AI-generated summary
 */
export async function fetchSummaryFromAI(content) {
  // Get API key from localStorage
  const apiKey = localStorage.getItem('openaiApiKey');
  
  if (!apiKey) {
    throw new Error('OpenAI API key not found. Please set it in settings.');
  }

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: '你是一个专业的笔记总结助手。'
          },
          {
            role: 'user',
            content: `请将以下笔记内容总结成3-5个简洁的要点，用于快速复习。要求语言精炼，保留核心概念，直接返回总结内容，不要有多余的解释。\n\n${content}`
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        }
      }
    );

    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error('AI API Error:', error);
    if (error.response) {
      throw new Error(`AI API error: ${error.response.data.error?.message || error.response.statusText}`);
    }
    throw new Error('Failed to connect to AI service');
  }
}
