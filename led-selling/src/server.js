import express from "express";
import connectDB from "./config/connectDB";
import configViewEngine from "./config/viewEngine";
import router from "./routes";
import bodyParser from "body-parser";
// import connectFlash from "connect-flash";
// import configSession from "./config/session";
// import passport from "passport";
// import initPassport from "./config/passport";
import http from "http";
// import socketIO from "socket.io";
// import initSockets from "./sockets";
// import cookieParser from "cookie-parser";
// import configSocketIO from "./config/socketIO";
import configLogger from "./config/logger";

// Init app
let app = express();

// Init server
let server = http.createServer(app);

// Config logger
configLogger(app);

// Connect to MongoDB
connectDB();

// // Config session
// configSession(app);

// Config view engine
configViewEngine(app);

// Enable post data for request
app.use(bodyParser.urlencoded({ extended: true }));

// // Enable flash messages
// app.use(connectFlash());

// // Use Cookie Parse
// app.use(cookieParser());

// // Config passportjs
// app.use(passport.initialize());
// app.use(passport.session());
// initPassport(passport);

// Handle app routes
app.use("/", router);


// // Config socketIO
// configSocketIO(io);

// // Init all sockets
// initSockets(io);

server.listen(process.env.APP_PORT, process.env.APP_HOST, () => {
  console.log(`Hello, The Server is running at http://${process.env.APP_HOST}:${process.env.APP_PORT}/`);
});
