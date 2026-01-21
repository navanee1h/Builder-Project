import Lead from '../models/Lead.model.js';
import Partner from '../models/Partner.model.js';

export const createLead = async (req, res) => {
  try {
    const { name, phone, serviceType, location, message, source } = req.body;

    // 1. Basic validation
    if (!name || !phone || !serviceType || !location) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing"
      });
    }

    // 2. Create lead
    const lead = await Lead.create({
      name,
      phone,
      serviceType,
      location,
      message,
      source: source || 'website',
      status: "new"
    });

    res.status(201).json({
      success: true,
      data: lead
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getLeads = async (req, res) => {
  try {
    const leads = await Lead.find().populate('assignedTo', 'name email').sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: leads
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update lead status
// @route   PUT /api/leads/:id/status
// @access  Private (Admin)
export const updateLeadStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    // Ensure status is valid env values if needed, but model handles enum validation
    lead.status = status;
    await lead.save();

    res.json({ success: true, data: lead });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Assign lead to partner
// @route   PUT /api/leads/:id/assign
// @access  Private (Admin)
export const assignPartner = async (req, res) => {
  try {
    const { partnerId } = req.body;
    const lead = await Lead.findById(req.params.id);
    const partner = await Partner.findById(partnerId);

    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    if (!partner) {
      return res.status(404).json({ success: false, message: 'Partner not found' });
    }

    if (!partner.isActive) {
      return res.status(400).json({ success: false, message: 'Partner is not active' });
    }

    lead.assignedTo = partnerId;
    lead.status = 'assigned';
    await lead.save();

    res.json({ success: true, data: lead });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete lead
// @route   DELETE /api/leads/:id
// @access  Private (Admin)
export const deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    await lead.deleteOne();

    res.json({ success: true, message: 'Lead removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
