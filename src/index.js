const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/database');
const clientRoutes = require('./client/routes/clientRoutes');


dotenv.config();
const app = express();

// Middleware
app.use(cors({origin:'*'}));
app.use(morgan('dev'));
app.use(express.json());

connectDB();

// Routes
app.use('/api/client',clientRoutes );

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => { // Ajoutez '0.0.0.0' comme host
  console.log(`Server running on port ${PORT}`);
});