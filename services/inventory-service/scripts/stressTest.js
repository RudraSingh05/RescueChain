const axios = require("axios");

const URL = "http://localhost:4000/inventory/reserve";

async function runTest() {
  const requests = [];

  for (let i = 0; i < 50; i++) {
    requests.push(
      axios.post(URL, {
        supplierId: "8cb11652-6741-4dda-8dcc-a65df5c917d2",
        itemName: "OXYGEN_CYLINDER",
        quantity: 2,
        requestType: "DELIVERY",
      })
      .then(res => ({ success: true }))
      .catch(err => ({ success: false }))
    );
  }

  const results = await Promise.all(requests);

  const success = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;

  console.log("Success:", success);
  console.log("Failed:", failed);
}

runTest();