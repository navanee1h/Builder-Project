import Lead from '../models/Lead.model.js';
import Partner from '../models/Partner.model.js';

export const getReports = async (req, res) => {
    try {
        // Leads by status
        const leadsByStatus = await Lead.aggregate([
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);

        // Leads by serviceType
        const leadsByServiceType = await Lead.aggregate([
            { $group: { _id: "$serviceType", count: { $sum: 1 } } }
        ]);

        // Leads by source
        const leadsBySource = await Lead.aggregate([
            { $group: { _id: "$source", count: { $sum: 1 } } }
        ]);

        // Leads by partner
        // We want to show partner name, so we might need lookup or just group by assignedTo and then populate
        const leadsByPartner = await Lead.aggregate([
            { $match: { assignedTo: { $exists: true, $ne: null } } },
            { $group: { _id: "$assignedTo", count: { $sum: 1 } } },
            {
                $lookup: {
                    from: 'partners',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'partner'
                }
            },
            {
                $unwind: '$partner'
            },
            {
                $project: {
                    _id: 1,
                    count: 1,
                    name: '$partner.name'
                }
            }
        ]);

        // Format the response to be more friendly (object instead of array of objects if preferred, but array is usually fine for charts)
        // User said "Return empty objects" if no data. 
        // Aggregation returns empty array if no matches.

        // Let's format it as key-value pairs for easier consumption if needed, or just return the arrays.
        // "Leads by status" -> { "new": 5, "assigned": 2 ... } might be easier.
        // Let's stick "clean" format.

        const formatData = (arr) => {
            return arr.reduce((acc, curr) => {
                acc[curr._id] = curr.count;
                return acc;
            }, {});
        };

        const formatPartnerData = (arr) => {
            return arr.reduce((acc, curr) => {
                acc[curr.name] = curr.count;
                return acc;
            }, {});
        }

        res.status(200).json({
            success: true,
            data: {
                byStatus: formatData(leadsByStatus),
                byServiceType: formatData(leadsByServiceType),
                bySource: formatData(leadsBySource),
                byPartner: formatPartnerData(leadsByPartner)
            }
        });

    } catch (error) {
        console.error('Error fetching reports:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error fetching reports'
        });
    }
};
