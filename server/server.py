import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from glob import glob
from configparser import ConfigParser
import os
import subprocess

class SongId(BaseModel):
    song_id : str

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

config = ConfigParser()
config.read(os.path.dirname(__file__) + "/config.ini")
cfg = config["DEFAULT"]

use_online_mode = cfg["online_mode"] == "1"
videos = cfg["songs_path"]
temp_videos = cfg["temp_videos_path"]

@app.get("/available_songs")
def get_available_songs():
    try:
        video_files = glob(videos + "*.*")
        return list(map(lambda file: os.path.basename(file).split(" ", 1)[-1].rsplit(".", 1)[0], video_files))
    except Exception as e:
        print(e)
        return 400

@app.get("/queue")
def get_queue():
    try:
        queue_file = open(cfg["queue_path"], "r")
        queue_raw = queue_file.read()
        queue_file.close()

        video_dir = temp_videos if use_online_mode else videos
        video_files = glob(video_dir + "*.*")
        print(video_files)
        queue = list(map(
            lambda id: list(filter(
                lambda y: id in y,
                video_files
            ))[0].split(id, 1)[-1].rsplit(".", 1)[0],
            [x for x in queue_raw.split('\n') if x != '']
        ))
        return queue
    except Exception as e:
        print(e)
        return 400

@app.get("/current_song")
def get_current_song():
    try:
        current_song_file = open(cfg["current_song_path"], "r")
        current_song_id = current_song_file.read()
        current_song_file.close()
        if current_song_id == "":
            return ""
        else:
            return current_song_id
    except Exception as e:
        print(e)
        return 400

@app.post("/add_to_queue")
def add_to_queue(song: SongId):
    song_id = song.song_id

    if not use_online_mode:
        video_file = glob(videos + "* " + song_id + "*.*")
        print(video_file)
        song_id = os.path.basename(video_file[0]).split(" ", 1)[0]

    try:
        queue_file = open(cfg["queue_path"], "a")
        queue_file.write(song_id.rsplit('/', 1)[-1] + "\n")
        if use_online_mode:
            if not os.path.isdir(temp_videos):
                os.mkdir(temp_videos)
            subprocess.Popen([
                "yt-dlp",
                "--remote-components", "ejs:github",
                song_id,
                "-f", "bv*[height<=720]+ba/b[height<=720]",
                "-o", temp_videos + "%(id)s %(title)s.%(ext)s"
            ])

        queue_file.close()
        return 200
    except Exception as e:
        print(e)
        return 400

@app.get("/skip_button")
def skip():
    try:
        skip_file = open(cfg["skip_path"], "w")
        skip_file.write("1")
        skip_file.close()
        return 200
    except Exception as e:
        print("Error writing skip file 1:", e)
        return 400

@app.get("/using_online_mode")
def using_online_mode():
    try:
        return use_online_mode
    except Exception as e:
        print(e)
        return 400

uvicorn.run(app, host="0.0.0.0", port=int(cfg["port"]))
