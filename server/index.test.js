const request = require("supertest");
const app = require("./index"); // Update with your server file path
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const User = require("./models/Users");
const Contact = require("./models/Contacts");
const BookRequest = require("./models/BookRequest");

let mongoServer;
let authToken;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  // Clear databases before each test
  await User.deleteMany({});
  await Contact.deleteMany({});
  await BookRequest.deleteMany({});
});

describe("User Authentication", () => {
  test("POST /register - should create a new user", async () => {
    const res = await request(app).post("/register").send({
      email: "test@iitdh.ac.in",
      name: "Test User",
      rollNo: "2021001",
      password: "testpassword",
    });

    expect(res.statusCode).toEqual(200);
    expect(res.text).toContain("Registration successful");
  });

  test("POST /login - should authenticate valid user", async () => {
    // First register a user
    await request(app).post("/register").send({
      email: "test@iitdh.ac.in",
      name: "Test User",
      rollNo: "2021001",
      password: "testpassword",
    });

    const res = await request(app).post("/login").send({
      email: "test@iitdh.ac.in",
      password: "testpassword",
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("email", "test@iitdh.ac.in");
  });
});

describe("Book Management", () => {
  test("POST /upload-book - should upload a new book", async () => {
    const bookData = {
      title: "Test Book",
      author: "Test Author",
      department: "CS",
      count: 5,
    };

    const res = await request(app).post("/upload-book").send(bookData);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("insertedId");
  });

  test("GET /all-books - should retrieve all books", async () => {
    // First upload a test book
    await request(app).post("/upload-book").send({
      title: "Test Book",
      author: "Test Author",
      department: "CS",
      count: 5,
    });

    const res = await request(app).get("/all-books");
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBeGreaterThan(0);
  });
});

describe("User Management", () => {
  test("GET /all-users - should retrieve all users", async () => {
    // First register a user
    await request(app).post("/register").send({
      email: "test@iitdh.ac.in",
      name: "Test User",
      rollNo: "2021001",
      password: "testpassword",
    });

    const res = await request(app).get("/all-users");
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test("PATCH /update-user - should update user details", async () => {
    // Register and login first
    await request(app).post("/register").send({
      email: "test@iitdh.ac.in",
      name: "Test User",
      rollNo: "2021001",
      password: "testpassword",
    });

    const loginRes = await request(app).post("/login").send({
      email: "test@iitdh.ac.in",
      password: "testpassword",
    });

    const user = loginRes.body;

    const updateRes = await request(app).patch("/update-user").send({
      email: "test@iitdh.ac.in",
      name: "Updated Name",
      rollNo: "2021002",
    });

    expect(updateRes.statusCode).toEqual(200);
    expect(updateRes.body.name).toBe("Updated Name");
  });
});

describe("Contact Form", () => {
  test("POST /contacts - should submit contact form", async () => {
    const contactData = {
      name: "Test User",
      email: "test@example.com",
      message: "Test message",
    };

    const res = await request(app).post("/contacts").send(contactData);

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("_id");
  });
});

describe("Book Requests", () => {
  test("POST /bookRequests - should create a new book request", async () => {
    const requestData = {
      bookName: "Test Book",
      url: "http://example.com",
      bookDesc: "Test Description",
      personName: "Test User",
      email: "test@example.com",
    };

    const res = await request(app).post("/bookRequests").send(requestData);

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("_id");
  });

  test("PATCH /bookRequests/:id/like - should increment likes", async () => {
    // First create a request
    const requestRes = await request(app).post("/bookRequests").send({
      bookName: "Test Book",
      url: "http://example.com",
      bookDesc: "Test Description",
      personName: "Test User",
      email: "test@example.com",
    });

    const likeRes = await request(app).patch(
      `/bookRequests/${requestRes.body._id}/like`
    );

    expect(likeRes.statusCode).toEqual(200);
    expect(likeRes.body.likes).toBe(1);
  });
});
