const Comment = require('../models/comment');
const CommentService = require('../services/commentService');
const { createCommentSchema, updateCommentSchema } = require('../validations/commentSchema.js');
const boom = require('@hapi/boom');

const createComment = async (req, res, next) => {
    try {
        const { error } = createCommentSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                statusCode: 400,
                error: "Bad Request",
                message: error.details.map(detail => detail.message).join(', ')
            });
        }

        const { text, logId } = req.body;
        const userId = req.user.id;
        const comment = new Comment({ text, userId, logId });
        await comment.save();

        res.status(201).json({
            message: 'Comment created successfully',
            comment
        });
    } catch (err) {
        next(err);
    }
};

const getAllComments = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 5;
        const page = parseInt(req.query.page) || 1;
        const skip = (page - 1) * limit;
        const sortBy = req.query.sortBy || 'created_at';
        const sortOrder = req.query.sortOrder || 'desc';

        const result = await CommentService.getAllComments(req.query, 
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

const getCommentById = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.id)
            .populate('userId', 'fullName email')
            .populate('logId');
        if (!comment) {
            throw boom.notFound('Comment not found');
        }
        res.status(200).json(comment);
    } catch (err) {
        next(err);
    }
};

const getCommentsByLog = async (req, res, next) => {
  try {
    const { logId } = req.params;
    const limit = parseInt(req.query.limit) || 5;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;

    const result = await CommentService.getCommentsByLog(logId, { limit, skip });

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

const updateComment = async (req, res, next) => {
    try {
        const { error } = updateCommentSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                statusCode: 400,
                error: "Bad Request",
                message: error.details.map(detail => detail.message).join(', ')
            });
        }

        const { id } = req.params;
        const comment = await Comment.findByIdAndUpdate(id, req.body, { new: true })
            .populate('userId', 'fullName email')
            .populate('logId');
        if (!comment) {
            throw boom.notFound('Comment not found');
        }
        res.status(200).json({
            message: 'Comment updated successfully',
            comment
        });
    } catch (err) {
        next(err);
    }
};

const deleteComment = async (req, res, next) => {
    try {
        const { id } = req.params;
        const comment = await Comment.findByIdAndDelete(id);
        if (!comment) {
            throw boom.notFound('Comment not found');
        }
        res.status(200).json({
            message: 'Comment deleted successfully'
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    createComment,
    getAllComments,
    getCommentById,
    getCommentsByLog,
    updateComment,
    deleteComment
};
