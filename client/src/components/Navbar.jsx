import {Button, Container, Navbar, Modal, Dropdown } from 'react-bootstrap';
import { useState, useContext } from 'react';
import { CartContext } from "../CartContext";
import CartProduct from './CartProduct';

function NavbarComponent(props) {
    const cart = useContext(CartContext);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleLogout = () => {
        sessionStorage.removeItem('user');
        props.onLogout();
        window.location.reload();
      };
    
    const checkout = async () => {
        await fetch('http://localhost:4000/checkout', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({items: cart.items})
        }).then((response) => {
            return response.json();
        }).then((response) => {
            if(response.url) {
                window.location.assign(response.url); // Forwarding user to Stripe
            }
        });
    }

    const productsCount = cart.items.reduce((sum, product) => sum + product.quantity, 0);

    return (
        <>  
            <Navbar expand="sm" className="navbar-light" style={{ borderRadius: '15px', backgroundColor: '#e3f2fd', width: '100%', paddingLeft: '15px', paddingRight: '15px' }}>
                <Navbar.Brand href="/">Pricing</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse className="justify-content-end">
                <Button variant="outline-light" onClick={handleShow} className="mx-3 bg-light text-dark" >
                    <img src={'cart.png'} alt="Cart" style={{ marginRight: '8px', width: "20%"}} /> 
                    Cart ({productsCount} Items)
                </Button>

                {props.user ? <Button variant="outline-light" className="text-dark" onClick={handleLogout}> <img src={props.user.photoURL} alt="dp" referrerPolicy='no-referrer' style={{height: '30px'}}/> Logout</Button> : null}

                </Navbar.Collapse>
            </Navbar>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Cart</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {productsCount > 0 ?
                        <>
                            <p>Items in your cart:</p>
                            {cart.items.map((currentProduct, idx) => (
                                <CartProduct key={idx} id={currentProduct.id} quantity={currentProduct.quantity}></CartProduct>
                            ))}

                            <h1>Total: {cart.getTotalCost().toFixed(2)}</h1>

                            <Button variant="success" onClick={checkout}>
                                Purchase items!
                            </Button>
                        </>
                        :
                        <h4>There are no items in your cart!</h4>
                    }
                </Modal.Body>
            </Modal>
        </>
    )
}

export default NavbarComponent;