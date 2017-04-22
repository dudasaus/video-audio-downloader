#!/bin/sh

# Install node dependencies
npm install

# Make sure ffmpeg is installed
dpkg-query -s ffmpeg 2>/dev/null | grep -q ^"Status: install ok installed"$

if [ $? -eq 1 ]; then
    apt-get install ffmpeg
fi

echo "Installation complete. Type \"make run\" to run the program."
