const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

const getRandomDate = (daysBack = 365) => {
    const date = new Date();
    date.setDate(date.getDate() - getRandomInt(0, daysBack));
    return date.toISOString();
};

const companyNames = ['Acme Corp', 'Globex', 'Soylent Corp', 'Initech', 'Umbrella Corp', 'Stark Ind', 'Cyberdyne', 'Massive Dynamic', 'Hooli', 'Pied Piper'];
const catchPhrases = ['Innovation directly', 'Future of work', 'Synergy incorporated', 'Scalable solutions', 'Dynamic workflows', 'Empowering teams', 'Global reach', 'Next-gen platform'];
const descriptions = [
    'A dedicated space for our team to collaborate and innovative.',
    'Project management and tracking for Q4 objectives.',
    'General discussion and random thoughts.',
    'High-priority tasks and confidential documents.',
    'Customer feedback loop and support tickets.',
    'Design system assets and brand guidelines.'
];

const generateSpaces = (count = 50) => {
    return Array.from({ length: count }, (_, i) => {
        const spaceId = i + 1;
        const isPersonal = Math.random() > 0.7;
        const type = isPersonal ? 'personal' : 'work';

        // Generate roles
        const spaceRoles = Array.from({ length: 3 }, (_, r) => ({
            id: parseInt(`${spaceId}${r}`),
            space_id: spaceId,
            name: `Role ${r + 1}`,
            icon: '🛡️',
            description: getRandomElement(descriptions),
            configuration: { permissions: ['read', 'write'] },
            created_at: getRandomDate(),
            updated_at: getRandomDate(30)
        }));

        // Generate members
        const spaceMembers = Array.from({ length: Math.floor(Math.random() * 5) + 1 }, (_, m) => ({
            id: parseInt(`${spaceId}${m}`),
            space_id: spaceId,
            user_id: getRandomInt(1, 100),
            status: 'active',
            invite_email: null,
            invite_username: null,
            invite_alias: null,
            notes: null,
            created_at: getRandomDate(),
            updated_at: getRandomDate(30),
            is_admin: m === 0, // First member is admin
            isVisible: true
        }));

        // Generate flows/categories (simplified)
        const flows = [];
        const categories = [];

        return {
            id: spaceId,
            created_at: getRandomDate(),
            updated_at: getRandomDate(30),
            deleted: false,
            deleted_at: null,
            deleted_by: null,
            perma_delete_at: null,
            length: 0,
            owner_id: getRandomInt(1, 100),
            type: type,
            profile_type: isPersonal ? 'personal' : 'work',
            name: `${getRandomElement(companyNames)} Workspace`,
            no_logo_colour: getRandomColor(),
            logo_url: null,
            banner_url: null,
            description: getRandomElement(catchPhrases),
            terms: true,
            terms_text: "Standard Terms",
            created_by: getRandomInt(1, 100),
            decription: getRandomElement(descriptions), // Typo consistency
            _count: {
                space_member: spaceMembers.length
            },
            activeCalls: [],
            unreadCount: getRandomInt(0, 5),
            isMention: Math.random() > 0.8,
            isInvited: false,

            // Nested Data
            spaceRoles,
            flows,
            categories,
            spaceMembers
        };
    });
};

export default generateSpaces();
