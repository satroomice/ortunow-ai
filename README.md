# OrtuNow AI

OrtuNow AI (Parenting Companion AI) is a chatbot that provides parenting advice and guidance for new parents. It is powered by the Gemini AI API.

## Who is the target user of your chatbot?

New parents and parents with children from infancy to adolescence who need everyday parenting assistance and guidance.

## How can your chatbot help users?

The chatbot helps provide parenting advice appropriate to the child’s age, solutions to common issues (tantrums, eating, sleeping), and calm, easy-to-understand support and explanations to help parents raise their children.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in the project root with your Gemini API key:

```bash
GEMINI_API_KEY=your_api_key_here
```

## Run

```bash
node index.js
```

Then open `http://localhost:3000` in your browser.

## Project Structure

- `index.js` - Express server and Gemini AI request handler
- `public/index.html` - chat UI markup
- `public/style.css` - chat UI styling
- `public/script.js` - frontend chat behavior and markdown formatting

## Notes

- The app is configured to use the Gemini model `gemini-2.5-flash`.
- Long AI responses may be limited by the model's token limit.
- If you want to customize the chat behavior, update the `systemInstruction` in `index.js`.

## Troubleshooting

- If the app does not start, make sure `.env` exists and `GEMINI_API_KEY` is set.
- If the chat returns an empty response, restart the server and verify your API key is valid.
- If the UI looks too wide or scrolls horizontally, refresh the browser and check `public/style.css` for custom overrides.
- For CORS or network issues, ensure `node index.js` is running and open `http://localhost:3000`.

## Deployment

This project is designed for local development. To deploy it:

1. Host it on a server with Node.js installed.
2. Install dependencies with `npm install`.
3. Set the `GEMINI_API_KEY` environment variable on the host machine.
4. Start the app with `node index.js` or a process manager such as `pm2`.

Example `pm2` deploy command:

```bash
pm install -g pm2
pm install
pm start
pm2 start index.js --name ortunow-ai
```

> Note: Keep your API key secret and do not commit `.env` to source control.
