#!/bin/bash

# Function to display usage
usage() {
    echo "Usage: $0 [-v version] [-u]"
    echo "  -v version  Specify the version to use"
    echo "  -u          Update the version in the file"
    exit 1
}

# Parse command-line arguments
while getopts ":v:u" opt; do
  case $opt in
    v)
      SPECIFIED_VERSION=$OPTARG
      ;;
    u)
      UPDATE=true
      ;;
    \?)
      usage
      ;;
  esac
done

# Get the current version from the plugin header
CURRENT_VERSION=$(grep -m 1 'Version:' agentwp.php | awk '{print $3}')

# Determine the new version
if [ -z "$SPECIFIED_VERSION" ]; then
    NEW_VERSION=$(echo $CURRENT_VERSION | awk -F. -v OFS=. '{$NF++; print}')
else
    NEW_VERSION=$SPECIFIED_VERSION
fi

echo "Current version: $CURRENT_VERSION"
echo "New version: $NEW_VERSION"

# Update the version in the plugin file, readme.txt, package.json, and server/Main.php if the -u flag is set
if [ "$UPDATE" = true ]; then
    sed -i '' "s/Version: $CURRENT_VERSION/Version: $NEW_VERSION/" agentwp.php
    sed -i '' "s/Stable tag: $CURRENT_VERSION/Stable tag: $NEW_VERSION/" readme.txt
    sed -i '' "s/\"version\": \"$CURRENT_VERSION\"/\"version\": \"$NEW_VERSION\"/" package.json
    sed -i '' "s/const PLUGIN_VERSION = '$CURRENT_VERSION';/const PLUGIN_VERSION = '$NEW_VERSION';/" server/Main.php
    echo "Version bumped to $NEW_VERSION in agentwp.php, readme.txt, package.json, and server/Main.php"
else
    echo "Version not updated. Use -u flag to update."
fi
