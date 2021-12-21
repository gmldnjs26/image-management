const express = require('express')

const app = express();
const PORT = 5555;

app.post('/upload', (req, res) => {
  console.log('/upload called');
  res.json({result: 'success'});
})

app.listen(PORT, () => console.log("Express Server listening on PORT " + PORT))