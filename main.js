const fs = require('fs');
const yargs = require('yargs');
const scrapeMessages = require('./src/scraper');
const { generateEmbeddings, filterMessagesByTopics } = require('./src/embeddings');
const summarizeMessages = require('./src/summarizer');
const { connectToMongo } = require('./db/mongo_client');

// Parse CLI arguments
const argv = yargs
  .option('model', {
    alias: 'm',
    type: 'string',
    description: 'Specify which LLM model to use',
    default: 'default'
  })
  .option('debug', {
    alias: 'd',
    type: 'boolean',
    description: 'Run in debug mode (process a smaller set of data)',
    default: false
  })
  .help()
  .argv;

// Load configuration files
const cookies = JSON.parse(fs.readFileSync('./config/cookies.json'));
const channels = JSON.parse(fs.readFileSync('./config/channels.json'));
const topics = JSON.parse(fs.readFileSync('./config/topics.json'));
const llmConfig = JSON.parse(fs.readFileSync('./config/llm_config.json'));

// Resolve LLM model configuration
const selectedModelKey = argv.model === 'default' ? llmConfig.default_model : argv.model;
const selectedModel = llmConfig.models[selectedModelKey];

if (!selectedModel) {
  console.error(`Model "${selectedModelKey}" not found in config.`);
  process.exit(1);
}

(async () => {
  try {
    console.log(`Using LLM model: ${selectedModelKey}`);
    console.log(argv.debug ? "Running in debug mode." : "Running full pipeline.");

    // Step 1: Scrape messages
    const targetChannels = argv.debug ? channels.slice(0, 1) : channels;
    console.log("Starting message scraping...");
    await scrapeMessages(cookies, targetChannels);

    // Step 2: Generate embeddings
    console.log("Generating embeddings...");
    const db = await connectToMongo();
    const rawMessages = await db.collection('messages').find({}).toArray();
    const embeddedMessages = await generateEmbeddings(rawMessages, selectedModel);

    // Step 3: Filter by topics
    console.log("Filtering messages by topics...");
    const relevantMessages = await filterMessagesByTopics(embeddedMessages, topics, selectedModel);

    // Step 4: Summarize messages
    console.log("Summarizing messages...");
    const summary = await summarizeMessages(relevantMessages, selectedModel);

    // Step 5: Output results
    console.log("Daily Summary:\n", summary);

    await db.close();
  } catch (err) {
    console.error("Error in pipeline:", err);
  }
})();
