import React, { Component } from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import { UserService } from "../Services/UserService";

class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        name: "",
        email: "",
      },
    };
  }

  componentDidMount = () => {
    this.setState({ user: UserService.getUserData() });
  };

  render() {
    return (
      <Navbar bg="light" expand="lg">
        <Navbar.Brand href="/">Webtech Store</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/products">Products</Nav.Link>
            <Nav.Link href="/orders">Orders</Nav.Link>
            <Nav.Link href="/users">Users</Nav.Link>
          </Nav>
          <NavDropdown title={this.state.user.email} id="basic-nav-dropdown">
            <NavDropdown.Item href="/login">Logout</NavDropdown.Item>
          </NavDropdown>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default Menu;
