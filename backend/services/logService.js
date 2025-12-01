const Log = require("../models/log");
const crypto = require("crypto");
const mongoose = require("mongoose");

const getAllLogs = async (filters, pagination) => {
  const { limit, skip, sortBy = 'last_seen_at', sortOrder = 'desc' } = pagination;
  const query = {};

  console.log("filters.search:", filters.search, typeof filters.search);

  if (filters.search) {
    const orFilters = [];
    orFilters.push(
      { issue_id: { $regex: filters.search, $options: "i" } },
      { message: { $regex: filters.search, $options: "i" } },
      { description: { $regex: filters.search, $options: "i" } },
      { culprit: { $regex: filters.search, $options: "i" } },
      { error_type: { $regex: filters.search, $options: "i" } },
      { error_signature: { $regex: filters.search, $options: "i" } },
      { environment: { $regex: filters.search, $options: "i" } },
      { status: { $regex: filters.search, $options: "i" } },
      { priority: { $regex: filters.search, $options: "i" } },
      { assigned_to: { $regex: filters.search, $options: "i" } },
      { $expr: { $regexMatch: { input: { $toString: "$_id" }, regex: filters.search, options: "i" } } }
    );
    /*if (mongoose.Types.ObjectId.isValid(filters.search)) {
      orFilters.push({ _id: new mongoose.Types.ObjectId(filters.search) });
    }*/
    query.$or = orFilters;
  }

  [
    "_id",
    "issue_id",
    "message",
    "description",
    "culprit",
    "error_type",
    "error_signature",
    "environment",
    "status",
    "priority",
    "assigned_to",
    "active",
  ].forEach((field) => {
    if (filters[field])
      if (query.$or) {
        query.$and = (query.$and || []).concat({ [field]: filters[field] });
      } else {
        query[field] = filters[field];
      }
  });

  // Filtros de fecha
  if (filters.date) {
    const date = new Date(filters.date + 'T00:00:00.000Z');
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);

    query.created_at = {
      $gte: date,
      $lt: nextDay
    };
  }

  // Ordenamiento
  const sort = {};
  sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

  const logs = await Log.find(query)
    .populate("userId", "username email")
    .skip(skip)
    .limit(limit)
    .sort(sort);
  const totalLogs = await Log.countDocuments(query);

  return {
    data: logs.map((log) => ({
      id: log._id,
      issue_id: log.issue_id,
      message: log.message,
      description: log.description,
      culprit: log.culprit,
      error_type: log.error_type,
      error_signature: log.error_signature,
      environment: log.environment,
      status: log.status,
      priority: log.priority,
      assigned_to: log.assigned_to,
      created_at: log.created_at,
      last_seen_at: log.last_seen_at,
      count: log.count,
      active: log.active,
    })),
    total: totalLogs,
  };
};

const getLogById = async (id) => {
  const log = await Log.findById(id)
    .populate("userId", "username email")
    .select("-password");

  if (!log) return null;

  return {
    id: log._id,
    issue_id: log.issue_id,
    message: log.message,
    description: log.description,
    culprit: log.culprit,
    error_type: log.error_type,
    error_signature: log.error_signature,
    environment: log.environment,
    status: log.status,
    priority: log.priority,
    assigned_to: log.assigned_to,
    created_at: log.created_at,
    last_seen_at: log.last_seen_at,
    count: log.count,
    active: log.active,
  };
};

function generateHash(log) {
  const base = [
    log.culprit || "",
    log.error_type || "",
    log.environment || "",
    log.message || ""
  ].join("|");
  return crypto.createHash("sha1").update(base).digest("hex");
}
const createLog = async (data) => {
  console.log("creating log with data:", data);
  let errorSignature = data.error_signature;
  if (!errorSignature && data.json_sentry?.metadata?.type) {
    errorSignature = data.json_sentry.metadata.type;
  }

  const hash = generateHash(data);

  let existeLog = await Log.findOne({ hash });

  if (existeLog) {
    existeLog.count += 1;
    existeLog.last_seen_at = new Date();
    //return await existeLog.save();
    return { ...existeLog.toObject(), update: true };
  }

  //const newLog = new Log(data);
  const newLog = new Log({
    ...data,
    hash,
    count: 1,
    last_seen_at: new Date(),
  });
  return await newLog.save();
};

const updateLog = async (id, data) => {
  const log = await Log.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  })
    .populate("userId", "username email")
    .select("-password");

  if (!log) return null;

  return {
    id: log._id,
    issue_id: log.issue_id,
    message: log.message,
    description: log.description,
    culprit: log.culprit,
    error_type: log.error_type,
    environment: log.environment,
    status: log.status,
    priority: log.priority,
    assigned_to: log.assigned_to,
    created_at: log.created_at,
    lst_aseen_at: log.lst_aseen_at,
    count: log.count,
    active: log.active,
  };
};

const deleteLog = async (id) => {
  return await Log.findByIdAndDelete(id);
};

module.exports = {
  getAllLogs,
  getLogById,
  createLog,
  updateLog,
  deleteLog,
};
