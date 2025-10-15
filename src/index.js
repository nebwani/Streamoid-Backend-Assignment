import sequelize from "./db/db.js";
import dotenv from "dotenv";
import express from "express"

dotenv.config({
    path: './.env'
});

import { app } from "./app.js";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const startServer = async () => {
  try {
    
    await sequelize.sync({ alter: true });
    console.log("Database connected successfully!");
    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

