import React, { Component } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

class ProductPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      product: {},
    };
  }

  loadProduct = () => {
    fetch(`http://localhost:8000/api/products/${this.props.match.params.id}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        this.setState({ product: data });
      });
  };

  componentDidMount() {
    this.loadProduct();
  }

  render() {
    const { product } = this.state;
    return (
      <Card style={{ width: "18rem" }} key={product.ProductId}>
        <Card.Img variant="top" src={product.ImageUrl} />
        <Card.Body>
          <Card.Title>{product.Name}</Card.Title>
          <Card.Text>Color: {product.Color}</Card.Text>
          <Card.Title>Price: {product.Price}$</Card.Title>
        </Card.Body>
        <Card.Footer>
          <Button variant="primary">Add to cart</Button>
        </Card.Footer>
      </Card>
    );
  }
}

export default ProductPage;
