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
PROJECT_ROOT="$SCRIPT_DIR/.."

# Generate project slug
PROJECT_SLUG=$(generate_slug "$PROJECT_TITLE")
WORKSPACE_DIR="$PROJECT_ROOT/projects/$PROJECT_SLUG"
BACKUPS_DIR="$PROJECT_ROOT/backups"

# Handle existing project
if [ -d "$WORKSPACE_DIR" ]; then
    if [ "$FORCE" = true ]; then
        # Create backup with timestamp
        TIMESTAMP=$(date +%Y%m%d_%H%M%S)
        BACKUP_NAME="${PROJECT_SLUG}_${TIMESTAMP}"
        BACKUP_PATH="$BACKUPS_DIR/$BACKUP_NAME"
        
        echo "Project workspace exists. Creating backup..."
        mkdir -p "$BACKUPS_DIR"
        mv "$WORKSPACE_DIR" "$BACKUP_PATH"
        echo "Backup created at: $BACKUP_PATH"
    else
        echo "Error: Project workspace already exists at $WORKSPACE_DIR"
        echo "Use --force or -f flag to backup and regenerate"
        exit 1
    fi
fi

# Create workspace directory structure
echo "Creating project workspace: $PROJECT_TITLE"
echo "Project slug: $PROJECT_SLUG"
echo "Workspace directory: $WORKSPACE_DIR"

mkdir -p "$WORKSPACE_DIR"
mkdir -p "$WORKSPACE_DIR/repository"
mkdir -p "$WORKSPACE_DIR/docs"

# Clone repository into repository folder
echo "Cloning repository into workspace..."
cd "$WORKSPACE_DIR/repository"
git clone --branch "$BRANCH_NAME" "$REPOSITORY_URL" .

# Get git username for creator field
if git config --global user.name &> /dev/null; then
    CREATOR=$(git config --global user.name)
elif git config user.name &> /dev/null; then
    CREATOR=$(git config user.name)
else
    CREATOR="$(whoami)"
fi

# Create info.json
echo "Creating info.json..."
cat > "$WORKSPACE_DIR/info.json" <<EOF
{
  "title": "$PROJECT_TITLE",
  "description": "$PROJECT_DESCRIPTION",
  "repository": "$REPOSITORY_URL",
  "branch": "$BRANCH_NAME",
  "creator": "$CREATOR",
  "created": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
}
EOF

echo " Project workspace initialized successfully!"
echo "Location: $WORKSPACE_DIR"
echo ""
echo "Next steps:"
echo "1. Review and update the README.md file"
echo "2. Set up your development environment"
echo "3. Start working on your project!"