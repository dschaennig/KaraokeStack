function filterSongsByString(string, songs){
    return songs.filter((song) => song.name.toLowerCase().includes(string.toLowerCase()))
}

export default filterSongsByString;