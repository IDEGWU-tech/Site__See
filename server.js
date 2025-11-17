// Minimal Express server showing an endpoint for bookings (JS backend)
// npm install express body-parser pg mysql2
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());

app.post('/api/book', (req, res) => {
  const data = req.body;
  // Demo: log booking; in production insert into DB
  console.log('Received booking:', data);
  res.json({status:'ok'});
});

const port = process.env.PORT || 4000;
app.listen(port, ()=> console.log(`JS backend running on ${port}`));
