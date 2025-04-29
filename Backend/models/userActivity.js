import mongoose from "mongoose";

const userActivitySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    email: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    activityType: {
        type: String,
        enum: ['login', 'logout'],
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const UserActivity = mongoose.model("UserActivity", userActivitySchema);
export default UserActivity; 