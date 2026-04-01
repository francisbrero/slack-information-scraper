# Slack Summary Agent

## Installation & Running

### Install dependencies

```bash
npm install
```

### Create configuration files

config/cookies.json: Add your Slack session cookies.
config/channels.json: List of channel names or IDs.
config/topics.json: List of key topics for filtering.

### Run the main pipeline

```bash
node main.js
```

- Run the daily pipeline with default settings:

```bash
npm start
```

- Run in debug mode:

```bash
npm run debug
```

- Run with a specific model:

```bash
node main.js --model local_gpt4o
```