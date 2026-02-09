import { useState, useEffect } from 'react';
import React from 'react';
import './App.css';
import {
  Col,
  Container,
  Row
} from 'react-bootstrap';

import { ContentBar } from './components/contentBar';

function App() {

  return (
    <Container fluid>
      <Row className='d-flex justify-content-center'>
        <Col><h2>Welcome to the Karaoke Stack Application :)</h2></Col>
      </Row>
      <ContentBar/>
    </Container>
  )
}

export default App
