#!/bin/bash

# run composer in production mode
composer install --no-dev --prefer-dist --optimize-autoloader
npm install
npm run build

# create the dist archive
echo "Creating dist archive..."
wp --allow-root dist-archive .

# get the file of the dist archive

echo "Dist archive created: $PLUGIN_FILE"

# move agentwp.*.zip inside plugin-builds folder
CURRENT_DIR=$(pwd)
PLUGIN_FILE=$(find "$CURRENT_DIR/.." -name 'agentwp.*.zip' -print -quit)

if [ -n "$PLUGIN_FILE" ]; then
    PLUGIN_FILENAME=$(basename "$PLUGIN_FILE")
    BUILDS_FOLDER="${CURRENT_DIR}/plugin-builds"

    if [ ! -d "$BUILDS_FOLDER" ]; then
        mkdir "$BUILDS_FOLDER"
    fi

    cp "$PLUGIN_FILE" "$BUILDS_FOLDER/main.zip"
    cp -f "$PLUGIN_FILE" "$CURRENT_DIR/agentwp.zip"

    if [ -f "$BUILDS_FOLDER/$PLUGIN_FILENAME" ]; then
        rm "$BUILDS_FOLDER/$PLUGIN_FILENAME"
    fi
    mv "$PLUGIN_FILE" "$BUILDS_FOLDER/"
fi

ls -ll "${CURRENT_DIR}/plugin-builds"
