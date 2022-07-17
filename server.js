const path = require("path");
const cors = require("cors");
const express = require("express");
const app = express();
const { logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");
const verifyJWT = require('./middleware/verifyJWT');
const cookieParser = require('cookie-parser');
const corsOptions = require('./config/corsOptions'); 
const credentials = require('./middleware/credentials');
const PORT = process.env.PORT || 3500;

// custom middleware - custom logger;
app.use(logger);

// handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

// cross origin resource sharing
app.use(cors(corsOptions));

// built-in middleware to handle urlencoded data ('content-type : application/x-www-form-urlencoded);
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json
app.use(express.json());

// middleware for cookies
app.use(cookieParser());

// built-in middleware for static  files
app.use(express.static(path.join(__dirname, "/public")));

// routes
app.use("/", require("./routes/root"));
app.use('/register',require('./routes/api/register'));
app.use('/auth',require('./routes/api/auth'));
app.use('/refresh',require('./routes/api/refresh'));
app.use('/logout',require('./routes/api/logout'));

app.use(verifyJWT);
app.use('/employees',require('./routes/api/employees'));

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "404 NOT FOUND!" });
  } else {
    res.type("txt").send("404 NOT FOUND!");
  }
});

app.use(errorHandler);


app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
