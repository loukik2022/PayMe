import Button from 'react-bootstrap/Button';
import { CartContext } from "../CartContext";
import { useContext } from "react";
import { getProductData } from "../productsStore";

function CartProduct(props) {
    const cart = useContext(CartContext);
    const id = props.id;
    const quantity = props.quantity;
    const productData = getProductData(id);

    let price = productData.price.replace(/[^\d.-]/g, ''); // remove non-digit characters
    if (productData.price.length > 12) {
        price = 0;
    } else {
        price = parseFloat(price); // convert to 2 decimal value
    }
    const TotalCost = id === "Basic" ? 0 : (quantity * price).toFixed(2);

    return (
        <>
            <h3>{productData.title}</h3>
            <p>{quantity} total</p>
            <p>{`₹ ${TotalCost}`}</p>
            <Button size="sm" onClick={() => cart.deleteFromCart(id)}>Remove</Button>
            <hr></hr>
        </>
    )
}

export default CartProduct;