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
  const [validURL, setValidURL] = useState(false);
  const [enteredURL, setEnteredURL] = useState("");

  const youtubeUrlRe = new RegExp("https://youtu.be/[a-zA-Z0-9_-]{11}")
  function parseURL(url) {
    setValidURL(youtubeUrlRe.test(url))
  };

  function getCleanURL(url) {
    return url.match(youtubeUrlRe)[0]
  }


  useEffect(() => {
    usingOnlineMode(setOnlineMode);
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
      { onlineMode ?
        <Row className='ps-4 pe-4 m-4'>
          <Col xs={8} md={10}>
            <Form.Control
              type='text'
              id="urlField"
              placeholder='Insert YouTube URL to Karaoke Song! :)'
              onChange={(e) => {
                parseURL(e.target.value);
                setEnteredURL(e.target.value);
              }}
            />
          </Col>
          <Col xs={4} md={2}>
            { validURL ?
              <Button
                variant="outline-success"
                onClick={() => {
                  addSongToQueue(getCleanURL(enteredURL));
                  setEnteredURL("");
                  document.getElementById('urlField').value="";
                }}
              >
                Submit
              </Button>
            :
              <Button variant="outline-danger">
                Invalid URL
              </Button>
            }
          </Col>
        </Row>
      :
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
      }
      <Row className='d-flex justify-content-center border-top p-2 m-1'>
        Press the + Button to add the song to the queue!
      </Row>
    </Col>
}

export {SongListing};