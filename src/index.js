import sequelize from "./db/db.js";
import dotenv from "dotenv";
import express from "express"
import router from "./routes/product.routes.js";

dotenv.config({
    path: './.env'
});

import { app } from "./app.js";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", router);

(async () => {
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
})();


