require("express-async-errors"); 
require("dotenv/config");

const AppError = require("./utils/AppError");

const uploadConfig = require("./configs/upload");

const cors = require("cors");
const express = require("express");
const routes = require("./routes");

const app = express();

app.use(cors());

app.use(express.json()); 

app.use("/files", express.static(uploadConfig.UPLOADS_FOLDER)); //buscando pelo que está dentro da pasta de uploads, na rota /files busco isso através do método static do express

app.use(routes);


app.use((error, request, response, next) => {
  if(error instanceof AppError) {
    return response.status(error.statusCode).json({
      status: "error",
      message: error.message
    });
  }
    console.error(error);
    return response.status(500).json({
    status: "error",
    message: "Internal server error"
  });

});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on Port ${PORT}`));
