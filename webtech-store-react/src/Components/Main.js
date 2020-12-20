import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";
import Menu from "./Menu";
import Orders from "./Orders";
import ProductList from "./ProductList";
import ProductPage from "./ProductPage";
import Users from "./Users";

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <Router>
        <div className="App">
          <Menu />
          <Switch>
            <Route path="/orders" component={Orders} />
            <Route path="/users" component={Users} />
            <Route path="/products" component={ProductList} />
            <Route path="/product/:id" component={ProductPage} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default Main;
