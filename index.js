
const fs = require('fs');
const path = require('path');
const cors = require('cors');
// load dependencies
const env = require('dotenv');
const express = require('express');
const flash = require('express-flash');
const bodyParser = require('body-parser');
const session = require('express-session');
const expressHbs = require('express-handlebars');
const SequelizeStore = require("connect-session-sequelize")(session.Store); // initalize sequelize with session store
const multer = require('multer');

const app = express();

const router = express.Router();


const uploadsDir = path.join('/tmp', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// ✅ Now define storage after uploadsDir exists
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });


// ✅ Enable CORS
app.use(cors({
	origin: 'http://localhost:3000', // Allow requests from frontend
	methods: 'GET,POST,PUT,DELETE',  // Allowed methods
	credentials: true                // Allow cookies/session
  }));
  
//Loading Routes
// const webRoutes = require('./routes/auth');
const {authRoute, chatbotRoutes, aiImageRoutes,trackerRoutes}=require('./routes/index');
const sequelize = require('./config/database');
const errorController = require('./app/controllers/ErrorController');

env.config();
app.use(bodyParser.json()); // For parsing application/json
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// required for csurf
app.use(
	session({
	  secret: process.env.SESSION_SECRET,
	  resave: false,
	  saveUninitialized: false,
	  store: new SequelizeStore({
		db: sequelize,
	  }),
	  cookie: { maxAge: 1209600000 }, // Two weeks
	})
  );

app.use(flash());

app.use((req, res, next) => {
	res.locals.isAuthenticated = req.session.isLoggedIn;
	next();
});

app.engine(
	'hbs',
	expressHbs({
		layoutsDir: 'views/layouts/',
		defaultLayout: 'web_layout',
		extname: 'hbs'
	})
);
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use('/api/v1',authRoute);
app.use('/api/v1/chatbot', chatbotRoutes);
app.use('/api/v1/trackerdata', trackerRoutes);
app.use('/api/v1/genaiimg', aiImageRoutes);
app.use('/uploads', express.static(uploadsDir));

app.use(errorController.pageNotFound);

app.post('/', upload.single('file'), (req, res) => {
  try {
    res.status(200).json({
      message: 'File uploaded successfully',
      filename: req.file.filename,
      path: req.file.path,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Upload failed' });
  }
});


sequelize
	//.sync({force : true})
	.sync()
	.then(() => {
		app.listen(process.env.PORT);
		//pending set timezone
		console.log("App listening on port " + process.env.PORT);
	})
	.catch(err => {
		console.log(err);
	});
