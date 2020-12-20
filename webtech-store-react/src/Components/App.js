import "./App.css";
import Menu from "./Menu";
import Orders from "./Orders";
import Users from "./Users";
import ProductPage from "./ProductPage";
import ProductList from "./ProductList";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Main from "./Main";
import Login from "./Login";
import { ProtectedRoute } from "./ProtectedRoute";

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/login" component={Login} />
          <ProtectedRoute path="/" component={Main} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
