const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({ apiKey: 'your-openai-api-key' });
const openai = new OpenAIApi(configuration);

async function summarizeMessages(messages) {
  const response = await openai.createChatCompletion({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: 'Summarize the following Slack messages into a concise report:' },
      { role: 'user', content: messages.map(msg => msg.text).join('\n') },
    ],
  });

  return response.data.choices[0].message.content;
}

module.exports = summarizeMessages;
