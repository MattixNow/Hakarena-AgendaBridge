const express = require('express');
const { body } = require('express-validator');
const { sanitizeBody } = require('express-validator');

c

const app = express();
app.use(express.json());

app.post('/comment', [
  body('email')
    .isEmail()
    .normalizeEmail(),
  body('text')
    .not().isEmpty()
    .trim()
    .escape(),
  sanitizeBody('notifyOnReply').toBoolean()
], (req, res) => {
  // Handle the request somehow
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))