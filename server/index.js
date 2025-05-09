const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const MongoStore = require("connect-mongo");
const Contact = require("./models/Contacts");
const User = require("./models/Users"); // Ensure correct path to your User model
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const BookRequest = require("./models/BookRequest");
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: ["https://soi-web-dev-2024-frontend.vercel.app"],
    methods: ["POST", "GET"],
    credentials: true,
  })
);

// Connect to MongoDB Atlas
const uri =
  "mongodb+srv://lib-books:bCdK2KWWQc20FSHH@lib-mgmt-cluster.lp5sak8.mongodb.net/?retryWrites=true&w=majority&appName=lib-mgmt-cluster";
mongoose
  .connect(uri, {
    dbName: "UserManagement", // Specify the database name
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB Atlas with Mongoose");
  })
  .catch((err) => {
    console.error(
      "Error connecting to MongoDB Atlas with Mongoose:",
      err.message
    );
  });

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: uri }), // Use the same URI for session store
    cookie: { maxAge: 180 * 60 * 1000 }, // 3 hours
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Passport Local Strategy

app.get("/all-users/:email", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    //console.log(`Title: ${user.books[1].title}`)
    //user.books.forEach(book => {
    //   console.log(`Title: ${book.title}`);
    //});

    if (!user) {
      return res.status(404).send("User not found");
    }
    res.json(user);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Passport Local Strategy
passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });

        if (!user) {
          return done(null, false, { message: "User not found" });
        }
        const isMatch = await user.isValidPassword(password);
        if (!isMatch) {
          return done(null, false, { message: "Incorrect password" });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

app.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(400).send(info.message);

    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.json(user); // Send user data
    });
  })(req, res, next);
});

// Registration Endpoint
app.post("/register", async (req, res) => {
  const { email, name, rollNo, password, books } = req.body;

  // Validate email format
  if (!email.endsWith("@iitdh.ac.in")) {
    return res.status(400).send("Email must be a valid @iitdh.ac.in address");
  }

  try {
    // Create new user instance
    const user = new User({ email, name, rollNo, password, books });

    // Save user to MongoDB
    await user.save();
    res.send("Registration successful!");
    res.redirect("/login");
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).send(err.message);
  }
});

// Example of other endpoints and configurations
// Replace or add your endpoints as needed

// MongoDB client for book inventory
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    console.log("Connected to MongoDB with MongoClient");

    const bookCollections = client.db("BookInventory").collection("Books");
    //for uploading a single book
    app.post("/upload-book", async (req, res) => {
      try {
        const data = req.body;
        const result = await bookCollections.insertOne(data);
        res.send(result);
      } catch (err) {
        console.error("Error uploading book:", err);
        res.status(500).send("Error uploading book");
      }
    });
    //for edit book by id
    app.patch("/book/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const updateBookData = req.body;
        const filter = { _id: new ObjectId(id) };
        const updatedDoc = { $set: { ...updateBookData } };
        const options = { upsert: true };

        const result = await bookCollections.updateOne(
          filter,
          updatedDoc,
          options
        );
        res.send(result);
      } catch (err) {
        console.error("Error updating book:", err);
        res.status(500).send("Error updating book");
      }
    });
    //deleting a book by id
    app.delete("/book/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) };
        const result = await bookCollections.deleteOne(filter);
        res.send(result);
      } catch (err) {
        console.error("Error deleting book:", err);
        res.status(500).send("Error deleting book");
      }
    });
    //fetching single book by id
    app.get("/book/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) };
        const result = await bookCollections.findOne(filter);
        res.send(result);
      } catch (err) {
        console.error("Error fetching book:", err);
        res.status(500).send("Error fetching book");
      }
    });
    //fetching books
    app.get("/all-books", async (req, res) => {
      try {
        let query = {};
        if (req.query?.department) {
          query = { department: req.query.department };
        }
        const result = await bookCollections.find(query).toArray();
        res.send(result);
      } catch (err) {
        console.error("Error fetching books:", err);
        res.status(500).send("Error fetching books");
      }
    });

    // Endpoint to increment book count
    app.patch("/book/:id/increment", async (req, res) => {
      try {
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) };
        const update = { $inc: { count: 1 } };

        const result = await bookCollections.updateOne(filter, update);
        res.send(result);
      } catch (err) {
        console.error("Error incrementing book count:", err);
        res.status(500).send("Error incrementing book count");
      }
    });

    // Endpoint to decrement book count
    app.patch("/book/:id/decrement", async (req, res) => {
      try {
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) };
        const update = { $inc: { count: -1 } };

        const result = await bookCollections.updateOne(filter, update);
        res.send(result);
      } catch (err) {
        console.error("Error decrementing book count:", err);
        res.status(500).send("Error decrementing book count");
      }
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } catch (err) {
    console.error("Error running MongoClient:", err);
  }
}

