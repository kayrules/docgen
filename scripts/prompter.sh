#!/bin/bash

# Prompter Script - Non-interactive Claude Code Execution
# Usage: ./prompter.sh "project-slug" "folder/path" "topic-name"

set -e

# Function to generate slug from title
generate_slug() {
    local title="$1"
    # Convert to lowercase, replace spaces with hyphens, remove special characters
    echo "$title" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g' | sed 's/--*/-/g' | sed 's/^-//' | sed 's/-$//'
}

# Check arguments
if [ $# -lt 3 ]; then
    echo "Usage: $0 \"project-slug\" \"folder/path\" \"topic-name\""
    echo ""
    echo "Examples:"
    echo "  $0 my-project . \"API Documentation\""
    echo "  $0 my-project api/endpoints \"REST API Guide\""
    echo "  $0 my-project getting-started \"Installation Guide\""
    exit 1
fi

PROJECT_SLUG="$1"
FOLDER_PATH="$2"
TOPIC_NAME="$3"


# Get project directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$SCRIPT_DIR/../projects/$PROJECT_SLUG"
source "$SCRIPT_DIR/../.env"

API_KEY="$ANTHROPIC_KEY"
API_URL="$ANTHROPIC_URL"

# Check if API key is set
if [ -z "$API_KEY" ]; then
    echo "Error: ANTHROPIC_KEY is not set in .env file"
    exit 1
fi

# Check if API URL is set
if [ -z "$API_URL" ]; then
    echo "Error: ANTHROPIC_URL is not set in .env file"
    exit 1
fi


# Check if project exists
if [ ! -d "$PROJECT_ROOT" ]; then
    echo "Error: Project '$PROJECT_SLUG' not found at $PROJECT_ROOT"
    exit 1
fi

REPOSITORY_DIR="$PROJECT_ROOT/repository"
DOCS_DIR="$PROJECT_ROOT/docs"

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
PROMPT="Write comprehensive documentation for: $TOPIC_NAME

Please create a markdown document that covers:
1. Overview and introduction
2. Key concepts and terminology
3. Step-by-step instructions or usage examples
4. Best practices and common pitfalls
5. Related resources or references

Make the documentation clear, well-structured, and suitable for this project's documentation.

Use markdown formatting with appropriate headers, code blocks, and lists."

# Execute claude code non-interactively
echo "Running Claude Code for project: $PROJECT_SLUG"
echo "Folder: $FOLDER_PATH"
echo "Topic: $TOPIC_NAME"
echo "Output file: $OUTPUT_FILE"
echo ""

cd "$REPOSITORY_DIR"
# ANTHROPIC_AUTH_TOKEN="$API_KEY" ANTHROPIC_BASE_URL="$API_URL" claude --dangerously-skip-permissions -p -c "$PROMPT" > "$FULL_PATH/$OUTPUT_FILE"
claude --dangerously-skip-permissions -p -c "$PROMPT" 

echo "Documentation generated successfully!"
echo "Location: $FULL_PATH/$OUTPUT_FILE"
echo "You can now review and edit the generated documentation."

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