const express = require('express');
const app = express();
const fs = require('fs');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());







const posts = [];

app.get('/api/posts', (req, res) => {
  res.send(posts);
});

app.post('/api/posts', (req, res) => {
  const post = req.body;
  posts.push(post);
  res.send('Post added');
});








app.post('/api/addData', (req, res) => {
  const newData = req.body;
  fs.readFile('data.json', (err, data) => {
    if (err) throw err;

    const json = JSON.parse(data);
    const stateExists = json.some((d) => d.state === newData.state && d.experience === newData.experience && d.gender === newData.gender);
    if (!stateExists) {
      json.push(newData);
      fs.writeFile('data.json', JSON.stringify(json), (err) => {
        if (err) throw err;
        res.status(200).send('Data added to file');
      });
    } else {
      res.status(400).send('Data already exists in file');
    }
  });
});


app.get('/api/print', (req, res) => {
    console.log("hello");
 })
console.log("hello");
app.listen(3001, () => console.log('Server running on port 3001'));
