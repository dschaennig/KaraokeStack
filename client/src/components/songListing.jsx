import React from 'react';
import { useState, useEffect } from 'react';
import {
  Button,
  Col,
  Form,
  Row,
} from 'react-bootstrap';

import {
  addSongToQueue,
  fetchAvailableSongs
} from "./../util/requests";

import filterSongsByString from './../util/filterString.js';


const SongListing = () => {
  
  const [availableSongs, setAvailableSongs] = useState([]);
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [filterString, setFilterSting] = useState("");

  useEffect(() => {
    //load all available Songs:
    fetchAvailableSongs(setAvailableSongs, setFilteredSongs);
  }, [])

  useEffect(() => {
    setFilteredSongs(filterSongsByString(filterString, availableSongs));
  }, [filterString])
 
  return <Col
    >
      <Row className='mt-4 mb-3'>
        <Col xs={12} md={2} className='mb-auto mt-auto'>
          Search
        </Col>
        <Col xs={12} md={10} className='mb-auto mt-auto'>
          <Form.Control
            type='text'
            placeholder="Search for songs :)"
            onChange={(e) => setFilterSting(e.target.value)}
          />
        </Col>
      </Row>
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
                  fetchQueue(setCurrentQueue);
                }}
              >
                +
              </Button>
            </Col>
          </Row>
      })}
      <Row className='d-flex justify-content-center mt-1 pt-2 mb-2 border-top'>
        Press the + Button to add the song to the queue!
      </Row>
    </Col>
}

export {SongListing};