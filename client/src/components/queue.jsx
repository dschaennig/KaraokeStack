import React from 'react';
import { useEffect, useState } from 'react';
import {
  Accordion,
  Button,
  Col,
  Row
} from 'react-bootstrap';

import "./songListing.css";
import {
  fetchCurrentSong,
  fetchQueue,
  skipButton,
  usingOnlineMode
} from './../util/requests.js';

const Queue = () => {

  const skipButtonEnabled = import.meta.env.VITE_SKIP_BUTTON_ACTIVE == "true";

  const [onlineMode, setOnlineMode] = useState(true);
  const [currentQueue, setCurrentQueue] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);

  function getEmbedForVideo(url) {
    var urlSplit = url.split("/");
    var id = urlSplit[urlSplit.length - 1]
    console.log(id)
    return (
      <iframe
        width="auto"
        height="auto"
        src={"https://www.youtube-nocookie.com/embed/" + id + "?controls=0"}
        title="YouTube video player"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerpolicy="strict-origin-when-cross-origin"
        allowfullscreen>
      </iframe>
    )
  }

  useEffect(() => {
    usingOnlineMode(setOnlineMode);
  }, [])

  useEffect(() => {
    //load the queue and currently playing song:
    fetchQueue(setCurrentQueue);
    fetchCurrentSong(setCurrentSong);
  }, [])


  return <Col
    >
      <Row className='d-flex justify-content-center m-1 p-1 pb-3 mb-3 border-bottom'>
        <h4>Currently playing:</h4>
        {currentSong != null ? (onlineMode ? getEmbedForVideo(currentSong) : currentSong.name)
        :
          "There is currently no song playing"
        }
      </Row>
      <Row className='d-flex justify-content-center m-2 p-2'>
        <Col xs={1}>
          &nbsp;
        </Col>
        <Col xs={5}>
          <Button 
            variant='outline-success className'
            onClick={() => {
              fetchQueue(setCurrentQueue);
              fetchCurrentSong(setCurrentSong);
            }}
          >
            Reload
          </Button>
        </Col>
        <Col xs={5}>
          <Button 
            disabled={!skipButtonEnabled}
            variant='outline-danger className'
            onClick={() => {
              skipButton();
            }}
          >
            {skipButtonEnabled ? "Skip Song" : "Disabled"}
          </Button>
        </Col>        
      </Row>
      <Row  className='d-flex justify-content-center m-0 p-0'>
        <h4>Queue:</h4>
        <div class="overflow">
          {onlineMode ? 
            <Accordion>
              {currentQueue.map((song, index) => {
                return <Accordion.Item eventKey={index.toString()}>
                  <Accordion.Header>
                    <Col xs={2} className='mb-auto mt-auto'>
                      {index + 1}
                    </Col>
                    <Col>
                      {song}
                    </Col>
                  </Accordion.Header>
                  <Accordion.Body>
                    {getEmbedForVideo(song)}
                  </Accordion.Body>
                </Accordion.Item>
              })}
            </Accordion>
          :
            currentQueue.map((song, index) => {
              return <Row className='d-flex justify-content-center border-bottom m-0 p-0 pt-1 pb-1'>
                <Col xs={2} className='mb-auto mt-auto'>
                  {index + 1}
                </Col>
                <Col xs={10} className='mb-auto mt-auto'>
                  {song.name}
                </Col>
              </Row>
            })
          }
        </div>
      </Row>
    </Col>
}

export {Queue};