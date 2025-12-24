const spaces = [];

// Generate 50 spaces for performance testing
const spaceNames = ['Engineering', 'Product Roadmap', 'Design System', 'Marketing Campaigns', 'Mobile App', 'DevOps & Infrastructure', 'Customer Feedback', 'Analytics Dashboard', 'Random', 'Security & Compliance'];
const types = ['team', 'project', 'channel'];
const icons = ['🛠️', '🎯', '🎨', '📱', '⚙️', '💬', '📊', '🎉', '🔒', '📚', '💼', '📢', '🚀', '💡', '🎪'];
const colors = ['#667eea', '#f093fb', '#4facfe', '#feca57', '#ff6b6b', '#5f27cd', '#00d2d3', '#48dbfb', '#ff9ff3', '#ee5a6f', '#fd79a8', '#a29bfe', '#74b9ff', '#55efc4', '#fdcb6e'];

for (let i = 1; i <= 50; i++) {
    const nameIndex = (i - 1) % spaceNames.length;
    const suffix = Math.floor((i - 1) / spaceNames.length);
    const name = suffix > 0 ? `${spaceNames[nameIndex]} ${suffix + 1}` : spaceNames[nameIndex];

    spaces.push({
        id: i,
        name: name,
        description: `Workspace for ${name.toLowerCase()} - Collaborative environment for team productivity`,
        type: types[i % types.length],
        icon: icons[i % icons.length],
        color: colors[i % colors.length],
        memberCount: 5 + (i % 45),
        isPrivate: i % 3 === 0,
        createdAt: new Date(2020 + Math.floor(i / 15), (i % 12), 1).toISOString(),
        updatedAt: new Date(2024, 11, 24 - (i % 20)).toISOString()
    });
}

module.exports = spaces;
