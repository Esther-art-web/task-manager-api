const mongoose = require("mongoose");
const taskSchema = new mongoose.Schema({
    owner : {
        type: mongoose.Schema.Types.ObjectId,
        reqired : true,
        ref : "User"
    },
    description: {
        type: String,
        trim: true,
        required: true
    },
    completed: {
        type: Boolean,
        required: false,
        default: false
    }
}, {
    timestamps : true
})
const Task = mongoose.model("Task", taskSchema )


module.exports= Task;