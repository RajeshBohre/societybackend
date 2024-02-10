


const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let smartphone = new Schema({
    voucherNo: String,
    amount: String,
    paidBy: String,
    paidTo: String,
    paidDate : Date,
    month: Object,
    comment: String
});

const model = mongoose.model("monthly-expenses", smartphone);

module.exports = model;