// Basic: price_1OCRKtSBvryMQKIBIoGmH4F0
// Standard: price_1OCRLpSBvryMQKIBhM9uhc1X
// Plus: price_1OCRMQSBvryMQKIBU6I01W07

const productsArray = [
    {
        id: "price_1OCRKtSBvryMQKIBIoGmH4F0",
        title: "Basic",
        price: "Free for 14 days",
        limit: "Only 1 user"
    },
    {
        id: "price_1OCRLpSBvryMQKIBhM9uhc1X",
        title: "Standard",
        price: "1,999 /year",
        limit: "Up to 5 users"
    },
    {
        id: "price_1OCRMQSBvryMQKIBU6I01W07",
        title: "Plus",
        price: "3,999 /year",
        limit: "Above 10 users"
    }
];

function getProductData(id) {
    let productData = productsArray.find(product => product.id === id);

    if (productData == undefined) {
        console.log("Product data does not exist for ID: " + id);
        return undefined;
    }

    return productData;
}

export { productsArray, getProductData };