const express = require("express");
const app = express();
var methodOverride = require("method-override");

var session = require("express-session");

const bcrypt = require("bcrypt");

const upload = require("./src/middlewares/uploadFiles");

// sequalize image
const config = require("./src/config/config.json");
const { Sequelize, QueryTypes, ARRAY } = require("sequelize");
const sequelize = new Sequelize(config.development);

const path = require("path");
const port = 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set("views", path.join(__dirname, "src/"));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.post("/projects", upload.single("image"), postProject);
app.use(express.static("src/assets"));

const flash = require("connect-flash");
app.use(flash());

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 2,
    },
  })
);

app.use((req, res, next) => {
  res.locals = {
    ...res.locals,
    userId: req.session.userId || null,
    userName: req.session.userName || null,
    isLogin: req.session.isLogin || false,
    errorEmail: req.flash("error-email"),
    succsessLogin: req.flash("success-login"),
  };

  next();
});

app.get("/", home);
app.get("/projects/:id", showProject);
app.post("/projects", upload.single("image"), postProject);
app.patch("/projects/:id", upload.single("image"), updateProject);
app.delete("/projects/:id", deleteProject);

app.get("/testi", testi);
app.get("/testi/rating/:bintang", testiBintang);
app.get("/contact", contact);
app.post("/contact", postContact);

app.get("/login", login);
app.post("/login", userLogin);

app.get("/register", register);
app.post("/register", addRegister);

app.listen(port, () => {
  console.log("Berjalan Di Port http://localhost:5000");
});

const availableTechnologies = [
  { value: "node-js", label: "Node.js" },
  { value: "react", label: "React" },
  { value: "vue-js", label: "Vue Js" },
  { value: "express", label: "Express" },
  { value: "mongodb", label: "Mongo DB" },
  { value: "tailwind", label: "Tailwind" },
  { value: "laravel", label: "Laravel" },
  { value: "postgres", label: "Postgresql" },
];

let dataTesti = [];

fetch("https://api.npoint.io/11be16bc5f763e5ba191")
  .then((response) => response.json())
  .then((testimonials) => {
    dataTesti.push(...testimonials);
  })
  .catch((error) => {
    console.error("Error fetching testimonials:", error);
  });

function calculateAndFormatProjectDuration(project) {
  const startDate = new Date(project.start_date);
  const endDate = new Date(project.end_date);
  return calculateAndFormatDuration(startDate, endDate);
}

function calculateAndFormatDuration(startDate, endDate) {
  const yearDiff = endDate.getFullYear() - startDate.getFullYear();
  const monthDiff = endDate.getMonth() - startDate.getMonth();
  const dayDiff = endDate.getDate() - startDate.getDate();

  if (yearDiff === 0 && monthDiff === 0 && dayDiff === 0) {
    return "1 hari";
  }

  const duration = { years: yearDiff, months: monthDiff, days: dayDiff + 1 };

  const parts = [];

  if (duration.years > 0) {
    parts.push(`${duration.years} Year`);
  }

  if (duration.months > 0) {
    parts.push(`${duration.months} Month`);
  }

  if (duration.days > 0) {
    parts.push(`${duration.days} Day`);
  }

  return parts.join(", ");
}

async function home(req, res) {
  try {
    let query = `SELECT "Projects".*, "Users".id AS author_id, "Users".name AS author_name FROM "Projects" LEFT JOIN "Users" ON "Projects".author = "Users".id`;
    if (req.session.isLogin) {
      query += ` WHERE "Projects".author=${req.session.userId} ORDER BY id ASC;`;
    }
    const data = await sequelize.query(query, { type: QueryTypes.SELECT });

    const dataModif = data.map((prevData) => ({
      ...prevData,
      duration: calculateAndFormatProjectDuration(prevData),
    }));

    res.render("views/index", {
      dataProject: dataModif,
      availableTechnologies,
    });
  } catch (error) {
    console.log(error);
  }
}

function formatDate(date) {
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Intl.DateTimeFormat("en-US", options).format(date);
}

async function showProject(req, res) {
  const id = req.params.id;

  try {
    const query = `SELECT "Projects".*, "Users".id AS author_id, "Users".name AS author_name FROM "Projects" LEFT JOIN "Users" ON "Projects".author = "Users".id WHERE "Projects".id=${id} ;`;
    const data = await sequelize.query(query, { type: QueryTypes.SELECT });

    const dataProject = data[0];

    const dataProjectWithDuration = {
      ...dataProject,
      duration: calculateAndFormatProjectDuration(dataProject),
      start_date: formatDate(dataProject.start_date),
      end_date: formatDate(dataProject.end_date),
    };

    res.render("views/detail", {
      dataProject: dataProjectWithDuration,
      availableTechnologies,
    });
  } catch (error) {
    console.log(error);
  }
}

