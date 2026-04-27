import React from 'react';
import { useState, useEffect } from 'react';
import {
  Button,
  Col,
  Form,
  Row,
} from 'react-bootstrap';

import './songListing.css';
import filterSongsByString from './../util/filterString.js';
import {
  addSongToQueue,
  fetchAvailableSongs,
  usingOnlineMode
} from "./../util/requests";

const SongListing = () => {
  
  const [onlineMode, setOnlineMode] = useState(true);
  const [availableSongs, setAvailableSongs] = useState([]);
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [filterString, setFilterSting] = useState("");

  useEffect(() => {
    usingOnlineMode(setOnlineMode);
    console.log("set online mode to:", onlineMode)
  }, [])

  useEffect(() => {
    //load all available Songs:
    if (!onlineMode) {
      fetchAvailableSongs(setAvailableSongs, setFilteredSongs);
    }
  }, [onlineMode])

  useEffect(() => {
    if (!onlineMode) {
    setFilteredSongs(filterSongsByString(filterString, availableSongs));
    }
  }, [filterString])
 
  return <Col
    >
      <Row className='mt-3 mb-3'>
        <Col xs={12} md={2} className='mb-auto mt-auto'>
          Search
        </Col>
        <Col xs={12} md={9} className='mb-auto mt-auto'>
          { onlineMode ? 
            <Row>
              Search is disabled because online mode is active, just insert a YouTube Video URL below! :)
            </Row>
          : 
            <Form.Control
              type='text'
              placeholder="Search for songs :)"
              onChange={(e) => setFilterSting(e.target.value)}
            />
          }
        </Col>
        <Col xs={0} md={1}>
          &nbsp;
        </Col>
      </Row>
      <div class="overflow">
        {filteredSongs.map((song) => {
          return <Row 
              className='d-flex justify-content-center border-top p-1'
            >
              <Col xs={10} className='mt-auto mb-auto'>
                {song.name}
              </Col>
              <Col xs={2} className='mt-auto mb-auto'>
                <Button
                  variant='outline-success'
                  onClick={() => {
                    addSongToQueue(song.id);
                  }}
                >
                  +
                </Button>
              </Col>
            </Row>
        })}
      </div>
      <Row className='d-flex justify-content-center border-top p-2 m-1'>
        Press the + Button to add the song to the queue!
      </Row>
    </Col>
}

export {SongListing};