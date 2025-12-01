const statusRegisterService = require('../services/statusRegisterService');

const roles = ['user', 'superadmin', 'admin'];


const createStatusRegister = async (req, res) => {
    try {
        const { logId, status, assigned_to } = req.body;
        const userId = req.user.id;

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ msg: 'Access denied.' });
        }

        const result = await statusRegisterService.createStatusRegister({
            logId,
            userId,
            status,
            assigned_to
        });

        res.status(200).json({
            msg: 'Log status updated and change registered successfully.',
            log: result.log,
            statusRegister: result.statusRegister,
        });
    } catch (err) {
        res.status(500).json({ msg: 'Error registering status change', error: err.message });
    }
};

const getAllStatusRegisters = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 5;
        const page = parseInt(req.query.page) || 1;
        const skip = (page - 1) * limit;
        const sortBy = req.query.sortBy || 'created_at';
        const sortOrder = req.query.sortOrder || 'desc';

        const result = await statusRegisterService.getAllStatusRegisters(req.query,
            { limit, skip, sortBy, sortOrder });

        res.status(200).json({
            success: true,
            page,
            limit,
            count: result.data.length,
            total: result.total,
            data: result.data
        });
    } catch (err) {
        next(err);
    }
};

const getStatusRegistersByLog = async (req, res) => {
    try {

        const { logId } = req.params;

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                msg: 'Access denied.',
                detail: 'Only superadmin, administrators, and users can view status Register by logId'
            });
        }

        const statusRegister = await statusRegisterService.getStatusRegistersByLog(logId);

        if (!statusRegister || statusRegister.data.length === 0) {
            //return res.status(404).json({ msg: 'Status Register not found.' });
            return res.status(200).json({ msg: 'Status Register not found.', data: []});
        }
        res.status(200).json(statusRegister);
    } catch (err) {
        res.status(500).json({ msg: 'Error obtaining Status Register', error: err.message });
    }
};

const getStatusRegisterById = async (req, res) => {
    try {
        console.log('🔍 DEBUG getStatusRegisterById:');
        console.log('- Usuario solicitante:', req.user);
        console.log('- ID solicitado:', req.params.id);

        if (!roles.includes(req.user.role) && req.user.id !== req.params.id) {
            return res.status(403).json({
                msg: 'Access denied.',
                detail: 'Only superadmin, administrators, and users can view status Register by ID'
            });
        }

        const statusRegister = await statusRegisterService.getStatusRegisterById(req.params.id);

        if (!statusRegister) {
            return res.status(404).json({ msg: 'Status Register not found.' });
        }

        res.status(200).json(statusRegister);
    } catch (err) {
        res.status(500).json({ msg: 'Error obtaining Status Register', error: err.message });
    }
};



module.exports = {
    createStatusRegister,
    getAllStatusRegisters,
    getStatusRegisterById,
    getStatusRegistersByLog
};
