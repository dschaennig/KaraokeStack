import vlc
from glob import glob
import time
import cv2
from configparser import ConfigParser
import os

config = ConfigParser()
config.read(os.path.dirname(__file__) + "/config.ini")
cfg = config["DEFAULT"]

songs = \
    glob(cfg["songs_path"] + "*.webm") +\
    glob(cfg["songs_path"] + "*.mp4") +\
    glob(cfg["songs_path"] + "*.mkv") +\
    glob(cfg["songs_path"] + "*.wmv")

loaded_songs = []

for indx, song in enumerate(songs):
    obj = {
        "path" : song,
        "name" : (song.split('\\')[-1]).rsplit('.', 1)[0].rsplit('[', 1)[0],
        "id" : indx
    }

    loaded_songs.append(obj)
    del obj

def get_queue():
    try:
        queue_file = open(cfg["queue_path"], "r")
        queue_raw = queue_file.read()
        queue_file.close()
        queue = [int(x) for x in queue_raw.split('\n') if x != '']
        return queue
    except Exception as e:
        print("Trouble reading queue file:", e)
        return 400

def get_next_song():
    queue = get_queue()
    if len(queue) == 0:
        current_song_file = open(cfg["current_song_path"], "w")
        current_song_file.write("")
        current_song_file.close()
        return 0
    next_song = queue.pop(0)
    try:
        queue_file = open(cfg["queue_path"], "w")
        for id in queue:
            queue_file.write(str(id) + '\n')
        queue_file.close()
        current_song_file = open(cfg["current_song_path"], "w")
        current_song_file.write(str(next_song))
        current_song_file.close()
    except Exception as e:
        print("Trouble writing queue or current song file:", e)
        return 1

    return [x for x in loaded_songs if x['id'] == next_song][0]

def main():
    while True:
        next = get_next_song()
        if next == 0:
            next_path = cfg["break_song_path"]
        else:
            next_path = next['path']

        video = cv2.VideoCapture(next_path)
        frames = video.get(cv2.CAP_PROP_FRAME_COUNT)
        fps = video.get(cv2.CAP_PROP_FPS)

        seconds = round(frames / fps)
        instance = vlc.Instance(['--video-on-top'])
        player = instance.media_player_new()
        player.toggle_fullscreen()


        media = instance.media_new(next_path)
        player.set_media(media)
        player.play()
        print("playing video for " + str(seconds) + " seconds")

        starting_time = time.time()

        # wait for song to end and periodically check if skip file was set to true
        while time.time() - starting_time < seconds:
            try:
                skip_file = open(cfg["skip_path"], "r")
                skip_bool = skip_file.read()
                skip_file.close()
                if skip_bool == "1":
                    print("skipping currently playing song...")
                    skip_file = open(cfg["skip_path"], "w")
                    skip_file.write("0")
                    skip_file.close()
                    break
            except Exception as e:
                print("Couldn't access skip file:", e)
            time.sleep(1)

        print("finished song or skip, closing player")
        player.stop()
        instance.vlm_stop_media("1")
        media.release()

main()
