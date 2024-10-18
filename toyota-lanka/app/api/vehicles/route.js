import { NextResponse } from "next/server";
import mysql from "mysql2/promise";
import multer from "multer";
import path from "path";
import { promises as fs } from "fs";

// Set up multer for handling image uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: "./public/uploads",
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  }),
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
      return cb(new Error("Only images are allowed"));
    }
    cb(null, true);
  },
});

// Database connection setup
async function connectToDB() {
  return await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "it21800450",
    database: "toyota_lanaa",
  });
}

// Handle POST requests (Form submission and image upload)
export async function POST(req) {
  try {
    const data = await req.formData();
    const images = data.getAll("images");

    // Process images and upload
    const imagePaths = [];
    for (let image of images) {
      const filePath = `./public/uploads/${Date.now()}-${image.name}`;
      await fs.writeFile(filePath, image.stream());
      imagePaths.push(filePath);
    }

    const formData = {
      make: data.get("make"),
      model: data.get("model"),
      body_type: data.get("body_type"),
      registration_number: data.get("registration_number"),
      mileage: parseInt(data.get("mileage"), 10),
      engine_cc: parseInt(data.get("engine_cc"), 10),
      fuel_type: data.get("fuel_type"),
      year_of_manufacture: parseInt(data.get("year_of_manufacture"), 10),
      district: data.get("district"),
      vehicle_grade: data.get("vehicle_grade"),
      exterior_color: data.get("exterior_color"),
      interior_color: data.get("interior_color"),
      num_owners: parseInt(data.get("num_owners"), 10) || null,
      image_urls: JSON.stringify(imagePaths),
    };

    // Save form data to the MySQL database
    const connection = await connectToDB();
    const query = `
      INSERT INTO vehicles (
        make, model, body_type, registration_number, mileage, engine_cc, fuel_type, year_of_manufacture, district, vehicle_grade, exterior_color, interior_color, num_owners, image_urls
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = Object.values(formData);

    await connection.execute(query, values);
    await connection.end();

    return NextResponse.json(
      { message: "Vehicle added successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error submitting vehicle:", error);
    return NextResponse.json(
      { error: "Failed to submit vehicle" },
      { status: 500 }
    );
  }
}

// Handle GET requests (Fetch all vehicles)
export async function GET() {
  try {
    const connection = await connectToDB();
    const [rows] = await connection.execute("SELECT * FROM vehicles");
    await connection.end();

    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    return NextResponse.json(
      { error: "Failed to fetch vehicles" },
      { status: 500 }
    );
  }
}
