const users = [];

// Generate 100 users for performance testing
const firstNames = ['Sarah', 'Marcus', 'Emily', 'David', 'Priya', 'James', 'Aisha', 'Lucas', 'Sophie', 'Raj', 'Isabella', 'Mohammed', 'Elena', 'Chen', 'Olivia', 'Yuki', 'Carlos', 'Fatima', 'Alexander', 'Nina'];
const lastNames = ['Chen', 'Rodriguez', 'Watson', 'Kim', 'Sharma', 'Anderson', 'Mohammed', 'Silva', 'Turner', 'Patel', 'Costa', 'Al-Farsi', 'Popov', 'Wei', 'Brown', 'Tanaka', 'Mendez', 'Hassan', 'Ivanov', 'Schmidt'];
const roles = ['Engineering Manager', 'Senior Developer', 'Product Designer', 'DevOps Engineer', 'Product Manager', 'Frontend Developer', 'UX Researcher', 'Backend Developer', 'Marketing Lead', 'Data Analyst', 'Sales Manager', 'Security Engineer', 'HR Manager', 'Mobile Developer', 'Content Strategist', 'QA Engineer', 'Finance Director', 'Customer Success', 'Technical Writer', 'Legal Counsel'];
const departments = ['Engineering', 'Design', 'Product', 'Marketing', 'Analytics', 'Sales', 'Human Resources', 'Finance', 'Legal', 'Support', 'Documentation'];
const statuses = ['active', 'active', 'active', 'active', 'away', 'offline'];

for (let i = 1; i <= 100; i++) {
  const firstName = firstNames[i % firstNames.length];
  const lastName = lastNames[Math.floor(i / firstNames.length) % lastNames.length];
  const name = `${firstName} ${lastName}`;

  users.push({
    id: i,
    name: name,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@company.com`,
    avatar: `https://i.pravatar.cc/150?img=${(i % 70) + 1}`,
    role: roles[i % roles.length],
    department: departments[i % departments.length],
    status: statuses[i % statuses.length],
    joinedAt: new Date(2020 + Math.floor(i / 25), (i % 12), (i % 28) + 1).toISOString()
  });
}

module.exports = users;
