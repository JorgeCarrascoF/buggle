// ============================================
// controllers/roleController.js (CORREGIDO)
// ============================================
const Role = require('../models/role');

const createRole = async (req, res) => {
    const { name, permission } = req.body;

    if (!name || !permission) {
        return res.status(400).json({ msg: 'Name and permission are required' });
    }

    try {
        const existingRole = await Role.findOne({ name });
        if (existingRole) {
            return res.status(400).json({ msg: 'Role already exists' });
        }

        const newRole = new Role({
            name,
            permission: Array.isArray(permission) ? permission : [permission]
        });

        await newRole.save();
        res.status(201).json({ msg: 'Role created successfully', role: newRole });
    } catch (err) {
        res.status(500).json({ msg: 'Error creating role', error: err.message });
    }
};


const getAllRoles = async (req, res) => {
    try {
        const limit =  parseInt(req.query.limit) || 10;
        const search = req.query.search || '';
        const page = parseInt(req.query.page) || 1;
        const skip = (page-1)*limit;

        const { name } = req.query;

        const query= {};
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } }           
            ];
        }

        if (name) query.name = name;

        //const roles = await Role.find();
        const roles = await Role.find(query)
        //.populate('userId', 'username email')
        .skip(skip)
        .limit(limit)
        .sort({ lastSeen: -1 });

        //res.status(200).json(roles);
        res.status(200).json({
            success: true,
            page,
            limit,
            roles
        });
    } catch (err) {
        res.status(500).json({ msg: 'Error obtaining roles', error: err.message });
    }
};

module.exports = { createRole, getAllRoles };