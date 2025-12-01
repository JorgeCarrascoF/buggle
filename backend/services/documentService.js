const Document = require('../models/document');
const boom = require('@hapi/boom');

class DocumentService {
    async createDocument(documentData) {
        const document = new Document(documentData);
        await document.save();
        return document;
    }

    async getAllDocuments(pagination) {
        //return await Document.find().populate('log');
        const { limit, skip, sortBy = 'date', sortOrder = desc } = pagination;
        const query = {};

        const sort = {};
        sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

        const documents = await Document.find(query)
            .populate('log')
            .skip(skip)
            .limit(limit)
            .sort(sort);

        const totalDocuments = await Document.countDocuments(query);

        return {
            data: documents.map((document) => ({
                id: document._id,
                title: document.title,
                content: document.content,
                date: document.logId,
                log: document.date
            })),
            total: totalDocuments,
        };
    }

    async getDocumentById(id) {
        const document = await Document.findById(id).populate('log');
        if (!document) {
            throw boom.notFound('The requested document could not be found.');
        }
        return document;
    }

    async updateDocument(id, updateData) {
        const document = await Document.findByIdAndUpdate(id, updateData, { new: true }).populate('log');
        if (!document) {
            throw boom.notFound('The document could not be updated because it does not exist.');
        }
        return document;
    }

    async deleteDocument(id) {
        const document = await Document.findByIdAndDelete(id);
        if (!document) {
            throw boom.notFound('The document could not be deleted because it was not found.');
        }
        return document;
    }
}

module.exports = new DocumentService();
