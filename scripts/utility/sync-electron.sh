#!/bin/bash

# Sync script to keep scripts/electron/ in sync with apps/desktop/
# Usage: ./scripts/sync-electron.sh

echo "🔄 Syncing Electron files from apps/desktop/ to scripts/electron/..."

# Define source and destination
SOURCE_DIR="apps/desktop"
DEST_DIR="scripts/electron"

# Files to sync
FILES_TO_SYNC=("main.js" "preload.js")

# Check if source directory exists
if [ ! -d "$SOURCE_DIR" ]; then
    echo "❌ Error: Source directory $SOURCE_DIR does not exist"
    exit 1
fi

# Check if destination directory exists
if [ ! -d "$DEST_DIR" ]; then
    echo "❌ Error: Destination directory $DEST_DIR does not exist"
    exit 1
fi

# Sync each file
for file in "${FILES_TO_SYNC[@]}"; do
    if [ -f "$SOURCE_DIR/$file" ]; then
        cp "$SOURCE_DIR/$file" "$DEST_DIR/$file"
        echo "✅ Synced $file"
    else
        echo "⚠️  Warning: $SOURCE_DIR/$file does not exist"
    fi
done

echo "🎉 Sync complete!"
echo ""
echo "Note: scripts/electron/ is a working copy for development/testing."
echo "The source of truth remains in apps/desktop/"
