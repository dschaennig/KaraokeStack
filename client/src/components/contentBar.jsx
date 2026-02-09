import React from "react";
import { useState } from "react";
import {
  Card,
  Col,
  Row
} from 'react-bootstrap';

import { SongListing } from "./songListing";
import { Queue } from "./queue";

const ContentBar = () => {

  const [content, setContent] = useState('songlisting');

  return <Card>
    <Card.Header as={Row} className="m-0 p-0 pt-2 pb-2">
      <Col
        xs={6}
        className="m-0 p-0 border-end"
        onClick={() => {
          setContent("songlisting");
        }}
        style={ content == "songlisting" ? {"color" : "#D18500"} : {}}
      >
        Songs
      </Col>
      <Col
        xs={6}
        className="m-0 p-0"
        onClick={() => {
          setContent("queue");
        }}
        style={ content == "queue" ? {"color" : "#D18500"} : {}}
      >
        Queue
      </Col>
    </Card.Header>
    <Card.Body className="m-0 p-0">
      {(content == "songlisting") && <SongListing/>}
      {(content == "queue") && <Queue/>}
    </Card.Body>
  </Card>
}

export {ContentBar};