// Middleware to check if user is an admin
export const isAdmin = (req, res, next) => {
  console.log('User in admin middleware:', req.user);
  console.log('User type:', req.user?.type);
  
  // Check if user exists and has admin role (using lowercase 'admin')
  if (!req.user || req.user.type !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required.'
    });
  }
  next();
}; 