const express = require('express');
const cors = require('cors');
const stripe = require('stripe')('sk_test_51OCIWZSBvryMQKIBYVqd1We92RBnvkMq4jYxFT42BiioMXiYAl7Oa4hRyddYNQrKLtw0arbfMEl6wfb2WmIjA8BM000cr1WS65');

const app = express();
app.use(cors());
app.use(express.static('public'));
app.use(express.json());


app.post("/checkout", async (req, res) => {
    /*
    req.body.items
    [
        {
            id: 1,
            quantity: 3
        }
    ]

    stripe wants
    [
        {
            price: 1,
            quantity: 3
        }
    ]
    */
    console.log(req.body);
    const items = req.body.items;
    let lineItems = [];
    items.forEach((item)=> {
        lineItems.push(
            {
                price: item.id,
                quantity: item.quantity
            }
        )
    });

    const session = await stripe.checkout.sessions.create({
        line_items: lineItems,
        mode: 'payment',
        success_url: "http://localhost:5173/success",
        cancel_url: "http://localhost:5173/cancel"
    });

    res.send(JSON.stringify({
        url: session.url
    }));
});


app.listen(4000, () => console.log("Listening on port 4000!"));