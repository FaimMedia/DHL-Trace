#!/bin/bash

# MacOS only

/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --pack-extension=./src/ --pack-extension-key=dhl-tracking.pem
mv src.crx build.crx