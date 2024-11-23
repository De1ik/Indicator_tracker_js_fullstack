const express = require('express');
const cors = require('cors');
const path = require('path');
const { setupDatabase, addUser, loginUser } = require('./db_setup');

const app = express();
const PORT = 8080;

setupDatabase();

app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(express.json());



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
    return res.status(201).json({ message: result_qw.message });
  }
  else {
    return res.status(400).json({ message: result_qw.message });
  }
});


app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  const result_qw = await loginUser({ email, password })
  if (result_qw.success){
    return res.status(201).json({ message: result_qw.message });
  } 
  else{
    return res.status(400).json({ message: result_qw.message });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
