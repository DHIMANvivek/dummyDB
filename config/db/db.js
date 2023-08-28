const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://androidvivek:androidvivek@cluster0.ay1mh.mongodb.net/ecommerce_venturepact?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('connection successful');
}).catch((err) => console.log(err));