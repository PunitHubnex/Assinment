import React, { useEffect, useReducer, useState } from "react";
import { Link } from "react-router-dom";
// react-bootstrap components
import {
  Badge,
  Button,
  Card,
  Navbar,
  Nav,
  Table,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import { BASEURL } from "../baseUrl";
import { TodoWrapperLocalStorage } from "components/Todo/TodoWrapperLocalStorage";
function TableList() {
  const [users, setUsers] = useState([]);
  const [update, forceUpdate] = useReducer(x => x + 1, 0)
  const usersData = async () => {
    try {
      const res = await fetch(`${BASEURL}/userData`, { method: "GET" });
      const jsonData = await res.json();
      if (!res.ok) {
        throw new Error(jsonData.message);
      }
      setUsers(jsonData.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    usersData();
  }, [update]);



  const UpdateusersAccess = async (access, id) => {
    try {
      const res = await fetch(`${BASEURL}/userData/${id}`, { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify({ access }) });
      const jsonData = await res.json();
      if (!res.ok) {
        throw new Error(jsonData.message);
      }
      console.log(jsonData.data);
    } catch (error) {
      console.log(error);
    } finally {
      forceUpdate()
    }
  };

  return (
    <>
      <Container fluid>
        <TodoWrapperLocalStorage />

      </Container>
    </>
  );
}

export default TableList;
