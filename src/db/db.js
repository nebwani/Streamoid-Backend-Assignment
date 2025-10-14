import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config({
    path: './.env'
});

const sequelize =   new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        dialect: "postgres",
        port: process.env.DB_PORT,
        logging: false,
    }
)

export default sequelize;

(async () => {
  try {
    await sequelize.authenticate();
    console.log("PostgreSQL connected successfully!");
  } catch (error) {
    console.error("PostgreSQL connection error:", error);
    process.exit(1);
  }
})();
