const axios = require('axios');
const { expect } = require('chai'); 
const mysql = require('mysql2/promise');
const app = require('../server'); 

let server;

describe('End-to-End Test for /api/user/add-measure', () => {
  let connection;

  before(async () => {
    server = app.listen(3000);

    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'js_student_6',
      database: process.env.DB_NAME || 'js_3_db',
    });

    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(100) NOT NULL,
        password VARCHAR(255) NOT NULL,
        age INT CHECK (age >= 0),
        height DECIMAL(5, 2) CHECK (height >= 0)
      ) ENGINE=InnoDB;
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS methods (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT
      ) ENGINE=InnoDB;
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS weights (
        id SERIAL PRIMARY KEY,
        date DATE NOT NULL,
        value DECIMAL(10, 2) NOT NULL,
        method_id BIGINT UNSIGNED,
        user_id BIGINT UNSIGNED,
        CONSTRAINT fk_method_weights FOREIGN KEY (method_id) REFERENCES methods (id),
        CONSTRAINT fk_user_weights FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `);

    // Вставляем тестовые данные
    await connection.query(`
      INSERT INTO users (email, name, password, age, height)
      VALUES ('test_user@gmail.com', 'Test_User', 'password123', 30, 170.5);
    `);

    await connection.query(`
      INSERT INTO methods (name, description)
      VALUES ('Test Method', 'This is a test method');
    `);
  });

  after(async () => {
    await connection.query(`DELETE FROM weights`);
    await connection.query(`DELETE FROM users WHERE email = 'test_user@gmail.com'`);
    await connection.query(`DELETE FROM methods WHERE name = 'Test Method'`);

    await connection.end();
    server.close();
  });

  it('should add a measurement record successfully', async () => {
    const [user] = await connection.query(`SELECT id FROM users WHERE email = 'test_user@gmail.com'`);
    const userId = user[0].id;

    const [method] = await connection.query(`SELECT id FROM methods WHERE name = 'Test Method'`);
    const methodId = method[0].id;

    const res = await axios.post('http://localhost:8080/api/user/add-measure', {
      mode: 'weights',
      methodType: methodId,
      date: '2024-12-03',
      value: 75.5,
      id: userId,
    });

    expect(res.status).to.equal(201);
    expect(res.data).to.have.property('message', 'Method was successfully created');

    const [rows] = await connection.query('SELECT * FROM weights WHERE user_id = ? AND method_id = ?', [userId, methodId]);
    expect(rows).to.have.lengthOf(1);
  });

  it('should return 500 if user_id is missing', async () => {
    try {
      await axios.post('http://localhost:8080/api/user/add-measure', {
        mode: 'weights',
        methodType: 1,
        date: '2024-12-03',
        value: 75.5,
      });
    } catch (err) {
      expect(err.response.status).to.equal(500);
      expect(err.response.data).to.include('An error occurred while measure creating');
    }
  });
});
