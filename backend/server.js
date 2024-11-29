const jwt = require('jsonwebtoken');
const express = require('express');
const cors = require('cors');
const path = require('path');
const { setupDatabase, addUser, loginUser } = require('./db_setup');

const app = express();
const PORT = 8080;

setupDatabase();

app.use(express.static(path.join(__dirname, 'public')));
// app.use(cors());

app.use(cors({
  origin: "http://localhost:3000", // Replace with your frontend's URL
  methods: "GET,POST,PUT,DELETE", // Allowed methods
  credentials: true               // Allow cookies if needed
}));

app.use(express.json());

const session = require('express-session');


const secretKey = "sdfrgthygfdwdefrg"




app.get('/api/data', (req, res) => {
  res.json({ message: 'Test' });
});


app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});



app.post("/api/register", async (req, res) => {
  const { name, email, password, age, height } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  const result_qw = await addUser({ name, email, password, age, height })

  if (result_qw.success){
    const token = jwt.sign({ email: email, role: "user" }, secretKey, {
      expiresIn: "1h",
      });
    return res.status(201).json({ message: result_qw.message, token: token });
  }
  else {
    return res.status(400).json({ message: result_qw.message });
  }
});


app.post("/api/login", async (req, res) => {
  let { email, password } = req.body;
  let role = 'user';

  if (email === "admin") {
    console.log("[*] ADMIN MODE")
    email = "admin@gmail.com";
    role = 'admin';
  }

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required!", isAdmin: true});
  }

  const result_qw = await loginUser({ email, password })
  if (result_qw.success){
    const token = jwt.sign({ email: email, role: role }, secretKey, {
      expiresIn: "1h",
    });
    return res.status(201).json({ message: result_qw.message, token: token });
  } 
  else{
    return res.status(400).json({ message: result_qw.message });
  }
});


app.post("/api/validateToken", (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    console.log("missed token")
    return res.status(401).json({ message: "Token missing" });
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      console.log("invalid token")
      console.log("Err", err)
      return res.status(403).json({ message: "Invalid token" });
    }
    console.log("valid token")
    res.status(200).json({ message: "Valid token" });
  });
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
