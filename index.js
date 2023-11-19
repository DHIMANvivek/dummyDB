const express = require("express");
const webpush = require("web-push");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
app.use(express.static(path.join(__dirname, "client")));
// const bodyParser = require('body-parser');
// Public Key:        // generate-vapid-keys 
// BDDvK37Ilar67CEVw8dXCkUXKvvN5gnaVrXu8MiejuT5LGcyhf1EwrVypIv7hJ1STiW--kBJsJtX92_HGj03L-M

// Private Key:
// 7SyxWhjrA6HxkWzApULEeMyAo56mIB6oBI9m79EVLyg
// const publicVapidKey = 'BDDvK37Ilar67CEVw8dXCkUXKvvN5gnaVrXu8MiejuT5LGcyhf1EwrVypIv7hJ1STiW--kBJsJtX92_HGj03L-M';
// const privateVapidKey = '7SyxWhjrA6HxkWzApULEeMyAo56mIB6oBI9m79EVLyg';

// app.use(bodyParser.json());

// webpush.setVapidDetails('mailto:googlydhiman.4236@gmail.com', publicVapidKey, privateVapidKey);
// app.post('/subscribe', (req, res) => {
//     const subscription = req.body;
//     console.log(subscription);
//     res.status(201).json({});
//     const payload = JSON.stringify({ title: 'eCommerce New Notification' });
//     webpush.sendNotification(subscription, payload).catch(err => console.error(err));
// });


// {
//   "endpoint": "https://push.example.com/some-endpoint",
  
  
  
  
//   "keys": {
//     "auth": "auth_key_here",
//     "p256dh": "p256dh_key_here"
//   }
// }


require("./config/db/db");
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

const routes = require('./routes/route');
app.use(routes);


// app.get('/', (req, res) => {
//     res.json({
//         message: 'Welcome to the API'
//     });
// });

let port = 4000;
app.listen(4000, (err) => {
    if (err)
        console.log(err);
    else
        console.log(`listening to port ${port}`);
});
