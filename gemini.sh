#!/bin/bash
set -e -E

# Usage:
#   ./gemini.sh "Your prompt here"
#
# Requirements:
#   export GEMINI_API_KEY="your_api_key_here"
#
# Example:
#   ./gemini.sh "Write a haiku about coding in the rain"

if [ -z "$1" ]; then
  echo "❌ Error: No prompt provided."
  echo "Usage: ./gemini.sh \"Your prompt here\""
  exit 1
fi

if [ -z "$GEMINI_API_KEY" ]; then
  echo "❌ Error: GEMINI_API_KEY environment variable is not set."
  echo "Run: export GEMINI_API_KEY=your_api_key_here"
  exit 1
fi

PROMPT="$1"
MODEL_ID="gemini-2.5-pro"
GENERATE_CONTENT_API="streamGenerateContent"

cat << EOF > request.json
{
  "contents": [
    {
      "role": "user",
      "parts": [
        { "text": "$PROMPT" }
      ]
    }
  ],
  "generationConfig": {
    "temperature": 0.7,
    "maxOutputTokens": 512
  }
}
EOF

curl -s \
  -X POST \
  -H "Content-Type: application/json" \
  "https://generativelanguage.googleapis.com/v1beta/models/${MODEL_ID}:${GENERATE_CONTENT_API}?key=${GEMINI_API_KEY}" \
  -d @request.json | jq .
