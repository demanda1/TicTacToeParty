#!/bin/bash

# Create audio directory if it doesn't exist
mkdir -p assets/audio

# Download retro game music
curl -L "https://opengameart.org/sites/default/files/8-bit-loop.mp3" -o assets/audio/retro-game.mp3

# Download puzzle game music
curl -L "https://opengameart.org/sites/default/files/puzzle-theme.mp3" -o assets/audio/puzzle-game.mp3

# Download adventure game music
curl -L "https://opengameart.org/sites/default/files/adventure-theme.mp3" -o assets/audio/adventure-game.mp3

# Download relaxing game music
curl -L "https://opengameart.org/sites/default/files/relaxing-theme.mp3" -o assets/audio/relaxing-game.mp3

echo "Audio files downloaded successfully!" 