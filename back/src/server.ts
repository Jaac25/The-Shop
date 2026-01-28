import app from "./app";
import { sequelize } from "./infraestructure/db/sequelize";

const PORT = process.env.PORT || 3000;

sequelize.sync().then(() => {
  console.log("✅ DB conectada");

  app.listen(PORT, () => {
    console.log(`🚀 API running on http://localhost:${PORT}`);
  });
});
