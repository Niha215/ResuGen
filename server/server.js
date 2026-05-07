import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();

const PORT = 5003;

// ✅ Middlewares
app.use(cors());

app.use(express.json());

// ✅ MongoDB connection
const MONGO_URI =
  "mongodb://127.0.0.1:27017/resumeDB";

mongoose
  .connect(MONGO_URI)
  .then(() =>
    console.log("✅ MongoDB Connected")
  )
  .catch((err) =>
    console.error(
      "❌ MongoDB Connection Error:",
      err
    )
  );

// ✅ Schema
const resumeSchema = new mongoose.Schema(
  {
    name: String,

    role: String,

    email: String,

    phone: String,

    linkedin: String,

    summary: String,

    skills: String,

    education: [
      {
        degree: String,

        college: String,

        start: String,

        end: String,
      },
    ],

    experience: [
      {
        role: String,

        company: String,

        start: String,

        end: String,

        description: String,
      },
    ],

    projects: [
      {
        name: String,

        description: String,
      },
    ],

    certifications: [String],
  },

  { timestamps: true }
);

// ✅ Model
const Resume = mongoose.model(
  "Resume",
  resumeSchema
);

// ✅ Health Check
app.get("/", (req, res) => {

  res.send("API Running...");
});

// ✅ CREATE (Save Resume)
app.post(
  "/save-resume",
  async (req, res) => {

    try {

      console.log(
        "📥 DATA RECEIVED:",
        req.body
      );

      const newResume =
        new Resume(req.body);

      await newResume.save();

      res.status(201).json({
        success: true,

        message: "Saved to MongoDB",

        data: newResume,
      });

    } catch (err) {

      console.error(
        "❌ Save Error:",
        err
      );

      res.status(500).json({
        success: false,

        error: err.message,
      });
    }
  }
);

// ✅ READ ALL
app.get("/resumes", async (req, res) => {

  try {

    const resumes =
      await Resume.find().sort({
        createdAt: -1,
      });

    res.json(resumes);

  } catch (err) {

    console.error(
      "❌ Fetch Error:",
      err
    );

    res.status(500).json({
      error: err.message,
    });
  }
});

// ✅ READ ONE
app.get(
  "/resumes/:id",
  async (req, res) => {

    try {

      const resume =
        await Resume.findById(
          req.params.id
        );

      if (!resume) {

        return res.status(404).json({
          error: "Resume not found",
        });
      }

      res.json(resume);

    } catch (err) {

      console.error(
        "❌ Fetch One Error:",
        err
      );

      res.status(500).json({
        error: err.message,
      });
    }
  }
);

// ✅ UPDATE
app.put(
  "/resumes/:id",
  async (req, res) => {

    try {

      const updated =
        await Resume.findByIdAndUpdate(
          req.params.id,

          req.body,

          {
            returnDocument: "after",
          }
        );

      res.json(updated);

    } catch (err) {

      console.error(
        "❌ Update Error:",
        err
      );

      res.status(500).json({
        error: err.message,
      });
    }
  }
);

// ✅ DELETE
app.delete(
  "/resumes/:id",
  async (req, res) => {

    try {

      await Resume.findByIdAndDelete(
        req.params.id
      );

      res.json({
        message:
          "Deleted successfully",
      });

    } catch (err) {

      console.error(
        "❌ Delete Error:",
        err
      );

      res.status(500).json({
        error: err.message,
      });
    }
  }
);

// ✅ START SERVER
app.listen(PORT, () => {

  console.log(
    `🚀 Server running on http://localhost:${PORT}`
  );
});