#!/bin/bash

# doc-generator Script - Non-interactive Claude Code Execution
# Usage: ./doc-generator.sh "project-slug" "folder/path" "topic-name" "custom prompt"

set -e

# Function to generate slug from title
generate_slug() {
    local title="$1"
    # Convert to lowercase, replace spaces with hyphens, remove special characters
    echo "$title" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g' | sed 's/--*/-/g' | sed 's/^-//' | sed 's/-$//'
}

# Check arguments
if [ $# -lt 3 ]; then
    echo "Usage: $0 \"project-slug\" \"folder/path\" \"topic-name\" [\"custom-prompt\"]"
    echo ""
    echo "Examples:"
    echo "  $0 my-project . \"API Documentation\""
    echo "  $0 my-project api/endpoints \"REST API Guide\""
    echo "  $0 my-project getting-started \"Installation Guide\" \"Write a guide on how to install this.\""
    exit 1
fi


PROJECT_SLUG="$1"
FOLDER_PATH="$2"
TOPIC_NAME="$3"
CUSTOM_PROMPT="$4"

# Get project directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
source "$SCRIPT_DIR/../.env"

# Check if API key is set
if [ -z "$ANTHROPIC_KEY" ]; then
    echo "Error: ANTHROPIC_KEY is not set in .env file"
    exit 1
fi

# Check if API URL is set
if [ -z "$ANTHROPIC_URL" ]; then
    echo "Error: ANTHROPIC_URL is not set in .env file"
    exit 1
fi

REPO_DIR="$SCRIPT_DIR/../repositories/$PROJECT_SLUG"
DOCS_DIR="$SCRIPT_DIR/../documentations/$PROJECT_SLUG"

# Check if repo dir exists
if [ ! -d "$REPO_DIR" ]; then
    echo "Error: '$REPO_DIR' not found"
    exit 1
fi

# Check if docs dir exists
if [ ! -d "$DOCS_DIR" ]; then
    echo "Error: '$DOCS_DIR' not found"
    exit 1
fi

# Generate slug for topic file
TOPIC_SLUG=$(generate_slug "$TOPIC_NAME")
OUTPUT_FILE="$TOPIC_SLUG.md"

# Build full folder path
if [[ "$FOLDER_PATH" == "." ]]; then
    FULL_PATH="$DOCS_DIR"
else
    FULL_PATH="$DOCS_DIR/$FOLDER_PATH"
fi

# Check if folder exists
if [ ! -d "$FULL_PATH" ]; then
    echo "Error: Folder '$FOLDER_PATH' not found at $FULL_PATH"
    echo "Use create-folder.sh to create the folder first"
    exit 1
fi

# Check if claude is available
if ! command -v claude &> /dev/null; then
    echo "Error: claude command not found. Please install Claude Code first."
    exit 1
fi

# Generate the prompt
if [ -n "$CUSTOM_PROMPT" ]; then
    CUSTOM_PROMPT="
**IMPORTANT INSTRUCTION:**
$CUSTOM_PROMPT"
fi


PROMPT="Your task is to generate comprehensive technical documentation for the topic: $TOPIC_NAME.

The documentation must be based *only* on the information available within the provided repository files.

**IMPORTANT CONSTRAINTS:**
- You MUST NOT run any build steps, install dependencies, or execute any code from the repository.
- You MUST NOT modify or delete any files other than creating the single output file specified.
- Your ONLY action should be to write the documentation content to the specified file.

First, analyze the repository content to create a plan for the document's structure.

After planning, write the full documentation in Markdown format. Explain concepts in detail, assuming the reader is a junior developer.

$CUSTOM_PROMPT.

Finally, save the completed documentation to the single file: 
- Filename: $OUTPUT_FILE
- Absolute Path: $REPO_DIR/$OUTPUT_FILE
"

# Execute gemini non-interactively
echo "Running DocGen for project: $PROJECT_SLUG"
echo "Topic: $TOPIC_NAME"
echo "Output file: $FULL_PATH/$OUTPUT_FILE"
echo ""

cd "$REPO_DIR"

if [ "$USE_KIMI" = "true" ] && [ -n "$ANTHROPIC_KEY" ] && [ -n "$ANTHROPIC_URL" ]; then 
    ANTHROPIC_AUTH_TOKEN=$ANTHROPIC_KEY ANTHROPIC_BASE_URL=$ANTHROPIC_URL claude --dangerously-skip-permissions -c "$PROMPT"
else
    claude --dangerously-skip-permissions -c "$PROMPT"
fi

# Try with continue flag first, fallback if no conversation found
# echo "Attempting to continue previous conversation..."
# OUTPUT=$(ANTHROPIC_AUTH_TOKEN=$ANTHROPIC_KEY ANTHROPIC_BASE_URL=$ANTHROPIC_URL claude --dangerously-skip-permissions -c "$PROMPT" 2>&1) || {
#     if echo "$OUTPUT" | grep -q "No conversation found to continue"; then
#         echo "No previous conversation found. Starting new conversation..."
#         ANTHROPIC_AUTH_TOKEN=$ANTHROPIC_KEY ANTHROPIC_BASE_URL=$ANTHROPIC_URL claude --dangerously-skip-permissions "$PROMPT"
#         # ANTHROPIC_AUTH_TOKEN=$ANTHROPIC_KEY ANTHROPIC_BASE_URL=$ANTHROPIC_URL claude --dangerously-skip-permissions "$PROMPT"
#     else
#         echo "Error: $OUTPUT"
#         exit 1
#     fi
# }

# Move the generated file to the final destination
mv "$OUTPUT_FILE" "$FULL_PATH/$OUTPUT_FILE"

# Update the folder's info.json to add this topic to contents array
if [ -f "$FULL_PATH/info.json" ]; then
    # Create temporary file for updated JSON
    TEMP_JSON=$(mktemp)
    
    # Use jq to add the topic to contents array (if jq is available)
    if command -v jq &> /dev/null; then
        jq --arg topic "$TOPIC_NAME" '.contents += [$topic]' "$FULL_PATH/info.json" > "$TEMP_JSON" 2>/dev/null || {
            # Fallback if jq fails
            cp "$FULL_PATH/info.json" "$TEMP_JSON"
        }
    else
        # Fallback without jq
        cp "$FULL_PATH/info.json" "$TEMP_JSON"
    fi
    
    mv "$TEMP_JSON" "$FULL_PATH/info.json"
fi

echo "----"
echo "Documentation generated successfully!"
echo "Location: $FULL_PATH/$OUTPUT_FILE"