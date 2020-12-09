import React, { Component } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import CardDeck from "react-bootstrap/CardDeck";

class ProductList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
    };
  }

  getProducts = () => {
    fetch("http://localhost:8000/api/products/all")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        this.setState({ products: data });
      });
  };

  componentDidMount() {
    this.getProducts();
  }

  render() {
    const image =
      "https://www.arraymedical.com/wp-content/uploads/2018/12/product-image-placeholder.jpg";
    return (
      <CardDeck>
        {this.state.products.map((product) => {
          const link = `/product/${product.ProductId}`;
          return (
            <Card style={{ width: "18rem" }} key={product.ProductId}>
              <Card.Img variant="top" src={product.ImageUrl} />
              <Card.Body>
                <Card.Title>{product.Name}</Card.Title>
                <Card.Text>Color: {product.Color}</Card.Text>
                <Card.Title>Price: {product.Price}$</Card.Title>
              </Card.Body>
              <Card.Footer>
                <a href={link}>
                  <Button variant="primary">See more</Button>
                </a>
              </Card.Footer>
            </Card>
          );
        })}
      </CardDeck>
    );
  }
}

export default ProductList;
