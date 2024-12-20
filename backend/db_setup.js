const mysql = require("mysql2/promise");
const bcrypt = require('bcryptjs');

const connectionConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "js_student_6",
  database: process.env.DB_NAME || "js_3_db",
};


const waitForDatabase = async (retries = 5, delay = 5000) => {
  while (retries > 0) {
    try {
      const connection = await mysql.createConnection(connectionConfig);
      await connection.end();
      console.log("[*] Database is ready for connections");
      return;
    } catch (err) {
      console.error(`Database not ready, retrying... (${retries} attempts left)`);
      retries -= 1;
      await new Promise((res) => setTimeout(res, delay));
    }
  }
  throw new Error("Database connection failed after multiple attempts");
};

// Функция для настройки базы данных
const setupDatabase = async () => {
  try {
    // const connection = await mysql.createConnection(connectionConfig);

    // console.log("[*] DB was connected successfully");
    await waitForDatabase();
    const connection = await mysql.createConnection(connectionConfig);

    console.log("[*] Connected to MySQL server");

    const dbName = process.env.DB_NAME || "js_3_db";
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
    console.log(`[*] Database '${dbName}' created or already exists`);

    await connection.changeUser({ database: dbName });

    console.log("[*] Switched to database:", dbName);

    const createUserTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      name VARCHAR(100) NOT NULL,
      password VARCHAR(255) NOT NULL,
      age INT CHECK (age >= 0),
      height DECIMAL(5, 2) CHECK (height >= 0)
    ) ENGINE=InnoDB;
  `;
  
  const createMethodsTableQuery = `
    CREATE TABLE IF NOT EXISTS methods (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      description TEXT
    ) ENGINE=InnoDB;
  `;
  
  const createAddsTableQuery = `
    CREATE TABLE IF NOT EXISTS adds (
      id SERIAL PRIMARY KEY,
      image_link TEXT NOT NULL,
      target_link TEXT NOT NULL,
      counter INT DEFAULT 0
    ) ENGINE=InnoDB;
  `;
  
  const createScalesTableQuery = `
    CREATE TABLE IF NOT EXISTS weights (
      id SERIAL PRIMARY KEY,
      date DATE NOT NULL,
      value DECIMAL(10, 2) NOT NULL,
      method_id BIGINT UNSIGNED,
      user_id BIGINT UNSIGNED,
      CONSTRAINT fk_method_weights FOREIGN KEY (method_id) REFERENCES methods (id),
      CONSTRAINT fk_user_weights FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    ) ENGINE=InnoDB;
  `;
  
  const createHeartbeatTableQuery = `
    CREATE TABLE IF NOT EXISTS heartbeats (
      id SERIAL PRIMARY KEY,
      date DATE NOT NULL,
      value DECIMAL(10, 2) NOT NULL,
      method_id BIGINT UNSIGNED,
      user_id BIGINT UNSIGNED,
      CONSTRAINT fk_method_heartbeats FOREIGN KEY (method_id) REFERENCES methods (id),
      CONSTRAINT fk_user_heartbeats FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    ) ENGINE=InnoDB;
  `;
  
  const createStepsTableQuery = `
    CREATE TABLE IF NOT EXISTS steps (
      id SERIAL PRIMARY KEY,
      date DATE NOT NULL,
      value DECIMAL(10, 2) NOT NULL,
      method_id BIGINT UNSIGNED,
      user_id BIGINT UNSIGNED,
      CONSTRAINT fk_method_steps FOREIGN KEY (method_id) REFERENCES methods (id),
      CONSTRAINT fk_user_steps FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    ) ENGINE=InnoDB;
  `;
  

    const tableQueries = [
      createUserTableQuery,
      createMethodsTableQuery,
      createAddsTableQuery,
      createScalesTableQuery,
      createHeartbeatTableQuery,
      createStepsTableQuery,
    ];

    for (const query of tableQueries) {
      await connection.query(query);
      console.log(`[*] Table created successfully: ${query.split(" ")[5]}`);
    }

    await connection.end();
    console.log("[*] Connection closed successfully.");
    await addUser({name: 'admin', email: 'admin@gmail.com', password: "admin", age: 18, height: 0})
  } catch (err) {
    console.error("Error setting up the database:", err);
  }
};





const getUser = async (userData) => {
  const { email } = userData;
  const selectUserQuery = `
    SELECT * FROM users WHERE email = ?;
  `;

  let connection;

  try {
    connection = await mysql.createConnection(connectionConfig);

    const [result] = await connection.execute(selectUserQuery, [
      email
    ]);

    return {succes: true, result: result}

  } catch (err) {
    console.error("Error login user into the database:", err);
    return {succes: false, result: null}
  }
  finally {
    if (connection) {
      await connection.end();
    }
  }
}


const getAllUsers = async () => {
  const selectUserQuery = `
    SELECT id, email, name, password, age, height FROM users;
  `;

  let connection;


  try {
    connection = await mysql.createConnection(connectionConfig);

    const [result] = await connection.execute(selectUserQuery);

    return {success: true, result: result}

  } catch (err) {
    console.error("Error fetching users from the database:", err);
    return {success: false, result: null}
  }
  finally {
    if (connection) {
      await connection.end();
    }
  }
}


const addUser = async (userData, needHash = true) => {
  const { name, email, password, age, height } = userData;

  const isUserExist = await getUser(userData)
  if (!isUserExist.succes){
    return { success: false, message: "Something went wrong" };
  }

  if (isUserExist.result.length > 0){
    return { success: false, message: "User already exists" };
  }

  let hashedPassword = password;
  if (needHash){
    hashedPassword = await bcrypt.hash(password, 10);
  }

  const insertUserQuery = `
    INSERT INTO users (email, name, password, age, height)
    VALUES (?, ?, ?, ?, ?);
  `;

  let connection;

  try {
    connection = await mysql.createConnection(connectionConfig);

    const [result] = await connection.execute(insertUserQuery, [
      email,
      name,
      hashedPassword,
      age,
      height,
    ]);

    console.log("[*] User was inserted successfully");
    return { success: true, id: result.insertId, message: "User already exists" };

  } catch (err) {
    console.error("Error inserting user into the database:", err);
    return { success: false, message: `Some error was appeared ${err}` };
  }
  finally{
    if (connection){
      await connection.end();
    }
  }
};


const deleteUser = async (data) => {
  const { id } = data;


  const deleteAddQuery = `
    DELETE FROM users WHERE (id = ?);
  `;

  let connection;

  try {
    connection = await mysql.createConnection(connectionConfig);

    const [result] = await connection.execute(deleteAddQuery, [
      id
    ]);

    console.log("[*] User was deleted successfully");
    return { success: true, message: 'User was deleted successfully'};

  } catch (err) {
    console.error("Error deleting User from the database:", err);
    return { success: false, message: `Some error was appeared ${err}` };
  }
  finally{
    if (connection){
      await connection.end();
    }
  }
};


const loginUser = async (userData) => {
  const { email, password } = userData;

  let connection;

  try {
    connection = await mysql.createConnection(connectionConfig);

    const isUserExist = await getUser(userData)
    if (!isUserExist.succes){
      return { success: false, message: "Something went wrong" };
    }


    if (isUserExist.result.length > 0) {
      const isMatch = await bcrypt.compare(password, isUserExist.result[0].password);
      if (isMatch){
        console.log("[*] User was logged in successfully");
        return { success: true, id: isUserExist.result[0].id, message: "Login successful" };
      }
    }
    return { success: false, message: "Invalid email or password" };

  } catch (err) {
    console.error("Error login user into the database:", err);
    return { success: false, message: "Server error", error: err.message };
  }
  finally {
    if (connection) {
      await connection.end();
    }
  }
};



const getAllAdds = async () => {
  const selectUserQuery = `
    SELECT id, image_link, target_link, counter FROM adds;
  `;

  let connection;


  try {
    connection = await mysql.createConnection(connectionConfig);

    const [result] = await connection.execute(selectUserQuery);

    return {success: true, result: result}

  } catch (err) {
    console.error("Error fetching users from the database:", err);
    return {success: false, result: null}
  }
  finally {
    if (connection) {
      await connection.end();
    }
  }
}

const createAdd = async (addData) => {
  const { imageTarget, imageUrl, counter } = addData;


  const insertAddQuery = `
    INSERT INTO adds (image_link, target_link, counter)
    VALUES (?, ?, ?);
  `;

  let connection;

  try {
    connection = await mysql.createConnection(connectionConfig);

    const [result] = await connection.execute(insertAddQuery, [
      imageUrl,
      imageTarget,
      counter
    ]);

    console.log("[*] New Add was inserted successfully");
    return { success: true, message: 'New Add was inserted successfully', id: result.insertId};

  } catch (err) {
    console.error("Error inserting add into the database:", err);
    return { success: false, message: `Some error was appeared ${err}`, id: null };
  }
  finally{
    if (connection){
      await connection.end();
    }
  }
};


const deleteAdd = async (data) => {
  const { id } = data;


  const deleteAddQuery = `
    DELETE FROM adds WHERE (id = ?);
  `;

  let connection;

  try {
    connection = await mysql.createConnection(connectionConfig);

    const [result] = await connection.execute(deleteAddQuery, [
      id
    ]);

    console.log("[*] Add was deleted successfully");
    return { success: true, message: 'Add was deleted successfully'};

  } catch (err) {
    console.error("Error deleting add from the database:", err);
    return { success: false, message: `Some error was appeared ${err}` };
  }
  finally{
    if (connection){
      await connection.end();
    }
  }
};


const updateClicks = async (data) => {
  const { id } = data;


  const updateClicksQuery = `
    UPDATE adds
    SET counter = counter + 1
    WHERE id = ?;
  `;

  let connection;

  try {
    connection = await mysql.createConnection(connectionConfig);

    const [result] = await connection.execute(updateClicksQuery, [
      id
    ]);

    console.log("[*] Counter for clicks was updated");
    return { success: true, message: 'Counter for clicks was updated successfully'};

  } catch (err) {
    console.error("Error updating counter of clicks:", err);
    return { success: false, message: `Some error was appeared ${err}` };
  }
  finally{
    if (connection){
      await connection.end();
    }
  }
};


const getMethodCreate = async (data) => {
  const { name } = data;
  const selectQuery = `
    SELECT id FROM methods WHERE name = ?;
  `;

  console.log("NAME:", name)



  let connection;

  try {
    connection = await mysql.createConnection(connectionConfig);

    const [result] = await connection.execute(selectQuery, [
      name
    ]);

    if (result.length > 0){
      return { success: true, result: result[0].id };
    }
    else {
      const {success, id} = await createMethod({name, description: "No information about this method"})
      if (success){
        return { success: true, result: id };
      }
      return { success:  false};
    }

  } catch (err) {
    console.error("Error login user into the database:", err);
    return {succes: false, result: null}
  }
  finally {
    if (connection) {
      await connection.end();
    }
  }
}


const getAllMethods = async () => {
  const selectMethodsQuery = `
    SELECT id, name, description FROM methods;
  `;

  let connection;


  try {
    connection = await mysql.createConnection(connectionConfig);

    const [result] = await connection.execute(selectMethodsQuery);

    return {success: true, result: result}

  } catch (err) {
    console.error("Error fetching methods from the database:", err);
    return {success: false, result: null}
  }
  finally {
    if (connection) {
      await connection.end();
    }
  }
}

const createMethod = async (addData) => {
  const { name, description } = addData;


  const createMethodQuery = `
    INSERT INTO methods (name, description)
    VALUES (?, ?);
  `;

  let connection;

  try {
    connection = await mysql.createConnection(connectionConfig);

    const [result] = await connection.execute(createMethodQuery, [
      name,
      description
    ]);

    console.log("[*] New Method was inserted successfully");
    return { success: true, id: result.insertId, message: 'New Method was inserted successfully'};

  } catch (err) {
    console.error("Error inserting method into the database:", err);
    return { success: false, message: `Some error was appeared ${err}` };
  }
  finally{
    if (connection){
      await connection.end();
    }
  }
};

const deleteMethod = async (data) => {
  const { id } = data;


  const deleteAddQuery = `
    DELETE FROM methods WHERE (id = ?);
  `;

  let connection;

  try {
    connection = await mysql.createConnection(connectionConfig);

    const [result] = await connection.execute(deleteAddQuery, [
      id
    ]);

    console.log("[*] Method was deleted successfully");
    return { success: true, message: 'Method was deleted successfully'};

  } catch (err) {
    if (err.code === 'ER_ROW_IS_REFERENCED_2') {
      console.error('Cannot delete method. There are dependent records in weights.');
      return { success: false, message: `Cannot delete method. There are dependent records in measurment.` };
    } else {
      console.error('Error deleting method:', err);
      return { success: false, message: `Some error was appeared ${err}` };
    }
  }
  finally{
    if (connection){
      await connection.end();
    }
  }
};


const getMeasure = async (mode, id) => {

  let selectMeasureQuery = `
    SELECT '${mode}' AS table_name, ${mode}.*, methods.name AS method_name, methods.description AS method_description
    FROM ${mode}
    LEFT JOIN methods ON ${mode}.method_id = methods.id
    WHERE ${mode}.user_id = (?);
    `;

  // console.log(selectMeasureQuery);
  // console.log("ID:", id);

  let connection;

  try {
    connection = await mysql.createConnection(connectionConfig);

    const [result] = await connection.execute(selectMeasureQuery, [id]);

    return {success: true, result: result}

  } catch (err) {
    console.error("Error fetching measurement from the database:", err);
    return {success: false, result: null}
  }
  finally {
    if (connection) {
      await connection.end();
    }
  }
}


const createMeasure = async (addData) => {
  const { mode, date, methodType, value, id } = addData;

  console.log("methodType:", methodType)
  console.log("USer Id:", id)

  const createMethodQuery = `
    INSERT INTO ${mode} (date, value, method_id, user_id)
    VALUES (?, ?, ?, ?);
  `;

  let connection;

  try {
    connection = await mysql.createConnection(connectionConfig);

    const [result] = await connection.execute(createMethodQuery, [
      date, value, methodType, id
    ]);

    console.log("[*] New Method was inserted successfully");
    return { success: true, message: 'New Method was inserted successfully'};

  } catch (err) {
    console.error("Error inserting measure into the database:", err);
    return { success: false, message: `Some error was appeared ${err}` };
  }
  finally{
    if (connection){
      await connection.end();
    }
  }
};


const deleteMeasure = async (data) => {
  const { id, mode } = data;


  const deleteQuery = `
    DELETE FROM ${mode} WHERE (id = ?);
  `;

  let connection;

  try {
    connection = await mysql.createConnection(connectionConfig);

    const [result] = await connection.execute(deleteQuery, [
      id
    ]);

    console.log("[*] Measure was deleted successfully");
    return { success: true, message: 'Measure was deleted successfully'};

  } catch (err) {
    console.error("Error deleting measure from the database:", err);
    return { success: false, message: `Some error was appeared ${err}` };
  }
  finally{
    if (connection){
      await connection.end();
    }
  }
};


module.exports = { setupDatabase, addUser, loginUser, getAllUsers, getAllAdds, createAdd, deleteAdd, updateClicks, deleteUser, getAllMethods, createMethod, deleteMethod, getMeasure, createMeasure, deleteMeasure, getMethodCreate};
