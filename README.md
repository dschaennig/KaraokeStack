# Welcome to KaraokeStack :]

This is a full stack application to run karaoke nights from your laptop.
Advantages of this application are:
- Nobody has to touch your device for queueing songs
- You don't have to manage the queue all night
- Everyone can see a list of available songs, the current song and the queue, its length, and add songs to the queue from their own device (porbably their smart phone)

This app is currently based on playing downloaded videos from your device. This is due to one karaoke location of ours having no access to the internet. I may add a feature toggle to use the app in online mode in the future!

# Install dependencies
Before you try to run the app, make sure to have all of the following python libraries installed:
- [cv2](https://pypi.org/project/opencv-python/)
- [FastAPI](https://pypi.org/project/fastapi/)
- [pydantic](https://pypi.org/project/pydantic/)
- [python-vlc](https://pypi.org/project/python-vlc/)
 - [uvicorn](https://pypi.org/project/uvicorn/)

and make sure to run

	cd ./client
	npm i

# Using the app
There are three parts to this app:
- frontend
- backend (server)
- video player

To use the app, you need to start those three parts separately in different shells (for now):
Run frontend:

	cd frontend
	npm run dev
Run backend:

	python ./server/server.py
And finally run the player:

	python ./server/player.py

Have a fun time with your friends (if you have any)!
