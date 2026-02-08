import { useState, useEffect } from 'react';
import React from 'react';
import './App.css';
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Row
} from 'react-bootstrap';

import {
  fetchAvailableSongs,
  fetchQueue,
  addSongToQueue,
  skipButton
} from './util/requests.js';

import filterSongsByString from './util/filterString.js';

function App() {

  const [availableSongs, setAvailableSongs] = useState([]);
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [filterString, setFilterSting] = useState("");
  const [currentQueue, setCurrentQueue] = useState([]);

  useEffect(() => {
    //load all available Songs:
    fetchAvailableSongs(setAvailableSongs, setFilteredSongs);

    //load the queue:
    fetchQueue(setCurrentQueue);
  }, [])

  useEffect(() => {
    setFilteredSongs(filterSongsByString(filterString, availableSongs));
  }, [filterString])
 
  return (
    <Container fluid>
      <Row className='d-flex justify-content-center'>
        <Col>Welcome to the Karaoke Stack Application :)</Col>
      </Row>
      <br/><br/>
      <Card className='p-0 m-0'>
        <Card.Header className='border-bottom-0'>
          <Row>
            <Col xs={12} md={6}>This is the current queue</Col>
            <Col xs={12} md={6} className='border-end'>These are all the available songs</Col>
          </Row>
        </Card.Header>
        <Card.Body className='border-start border-start border-end'>
          <Row>
            <Col xs={12} md={6}>
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
              <Row className='d-flex justify-content-center mt-3 pt-3 border-top border-bottom pb-3'>
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
                    variant='outline-danger className'
                    onClick={() => {
                      //skipButton();
                    }}
                  >
                    No Skip anymore :)
                  </Button>
                </Col>
                <Col xs={1}>
                  &nbsp;
                </Col>
                
              </Row>
            </Col>
            <Col xs={12} md={6} className='border-start'>
              <Row className='border-bottom mb-1 pb-3'>
                <Col xs={12} md={2} className='mb-1 mt-1'>
                  Search
                </Col>
                <Col xs={12} md={10}>
                  <Form.Control
                    type='text'
                    placeholder="Search for songs :)"
                    onChange={(e) => setFilterSting(e.target.value)}
                  />
                </Col>
              </Row>
              {filteredSongs.map((song) => {
                return <Row className='d-flex justify-content-center border-bottom pt-2 pb-2'>
                  <Col xs={10}>
                    {song.name}
                  </Col>
                  <Col xs={2}>
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
              <Row className='d-flex justify-content-center mt-3 pt-3 border-top border-bottom'>
                Press the + Button to add the song to the queue!
              </Row>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default App
