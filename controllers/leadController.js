import Lead from "../models/lead.js";

export const createLead = async (req, res) => {
    try {
        const lead = await Lead.create(req.body);
        res.status(201).json({ lead });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const buildFilterQuery = (query) => {
    const filter = {};
    const queryParams = { ...query };
    
    const page = parseInt(query.page) || 1;
    const limit = Math.min(parseInt(query.limit) || 20, 100);
    const skip = (page - 1) * limit;
    
    delete queryParams.page;
    delete queryParams.limit;

    Object.entries(queryParams).forEach(([key, value]) => {
        if (key.endsWith('_contains')) {
            const field = key.replace('_contains', '');
            filter[field] = { $regex: value, $options: 'i' };
        } 
        else if (key.endsWith('_in')) {
            const field = key.replace('_in', '');
            filter[field] = { $in: value.split(',') };
        }
        else if (key.endsWith('_gt')) {
            const field = key.replace('_gt', '');
            filter[field] = { $gt: Number(value) };
        }
        else if (key.endsWith('_lt')) {
            const field = key.replace('_lt', '');
            filter[field] = { $lt: Number(value) };
        }
        else if (key.endsWith('_between')) {
            const field = key.replace('_between', '');
            const [min, max] = value.split(',').map(Number);
            filter[field] = { $gte: min, $lte: max };
        }
        else if (key.endsWith('_on')) {
            const field = key.replace('_on', '');
            const date = new Date(value);
            const nextDay = new Date(date);
            nextDay.setDate(date.getDate() + 1);
            filter[field] = { $gte: date, $lt: nextDay };
        }
        else if (key.endsWith('_before')) {
            const field = key.replace('_before', '');
            filter[field] = { $lt: new Date(value) };
        }
        else if (key.endsWith('_after')) {
            const field = key.replace('_after', '');
            filter[field] = { $gt: new Date(value) };
        }
        else if (key.endsWith('_date_between')) {
            const field = key.replace('_date_between', '');
            const [start, end] = value.split(',');
            filter[field] = { $gte: new Date(start), $lte: new Date(end) };
        }
        else {
            filter[key] = value;
        }
    });

    return { filter, skip, limit, page };
};

export const getLeads = async (req, res) => {
    try {
        const { filter, skip, limit, page } = buildFilterQuery(req.query);
        
        console.log('🔍 [getLeads] Filter:', filter);
        
        const [leads, total] = await Promise.all([
            Lead.find(filter).skip(skip).limit(limit).lean(),
            Lead.countDocuments(filter)
        ]);

        console.log(`📊 [getLeads] Found ${leads.length} leads out of ${total}`);
        
        // Convert _id to id and remove __v for cleaner frontend data
        const formattedLeads = leads.map(lead => {
            const { _id, __v, ...rest } = lead;
            return { id: _id, ...rest };
        });

        res.status(200).json({
            success: true,
            data: formattedLeads,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const getLead = async (req, res) => {
    try {
        const lead = await Lead.findById(req.params.id);
        if (!lead) {
            return res.status(404).json({ error: "Lead not found" });
        }
        res.status(200).json({ lead });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const updateLead = async (req, res) => {
    try {
        const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!lead) {
            return res.status(404).json({ error: "Lead not found" });
        }
        res.status(200).json({ lead });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const deleteLead = async (req, res) => {
    try {
        const lead = await Lead.findByIdAndDelete(req.params.id);
        if (!lead) {
            return res.status(404).json({ error: "Lead not found" });
        }
        res.status(200).json({ lead });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}