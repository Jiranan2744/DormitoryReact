import User from "../modals/User.js";


const isAdmin = (req, res, next) => {
  const user = req.user; 

  if (!user || user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Only admins are allowed.' });
  }

  next();
};

export const getAllUsers = async (req, res) => {
  try {
    await isAdmin(req, res, async () => {
      const users = await User.find();
      res.status(200).json(users);
    });
  } catch (error) {
    console.error('Error getting users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
  
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the user exists
    const existingUser = await User.findById(id);

    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Proceed with user deletion
    const deletedUser = await User.findByIdAndDelete(id);

    console.log('User deleted:', deletedUser);

    // Return a success message or the updated list of users
    const remainingUsers = await User.find();
    return res.status(200).json({ message: 'User deleted successfully', users: remainingUsers });
  } catch (error) {
    console.error('Error deleting user:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
