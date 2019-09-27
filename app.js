if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();
}

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// set up express app
const app = express();

// connect to mongodb
mongoose.connect(process.env.dbURI, { useNewUrlParser: true }, () => {
  console.log('Connected to MongoDB');
});

// static files
app.use(express.static('public'));

// set up view engine
app.set('view engine', 'ejs');

app.use(bodyParser.json());

app.use(express.urlencoded({ extended: false }));

// set up routes
app.use('/', require('./routes/routes'));

//error handling middleware
app.use( (error, req, res, next) => {
  console.log('error')
  res.status(422).send({error: error.message});
});

  // initialize the Fitbit API client
const FitbitApiClient = require("fitbit-node");
const client = new FitbitApiClient({
	clientId: "22B5D4",
	clientSecret: "a21507946862c9891c42fb044e8e0b15",
	apiVersion: '1.2' // 1.2 is the default
});

// redirect the user to the Fitbit authorization page
app.get("/authorize", (req, res) => {
	// request access to the user's activity, heartrate, location, nutrion, profile, settings, sleep, social, and weight scopes
	res.redirect(client.getAuthorizeUrl('activity, heartrate, location, sleep', 'http://localhost:3000/callback'));
});

// handle the callback from the Fitbit authorization flow
app.get("/callback", (req, res) => {
  // exchange the authorization code we just received for an access token
  console.log(req.query.code)
	client.getAccessToken(req.query.code, 'http://localhost:3000/callback').then(result => {
    // use the access token to fetch the user's profile information
    console.log(result.access_token)
		client.get("/profile.json", result.access_token).then(results => {
      res.send(results[0]);
		}).catch(err => {
			res.status(err.status).send(err);
		});
	}).catch(err => {
		res.status(err.status).send(err);
	});
});

const server = app.listen(process.env.PORT || 3000, '0.0.0.0', () => {
  console.log('Listening on port ' + (process.env.PORT || 3000));
});