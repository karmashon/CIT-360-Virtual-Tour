require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const {logger,logEvents} = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const connectDB = require('./config/dbConn');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 3500;


app.use(cors(corsOptions));
connectDB();
const db = mongoose.connection;


/* used for form */
app.use(express.urlencoded({
    extended: true,
}))

app.use(logger);


app.use(express.json());

app.use(cookieParser());

app.use('/',express.static(path.join(__dirname,'/public')));

app.use('/',require('./routes/root'));
const imageRouter = require('./routes/images'); 
app.use('/images',imageRouter);

const interfaceRouter = require('./routes/interface');
app.use('/contentManager',interfaceRouter);

const s3Router = require('./routes/s3');
app.use('/s3',s3Router);

app.all('*',(req,res) => {
	res.status(404);
	if (req.accepts('html')){
		res.sendFile(path.join(__dirname,'views','404.html'));
	}
	else if (req.accepts('json')){
		res.json({message: '404 Not Found'});
	}
	else{
		res.type('txt').send('404 Not Found');
	}
})

app.use(errorHandler);

db.once('open', () => {
	console.log('Connected to MongoDB');
	app.listen(PORT,() => console.log(`Server running on port ${PORT}`));
})

db.on('error', err => {
    console.log(err)
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log')
})
