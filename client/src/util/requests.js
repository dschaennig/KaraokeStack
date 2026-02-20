import api from './api.js';

const fetchAvailableSongs = async (setter, setter2) => {
  try {
    const response = await api.get('/available_songs');
    setter(response.data);
    setter2(response.data);
    return 200;
  } catch (error) {
    console.log("Error fetching songs:", error);
    return 400;
  }
};


const fetchQueue = async (setter) => {
  try {
    const response = await api.get('/queue');
    setter(response.data);
    return 200;
  } catch (error) {
    console.log("Error fetching queue:", error);
    return 400;
  }
};


const fetchCurrentSong = async (setter) => {
  try {
    const response = await api.get('/current_song');
    setter(response.data != "" ? response.data : null);
    return 200;
  } catch (error) {
    console.log("Error fetching current song:", error);
    return 400;
  }
};


const addSongToQueue = async (songId) => {
  try {
    await api.post('/add_to_queue', {'song_id' : songId});
    return 200;
  } catch (error) {
    console.log("Error adding song:", error);
    return 400;
  }
}

const skipButton = async () => {
  try {
    const response = await api.get('/skip_button');
    return response;
  } catch (error) {
    console.log("Error sending skip button:", error);
    return 400
  }
}


export {fetchAvailableSongs, fetchCurrentSong, fetchQueue, addSongToQueue, skipButton};