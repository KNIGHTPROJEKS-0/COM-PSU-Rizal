// To run this code you need to install the following dependencies:
// npm install @google/genai mime
// npm install -D @types/node

import {
  GoogleGenAI,
} from '@google/genai';

async function main() {
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });
  const tools = [
    { urlContext: {} },
    { codeExecution: {} },
  ];
  const config = {
    thinkingConfig: {
      thinkingBudget: 32768,
    },
    tools,
  };
  const model = 'gemini-2.5-pro';
  const contents = [
    {
      role: 'user',
      parts: [
        {
          text: `INSERT_INPUT_HERE`,
        },
      ],
    },
  ];

  const response = await ai.models.generateContentStream({
    model,
    config,
    contents,
  });
  let fileIndex = 0;
  for await (const chunk of response) {
    if (!chunk.candidates || !chunk.candidates[0].content || !chunk.candidates[0].content.parts) {
      continue;
    }
    if (chunk.candidates[0].content.parts[0].text) {
      console.log(chunk.candidates[0].content.parts[0].text);
    }
    if (chunk.candidates[0].content.parts[0].executableCode) {
      console.log(chunk.candidates[0].content.parts[0].executableCode);
    }
    if (chunk.candidates[0].content.parts[0].codeExecutionResult) {
      console.log(chunk.candidates[0].content.parts[0].codeExecutionResult);
    }
  }
}

main();
