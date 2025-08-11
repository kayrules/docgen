#!/bin/bash

# Create Folder Script for docs/
# Usage: ./create-folder.sh [parent-folder] "folder-title"
# Use . for root docs folder

set -e

# Function to generate slug from title
generate_slug() {
    local title="$1"
    # Convert to lowercase, replace spaces with hyphens, remove special characters
    echo "$title" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g' | sed 's/--*/-/g' | sed 's/^-//' | sed 's/-$//'
}

# Function to convert slug to title
title_from_slug() {
    local slug="$1"
    # Replace hyphens with spaces, capitalize first letters
    echo "$slug" | sed 's/-/ /g' | awk '{for(i=1;i<=NF;i++){$i=toupper(substr($i,1,1))substr($i,2)}}1'
}


# Check arguments
if [ $# -lt 2 ]; then
    echo "Usage: $0 \"project-slug\" [parent-folder] \"folder-title\""
    echo "Use . for root docs folder"
    echo ""
    echo "Examples:"
    echo "  $0 my-project . \"Getting Started\""
    echo "  $0 my-project api \"User Authentication\""
    echo "  $0 my-project api/endpoints \"REST API\""
    exit 1
fi

PROJECT_SLUG="$1"
PARENT_FOLDER="${2:-.}"
FOLDER_TITLE="$3"

# Validate arguments
if [ -z "$FOLDER_TITLE" ]; then
    echo "Error: Folder title is required"
    echo "Usage: $0 \"project-slug\" [parent-folder] \"folder-title\""
    exit 1
fi

# Get project directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$SCRIPT_DIR/../projects/$PROJECT_SLUG"

# Check if project exists
if [ ! -d "$PROJECT_ROOT" ]; then
    echo "Error: Project '$PROJECT_SLUG' not found at $PROJECT_ROOT"
    exit 1
fi

DOCS_DIR="$PROJECT_ROOT/docs"

# Generate slug from title
FOLDER_SLUG=$(generate_slug "$FOLDER_TITLE")

# Build full folder path
if [[ "$PARENT_FOLDER" == "." ]]; then
    FULL_PATH="$DOCS_DIR/$FOLDER_SLUG"
else
    FULL_PATH="$DOCS_DIR/$PARENT_FOLDER/$FOLDER_SLUG"
fi

# Check if folder already exists
if [ -d "$FULL_PATH" ]; then
    echo "Error: Folder already exists at $FULL_PATH"
    exit 1
fi

# Create folder structure
echo "Project: $PROJECT_SLUG"
echo "Creating folder: $FOLDER_TITLE"
echo "Slug: $FOLDER_SLUG"
echo "Parent: $PARENT_FOLDER"
echo "Full path: $FULL_PATH"

mkdir -p "$FULL_PATH"

# Create info.json for all parent folders in path
IFS='/' read -ra PATH_PARTS <<< "$PARENT_FOLDER"
CURRENT_PATH="$DOCS_DIR"

# Create info.json for each parent folder that doesn't exist
for part in "${PATH_PARTS[@]}"; do
    if [[ "$part" != "." ]] && [[ -n "$part" ]]; then
        CURRENT_PATH="$CURRENT_PATH/$part"
        if [ ! -f "$CURRENT_PATH/info.json" ]; then
            PART_TITLE=$(title_from_slug "$part")
            echo "Creating parent folder info.json: $CURRENT_PATH/info.json"
            cat > "$CURRENT_PATH/info.json" <<EOF
{
  "title": "$PART_TITLE",
  "contents": []
}
EOF
        fi
    fi
done

# Create info.json for the final folder
FINAL_PATH="$CURRENT_PATH/$FOLDER_SLUG"
if [ ! -f "$FINAL_PATH/info.json" ]; then
    echo "Creating final folder info.json: $FINAL_PATH/info.json"
    cat > "$FINAL_PATH/info.json" <<EOF
{
  "title": "$FOLDER_TITLE",
  "contents": []
}
EOF
fi

echo "Folder created successfully!"
echo "Location: $FULL_PATH"
echo "You can now add subfolders or content to this folder."}