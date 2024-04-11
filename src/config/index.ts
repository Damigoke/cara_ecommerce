import { Sequelize } from "sequelize";
import { DB_URL } from "./config";

function dbconnection() {
  const sslOptions = {
    rejectUnauthorized: false, // Set rejectUnauthorized to true
  };

  const sequelize = new Sequelize(DB_URL, {
    dialect: "mysql",
    dialectOptions: {
      ssl: sslOptions,
    },
    // timezone: '+00:00',
  });

  sequelize
    .authenticate()
    .then(() => {
      console.log(
        "Connection to the database has been established successfully."
      );
    })
    .catch((err) => {
      console.error("Unable to connect to the database:", err);
    });

  return sequelize;
}

export default dbconnection;
