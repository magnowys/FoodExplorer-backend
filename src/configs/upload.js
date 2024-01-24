const path = require("path");
const multer = require("multer");
const crypto = require("crypto");

const TMP_FOLDER = path.resolve(__dirname,"..", "..", "tmp"); //dois pontos para sair dessa pasta, depois mais dois pontos pra sair da pasta src, e na raiz teremos uma pasta "tmp".

const UPLOADS_FOLDER = path.resolve(TMP_FOLDER,"uploads"); //dentro desta pasta teremos uma pasta "uploads".

const MULTER = {
  storage: multer.diskStorage({
  destination: TMP_FOLDER,
  filename(request, file, callback){
    const fileHash = crypto.randomBytes(10).toString("hex"); //criptografei, gerei aleatório preenchendo um intervalo de 10 bytes, coloquei em formato hexadecimal
    const fileName = `${fileHash}-${file.originalname}`;

    return callback(null, fileName);
  },
  }),
};

module.exports = {
  TMP_FOLDER,
  UPLOADS_FOLDER,
  MULTER,
}