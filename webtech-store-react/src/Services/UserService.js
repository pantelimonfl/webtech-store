const jwt = require("jsonwebtoken");
export const UserService = {
  login,
  googleLogin,
  logout,
  getUserData,
  isLoggedIn,
};

function login(email, password) {
  const loginEndpoint = `http://localhost:8000/api/users/login?Email=${email}&Password=${password}`;
  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  };

  return fetch(loginEndpoint, requestOptions)
    .then(handleResponse)
    .then((token) => {
      if (token) {
        localStorage.setItem("auth_token", token);
      }

      return token;
    });
}

function googleLogin(token) {
  const loginEndpoint = `http://localhost:8000/api/google/login/${token}`;
  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  };

  return fetch(loginEndpoint, requestOptions)
    .then(handleResponse)
    .then((token) => {
      if (token) {
        localStorage.setItem("auth_token", token);
      }

      return token;
    });
}

function isLoggedIn() {
  return localStorage.getItem("auth_token");
}

function logout() {
  localStorage.removeItem("auth_token");
}

function getUserData() {
  const token = localStorage.getItem("auth_token");
  if (token) {
    const user = jwt.decode(token);
    return {
      email: user.Email,
      name: user.Name,
    };
  }
}

function handleResponse(response) {
  return response.text().then((text) => {
    const data = text;
    if (!response.ok) {
      if (response.status === 401) {
        logout();
        window.location.reload();
      }
    }

    return data;
  });
}
