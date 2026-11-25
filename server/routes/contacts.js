
const express = require("express");
const Contact = require("../models/Contact");

const router = express.Router();

// CREATE CONTACT
router.post("/", async (req, res) => {
  try {
    const contact = await Contact.create(req.body);
    res.status(201).json({
      message: "Contact created successfully",
      contact,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

// GET ALL CONTACTS
router.get("/", async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({
      message: "Could not retrieve contacts",
    });
  }
});

// GET ONE CONTACT
router.get("/:id", async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        message: "Contact not found",
      });
    }

    res.status(200).json(contact);
  } catch (error) {
    res.status(400).json({
      message: "Invalid contact ID",
    });
  }
});

// UPDATE CONTACT
router.put("/:id", async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!contact) {
      return res.status(404).json({
        message: "Contact not found",
      });
    }

    res.status(200).json({
      message: "Contact updated successfully",
      contact,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

// DELETE CONTACT
router.delete("/:id", async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({
        message: "Contact not found",
      });
    }

    res.status(200).json({
      message: "Contact deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      message: "Invalid contact ID",
    });
  }
});

module.exports = router;
