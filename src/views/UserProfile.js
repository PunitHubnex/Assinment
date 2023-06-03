import moment from "moment/moment";
import { BASEURL } from "../baseUrl";
import React, { useEffect, useReducer, useState } from "react";

// react-bootstrap components
import {
  Badge,
  Button,
  Card,
  Form,
  Navbar,
  Nav,
  Container,
  Row,
  Col
} from "react-bootstrap";

function User() {

  const [data, setData] = useState({})
  const usersData = async () => {
    try {
      const res = await fetch(`${BASEURL}/userData/${window.localStorage.getItem('userId')}`, { method: "GET" });
      const jsonData = await res.json();
      if (!res.ok) {
        throw new Error(jsonData.message);
      }
      let data = jsonData.data

      setData(data)
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    usersData();
  }, []);


  return (
    <>
      <Container fluid>
        <Row>
          <Col md="7">
            <Card>
              <Card.Header>
                <Card.Title as="h4">Edit Profile</Card.Title>
              </Card.Header>
              <Card.Body>
                <Form >
                  <Row>
                    <Col className="pr-1" md="5">
                      <Form.Group>
                        <label>User Name</label>
                        <Form.Control
                          defaultValue=" Punit AST"
                          disabled
                          placeholder="Company"
                          type="text"
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="12">
                      <Form.Group>
                        <label>User Email</label>
                        <Form.Control
                          placeholder="For security token is not show"
                          type="text"
                          value={data.email}
                        ></Form.Control>
                      </Form.Group>
                    </Col>

                  </Row>
                  <Row>
                    <Col md="12">
                      <Form.Group>
                        <label>Joining Time(In hours)</label>
                        <Form.Control
                          placeholder="give time in hours"
                          type="text"
                          value={moment(data.createdDate).format('DD-MM-YY')}
                        ></Form.Control>
                      </Form.Group>
                    </Col>

                  </Row>

                  <div className="clearfix"></div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
          <Col md="4">
            <Card className="card-user">
              <div className="card-image">
                <img
                  alt="..."
                  src={require("assets/img/photo-1431578500526-4d9613015464.jpeg")}
                ></img>
              </div>
              <Card.Body>
                <div className="author">
                  <img
                    alt="..."
                    className="avatar border-gray"
                    src={require("assets/img/faces/face-3.jpg")}
                  ></img>
                  <h5 className="title">Punit AST</h5>
                </div>
              </Card.Body>

            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default User;
