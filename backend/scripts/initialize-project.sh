#!/bin/bash

# Initialize Project Workspace Script
# Usage: ./initialize-project.sh [--force|-f] "Project Title" "repository-url" [branch-name] [description]
# Default description: "Brief description of [project title]"
# Default branch: master

set -e

# Parse arguments
FORCE=false
POSITIONAL_ARGS=()

while [[ $# -gt 0 ]]; do
    case $1 in
        -f|--force)
            FORCE=true
            shift
            ;;
        -*|--*)
            echo "Unknown option: $1"
            exit 1
            ;;
        *)
            POSITIONAL_ARGS+=("$1")
            shift
            ;;
    esac
done

set -- "${POSITIONAL_ARGS[@]}"

# Check if required arguments are provided
if [ $# -lt 2 ]; then
    echo "Usage: $0 [--force|-f] \"Project Title\" \"repository-url\" [branch-name] [description]"
    echo "Example: $0 --force \"My Awesome Project\" \"https://github.com/user/my-awesome-project.git\" main \"A cool project\""
    exit 1
fi

PROJECT_TITLE="$1"
REPOSITORY_URL="$2"
BRANCH_NAME="${3:-master}"
PROJECT_DESCRIPTION="${4:-Brief description of $PROJECT_TITLE}"

# Function to generate project slug from title
generate_slug() {
    local title="$1"
    # Convert to lowercase, replace spaces with hyphens, remove special characters
    echo "$title" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g' | sed 's/--*/-/g' | sed 's/^-//' | sed 's/-$//'
}

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$SCRIPT_DIR/../.."

# Source environment variables if .env exists
if [ -f "$PROJECT_ROOT/.env" ]; then
    source "$PROJECT_ROOT/.env"
fi

# Generate project slug
PROJECT_SLUG=$(generate_slug "$PROJECT_TITLE")
DOCS_DIR="$PROJECT_ROOT/docupilot/$PROJECT_SLUG"
REPO_DIR="$PROJECT_ROOT/repositories/$PROJECT_SLUG"
BACKUPS_DIR="$PROJECT_ROOT/backups"
TEMPLATES_DIR="$PROJECT_ROOT/templates"

# Handle existing project
if [ -d "$REPO_DIR" ] || [ -d "$DOCS_DIR" ]; then
    if [ "$FORCE" = true ]; then
        # Create backup with timestamp
        TIMESTAMP=$(date +%Y%m%d_%H%M%S)
        BACKUP_NAME="${PROJECT_SLUG}_${TIMESTAMP}"
        BACKUP_PATH="$BACKUPS_DIR/$BACKUP_NAME"
        
        echo "Project workspace exists. Creating backup..."
        mkdir -p "$BACKUP_PATH"
        
        # Move repository folder if it exists
        if [ -d "$REPO_DIR" ]; then
            rm -rf "$REPO_DIR"
            echo "Delete old repository"
        fi
        
        # Move documentation folder if it exists
        if [ -d "$DOCS_DIR" ]; then
            mv "$DOCS_DIR" "$BACKUP_PATH/documentation"
            echo "Documentation backed up to: $BACKUP_PATH/documentation"
        fi
        
        echo "Backup created at: $BACKUP_PATH"
    else
        echo "Error: Project workspace already exists"
        if [ -d "$REPO_DIR" ]; then
            echo "Repository exists at: $REPO_DIR"
        fi
        if [ -d "$DOCS_DIR" ]; then
            echo "Documentation exists at: $DOCS_DIR"
        fi
        echo "Use --force or -f flag to backup and regenerate"
        exit 1
    fi
fi

# Create workspace directory structure
echo "Creating project workspace: $PROJECT_TITLE"
echo "Project slug: $PROJECT_SLUG"
echo "Repository directory: $REPO_DIR"
echo "Documentation directory: $DOCS_DIR"

mkdir -p "$REPO_DIR"
mkdir -p "$DOCS_DIR"

# Clone repository into repository folder
echo "Cloning repository into workspace..."
cd "$REPO_DIR"
git clone --branch "$BRANCH_NAME" "$REPOSITORY_URL" .

# Get git username for creator field
if git config --global user.name &> /dev/null; then
    CREATOR=$(git config --global user.name)
elif git config user.name &> /dev/null; then
    CREATOR=$(git config user.name)
else
    CREATOR="$(whoami)"
fi

# Generate camelCase sidebar ID from project slug (consistent with backend JS)
# Convert kebab-case to camelCase: "ubeda-afb" → "ubedaAfbSidebar"
SIDEBAR_ID=$(echo "$PROJECT_SLUG" | awk -F'-' '{
  result = $1;
  for(i=2; i<=NF; i++) {
    result = result toupper(substr($i,1,1)) substr($i,2);
  }
  print result "Sidebar";
}')

# Copy templates and replace placeholders
echo "Copying templates..."
if [ -d "$TEMPLATES_DIR" ] && [ "$(ls -A $TEMPLATES_DIR)" ]; then
    for file in "$TEMPLATES_DIR"/*; do
        filename=$(basename "$file")
        if [ -d "$file" ]; then
            cp -r "$file" "$DOCS_DIR/"
        elif [ "$filename" = "sidebars.js" ]; then
            # Special handling for sidebars.js - replace placeholders
            sed -e "s/__SIDEBAR_ID__/${SIDEBAR_ID}/g" \
                -e "s/__PROJECT_TITLE__/${PROJECT_TITLE}/g" \
                -e "s/__PROJECT_DESCRIPTION__/${PROJECT_DESCRIPTION}/g" \
                "$file" > "$DOCS_DIR/$filename"
            echo "Processed sidebars.js with placeholders replaced"
        else
            cp "$file" "$DOCS_DIR/"
        fi
    done
    echo "Templates copied successfully"
else
    echo "No templates found or templates directory empty"
fi
# cat > "$REPO_DIR/info.json" <<EOF
# {
#   "title": "$PROJECT_TITLE",
#   "description": "$PROJECT_DESCRIPTION",
#   "repository": "$REPOSITORY_URL",
#   "branch": "$BRANCH_NAME",
#   "creator": "$CREATOR",
#   "created": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
# }
# EOF

echo "Project workspace initialized successfully!"
echo "Location: $REPO_DIR"
echo ""
echo "Next steps:"
echo "1. Review and update the README.md file"
echo "2. Set up your development environment"
echo "3. Start working on your project!"