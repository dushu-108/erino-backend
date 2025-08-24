import express from "express";
import { createLead, deleteLead, getLead, getLeads, updateLead } from "../controllers/leadController.js";
import { protect } from "../middleware/protect.js";

const router = express.Router();

router.post("/", protect, createLead);
router.get("/", protect, getLeads);
router.get("/:id", protect, getLead);
router.put("/:id", protect, updateLead);
router.delete("/:id", protect, deleteLead);

export default router;