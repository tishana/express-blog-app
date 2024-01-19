const express = require('express')
const app = express()
const port = 3000

const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json({ extended: true }))

// Our route files for users and posts
const users = require('./routes/users')
const posts = require('./routes/posts')

const error = require('./utilities/error')

// Valid API Keys.
apiKeys = ["perscholas", "ps-example", "hJAsknw-L198sAJD-l3kasx"];

// to access: localhost:3000/api/users?api-key=ONEOFTHEKEYS

// New middleware to check for API keys!
// Note that if the key is not verified,
// we do not call next(); this is the end.
// This is why we attached the /api/ prefix
// to our routing at the beginning!
app.use("/api", function (req, res, next) {
  var key = req.query["api-key"];

  // Check for the absence of a key.
  if (!key) next(error(400, "API Key Required"))

  // Check for key validity.
  if (apiKeys.indexOf(key) === -1) next(error(401, "Invalid API Key"))
  
  // Valid key! Store it in req.key for route access.
  req.key = key;
  next();
});

// Use our routes, because duh...
app.use('/api/users', users)
app.use('/api/posts', posts)

app.get("/", (req, res) => {
  res.send("This is the root. All service routes should begin with /api.");
});

// 404 Middleware
app.use((req, res, next) => {
  next(error(404, "Resource Not Found"));
});

// Error-handling middleware.
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({ error: err.message });
});

// Port listening Info
app.listen(port, () => {
    console.log(`Server listening on port: ${port}.`)
  })