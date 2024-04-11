import { Sequelize } from "sequelize";
import { DATABASE_URL } from "./config";

function dbconnection() {
  const sslOptions = {
    rejectUnauthorized: true, // Set rejectUnauthorized to true
  };

  const sequelize = new Sequelize(DATABASE_URL, {
    dialect: "mysql",
    dialectOptions: {
      ssl: sslOptions,
    },
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
