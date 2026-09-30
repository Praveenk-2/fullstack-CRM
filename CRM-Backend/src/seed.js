const dotenv = require('dotenv');
dotenv.config();

const connectDB = require('./config/db');
const User = require('./models/User');
const Company = require('./models/Company');
const Lead = require('./models/Lead');
const Task = require('./models/Task');

const seedData = async () => {
  try {
    await connectDB();

    console.log('Clearing existing data...');
    await Task.deleteMany({});
    await Lead.deleteMany({});
    await Company.deleteMany({});
    await User.deleteMany({});

    console.log('Seeding Users...');
    const users = await User.create([
      {
        name: 'Admin',
        email: 'admin@gmail.com',
        password: '12345',
      },
    ]);

    const admin = users[0];
    const john = admin;
    const david = admin;

    console.log('Seeding Companies...');
    const companies = await Company.create([
      {
        name: 'ABC Corp',
        industry: 'IT Services',
        location: 'Chennai',
      },
      {
        name: 'XYZ Technologies',
        industry: 'Software Development',
        location: 'Bangalore',
      },
      {
        name: 'Global Solutions',
        industry: 'Consulting',
        location: 'Mumbai',
      },
    ]);

    const abcCorp = companies.find((c) => c.name === 'ABC Corp');
    const xyzTech = companies.find((c) => c.name === 'XYZ Technologies');
    const globalSol = companies.find((c) => c.name === 'Global Solutions');

    console.log('Seeding Leads...');
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
      {
        name: 'Vikram Singh',
        email: 'vikram@example.com',
        phone: '+91 9876543214',
        status: 'New',
        assignedTo: david._id,
        company: xyzTech._id,
        isDeleted: false,
      },
      {
        name: 'Sneha Reddy',
        email: 'sneha@example.com',
        phone: '+91 9876543215',
        status: 'Contacted',
        assignedTo: admin._id,
        company: globalSol._id,
        isDeleted: false,
      },
    ]);

    const leadRavi = leads.find((l) => l.name === 'Ravi Kumar');
    const leadPriya = leads.find((l) => l.name === 'Priya Sharma');
    const leadAmit = leads.find((l) => l.name === 'Amit Patel');
    const leadSara = leads.find((l) => l.name === 'Sara Khan');

    console.log('Seeding Tasks...');
    const today = new Date();

    await Task.create([
      {
        title: 'Initial Discovery Call with Ravi',
        lead: leadRavi._id,
        assignedTo: john._id,
        dueDate: today,
        status: 'Pending',
      },
      {
        title: 'Send Proposal to Priya',
        lead: leadPriya._id,
        assignedTo: david._id,
        dueDate: today,
        status: 'Pending',
      },
      {
        title: 'Product Demo for Amit',
        lead: leadAmit._id,
        assignedTo: john._id,
        dueDate: new Date(Date.now() + 86400000 * 2), // 2 days from now
        status: 'Completed',
      },
      {
        title: 'Follow-up Email to Sara',
        lead: leadSara._id,
        assignedTo: admin._id,
        dueDate: new Date(Date.now() - 86400000), // Yesterday
        status: 'Completed',
      },
    ]);

    console.log('✅ Database Seeded Successfully!');
    console.log('-----------------------------------');
    console.log('Test Credentials:');
    console.log('Admin - Email: admin@gmail.com | Password: 12345');
    console.log('-----------------------------------');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
