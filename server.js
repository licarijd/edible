/*Stripe Test Secret Key (won't actually charge cards, use for testing):
sk_test_XiNs7U7o7HcsC0F7s249m24z

Test Publishable Key:
pk_test_46rh9JVaHf6uNj9pvZaFSio8*/

const stripe = require("stripe")("sk_test_XiNs7U7o7HcsC0F7s249m24z");
const http = require('http');
const hbs = require('handlebars');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// If an incoming request uses
// a protocol other than HTTPS,
// redirect that request to the
// same url but with HTTPS
const forceSSL = function() {
  return function (req, res, next) {
    if (req.headers['x-forwarded-proto'] !== 'https') {
      return res.redirect(['https://', req.get('Host'), req.url].join(''));
    }
    next();
  }
}

// Instruct the app
// to use the forceSSL
// middleware
app.use(forceSSL());

// Run the app by serving the static files
// in the dist directory
app.use(express.static(__dirname + '/feedback'/* + '/dist'*/));
app.use(express.static(__dirname + '/signup'/* + '/dist'*/));
app.use(express.static(__dirname + '/build'));

// For all GET requests, send back index.html
// so that PathLocationStrategy can be used

app.get('/feedback/*', function(req, res) {
  res.sendFile(path.join('/feedback/index.html'));
});

app.get('/signup/*', function(req, res) {
  res.sendFile(path.join('/signup/index.html'));
});

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname + '/build/index.html'));
});


//app.use(require('connect').bodyParser());
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

/**bodyParser.json(options)
 * Parses the text as JSON and exposes the resulting object on req.body.
 */

/*Mailgun info*/
var api_key = 'key-a79f8d805d25a51cad5b608ef2933483';
var domain = 'sandbox22fc0dbba1c64ed1bc62b398dec5603d.mailgun.org';
var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});

function contact(name, email, message) {
		
  var data = {
  from: 'Edible <me@samples.mailgun.org>',
  to: 'edibleappofficial@gmail.com',
  subject: 'Feedback from '+name+' at '+email,
  text: message
};
  /*Send confirmation email*/
	mailgun.messages().send(data, function (error, body) {
		console.log(body);
	});
}

function signup(name, email, zip) {
		
  var data = {
  from: 'Edible <me@samples.mailgun.org>',
  to: 'edibleappofficial@gmail.com',
  subject: 'Feedback from '+name+' at '+email,
  text: message
};
  /*Send confirmation email*/
	mailgun.messages().send(data, function (error, body) {
		console.log(body);
	});
}
		

function contacttest() {
		
  var data = {
  from: 'Edible <me@samples.mailgun.org>',
  to: 'edibleappofficial@gmail.com',
  subject: 'New email from ',
  text: 'test2'
};
		
  /*Send confirmation email*/
	mailgun.messages().send(data, function (error, body) {
		console.log(body);
	});
}

function sendEmail(uid) {
		
  var data = {
  from: 'Edible <me@samples.mailgun.org>',
  to: 'edibleappofficial@gmail.com',
  subject: 'A new user has purchased food',
  text:/* uid+' has just purchased food'*/ 'A user has just purchased food'
};
		
  /*Send confirmation email*/
	mailgun.messages().send(data, function (error, body) {
		console.log("sending mail");
		console.log(body);
		console.log(error);
	});
}

function sendEmailPremium(uid) {
		
  var data = {
  from: 'Edible <me@samples.mailgun.org>',
  to: 'edibleappofficial@gmail.com',
  subject: 'A new user has purchased documents and training',
  text: uid+' has just purchased docs and training'
};
		
  /*Send confirmation email*/
	mailgun.messages().send(data, function (error, body) {
		console.log(body);
	});
}

function sendEmailTraining(uid) {
		
  var data = {
  from: 'Edible <me@samples.mailgun.org>',
  to: 'edibleappofficial@gmail.com',
  subject: 'A new user has purchased 4 hours of training',
  text: uid+' has just purchased training'
};
		
  /*Send confirmation email*/
	mailgun.messages().send(data, function (error, body) {
		console.log(body);
	});
}

app.post('/feedback', function(req, res){
	//console.log(req.body.name, req.body.email, req.body.message);
	contact(req.body.name, req.body.email, req.body.message);
	//contacttest();	
});

app.post('/sign-up', function(req, res){
	//console.log(req.body.name, req.body.email, req.body.message);
	signup(req.body.name, req.body.email, req.body.zip);
	//contacttest();	
});
 
app.post('/sendmail', function(req, res){
	console.log(req.body.userIdentifier);
	sendEmail(req.body.userIdentifier);	
});

/*app.post('*', function(req, res){
	console.log(req.body.userIdentifier);
	sendEmail(req.body.userIdentifier);	
});

app.get('*', function(req, res){
	console.log(req.body.userIdentifier);
	sendEmail(req.body.userIdentifier);	
});*/

app.post('/sendmailpremium', function(req, res){
	console.log(req.body.userIdentifier);
	sendEmailPremium(req.body.userIdentifier);	
});

app.post('/sendmailtraining', function(req, res){
	console.log(req.body.userIdentifier);
	sendEmailTraining(req.body.userIdentifier);	
});

app.post('/cc', function(req, res){
	console.log(req.body.stripeToken);

	// Token is created using Stripe.js or Checkout!
	// Get the payment token submitted by the form:
	var token = req.body.stripeToken; // Using Express
	// Charge the user's card:
	var charge = stripe.charges.create({
		amount: 5000,
		currency: "cad",
		description: "Do-it-yourself kit",
		source: token
	}, function(err, charge) {
		// asynchronously called
		
	});
});

app.post('/ccpremium', function(req, res){
	console.log(req.body.stripeToken);

	// Token is created using Stripe.js or Checkout!
	// Get the payment token submitted by the form:
	var token = req.body.stripeToken; // Using Express
	// Charge the user's card:
	var charge = stripe.charges.create({
		amount: 50000,
		currency: "cad",
		description: "Do-it-yourself kit & online training",
		source: token
	}, function(err, charge) {
		// asynchronously called
		
	});
});

app.post('/cctraining', function(req, res){
	console.log(req.body.stripeToken);

	// Token is created using Stripe.js or Checkout!
	// Get the payment token submitted by the form:
	var token = req.body.stripeToken; // Using Express
	// Charge the user's card:
	var charge = stripe.charges.create({
		amount: 45000,
		currency: "cad",
		description: "Online training",
		source: token
	}, function(err, charge) {
		// asynchronously called
		
	});
});

// Start the app by listening on the default
// Heroku port
app.listen(process.env.PORT || 3000);