"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const FaqSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    sort_order: {
        type: String,
        required: true,
        unique: true,
    },
    category: {
        type: String,
        enum: ['terms', 'payment', 'contact', 'help', 'support'],
        required: true,
    },
    videoUrl: { type: String },
}, {
    timestamps: true,
});
exports.default = FaqSchema;
//# sourceMappingURL=faq.schema.js.map