async function postProject(req, res) {
  try {
    const {
      author,
      name,
      start_date,
      end_date,
      technologies,
      description,
      image,
      imageDescription,
    } = req.body;

    const technologiesArray = Array.isArray(technologies)
      ? technologies.map((tech) => `'${tech}'`)
      : [`'${technologies}'`];

    await sequelize.query(`INSERT INTO "Projects"(
      author, name, start_date, end_date, description, technologies, image, "createdAt", "updatedAt")
      VALUES (${author}, '${name}', '${start_date}', '${end_date}', '${description}', ARRAY[${technologiesArray}], '${
      "/images/" + req.file.filename
    }', NOW(), NOW());`);

    console.log("data baru");
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
}

async function updateProject(req, res) {
  try {
    const id = req.params.id;

    const {
      name,
      start_date,
      end_date,
      technologies,
      description,
      image,
      imageDescription,
    } = req.body;

    const technologiesArray = Array.isArray(technologies)
      ? technologies.map((tech) => `'${tech}'`)
      : [`'${technologies}'`];

    let updateQuery = `UPDATE "Projects"
      SET name='${name}', start_date='${start_date}', end_date='${end_date}', description='${description}', technologies=ARRAY[${technologiesArray}], "updatedAt"=NOW()`;

    if (req.file) {
      const currentImageQuery = `SELECT image FROM "Projects" WHERE id=${id}`;
      const currentImageObj = await sequelize.query(currentImageQuery, {
        type: QueryTypes.SELECT,
      });
      const currentImage = currentImageObj[0].image;

      const fs = require("fs");
      const imagePath = path.join(__dirname, "src/assets", currentImage);
      fs.unlinkSync(imagePath);

      updateQuery += `, image='${"/images/" + req.file.filename}'`;
    }

    updateQuery += ` WHERE id=${id}`;

    await sequelize.query(updateQuery);

    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
}

async function deleteProject(req, res) {
  const { id } = req.params;

  const currentImageQuery = `SELECT image FROM "Projects" WHERE id=${id}`;
  const currentImageObj = await sequelize.query(currentImageQuery, {
    type: QueryTypes.SELECT,
  });
  const currentImage = currentImageObj[0].image;

  const fs = require("fs");
  const imagePath = path.join(__dirname, "src/assets", currentImage);
  fs.unlinkSync(imagePath);

  await sequelize.query(`DELETE FROM "Projects" WHERE id=${id}`);

  res.redirect("/");
}

// end project

function testi(req, res) {
  res.render("views/testimonials", { dataTesti });
}

function testiBintang(req, res) {
  const { bintang } = req.params;
  const dataBintang = dataTesti.filter((b) => b.rating == bintang);
  res.render("views/testimonials", { dataTesti: dataBintang, bintang });
}

function contact(req, res) {
  res.render("views/contact");
}

function postContact(req, res) {
  try {
    const { name, email, phone, subject, message } = req.body;

    const emailReceiver = "fauzanyanuarp@gmail.com";
    const mailtoLink = `mailto:${name}?subject=${subject}&body=Hello nama saya ${name}, ${subject}, ${message}, hubungi saya email: ${email}, telp: ${phone}`;

    res.redirect(mailtoLink);
  } catch (error) {
    console.log(error);
  }
}

// login

async function login(req, res) {
  if (req.session.isLogin) {
    res.redirect("/");
    return;
  }
  const email = null;
  res.render("views/auth/login", { email });
}

async function userLogin(req, res) {
  try {
    const { email, password } = req.body;
    const query = `SELECT * FROM "Users" WHERE email='${email}'`;

    const obj = await sequelize.query(query, {
      type: QueryTypes.SELECT,
    });

    if (!obj.length) {
      req.flash("error-email", "Email or password is incorrect");
      res.redirect("/login");
      return;
    }

    await bcrypt.compare(password, obj[0].password, (err, result) => {
      if (result) {
        req.flash("success-login", "Login successful");
        req.session.userId = obj[0].id;
        req.session.userName = obj[0].name;
        req.session.isLogin = true;
        res.redirect("/");
      } else {
        req.flash("error-email", "Email or password is incorrect");
        res.redirect("/login");
      }
    });
  } catch (err) {
    console.log(err);
  }
}

// end login

// register

function register(req, res) {
  if (req.session.isLogin) {
    res.redirect("/");
    return;
  }
  res.render("views/auth/register");
}
async function addRegister(req, res) {
  try {
    const { name, email, password } = req.body;
    salt = 10;

    const query = `SELECT * FROM "Users" WHERE email='${email}'`;

    const obj = await sequelize.query(query, {
      type: QueryTypes.SELECT,
    });

    if (obj.length > 0 && obj[0].email === email) {
      req.flash("error-email", "Email has been registered");
      res.redirect("/register");
      return;
    }

    await bcrypt.hash(password, salt, (err, HashPassword) => {
      const query = `INSERT INTO "Users"(name, email, password, "createdAt", "updatedAt")
      VALUES ('${name}', '${email}', '${HashPassword}', NOW(), NOW())`;

      sequelize.query(query);
      res.render("views/auth/login", { email });
    });
  } catch (err) {
    console.log(err);
  }
}

// end register

app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});
