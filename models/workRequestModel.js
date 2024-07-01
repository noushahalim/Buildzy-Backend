const mongoose = require('mongoose');

const milestoneSchema = mongoose.Schema({
    description: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        default: false
    }
});

const workRequestSchema = mongoose.Schema({
    projectTitle: {
        type: String,
        required: true
    },
    projectDescription: {
        type: String,
        required: true
    },
    projectLocation: {
        type: String,
        required: true
    },
    projectType: {
        type: String,
        enum: ['Residential', 'Commercial', 'Industrial'],
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    clientName: {
        type: String,
        required: true
    },
    estimatedCost: {
        type: Number,
        required: true
    },
    milestones: {
        type: [milestoneSchema],
        required: true,
        default: [
            { description: 'Pending' },
            { description: 'Started' },
            { description: '50% Completed' },
            { description: 'Completed' }
        ]
    },
    clientId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    engineerId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    status: {
        type: Boolean,
        default: false
    },
    companyName: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const workRequestModel = mongoose.model('WorkRequest', workRequestSchema);

module.exports = workRequestModel;
