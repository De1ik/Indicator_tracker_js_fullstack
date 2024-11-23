const mysql = require("mysql2/promise");
const bcrypt = require('bcrypt');

// Конфигурация соединения
const connectionConfig = {
  host: "localhost",
  user: "root",
  password: "js_student_6",
  database: "js_3_db",
};

// Функция для настройки базы данных
const setupDatabase = async () => {
  try {
    const connection = await mysql.createConnection(connectionConfig);

    console.log("[*] DB was connected successfully");

    const createUserTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(100) NOT NULL,
        password VARCHAR(255) NOT NULL,
        age INT CHECK (age >= 0),
        height DECIMAL(5, 2) CHECK (height > 0)
      );
    `;

    const createMethodsTableQuery = `
      CREATE TABLE IF NOT EXISTS methods (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT
      );
    `;

    const createAddsTableQuery = `
      CREATE TABLE IF NOT EXISTS adds (
        id SERIAL PRIMARY KEY,
        image_link TEXT NOT NULL,
        target_link TEXT NOT NULL,
        counter INT DEFAULT 0
      );
    `;

    const createScalesTableQuery = `
      CREATE TABLE IF NOT EXISTS scales (
        id SERIAL PRIMARY KEY,
        date DATE NOT NULL,
        value DECIMAL(10, 2) NOT NULL,
        method_id BIGINT UNSIGNED,
        CONSTRAINT fk_method_scales FOREIGN KEY (method_id) REFERENCES methods (id)
      );
    `;

    const createHeartbeatTableQuery = `
      CREATE TABLE IF NOT EXISTS heartbeats (
        id SERIAL PRIMARY KEY,
        date DATE NOT NULL,
        value DECIMAL(10, 2) NOT NULL,
        method_id BIGINT UNSIGNED,
        CONSTRAINT fk_method_heartbeats FOREIGN KEY (method_id) REFERENCES methods (id)
      );
    `;

    const createStepsTableQuery = `
      CREATE TABLE IF NOT EXISTS steps (
        id SERIAL PRIMARY KEY,
        date DATE NOT NULL,
        value DECIMAL(10, 2) NOT NULL,
        method_id BIGINT UNSIGNED,
        CONSTRAINT fk_method_steps FOREIGN KEY (method_id) REFERENCES methods (id)
      );
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


const addUser = async (userData) => {
  const { name, email, password, age, height } = userData;

  const isUserExist = await getUser(userData)
  if (!isUserExist.succes){
    return { success: false, message: "Something went wrong" };
  }

  if (isUserExist.result.length > 0){
    return { success: false, message: "User already exists" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

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
    return { success: true, message: "User already exists" };

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
        return { success: true, message: "Login successful" };
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


module.exports = { setupDatabase, addUser, loginUser };
