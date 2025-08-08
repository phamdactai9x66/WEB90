const { orders, customers, products } = require("./constants");
const http = require("http");

// const url2 = require("url");

const hostname = "localhost";
const port = 8080;

const app = http.createServer((req, res) => {
  const url = req.url;

  switch (url) {
    case "/orders": {
      res.end(JSON.stringify(orders));
      return;
    }
    case "/customers/c001": {
      const paramId = "c001";

      const customer = customers.find((customer) => customer.id === paramId);

      return res.end(JSON.stringify(customer));
    }

    case "/customers/c001/orders": {
      try {
        const customerId = "c001";

        const customerOrders = orders.filter(
          (order) => order.customerId === customerId
        );

        return res.end(
          JSON.stringify({
            status: 200,
            data: customerOrders,
            message: "you call api customers/c001/orders success",
          })
        );
      } catch (error) {
        return res.end(
          JSON.stringify({
            status: 500,
            data: [],
            message: "you call api customers/c001/orders fail",
          })
        );
      }
    }

    case "/orders/highvalue": {
      try {
        const customerOrders = orders.filter(
          (order) => order.totalPrice > 10000000
        );

        return res.end(
          JSON.stringify({
            status: 200,
            data: customerOrders,
            message: "you call api orders/highvalue success",
          })
        );
      } catch (error) {
        return res.end(
          JSON.stringify({
            status: 500,
            data: [],
            message: "you call api orders/highvalue fail",
          })
        );
      }
    }

    case "/products?minPrice=900000&maxPrice=10000000": {
      try {
        // const parseUrl = url2.parse(req.url, true).query;

        const minPrice = 900000;
        const maxPrice = 10000000;

        const rangePrice = products.filter((product) => {
          return product.price >= minPrice && product.price <= maxPrice;
        });

        res.end(
          JSON.stringify({
            status: 200,
            data: rangePrice,
            message:
              "you call api /products?minPrice=900000&maxPrice=10000000 success",
          })
        );
      } catch (error) {
        return res.end(
          JSON.stringify({
            status: 500,
            data: [],
            message:
              "you call api /products?minPrice=900000&maxPrice=10000000 fail",
          })
        );
      }
    }
  }

  res.end(JSON.stringify("Not found"));
});

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
