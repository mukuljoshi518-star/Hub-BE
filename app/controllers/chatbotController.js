const axios = require('axios');
const ChatMessage = require('../models/chatbotModal'); // ensure file name is correct

const chatbotReply = async (req, res) => {
  const { message, userId } = req.body;

  if (!message || !userId) {
    return res.status(400).json({ error: 'Message and userId required' });
  }

  try {
    // 1. Call OpenRouter API
    const completion = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'Qwen/Qwen3-32B', // or gpt-4o, llama3, etc.
        messages: [{ role: 'user', content: message }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const botReply = completion.data.choices[0].message.content;

    // 2. Find or create chat session
    let session = await ChatMessage.findOne({ where: { userId } });

    let conversationHistory = [];

    if (session) {
      try {
        conversationHistory = JSON.parse(session.messages);
      } catch (err) {
        console.error('Failed to parse chat history:', err.message);
        conversationHistory = [];
      }

      conversationHistory.push({ question: message, answer: botReply });

      session.messages = JSON.stringify(conversationHistory);
      await session.save();
      console.log('✅ Chat updated for userId:', userId);
    } else {
      await ChatMessage.create({
        userId,
        messages: JSON.stringify([{ question: message, answer: botReply }]),
      });
      console.log('✅ New chat session created for userId:', userId);
    }

    res.status(200).json({ reply: botReply });
  } catch (err) {
    console.error('Chatbot error:', err?.response?.data || err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Optional: Get session history
const getChatSession = async (req, res) => {
  const { userId } = req.params;
  const session = await ChatMessage.findOne({ where: { userId } });

  if (!session) {
    return res.status(404).json({ message: 'No session found' });
  }

  const messages = JSON.parse(session.messages);
  res.json(messages);
};

module.exports = {
  chatbotReply,
  getChatSession,
};
