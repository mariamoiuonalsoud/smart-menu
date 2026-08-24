// Main server file for initializing the Express app and setting up middleware

const express = require("express");
const cors = require("cors");
const app = express();
const path = require("path");
const port = 3000;
const connectDB = require("mongoose");
const dns = require("dns");
const Menudata = require("./backend/config/db"); // Import the Mongoose model for the "Mydata" collection
const livereload = require("livereload");
const livereloadserver = livereload.createServer();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "frontend", "views"));
require("dotenv").config(); // for reading variables from .env file
app.use("/frontend", express.static(path.join(__dirname, "frontend")));
app.use(express.urlencoded({ extended: true })); // Parse incoming URL-encoded requests
app.use(express.json()); // Parse incoming JSON requests
dns.setServers(["8.8.8.8", "8.8.4.4"]);
//Data is represented in array of objects.

// Serve static files from the "frontend" directory
livereloadserver.watch(path.join(__dirname, "frontend"));
const connectLivereload = require("connect-livereload");
app.use(connectLivereload());

livereloadserver.server.once("connection", () => {
  setTimeout(() => {
    livereloadserver.refresh("/");
  }, 100);
});

app.get("/", (req, res) => {
  Menudata.find({ isHidden: false })
    .then((data) => {
      const groupedMenu = data.reduce((result, meal) => {
        const category = meal.category || "Uncategorized";
        if (!result[category]) {
          result[category] = [];
        }
        result[category].push(meal);
        return result;
      }, {});
      res.render("menu.ejs", {
        title: "Karam El-Sham",
        groupedMenu: groupedMenu,
      });
    })
    .catch((err) => {
      console.log("Error fetching data from the database: ", err);
      res.status(500).json({ error: err.message });
    });
});

// Serve the panel.html file when the /frontend/modules/vibeslab_portal/panel.html route is accessed

app.get("/frontend/modules/vibeslab_portal/panel.html", (req, res) => {
  res.sendFile(
    path.join(
      __dirname,
      ".",
      "frontend",
      "modules",
      "vibeslab_portal",
      "panel.html",
    ),
  );
});

// Serve the manager.html file when the /frontend/modules/menu_manager/manager.html route is accessed

app.get("/frontend/modules/menu_manager/manager.html", (req, res) => {
  res.sendFile(
    path.join(
      __dirname,
      ".",
      "frontend",
      "modules",
      "menu_manager",
      "manager.html",
    ),
  );
});

// API endpoint to fetch all items from the database

app.get("/api/items", (req, res) => {
  Menudata.find()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
      console.log("Find data error: ", err);
    });
});

// API endpoint to update an item in the database by its ID
app.put("/api/items/:id", (req, res) => {
  Menudata.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((items) => {
      res.json(items);
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
      console.log("Update data error: ", err);
    });
});

// API endpoint to delete an item from the database by its ID
app.delete("/api/items/:id", (req, res) => {
  Menudata.findByIdAndDelete(req.params.id)
    .then(() => {
      res.json({ message: "Deleted successfully" });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

// API endpoint to toggle the isHidden property of an item in the database by its ID
app.patch("/api/items/:id", (req, res) => {
  Menudata.findByIdAndUpdate(req.params.id)
    .then((item) => {
      item.isHidden = !item.isHidden;
      return item.save();
    })
    .then((item) => {
      res.json(item);
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

connectDB
  .connect(process.env.dbURL)
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.log("Error connecting to the database: ", err);
  });

app.post("/", (req, res) => {
  console.log(req.body);

  const newMenuData = new Menudata(req.body); // Create a new instance of the Menudata model with the request body data
  newMenuData
    .save()
    .then(() => {
      res.redirect("/frontend/modules/vibeslab_portal/panel.html");
    })
    .catch((err) => {
      console.log("Error saving data to the database: ", err);
    }); // Save the new document to the database
});
