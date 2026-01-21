import Partner from '../models/Partner.model.js';

// @desc    Register a new partner
// @route   POST /api/partners
// @access  Private (Admin)
export const createPartner = async (req, res) => {
    try {
        const { name, email, phone, role, services, areas } = req.body;

        if (email) {
            const partnerExists = await Partner.findOne({ email });
            if (partnerExists) {
                return res.status(400).json({ success: false, message: 'Partner already exists' });
            }
        }

        const partner = await Partner.create({
            name,
            email,
            phone,
            role,
            services,
            areas
        });

        res.status(201).json({
            success: true,
            data: partner
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get all partners
// @route   GET /api/partners
// @access  Private (Admin)
export const getPartners = async (req, res) => {
    try {
        const partners = await Partner.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            data: partners
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update partner details
// @route   PUT /api/partners/:id
// @access  Private (Admin)
export const updatePartner = async (req, res) => {
    try {
        const { name, email, phone, role, services, areas, isActive } = req.body;
        const partner = await Partner.findById(req.params.id);

        if (!partner) {
            return res.status(404).json({ success: false, message: 'Partner not found' });
        }

        partner.name = name || partner.name;
        partner.email = email || partner.email;
        partner.phone = phone || partner.phone;
        partner.role = role || partner.role;
        partner.services = services || partner.services;
        partner.areas = areas || partner.areas;

        // Explicitly check for boolean since it can be false
        if (typeof isActive !== 'undefined') {
            partner.isActive = isActive;
        }

        const updatedPartner = await partner.save();

        res.json({ success: true, data: updatedPartner });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete partner
// @route   DELETE /api/partners/:id
// @access  Private (Admin)
export const deletePartner = async (req, res) => {
    try {
        const partner = await Partner.findById(req.params.id);

        if (!partner) {
            return res.status(404).json({ success: false, message: 'Partner not found' });
        }

        await partner.deleteOne();

        res.json({ success: true, message: 'Partner removed' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update partner status
// @route   PUT /api/partners/:id/status
// @access  Private (Admin)
export const updatePartnerStatus = async (req, res) => {
    try {
        const { isActive } = req.body;
        const partner = await Partner.findById(req.params.id);

        if (!partner) {
            return res.status(404).json({ success: false, message: 'Partner not found' });
        }

        partner.isActive = isActive;
        await partner.save();

        res.json({ success: true, data: partner });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
