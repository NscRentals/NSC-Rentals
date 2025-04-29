import UserActivity from "../models/userActivity.js";

// Log user activity (login/logout)
export async function logUserActivity(userId, email, firstName, lastName, activityType) {
    try {
        const activity = new UserActivity({
            userId,
            email,
            firstName,
            lastName,
            activityType
        });
        await activity.save();
    } catch (error) {
        console.error('Error logging user activity:', error);
    }
}

// Log activity from token
export async function logActivityFromToken(req, activityType) {
    try {
        if (req.user && (req.user.type === 'admin' || req.user.type === 'Customer')) {
            await logUserActivity(
                req.user.id,
                req.user.email,
                req.user.firstName,
                req.user.lastName,
                activityType
            );
        }
    } catch (error) {
        console.error('Error logging activity from token:', error);
    }
}

// Get all user activities (for admin dashboard)
export async function getUserActivities(req, res) {
    try {
        if (req.user.type !== 'admin') {
            return res.status(403).json({ message: "Not authorized" });
        }

        // Get activities from the last 24 hours
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        
        const activities = await UserActivity.find({
            timestamp: { $gte: oneDayAgo }
        })
        .sort({ timestamp: -1 }) // Sort by most recent first
        .limit(50); // Limit to last 50 activities

        res.json(activities);
    } catch (error) {
        console.error('Error fetching user activities:', error);
        res.status(500).json({ message: "Error fetching activities" });
    }
} 