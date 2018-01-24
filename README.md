# my-weekly-music
Simple script to use last.fm API to retrieve the 25 most listened to albums of mine (or any last.fm user) for the passt week, stitch the 25 album covers into one 5x5 image and tweet it. On my laptop, it is setup to use anacron to run the script once a week.

## Installation and setup
```npm install```
One of the dependencies depends on node canvas so it may require that you follow the installation instructions found here for its dependencies: https://github.com/Automattic/node-canvas/wiki/_pages

In addition,you need to rename the ".env-sample" file to ".env" and fill it out with your own information and API keys and secrets
