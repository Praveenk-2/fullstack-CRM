const dotenv = require('dotenv');
dotenv.config();

const app = require('./src/app');
const connectDB = require('./src/config/db');
const User = require('./src/models/User');
const Company = require('./src/models/Company');
const Lead = require('./src/models/Lead');
const Task = require('./src/models/Task');

const PORT = process.env.PORT || 5000;

const seedInitialDataIfNeeded = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('No existing users found. Auto-seeding initial test data...');
      
      const users = await User.create([
        { name: 'John', email: 'john@example.com', password: 'password123' },
        { name: 'David', email: 'david@example.com', password: 'password123' },
        { name: 'Admin', email: 'admin@example.com', password: 'password123' },
      ]);

      const john = users.find((u) => u.name === 'John');
      const david = users.find((u) => u.name === 'David');
      const admin = users.find((u) => u.name === 'Admin');

      const companies = await Company.create([
        { name: 'ABC Corp', industry: 'IT Services', location: 'Chennai' },
        { name: 'XYZ Technologies', industry: 'Software Development', location: 'Bangalore' },
        { name: 'Global Solutions', industry: 'Consulting', location: 'Mumbai' },
      ]);

      const abcCorp = companies.find((c) => c.name === 'ABC Corp');
      const xyzTech = companies.find((c) => c.name === 'XYZ Technologies');
      const globalSol = companies.find((c) => c.name === 'Global Solutions');

      const leads = await Lead.create([
        {
          name: 'Ravi Kumar',
          email: 'ravi@example.com',
          phone: '+91 9876543210',
          status: 'New',
          assignedTo: john._id,
          company: abcCorp._id,
          isDeleted: false,
        },
        {
          name: 'Priya Sharma',
          email: 'priya@example.com',
          phone: '+91 9876543211',
          status: 'Contacted',
          assignedTo: david._id,
          company: xyzTech._id,
          isDeleted: false,
        },
        {
          name: 'Amit Patel',
          email: 'amit@example.com',
          phone: '+91 9876543212',
          status: 'Contacted',
          assignedTo: john._id,
          company: abcCorp._id,
          isDeleted: false,
        },
        {
          name: 'Sara Khan',
          email: 'sara@example.com',
          phone: '+91 9876543213',
          status: 'Lost',
          assignedTo: admin._id,
          company: globalSol._id,
          isDeleted: false,
        },
      ]);

      const leadRavi = leads.find((l) => l.name === 'Ravi Kumar');
      const leadPriya = leads.find((l) => l.name === 'Priya Sharma');
      const leadAmit = leads.find((l) => l.name === 'Amit Patel');

      await Task.create([
        {
          title: 'Initial Discovery Call with Ravi',
          lead: leadRavi._id,
          assignedTo: john._id,
          dueDate: new Date(),
          status: 'Pending',
        },
        {
          title: 'Send Proposal to Priya',
          lead: leadPriya._id,
          assignedTo: david._id,
          dueDate: new Date(),
          status: 'Pending',
        },
        {
          title: 'Product Demo for Amit',
          lead: leadAmit._id,
          assignedTo: john._id,
          dueDate: new Date(Date.now() + 86400000 * 2),
          status: 'Completed',
        },
      ]);

      console.log('✅ Auto-seeding completed!');
    }
  } catch (error) {
    console.error('Auto-seeding error:', error.message);
  }
};

// Connect to Database and start server
if (!process.env.VERCEL) {
  connectDB().then(async () => {
    await seedInitialDataIfNeeded();
    app.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
  });
} else {
  connectDB().then(async () => {
    await seedInitialDataIfNeeded();
  });
}

module.exports = app;