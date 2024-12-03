// import {parseCSV} from './utils.js';


const express = require('express');
const cors = require('cors');
const path = require('path');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const multer = require('multer');
const { setupDatabase, addUser, loginUser, getAllUsers, getAllAdds, createAdd, deleteAdd, updateClicks, deleteUser, getAllMethods, createMethod, deleteMethod, getMeasure, createMeasure, deleteMeasure } = require('./db_setup.js');
const { parseCSV, measureParseCSV } = require('./utils.js');


const app = express();
const PORT = process.env.PORT || 8080;

setupDatabase();

app.use(cors());

// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, "build")));


app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });


const secretKey = "sdfrgthygfdwdefrg"



app.post("/api/register", async (req, res) => {
  const { name, email, password, age, height } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  const result_qw = await addUser({ name, email, password, age, height })

  if (result_qw.success){
    const token = jwt.sign({ email: email, id: result_qw.id, role: "user" }, secretKey, {
      expiresIn: "1h",
      });
    return res.status(201).json({ message: result_qw.message, token: token });
  }
  else {
    return res.status(400).json({ message: result_qw.message, token: null });
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
    const token = jwt.sign({ email: email, id: result_qw.id, role: role }, secretKey, {
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
      // console.log("Err", err)
      return res.status(403).json({ message: "Invalid token" });
    }
    console.log("valid token")
    res.status(200).json({ message: "Valid token" });
  });
});


app.get('/api/admin/get-adds', async (req, res) =>{
  try {
    const { success, result } = await getAllAdds();


    if (!success) {
      return res.status(500).send("Failed to fetch adds from the database.");
    }

    return res.status(201).json({ data: result });

  } catch (err) {
    console.error("Error adds getting:", err);
    res.status(500).send("An error occurred while add data take.");
  }
})


app.post('/api/admin/create-add', async (req, res) =>{
  const { imageTarget, imageUrl, counter } = req.body;


  try {
    const { success, id } = await createAdd({imageTarget, imageUrl, counter});


    if (!success) {
      return res.status(500).send("Failed to create new add.");
    }

    return res.status(201).json({ message: "Add was successfully created", id: id });;

  } catch (err) {
    console.error("Error adds getting:", err);
    res.status(500).send("An error occurred while add data take.");
  }
})


app.delete('/api/admin/delete-add', async (req, res) =>{
  const { id } = req.body;


  try {
    const { success } = await deleteAdd({id});


    if (!success) {
      return res.status(500).send("Failed to delete add.");
    }

    return res.status(201).json({ message: "Add was successfully dealeted" });

  } catch (err) {
    console.error("Error add delete:", err);
    res.status(500).send("An error occurred while add delete.");
  }
})


app.put('/api/admin/update-clicks', async (req, res) =>{
  const { id } = req.body;


  try {
    const { success } = await updateClicks({id});


    if (!success) {
      return res.status(500).send("Failed to update clicks.");
    }

    return res.status(201).json({ message: "Add was successfully dealeted" });

  } catch (err) {
    console.error("Error add delete:", err);
    res.status(500).send("An error occurred while add delete.");
  }
})


app.get('/api/admin/get-users', async  (req, res) => {
  try {
    const { success, result } = await getAllUsers();


    if (!success) {
      return res.status(500).send("Failed to fetch users from the database.");
    }

    return res.status(201).json({ data: result });

  } catch (err) {
    console.error("Error exporting users:", err);
    res.status(500).send(`An error occurred while get all users. ${err}`);
  }
});


app.delete('/api/admin/delete-user', async (req, res) =>{
  const { id } = req.body;


  try {
    const { success } = await deleteUser({id});


    if (!success) {
      return res.status(500).send("Failed to delete user.");
    }

    return res.status(201).json({ message: "User was successfully deleted" });

  } catch (err) {
    console.error("Error add delete:", err);
    res.status(500).send("An error occurred while add delete.");
  }
})


app.post('/api/upload-csv', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }

    // Преобразование буфера файла в строку
    const csvContent = req.file.buffer.toString('utf-8');

    // Вызов функции parseCSV и ожидание результата
    const result = await parseCSV(csvContent);

    if (result.success) {
      res.json({ success: true, message: result.message });
    } else {
      res.status(400).json({ success: false, message: result.message, errors: result.errors });
    }
  } catch (error) {
    console.error("Error processing CSV upload:", error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});