run().catch(console.dir);

// MongoDB client for user management
async function runMongoClient() {
  try {
    await client.connect();
    console.log("Connected to MongoDB with MongoClient");

    const userCollection = client.db("UserManagement").collection("users");

    // Route to fetch all users
    app.get("/all-users", async (req, res) => {
      try {
        const users = await userCollection.find({}).toArray();
        res.json(users);
      } catch (err) {
        console.error("Error fetching users:", err);
        res.status(500).send("Error fetching users");
      }
    });
    //delete a user
    app.delete("/users/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) };
        const result = await userCollection.deleteOne(filter);
        res.send(result);
      } catch (err) {
        console.error("Error deleting book:", err);
        res.status(500).send("Error deleting book");
      }
    });
    //edit a user details

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } catch (err) {
    console.error("Error running MongoClient:", err);
  }
}

runMongoClient().catch(console.dir);

app.get("/user", (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).send("You need to log in first");
  }
  res.send("Welcome to the main page!");
});

app.post("/contacts", async (req, res) => {
  const { name, email, message } = req.body;
  const newContact = new Contact({ name, email, message });

  try {
    await newContact.save();
    res.status(201).json(newContact);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Admin endpoint to update user books
// PATCH endpoint to update user books
// Admin endpoint to update user books
// Admin endpoint to update user books
app.patch("/users/:id/books", async (req, res) => {
  try {
    const id = req.params.id;
    const { books } = req.body;
    const filter = { _id: new ObjectId(id) };
    const update = { $push: { books: { $each: books } } };
    const options = { upsert: false }; // Do not create a new document if it doesn't exist

    const result = await User.updateOne(filter, update, options);

    if (result.modifiedCount === 0) {
      return res.status(404).send("User not found or no changes made");
    }

    res.send("User books updated successfully");
  } catch (err) {
    console.error("Error updating user books:", err);
    res.status(500).send("Error updating user books");
  }
});

app.patch("/update-user", async (req, res) => {
  const { email, name, rollNo, about, photo } = req.body;
  console.log(req.body);
  try {
    const updatedUser = await User.findOneAndUpdate(
      { email }, // Find the user by email
      { name, rollNo, about, photo }, // Update these fields
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return res.status(404).send("User not found");
    }

    res.json(updatedUser);
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).send("An error occurred while updating the user profile");
  }
});

app.patch("/change-password", async (req, res) => {
  const { email, newPassword } = req.body;

  if (newPassword.length < 8 || newPassword.length > 15) {
    return res
      .status(400)
      .json({ message: "Password must be between 8 and 15 characters." });
  }

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const user = await User.findOneAndUpdate(
      { email },
      { password: hashedPassword },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/bookRequests", async (req, res) => {
  try {
    const bookRequests = await BookRequest.find();
    res.json(bookRequests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST a new book request
app.post("/bookRequests", async (req, res) => {
  const { bookName, url, bookDesc, personName, email, likes, addedOn } =
    req.body;

  const newBookRequest = new BookRequest({
    bookName,
    url,
    bookDesc,
    personName,
    email,
    likes,
    addedOn,
  });

  try {
    const savedBookRequest = await newBookRequest.save();
    res.status(201).json(savedBookRequest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
app.get("/reminders", async (req, res) => {
  try {
    const bookRequests = await BookRequest.find();
    const reminders = bookRequests.map((bookRequest) => ({
      email: bookRequest.email,
      issueDate: bookRequest.issueDate,
      personName: bookRequest.personName,
      bookName: bookRequest.bookName,
      bookDesc: bookRequest.bookDesc,
      url: bookRequest.url,
      addedOn: bookRequest.addedOn,
    }));
    res.json(reminders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.patch("/bookRequests/:id/like", async (req, res) => {
  try {
    const bookRequest = await BookRequest.findById(req.params.id);
    if (!bookRequest) {
      return res.status(404).send("Book request not found");
    }
    bookRequest.likes += 1;
    await bookRequest.save();
    res.status(200).send(bookRequest);
  } catch (error) {
    res.status(500).send(error);
  }
});
app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
