import logo from "./logo.svg";
import "./App.css";
import Menu from "./Menu";
import Orders from "./Orders";
import Users from "./Users";
import ProductPage from "./ProductPage";
import ProductList from "./ProductList";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

function App() {
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

export default App;
