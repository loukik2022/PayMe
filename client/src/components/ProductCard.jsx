import { Card, Button, Form, Row, Col } from 'react-bootstrap';
import { CartContext } from '../CartContext';
import { useContext } from 'react';
import './ProductCard.css'; 

function ProductCard(props) {
    const product = props.product;
    const cart = useContext(CartContext);
    const productQuantity = cart.getProductQuantity(product.id);

    return (
        
        <Card className="product-card">
            <div className="card-title-section">
                <Card.Title>{product.title}</Card.Title>
            </div>
            <Card.Body>
                <Card.Text className="price-text">{product.title === "Basic" ? product.price : `₹ ${product.price}`}</Card.Text>
                <Card.Text>{product.limit}</Card.Text>
                {productQuantity > 0 ? (
                    <>
                        <Form as={Row} className="mt-3">
                            <Form.Label column sm={6}>In Cart: {productQuantity}</Form.Label>
                            <Col sm={6} className="d-flex align-items-center justify-content-end">
                                <Button className="mr-2" onClick={() => cart.addOneToCart(product.id)}>+</Button>
                                <Button onClick={() => cart.removeOneFromCart(product.id)}>-</Button>
                            </Col>
                        </Form>
                        <Button variant="danger" onClick={() => cart.deleteFromCart(product.id)}>Remove from cart</Button>
                    </>
                ) : (
                    <Button variant="primary" onClick={() => cart.addOneToCart(product.id)}>Add To Cart</Button>
                )}
            </Card.Body>
        </Card>
    )
}

export default ProductCard;
