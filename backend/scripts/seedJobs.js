import 'dotenv/config';
import { connectDB } from "../config/db.js";
import Job from "../models/job.model.js";
import User from "../models/user.model.js";

const seedJobs = async () => {
  try {
    await connectDB();

    // Find an admin user to attach as createdBy. If none, use any user.
    let user = await User.findOne({ role: "admin" });
    if (!user) user = await User.findOne();
    if (!user) {
      console.error("No users found in DB. Create a user first or set createdBy manually.");
      process.exit(1);
    }

    const sampleJobs = [
      {
        companyLogo: "https://via.placeholder.com/128.png?text=Acme",
        roleName: "Frontend Engineer",
        companyName: "Acme Corp",
        techStack: ["React", "JavaScript", "CSS"],
        location: "Remote",
        experience: "2-4 years",
        salary: 80000,
        salaryType: "/year",
        jobType: "full-time",
        postDate: new Date(),
        category: "Engineering",
        openings: 2,
        overview: "Work on building beautiful user interfaces.",
        responsibilities: ["Build components", "Collaborate with designers"],
        jobCriteria: ["2+ years experience", "Strong React skills"],
        education: ["Bachelor's in CS"] ,
        createdBy: user._id,
      },
      {
        companyLogo: "https://via.placeholder.com/128.png?text=Beta",
        roleName: "Backend Engineer",
        companyName: "Beta LLC",
        techStack: ["Node.js", "Express", "MongoDB"],
        location: "Bengaluru, India",
        experience: "3-6 years",
        salary: 120000,
        salaryType: "/year",
        jobType: "full-time",
        postDate: new Date(),
        category: "Engineering",
        openings: 1,
        overview: "Design scalable APIs and services.",
        responsibilities: ["Design APIs", "Optimize DB queries"],
        jobCriteria: ["3+ years experience", "Node.js expertise"],
        education: ["Bachelor's in CS"],
        createdBy: user._id,
      }
    ];

    const inserted = await Job.insertMany(sampleJobs);
    console.log(`Inserted ${inserted.length} jobs.`);
    inserted.forEach((j) => console.log(j._id.toString(), j.roleName, j.companyName));

    process.exit(0);
  } catch (err) {
    console.error("Error seeding jobs:", err);
    process.exit(1);
  }
};

seedJobs();
