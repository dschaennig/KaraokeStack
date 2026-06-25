# Welcome to KaraokeStack :]

This is a full stack application to run karaoke nights from your laptop.
Advantages of this application are:
- Nobody has to touch your device for queueing songs
- You don't have to manage the queue all night
- Everyone can see a list of available songs (relevant for offline mode only), the current song and the queue, its length (well, in video count, maybe adding a timer somewhere down the line), and add songs to the queue from their own device (probably their smart phone)

# Operational modes

This app has two modes of operation, online mode and offline mode. For offline mode, you need to download the videos of the songs you want to sing that night onto your pc beforehand. A possible download script is provided in `downloads/download.py`.
If your karaoke location has internet, you can simply use online mode and not worry about that.

To switch the mode of operation, you need to edit the `online_mode ` parameter in `server/config.ini` to `1` for online mode and anything else (`0` is suggested) for offline mode. 

# Install dependencies
Before you try to run the app, make sure to have all of the following packages installed:
- [deno](https://docs.deno.com/runtime/getting_started/installation/) (only needed for yt-dlp)
- [FastAPI](https://pypi.org/project/fastapi/)
- [pydantic](https://pypi.org/project/pydantic/)
- [python-vlc](https://pypi.org/project/python-vlc/)
- [uvicorn](https://pypi.org/project/uvicorn/)
- [yt-dlp](https://github.com/yt-dlp/yt-dlp) (only needed for online mode or downloading)

and make sure to run

	cd ./client
	npm i
to install all necessary node modules.

# Using the app
## Configuring
Edit the [server/config.ini](server/config.ini) to direct the server to the relevant files.
For offline mode, the most interesting value is `songs_path`, which is the folder that contains the karaoke video files.
Additionally you can choose a video or an image that shows when no song is currently queued with `banner_path`.
Here you can also choose offline/online mode with `online_mode`.
The other values can be safely left alone.

## Running
There are three parts to this app:
- frontend
- backend (server)
- video player

To use the app, you need to start those three parts separately in different shells (for now):
Run frontend:

	cd client
	npm run dev
Run backend:

	python ./server/server.py
And finally run the player:

	python ./server/player.py

Have a fun time with your friends (if you have any)!

# Downloading with yt-dlp
## Download script
There is a download script included. This script does local filtering of already downloaded songs (as long as you leave the video id in the file names) instead of apparently online filtering with yt-dlp's playlist download, which resolves getting limitted by yt-dlp for starting the download process of already downloaded songs.

## Live downloading in online mode
Online mode uses yt-dlp to download songs once they've been added to the queue. If you don't want your network to be seen downloading songs with yt-dlp, use a VPN or something similar, but in my experience those get blocked after a while if not immediately. 
Downloading videos with yt-dlp violates Google's ToS, but since it's for personal use this is probably not something you will get criminally charged for. Inform yourself about the laws in your country.
Use at your own risk, I am not a lawyer (yet).


