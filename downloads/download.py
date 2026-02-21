import shutil
import subprocess
from glob import glob

def already_downloaded(id, list):
    for v in list:
        if id in v:
            return True
    return False

download_path = "D:\\\\Musik\\Karaoke\\"

playlist_url_file = open(download_path + "_playlist.txt", "r")
playlist_url = playlist_url_file.read()
playlist_url_file.close()

urls_file = open(download_path + "_urls.txt", "w")
urls_file.write("")
urls_file.close()

downloaded_videos = \
    glob(download_path + "*.webm") +\
    glob(download_path + "*.mp4") +\
    glob(download_path + "*.mkv") +\
    glob(download_path + "*.wmv")

subprocess.run(["yt-dlp", "--flat-playlist", "-i", "--print-to-file", "url", download_path + "_urls.txt", playlist_url])

urls_file = open(download_path + "_urls.txt", "r")
urls_raw = urls_file.read()
urls = list(filter(lambda x: x != '', urls_raw.split('\n')))

ids = [x.split("watch?v=")[-1] for x in urls]

new_ids = [x for x in ids if not already_downloaded(x, downloaded_videos)]

files_now = glob("./*.*")

for id in new_ids:
    subprocess.run(["yt-dlp", "https://www.youtube.com/watch?v=" + id])

files_new = list(filter(lambda x: x not in files_now, glob("./*.*")))

for file in files_new:
    shutil.move(file, download_path + file[2:])