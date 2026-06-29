function filterSongsByString(string, songs){
    return songs.filter((song) => song.toLowerCase().includes(string.toLowerCase()))
}

export default filterSongsByString;
