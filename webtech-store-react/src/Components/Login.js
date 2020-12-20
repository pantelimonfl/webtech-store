import "./Login.css";
import React, { Component } from "react";

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
    };
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleLogin = (e) => {};

  render() {
    const { email, password } = this.state;
    return (
      <div>
        <div className="wrapper fadeInDown">
          <div id="formContent">
            <form onSubmit={this.handleLogin}>
              <input
                type="text"
                id="login"
                className="fadeIn second"
                name="email"
                placeholder="login"
                onChange={this.handleChange}
                value={email}
              />
              <input
                type="password"
                id="password"
                className="fadeIn third"
                name="password"
                placeholder="password"
                onChange={this.handleChange}
                value={password}
              />
              <input type="submit" className="fadeIn fourth" value="Log In" />
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
