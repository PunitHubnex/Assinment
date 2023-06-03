import React, { Component } from "react";
import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";

class Footer extends Component {
  render() {
    return (
      <footer className="footer px-0 px-lg-3">
        <Container fluid>
          <nav>
            <ul className="footer-menu">
              <li>
                <Link to="#pablo" onClick={(e) => e.preventDefault()}>
                  Home
                </Link>
              </li>
              <li>
                <Link to="#pablo" onClick={(e) => e.preventDefault()}>
                  Company
                </Link>
              </li>
              <li>
                <Link to="#pablo" onClick={(e) => e.preventDefault()}>
                  Portfolio
                </Link>
              </li>
              <li>
                <Link to="#pablo" onClick={(e) => e.preventDefault()}>
                  Blog
                </Link>
              </li>
            </ul>
            <p className="copyright text-center">
              © {new Date().getFullYear()}{" "}
              <Link to="/">Telegram bot</Link>, made by Punit🎈
            </p>
          </nav>
        </Container>
      </footer>
    );
  }
}

export default Footer;
