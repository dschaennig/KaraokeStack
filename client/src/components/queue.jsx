import React from 'react';
import { useEffect, useState } from 'react';
import {
  Button,
  Col,
  Row
} from 'react-bootstrap';

import "./songListing.css";
import {
  fetchQueue,
  skipButton
} from './../util/requests.js';

const Queue = () => {

  const skipButtonEnabled = import.meta.env.VITE_SKIP_BUTTON_ACTIVE == "true";

  const [currentQueue, setCurrentQueue] = useState([]);

  useEffect(() => {
    //load the queue:
    fetchQueue(setCurrentQueue);
  }, [])


  return <Col
    >
      <div class="overflow">
        {currentQueue.map((song, index) => {
          return <Row className='d-flex justify-content-center border-bottom m-2 p-2'>
            <Col xs={2} className='mb-auto mt-auto'>
              {index + 1}
            </Col>
            <Col xs={10} className='mb-auto mt-auto'>
              {song.name}
            </Col>
          </Row>
        })}
      </div>
      <Row className='d-flex justify-content-center m-2 p-2'>
        <Col xs={1}>
          &nbsp;
        </Col>
        <Col xs={5}>
          <Button 
            variant='outline-success className'
            onClick={() => {
              fetchQueue(setCurrentQueue);
            }}
          >
            Reload queue
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
            {skipButtonEnabled ? "Skip current Song" : "Skipping not enabled"}
          </Button>
        </Col>        
      </Row>
    </Col>
}

export {Queue};