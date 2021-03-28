const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(bodyParser.json())
app.use(cors());

const posts = {};

const handleEvent = (type, data) => {
  if (type === 'PostCreated') {
    const { id, title } = data;
    posts[id] = { id, title, comments: [] };
  }
  if (type === 'CommentCreated') {
    const { id, content, postId, status } = data;
    
    const post = posts[postId];
    post.comments.push({ id, content, status });
  }
  if (type === 'CommentUpdated') {
    const { id, content, postId, status } = data;
    const post = posts[postId];
    const comment = post.comments.find(comment => {
      return comment.id === id;
    });
    comment.status = status;
    comment.content = content;
  }
};

app.get('/posts', (req, res) => {
  res.send(posts);
});

app.post('/events', (req, res) => {
  const { type, data } = req.body;
  handleEvent(type, data);

  // print out the current data structure (post collection that we have)
  // console.log(posts);
  // send back a response 
  // - an empty object we received the event and processed it
  res.send({});
});


app.listen(4002, async () => {
  console.log('Listening on 4002');

  // make a request to eventbus microservice 4005
  const res = await axios.get('http://eventbus-srv:4005/events');
  for (let event of res.data){
    console.log('Processing event:', event.type);
    handleEvent(event.type, event.data);

  }
});