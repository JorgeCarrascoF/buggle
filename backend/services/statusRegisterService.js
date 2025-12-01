const StatusRegister = require("../models/status register");
const Log = require("../models/log");
const mongoose = require("mongoose");
const suggestedUserService = require("./suggestedUserService");
const Boom = require('@hapi/boom');

class StatusRegisterService {

  createStatusRegister = async ({ logId, userId, status, assigned_to }) => {
    if (!mongoose.Types.ObjectId.isValid(logId)) {
      throw new Error("Invalid logId");
    }

    const updateStatus = { status };
    if (assigned_to) updateStatus.assigned_to = assigned_to;

    const log = await Log.findByIdAndUpdate(
      logId,
      //{ status, assigned_to: userId },
      updateStatus,
      { new: true, runValidators: true }
    );

    if (!log) throw new Error("Log not found");
    const newStatusRegister = new StatusRegister({
      logId,
      userId,
      status,
      created_at: new Date(),
    });

    await newStatusRegister.save();
    await suggestedUserService.trackResolution(logId);

    return { log, statusRegister: newStatusRegister };
  };

  getAllStatusRegisters = async (pagination) => {
    const { limit, skip, sortBy = 'created_at', sortOrder = "desc" } = pagination;
    const query = {};

    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const statusRegisters = await StatusRegister.find(query)
      .populate('userId', 'fullName email')
      .populate('logId', 'issue_id message description culprit error_type environment status priority assigned_to created_at last_seen_at count active userId error_signature')
      .skip(skip)
      .limit(limit)
      .sort(sort);

    const totalStatusRegisters = await StatusRegister.countDocuments(query);

    return {
      data: statusRegisters.map((statusRegister) => ({
        id: statusRegister._id,
        status: statusRegister.status,
        userId: statusRegister.userId,
        logId: statusRegister.logId,
        created_at: statusRegister.created_at
      })),
      total: totalStatusRegisters,
    };

  };

  async getStatusRegistersByLog(logId) {
    const query = { logId }; // filtrar por logId

    const statusRegister = await StatusRegister.find(query)
      .populate('userId', 'fullName email')
      .populate('logId', 'issue_id message description culprit error_type environment status priority assigned_to created_at last_seen_at count active userId error_signature')
      .sort({ created_at: -1 });

    const totalStatusRegisters = await StatusRegister.countDocuments(query);

    if (!statusRegister) {
      throw Boom.notFound('Status Register not found');
    }

    return {
      total: totalStatusRegisters,
      data: statusRegister.map(c => ({
        id: c._id,
        status: c.status,
        user: c.userId,
        log: c.logId,
        created_at: c.created_at
      }))
    };
  }

  async getStatusRegisterById(id) {

    const statusRegister = await StatusRegister.findById(id)
      .populate('userId', 'fullName email')
      .populate('logId', 'issue_id message description culprit error_type environment status priority assigned_to created_at last_seen_at count active userId error_signature')

    if (!statusRegister) {
      throw Boom.notFound('Status Register not found');
    }

    //return statusRegister;

    return {
      id: statusRegister._id,
      status: statusRegister.status,
      user: statusRegister.userId,
      log: statusRegister.logId,
      created_at: statusRegister.created_at
    };
  };



}

module.exports = new StatusRegisterService();
