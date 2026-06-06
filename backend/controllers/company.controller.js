import Company from "../models/company.model.js";
import { uploadToCloudinary } from "../utils/cloudinaryUpload.js";

//  Get all companies (user)
export const getCompanies = async (req, res) => {
  try {
    const companies = await Company.find();
    res.status(200).json({
      success: true,
      companies,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

//  Add company (ONLY admin)
export const addCompany = async (req, res) => {
  try {
    const { website, name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Company name is required",
      });
    }

    if (!website) {
      return res.status(400).json({
        success: false,
        message: "Website is required",
      });
    }
    let logoUrl = "";
    if (req.file) {
      try {
        const uploadResult = await uploadToCloudinary(
          req.file.buffer,
          "jobportal/logos",
          "image",
          req.file.originalname
        );
        logoUrl = uploadResult.secure_url;
      } catch (uploadErr) {
        // Fallback: save file locally to /uploads/logos and serve via /uploads
        try {
          const fs = await import("fs");
          const path = await import("path");
          const uploadsDir = path.join(process.cwd(), "uploads", "logos");
          fs.mkdirSync(uploadsDir, { recursive: true });
          const uniqueName = `${Date.now()}-${req.file.originalname}`.replace(/\s+/g, "_");
          const filePath = path.join(uploadsDir, uniqueName);
          fs.writeFileSync(filePath, req.file.buffer);
          const host = req.get("host");
          const protocol = req.protocol;
          logoUrl = `${protocol}://${host}/uploads/logos/${uniqueName}`;
        } catch (fsErr) {
          console.error("Failed fallback file save:", fsErr);
          logoUrl = "";
        }
      }
    }

    const company = await Company.create({
      name: name.trim(),
      logo: logoUrl,
      website,
      createdBy: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Company added successfully",
      company,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
//delete the company(for admin)
export const deleteCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }
    await company.deleteOne();

    res.status(200).json({
      success: true,
      message: "Company deleted successfully",
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};