app.get('/api/download-users-csv', async  (req, res) => {
  try {
    const { success, result: users } = await getAllUsers();


    if (!success) {
      return res.status(500).send("Failed to fetch users from the database.");
    }

    let csvContent = 'name,email,password,age\n';
    users.forEach(user => {
      csvContent += `${user.name},${user.email},${user.password},${user.age}\n`;
    });

    const filePath = path.join(__dirname, 'users_data.csv');
    fs.writeFileSync(filePath, csvContent);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="users_data.csv"');
    res.send(csvContent);
  } catch (err) {
    console.error("Error exporting users:", err);
    res.status(500).send("An error occurred while exporting users.");
  }
});


app.get('/api/get-methods', async (req, res) =>{
  try {
    const { success, result } = await getAllMethods();


    if (!success) {
      return res.status(500).send("Failed to fetch adds from the database.");
    }

    return res.status(201).json({ data: result });

  } catch (err) {
    console.error("Error adds getting:", err);
    res.status(500).send("An error occurred while add data take.");
  }
})


app.post('/api/create-method', async (req, res) =>{
  const { name, description } = req.body;


  try {
    const { success } = await createMethod({name, description});


    if (!success) {
      return res.status(500).send("Failed to create new method.");
    }

    return res.status(201).json({ message: "Method was successfully created" });;

  } catch (err) {
    console.error("Error method creating:", err);
    res.status(500).send("An error occurred while method creating.");
  }
})


app.delete('/api/delete-method', async (req, res) =>{
  const { id } = req.body;


  try {
    const { success, message } = await deleteMethod({id});


    if (!success) {
      return res.status(500).json({ message });
    }

    return res.status(201).json({ message: "Method was successfully dealeted" });

  } catch (err) {
    // if (err.code === 'ER_ROW_IS_REFERENCED_2') {
    //   console.error('Cannot delete method. There are dependent records in weights.');
    //   res.status(500).send('Cannot delete method. There are dependent records in weights.');
    // } else {
    //   console.error('Error deleting method:', err);
    //   res.status(500).send("An error occurred while Method delete.");
    // }
    console.error('Error deleting method:', err);
    res.status(500).send("An error occurred while Method delete.");
  }
})


app.get('/api/user/get-:mode', async (req, res) =>{
  try {
    const { mode } = req.params;
    const { id } = req.query; 

    if (!id) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    
    const { success, result } = await getMeasure(mode, id);


    if (!success) {
      return res.status(500).send("Failed to fetch measurement from the database.");
    }

    return res.status(201).json({ data: result });

  } catch (err) {
    console.error("Error adds getting:", err);
    res.status(500).send("An error occurred while add data take.");
  }
})


app.post('/api/user/add-measure', async (req, res) =>{
  const { mode, methodType, date, value, id } = req.body;
  if (!id){
    return res.status(500).send("An error occurred while measure creating.");
  }

  try {
    const { success } = await createMeasure({mode, methodType, date, value, id});


    if (!success) {
      return res.status(500).send("Failed to create new method.");
    }

    return res.status(201).json({ message: "Method was successfully created" });;

  } catch (err) {
    console.error("Error method creating:", err);
    res.status(500).send("An error occurred while measure creating.");
  }
})


app.delete('/api/user/delete-measure', async (req, res) =>{
  const { id, mode } = req.body;

  try {
    const { success } = await deleteMeasure({id, mode});


    if (!success) {
      return res.status(500).send("Failed to delete Measure.");
    }

    return res.status(201).json({ message: "Measure was successfully dealeted" });

  } catch (err) {
    console.error("Error Measure delete:", err);
    res.status(500).send("An error occurred while Measure delete.");
  }
})



app.post('/api/user/upload-csv/get-:id', upload.single('file'), async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'User ID is required' });
    }


    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }

    const csvContent = req.file.buffer.toString('utf-8');

    const result = await measureParseCSV(csvContent, id);

    if (result.success) {
      res.json({ success: true, message: result.message });
    } else {
      res.status(400).json({ success: false, message: result.message, errors: result.errors });
    }
  } catch (error) {
    console.error("Error processing CSV upload:", error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});


app.get('/api/user/download-measure-csv/get-:mode', async  (req, res) => {
  try {

    const { mode } = req.params;
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    
    const { success, result } = await getMeasure(mode, id);


    if (!success) {
      return res.status(500).send("Failed to fetch mesure from the database.");
    }

    let csvContent = 'date,value,type,method\n';
    result.forEach(item => {
      csvContent += `${new Date(item.date).toISOString().split('T')[0]},${item.value},${item.table_name},${item.method_name}\n`;
    });

    const filePath = path.join(__dirname, `${mode}_data.csv`);
    fs.writeFileSync(filePath, csvContent);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${mode}_data.csv"`);
    res.send(csvContent);
  } catch (err) {
    console.error("Error exporting measures:", err);
    res.status(500).send("An error occurred while exporting measure.");
  }
});





app.use(express.static(path.join(__dirname, 'build')));


app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


module.exports = app;