const express = require("express");
const path = require("path");


const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();


const dbPath = path.join(__dirname, "mock.db");


let db = null;


const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(5031, () => {
      console.log("Server Running at http://localhost:5031/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};


initializeDBAndServer();
﻿
app.post("/users/", async (request, response) => {
    const { username, name, password, gender, location } = request.body;
    const hashedPassword = await bcrypt.hash(request.body.password, 10);
    const selectUserQuery = `SELECT * FROM users WHERE username = '${username}'`;
    const dbUser = await db.get(selectUserQuery);
    if (dbUser === undefined) {
      const createUserQuery = `
        INSERT INTO 
          users (username, name, password, gender, location) 
        VALUES 
          (
            '${username}', 
            '${name}',
            '${hashedPassword}', 
            '${gender}',
            '${location}'
          )`;
      const dbResponse = await db.run(createUserQuery);
      const newUserId = dbResponse.lastID;
      response.send(`Created new user with ${newUserId}`);
    } else {
      response.status = 400;
      response.send("User already exists");
    }
  });
