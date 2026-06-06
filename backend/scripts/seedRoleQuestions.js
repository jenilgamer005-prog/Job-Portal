import 'dotenv/config';
import { connectDB } from "../config/db.js";
import InterviewRole from "../models/interviewRole.model.js";
import RoleQuestion from "../models/roleQuestion.model.js";
import User from "../models/user.model.js";

const roles = [
  {
    roleName: "Frontend Developer",
    image: "https://via.placeholder.com/300x200.png?text=Frontend",
    questionsCount: "10+",
    questions: [
      {
        question: "What are the differences between var, let, and const?",
        answer:
          "var is function-scoped and can be redeclared; let and const are block-scoped, with const creating a read-only reference.",
        keyPoints: ["Scope", "Hoisting", "Reassignment"],
        askedBy: [
          { companyName: "Acme Corp", dateAsked: "2026-05-12" },
        ],
      },
      {
        question: "How does the virtual DOM work in React?",
        answer:
          "React uses a lightweight copy of the DOM to compute changes, then patches only the changed elements in the real DOM for better performance.",
        keyPoints: ["Diffing", "Reconciliation", "Performance"],
        askedBy: [
          { companyName: "Beta LLC", dateAsked: "2026-03-28" },
        ],
      },
      {
        question: "What is event delegation in JavaScript?",
        answer:
          "Event delegation uses a single event listener on a parent element to handle events from child elements, avoiding multiple listeners.",
        keyPoints: ["Bubbling", "Delegation", "Performance"],
        askedBy: [
          { companyName: "Gamma Tech", dateAsked: "2026-04-15" },
        ],
      },
    ],
  },
  {
    roleName: "Backend Developer",
    image: "https://via.placeholder.com/300x200.png?text=Backend",
    questionsCount: "8+",
    questions: [
      {
        question: "What is middleware in Express.js?",
        answer:
          "Middleware are functions that execute during request/response lifecycle and can modify req, res, or terminate the request.",
        keyPoints: ["Request pipeline", "Next()", "Reusability"],
        askedBy: [
          { companyName: "Delta Systems", dateAsked: "2026-02-20" },
        ],
      },
      {
        question: "Explain the difference between SQL and NoSQL databases.",
        answer:
          "SQL databases are relational and structured, while NoSQL databases are non-relational and schema-flexible.",
        keyPoints: ["Schema", "Joins", "Scaling"],
        askedBy: [
          { companyName: "Epsilon Labs", dateAsked: "2026-04-05" },
        ],
      },
    ],
  },
  {
    roleName: "Data Analyst",
    image: "https://via.placeholder.com/300x200.png?text=Data+Analyst",
    questionsCount: "6+",
    questions: [
      {
        question: "How do you clean and prepare data for analysis?",
        answer:
          "I remove duplicates, handle missing values, normalize formats, and verify consistency before analysis.",
        keyPoints: ["Cleaning", "Missing values", "Normalization"],
        askedBy: [
          { companyName: "Zeta Insights", dateAsked: "2026-01-30" },
        ],
      },
      {
        question: "What is the difference between correlation and causation?",
        answer:
          "Correlation means two variables move together, while causation means one variable directly affects the other.",
        keyPoints: ["Relationship", "Analysis", "Statistical inference"],
        askedBy: [
          { companyName: "Theta Analytics", dateAsked: "2026-03-09" },
        ],
      },
    ],
  },
];

const run = async () => {
  try {
    await connectDB();

    const user = (await User.findOne({ role: "admin" })) || (await User.findOne());
    if (!user) {
      console.error("No users found in DB. Please create a user first.");
      process.exit(1);
    }

    for (const roleData of roles) {
      let role = await InterviewRole.findOne({ roleName: roleData.roleName });
      if (!role) {
        role = await InterviewRole.create({
          roleName: roleData.roleName,
          image: roleData.image,
          questionsCount: roleData.questionsCount,
          createdBy: user._id,
        });
        console.log(`Created role: ${role.roleName}`);
      } else {
        console.log(`Existing role skipped: ${role.roleName}`);
      }

      const existingQuestions = await RoleQuestion.find({ roleId: role._id });
      if (existingQuestions.length === 0) {
        const questionsToInsert = roleData.questions.map((q) => ({
          roleId: role._id,
          question: q.question,
          answer: q.answer,
          keyPoints: q.keyPoints,
          askedBy: q.askedBy,
        }));
        await RoleQuestion.insertMany(questionsToInsert);
        console.log(`Inserted ${questionsToInsert.length} questions for ${role.roleName}`);
      } else {
        console.log(`Role ${role.roleName} already has ${existingQuestions.length} question(s)`);
      }
    }

    console.log("Role question seed completed.");
    process.exit(0);
  } catch (err) {
    console.error("Error seeding role questions:", err);
    process.exit(1);
  }
};

run();
