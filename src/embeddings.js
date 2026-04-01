const { Configuration, OpenAIApi } = require('openai');
const { connectToMongo } = require('../db/mongo_client');
const { cosineSimilarity } = require('../utils/math');

const configuration = new Configuration({ apiKey: 'your-openai-api-key' });
const openai = new OpenAIApi(configuration);

async function generateEmbeddings(messages) {
  const response = await openai.createEmbedding({
    model: 'text-embedding-ada-002',
    input: messages.map(msg => msg.text),
  });

  return response.data.data.map((embedding, index) => ({
    ...messages[index],
    embedding: embedding.embedding,
  }));
}

async function filterMessagesByTopics(messages, topics) {
  const topicEmbeddings = await openai.createEmbedding({
    model: 'text-embedding-ada-002',
    input: topics,
  });

  const filteredMessages = messages.filter(msg => {
    const similarities = topicEmbeddings.data.data.map(topic => cosineSimilarity(msg.embedding, topic.embedding));
    return Math.max(...similarities) > 0.8; // Threshold for relevance
  });

  return filteredMessages;
}

module.exports = { generateEmbeddings, filterMessagesByTopics };
