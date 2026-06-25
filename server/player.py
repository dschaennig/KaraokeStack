import vlc
from glob import glob
import time
from configparser import ConfigParser
import os

config = ConfigParser()
config.read(os.path.dirname(__file__) + "/config.ini")
cfg = config["DEFAULT"]

use_online_mode = cfg["online_mode"] == "1"
temp_videos = cfg["temp_videos_path"]

def get_queue():
    try:
        queue_file = open(cfg["queue_path"], "r")
        queue_raw = queue_file.read()
        queue_file.close()
        if not use_online_mode:
            queue = [int(x) for x in queue_raw.split('\n') if x != '']
            return queue
        else:
            return list(filter(lambda x: x!= '', queue_raw.split('\n')))
    except Exception as e:
        print("Trouble reading queue file:", e)
        return 400
    
def match_file_from_id(id):
    video = glob(temp_videos + id + " *.*")
    for v in video:
        if v.endswith(".part"):
            print("returning 0 because Song is still loading...")
            return 0
    if len(video) == 1:
        return video[0]
    else:
        print("Found too many or too less videos for id: " + id + ": ", len(video), "\n", "\n".join(video))
        exit()

def get_next_song(loaded_songs):
    queue = get_queue()
    if len(queue) == 0:
        current_song_file = open(cfg["current_song_path"], "w")
        current_song_file.write("")
        current_song_file.close()
        return 0
    next_song_id = queue.pop(0)
    next_song = next_song_id if not use_online_mode else match_file_from_id(next_song_id)
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
            str(next_song)
            if not use_online_mode else
            next_song.split(next_song_id, 1)[-1].rsplit(".", 1)[0]
        )
        current_song_file.close()
    except Exception as e:
        print("Trouble writing queue or current song file:", e)
        return 1

    if not use_online_mode:
        return [x for x in loaded_songs if x['id'] == next_song][0]
    else:
        return next_song


def run_player():
    if not use_online_mode:
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

        play_vlc(loaded_songs= loaded_songs)
    else:
        play_vlc()



def play_vlc(loaded_songs=[]):
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
            
            next = get_next_song(loaded_songs)
            if next != 0:
                media = instance.media_new(next['path'] if not use_online_mode else next)
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

run_player()
