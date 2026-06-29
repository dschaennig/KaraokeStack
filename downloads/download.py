import subprocess
from glob import glob

def already_downloaded(id, list):
    for v in list:
        if id in v:
            return True
    return False

download_path = "./videos/"

playlist_url_file = open(download_path + "_playlist.txt", "r")
playlist_url = playlist_url_file.read()
playlist_url_file.close()

urls_file = open(download_path + "_urls.txt", "w")
urls_file.write("")
urls_file.close()

downloaded_videos = glob(download_path + "*.*")

subprocess.run(["yt-dlp", "--flat-playlist", "-i", "--print-to-file", "url", download_path + "_urls.txt", playlist_url])

urls_file = open(download_path + "_urls.txt", "r")
urls_raw = urls_file.read()
urls = list(filter(lambda x: x != '', urls_raw.split('\n')))

ids = [x.split("watch?v=")[-1] for x in urls]

new_ids = [x for x in ids if not already_downloaded(x, downloaded_videos)]

for id in new_ids:
    subprocess.run(["yt-dlp", "--remote-components", "ejs:github", "https://www.youtube.com/watch?v=" + id, "-f", "bv*[height<=720]+ba/b[height<=720]", "-o", download_path + "%(id)s %(title)s.%(ext)s"])
