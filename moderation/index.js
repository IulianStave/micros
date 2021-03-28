const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// one POST route handlerer for /events
app.post('/events', async (req, res) => {
  // destructure body 
  const { type, data } = req.body;

  if (type === 'CommentCreated') {
    const status = data.content.includes('orange') ? 'rejected': 'approved';
    console.log(status);
    // send the event to eventbus
    await axios.post('http://eventbus-srv:4005/events', {
      type: 'CommentModerated',
      data: {
        id: data.id,
        postId: data.postId,
        status,
        content: data.content
      }
    })
  
  }
});

app.listen(4003, () => {
  console.log('Listening on 4003')
});