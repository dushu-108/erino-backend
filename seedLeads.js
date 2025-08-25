import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Lead from './models/lead.js';

dotenv.config();

// Sample data generation functions
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomDate = (start, end) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

const sources = ['website', 'facebook_ads', 'google_ads', 'referral', 'events', 'other'];
const statuses = ['new', 'contacted', 'qualified', 'lost', 'won'];
const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose'];
const states = ['CA', 'TX', 'FL', 'NY', 'PA', 'IL', 'OH', 'GA', 'NC', 'MI'];
const companies = ['TechCorp', 'InnoSoft', 'DataSystems', 'CloudNine', 'WebWise', 'NetSol', 'InfoTech', 'SoftServe', 'ByteDance', 'Nexus'];

const generateLeads = (count) => {
  const leads = [];
  
  for (let i = 1; i <= count; i++) {
    const firstName = `User${i}`;
    const lastName = `Last${i}`;
    const email = `user${i}@example.com`;
    const phone = `+1${Math.floor(1000000000 + Math.random() * 9000000000)}`;
    const company = companies[Math.floor(Math.random() * companies.length)];
    const city = cities[Math.floor(Math.random() * cities.length)];
    const state = states[Math.floor(Math.random() * states.length)];
    const source = sources[Math.floor(Math.random() * sources.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const score = getRandomInt(0, 100);
    const leadValue = getRandomInt(1000, 50000);
    const lastActivityAt = randomDate(new Date(2024, 0, 1), new Date());
    const isQualified = Math.random() > 0.5;
    
    leads.push({
      first_name: firstName,
      last_name: lastName,
      email: email,
      phone: phone,
      company: company,
      city: city,
      state: state,
      source: source,
      status: status,
      score: score,
      lead_value: leadValue,
      last_activity_at: lastActivityAt,
      is_qualified: isQualified,
      created_at: new Date(),
      updated_at: new Date()
    });
  }
  
  return leads;
};

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    // Clear existing leads
    await Lead.deleteMany({});
    console.log('Cleared existing leads');
    
    // Generate and insert new leads
    const leads = generateLeads(100);
    await Lead.insertMany(leads);
    
    console.log('Successfully seeded 100 leads');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
