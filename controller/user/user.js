'use strict';
const secretKey = "secretKey";
const user = require('../../models/users');
const product = require('../../models/products');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const country = require('../../models/countrys');
const seededData = require('../../models/seedingCountrys')
module.exports = {

    signup: async (req, res) => {
        const { username, email, password } = req.body;

        try {
            const existingUser = await user.findOne({ name: username });

            if (existingUser) {
                return res.status(400).json({ error: 'Username already exists' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new user({
                _id: new mongoose.Types.ObjectId(),
                name: username,
                email: email,
                password: hashedPassword
            });

            const result = await newUser.save();

            jwt.sign({ data: result }, secretKey, { expiresIn: '10s' }, (err, token) => {
                if (!err) {
                    res.json({ token });
                } else {
                    res.status(500).json({ error: 'Error generating token' });
                }
            });
        } catch (err) {
            res.status(500).json({ error: 'Error saving user data' });
        }
    },

    login: async (req, res) => {
        const username = req.body.username;
        const password = req.body.password;

        try {
            const foundUser = await user.findOne({ role: 'PURCHASER', name: username });

            if (foundUser) {
                const passwordMatch = await bcrypt.compare(password, foundUser.password);

                if (passwordMatch) {
                    jwt.sign({ result: foundUser }, secretKey, { expiresIn: '300s' }, (err, token) => {
                        if (!err) {
                            res.json({ token });
                        } else {
                            res.status(500).json({ error: 'Error generating token' });
                        }
                    });
                } else {
                    res.status(401).json({ error: 'Invalid credentials' });
                }
            }
            else {
                res.status(404).json({ error: 'User not found' });
            }
        } catch (err) {
            res.status(500).json({ error: 'Error finding user' });
        }
    },

    getUser: async (req, res) => {
        try {
            let users = await user.find();
            return res.status(200).send({
                success: true,
                data: users
            });
        } catch (error) {
            console.log(error)
        }
    },

    getProduct: async (req, res) => {
        try {
            let products = await product.find({});
            return res.status(200).send({
                success: true,
                data: products
            });
        } catch (error) {
            console.log(error)
        }
    },

getCountries: async (req, res) => {
        try {
            console.log("country is a ",country);
            let countrys = await country.find();
            console.log("inside country try");
            return res.status(200).send({ success: true, data: countrys });
        } catch (err) {
            console.error('Error fetching country data:', err);
            res.status(500).json({ success: false, error: 'Internal server error' });
        }
    },

getStates: async (req, res) => {
  const countryName = req.query.countryName;

  if (!countryName) {
    return res.status(400).json({ error: 'Missing query parameter: countryName' });
  }

  try {
    const uniqueStateNames = await country.distinct('STATE', { COUNTRY: countryName });
    

    if (uniqueStateNames.length === 0) {
      return res.status(404).json({ message: 'No states found for the given country' });
    }

    return res.json({ country: countryName, states: uniqueStateNames });
  } catch (error) {
    console.error('Error fetching data:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
},

getDetailsByPostalCode: async (req, res) => {
  try {
    const postalCode = parseInt(req.query.postalCode);

    if (!postalCode) {
      return res.status(400).json({ error: 'Postal code parameter is required' });
    }

    const count = await country.estimatedDocumentCount({ 'POSTAL_CODE': postalCode });

    if (count === 0) {
      return res.status(404).json({ message: 'No documents found with postal code ' + postalCode });
    }

    const distinctData = await country.find({ 'POSTAL_CODE': postalCode }).select('COUNTRY COUNTY STATE CITY').limit(10);

    if (!distinctData || distinctData.length === 0) {
            // Insert new data into the "seededData" collection
      const newData = {
        POSTAL_CODE: postalCode,
        COUNTRY: 'New Country',
        COUNTY: 'New County',
        CITY: ['New City'],
        STATE: 'New State'
      };

      await seededData.create(newData);

      const distinctData = await seededData.find({ 'POSTAL_CODE': postalCode }).select('COUNTRY COUNTY STATE CITY').limit(10);

      return res.json(distinctData);
      // return res.status(404).json({ message: 'No documents found with postal code ' + postalCode + '. New data inserted.' });
      // return res.status(404).json({ message: 'Postal code not found' });
    }

    return res.json(distinctData);
  } catch (error) {
    console.error('Error fetching data:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
},

getDetailsByCountry: async (req, res) => {
     const countryName = req.query.countryName;

  if (!countryName) {
    return res.status(400).json({ error: 'Missing query parameter: countryName' });
  }

  try {
    const details = await country.find({ 'COUNTRY': countryName }).select('POSTAL_CODE STATE CITY');

    if (details.length === 0) {
      return res.status(404).json({ message: 'No data found for the given country' });
    }

    return res.json(details);
  } catch (error) {
    console.error('Error fetching data:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
},

getDetailsByCity: async (req, res) => {
    const cityName = req.query.cityName;

  if (!cityName) {
    return res.status(400).json({ error: 'Missing query parameter: cityName' });
  }

  try {
    // Use MongoDB's find method to get postal codes, states, and countries for the given city
    const details = await country.find({ CITY: cityName }).select('POSTAL_CODE STATE COUNTRY');

    if (details.length === 0) {
      return res.status(404).json({ message: 'No data found for the given city' });
    }

    return res.json(details);
  } catch (error) {
    console.error('Error fetching data:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
},
getDetailsByState: async (req, res) => {
  const stateName = req.query.stateName;

  if (!stateName) {
    return res.status(400).json({ error: 'Missing query parameter: stateName' });
  }

  try {
    const query = { 'STATE': stateName };
    const projection = { 'POSTAL_CODE': 1, 'CITY': 1, 'COUNTRY': 1 };

    const details = await country.find(query).select(projection);

    if (details.length === 0) {
      return res.status(404).json({ success: false, message: 'No data found for the given state' });
    }

    return res.json({ success: true, data: details });
  } catch (error) {
    console.error('Error fetching data:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
},
};
