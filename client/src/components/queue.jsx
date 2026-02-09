import React from 'react';
import {
  Col,
  Row
} from 'react-bootstrap';

import {
  fetchQueue,
  skipButton
} from './../util/requests.js';

const Queue = () => {

  const [currentQueue, setCurrentQueue] = useState([]);

  useEffect(() => {
    //load the queue:
    fetchQueue(setCurrentQueue);
  }, [])


  return <Col
    >
      {currentQueue.map((song, index) => {
        return <Row className='d-flex justify-content-center border-bottom'>
          <Col xs={2}>
            {index + 1}
          </Col>
          <Col xs={10}>
            {song.name}
          </Col>
        </Row>
      })}
      <Row className='d-flex justify-content-center border-top border-bottom'>
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