import vlc
from glob import glob
import time
from configparser import ConfigParser
import os

config = ConfigParser()
config.read(os.path.dirname(__file__) + "/config.ini")
cfg = config["DEFAULT"]

use_online_mode = cfg["online_mode"] == "1"
video_dir = cfg["songs_path"]
temp_videos = cfg["temp_videos_path"]

def get_queue():
    try:
        queue_file = open(cfg["queue_path"], "r")
        queue_raw = queue_file.read()
        queue_file.close()
        return list(filter(lambda x: x!= '', queue_raw.split('\n')))
    except Exception as e:
        print("Trouble reading queue file:", e)
        return 400

def match_file_from_id(id):
    videos = temp_videos if use_online_mode else video_dir
    video = glob(videos + id + " *.*")
    if len(video) < 1:
        return 0
    for v in video:
        if v.endswith(".part"):
            print("returning 0 because Song is still loading...")
            return 0
    if len(video) == 1:
        return video[0]
    else:
        print("Found too many videos for id: " + id + ": ", len(video), "\n", "\n".join(video))
        exit()

def get_next_song():
    queue = get_queue()
    if len(queue) == 0:
        current_song_file = open(cfg["current_song_path"], "w")
        current_song_file.write("")
        current_song_file.close()
        return 0
    next_song_id = queue.pop(0)
    next_song = match_file_from_id(next_song_id)
    if next_song == 0:
        current_song_file = open(cfg["current_song_path"], "w")
        current_song_file.write("")
        current_song_file.close()
        return 0
    try:
        queue_file = open(cfg["queue_path"], "w")
        for item in queue:
            queue_file.write(str(item) + '\n')
        queue_file.close()
        current_song_file = open(cfg["current_song_path"], "w")
        current_song_file.write(
            next_song.split(next_song_id, 1)[-1].rsplit(".", 1)[0]
        )
        current_song_file.close()
    except Exception as e:
        print("Trouble writing queue or current song file:", e)
        return 1

    return next_song


def play_vlc():
    instance = vlc.Instance(['--video-on-top'])
    player = instance.media_player_new()
    player.toggle_fullscreen()

    banner = instance.media_new(cfg["banner_path"], '--image-duration 5')
    banner.parse()
    banner_duration = banner.get_duration() / 1000;

    try:
        while True:
            media = banner
            seconds = banner_duration

            next = get_next_song()
            if next != 0:
                media = instance.media_new(next)
                media.add_option('avcodec-hw=none')
                media.parse()
                seconds = media.get_duration() / 1000;

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
            if next != 0:
                media.release()
            if use_online_mode and next != 0 and next not in list(map(lambda x: match_file_from_id(x), get_queue())):
                try:
                    os.remove(next)
                except Exception as e:
                    print("Failed to remove", next, "\n", e)
                    exit()
    except:
        if use_online_mode and next != 0 and next not in list(map(lambda x: match_file_from_id(x), get_queue())):
            try:
                os.remove(next)
            except Exception as e:
                print("Failed to remove", next, "\n", e)
                exit()

play_vlc()
