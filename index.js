const express = require("express");
const formidable = require("formidable");
const nodemailer = require("nodemailer");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const route = express.Router();
app.use(
  cors({
    origin: process.env.VERCEL_DOMAIN || "http://localhost:3000",
  })
);

const port = process.env.PORT || 5000;

/** Log the req */
app.use("/v1", route);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

route.get("/ping", (req, res, next) =>
  res.status(200).json({ hello: "world" })
);

route.use("/send-form", async (req, res) => {
  const data = await new Promise((resolve, reject) => {
    const form = new formidable.IncomingForm();

    form.parse(req, (err, fields, files) => {
      if (err) reject({ err });
      resolve({ fields, files });
    });
  });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_LOGIN,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const attachments = Object.values(data.files).map((file) => {
    return { path: file.filepath, filename: file.originalFilename };
  });

  const mailOptions = {
    from: "",
    to: process.env.EMAIL_TO,
    subject: "3 миллиарда ватт",
    html: `<div dir="auto">
              <h2>Пол - ${data.fields.gender}</h2>
              <h2>Возраст - ${data.fields.age}</h2>
              <h2>Cлово-ассоциация - ${data.fields.loveWord}</h2>
              <h2>Геолокация - ${data.fields.geoLink}</h2>
              <h2>Что связано с этим местом - ${data.fields.geoDesc}</h2>
             </div>`,
    attachments: attachments,
  };
  console.log(data, attachments);
  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    return res.status(500).json({ error: "Error while sending email" });
  }
  res.status(200).json({ email: "sent", data, attachments });
});
