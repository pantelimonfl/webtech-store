import React, { Component } from "react";
import GoogleLogin from "react-google-login";
import { UserService } from "../Services/UserService";

class GoogleAuth extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.handleResponse = this.handleResponse.bind(this);
  }

  handleResponse = (response) => {
    UserService.googleLogin(response.tokenId).then(() => {
      const { from } = {
        from: { pathname: "/" },
      };
      this.props.history.push(from);
    });
  };

  render() {
    return (
      <GoogleLogin
        clientId="886505657506-2pcbmgfifcrdbsnljnphj68d8lrrn9i7.apps.googleusercontent.com"
        buttonText="Login with Google"
        onSuccess={this.handleResponse}
        cookiePolicy={"single_host_origin"}
      />
    );
  }
}
export default GoogleAuth;
