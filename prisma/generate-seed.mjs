import fs from 'fs';
import { faker } from '@faker-js/faker';

const seedData = {
    users: [],
    accounts: [],
    categories: [],
    tags: [],
    posts: [],
    comments: []
};

// 0. Generate Base Entities
const adminPasswordHash = "$2b$10$ZrsDOy6oAbnXv2P8jyFrE.UkUJwEBhej1rXYN6zSX6tAIYXMg6OeC"; // password123

// Ensure default testing accounts exist
seedData.users.push(
    { email: "admin@example.com", name: "Admin User", username: "admin", role: "ADMIN", image: "https://i.pravatar.cc/150?u=admin", password: adminPasswordHash },
    { email: "janedoe@example.com", name: "Jane Doe", username: "janedoe", role: "READER", image: "https://i.pravatar.cc/150?u=janedoe", password: adminPasswordHash }
);

for (let i = 0; i < 50; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const username = faker.internet.username({ firstName, lastName }).toLowerCase().replace(/[^a-z0-9]/g, '');
    seedData.users.push({
        email: faker.internet.email({ firstName, lastName }),
        name: `${firstName} ${lastName}`,
        username,
        role: "READER",
        image: `https://i.pravatar.cc/150?u=${username}`,
        password: adminPasswordHash
    });
}

// Generate some Mock OAuth Accounts
for (let i = 0; i < 10; i++) {
    const user = seedData.users[i];
    seedData.accounts.push({
        userUsername: user.username,
        type: "oauth",
        provider: faker.helpers.arrayElement(["google", "github"]),
        providerAccountId: faker.string.uuid(),
        access_token: faker.string.alphanumeric(32)
    });
}

// Generate Categories
const catNames = [
    "Technology", "Lifestyle", "Programming", "Design", "Business", "Travel", "Finance",
    "Health & Wellness", "Education", "Entertainment", "Sports", "Science", "Food & Drink",
    "Art", "Music", "Gaming", "Fashion", "Beauty", "Home & Garden", "Automotive", "Real Estate",
    "Politics", "Environment", "History", "Philosophy", "Literature", "Photography", "Marketing",
    "Artificial Intelligence", "Cybersecurity"
];
for (const name of catNames) {
    seedData.categories.push({ name, slug: faker.helpers.slugify(name).toLowerCase() });
}

// Generate Tags
// for (let i = 0; i <= 50; i++) {
//   const name = faker.commerce.productAdjective();
const tagNames = [
    "React", "Next.js", "Web Development", "Health", "UI/UX", "Entrepreneurship", "Adventure",
    "Python", "JavaScript", "Machine Learning", "CSS", "Node.js", "Cloud Computing", "DevOps",
    "Docker", "Kubernetes", "Data Science", "Blockchain", "Cryptocurrency", "Startups",
    "Leadership", "Productivity", "Investing", "Personal Finance", "Real Estate Investing",
    "Marketing Strategy", "SEO", "Content Marketing", "Social Media", "Photography Tips",
    "Graphic Design", "Illustration", "Typography", "Fitness", "Nutrition", "Mental Health",
    "Yoga", "Meditation", "Vegan", "Gluten-Free", "Baking", "Coffee", "Wine", "Backpacking",
    "Solo Travel", "Digital Nomad", "Road Trips", "Sustainable Living", "Climate Change",
    "Zero Waste", "Minimalism", "DIY", "Interior Design", "Gardening", "Pets", "Dogs", "Cats",
    "Parenting", "Relationships", "Dating", "Wedding Planning", "Movies", "Television", "Books",
    "Writing", "Poetry", "Music Production", "Guitar", "Piano", "Esports", "Board Games",
    "Football", "Basketball", "Tennis", "Running", "Cycling", "Swimming", "Electric Vehicles",
    "Space Exploration", "Astrophysics"
];
for (const name of tagNames) {
    seedData.tags.push({ name, slug: faker.helpers.slugify(name).toLowerCase() });
}

const { users, categories, tags, posts, comments, accounts } = seedData;

// 1. Generate 100 Posts
for (let i = 0; i < 500; i++) {
    const title = faker.lorem.sentence({ min: 4, max: 8 }).replace('.', '');
    const category = faker.helpers.arrayElement(categories);
    const author = faker.helpers.arrayElement(users);

    // Pick 1 to 4 random tags
    const postTags = faker.helpers.arrayElements(tags, { min: 1, max: 4 });

    posts.push({
        id: `post_${i}`, // Temp ID to map comments later
        title: title,
        slug: faker.helpers.slugify(title).toLowerCase(),
        excerpt: faker.lorem.sentences(2),
        content: faker.lorem.paragraphs({ min: 4, max: 10 }),
        status: faker.helpers.arrayElement(['PUBLISHED', 'PUBLISHED', 'PUBLISHED', 'DRAFT']),
        publishedDaysAgo: faker.number.int({ min: 0, max: 365 }),
        readingTime: faker.number.int({ min: 2, max: 15 }),
        image: faker.image.url({ category: category.slug, width: 1000, height: 600 }),
        categorySlug: category.slug,
        tagSlugs: postTags.map(t => t.slug),
        authorUsername: author.username
    });
}

// 2. Generate 200 Top-Level Comments
for (let i = 0; i < 200; i++) {
    const post = faker.helpers.arrayElement(posts);
    const author = faker.helpers.arrayElement(users);

    comments.push({
        id: `comment_${i}`,
        content: faker.lorem.sentences({ min: 1, max: 3 }),
        authorUsername: author.username,
        postSlug: post.slug,
        parentId: null, // Null indicates a top-level comment
        createdAtDaysAgo: faker.number.int({ min: 0, max: post.publishedDaysAgo })
    });
}

// 3. Generate 200 Replies (Nested Comments)
const topLevelComments = comments.filter(c => c.parentId === null);

for (let i = 0; i < 200; i++) {
    const parentComment = faker.helpers.arrayElement(topLevelComments);
    const author = faker.helpers.arrayElement(users);

    comments.push({
        id: `reply_${i}`,
        content: faker.lorem.sentences({ min: 1, max: 2 }),
        authorUsername: author.username,
        postSlug: parentComment.postSlug,
        parentId: parentComment.id, // Links to the parent comment for nesting
        createdAtDaysAgo: faker.number.int({ min: 0, max: parentComment.createdAtDaysAgo })
    });
}

// Clean up temporary IDs from posts before final assembly
const cleanedPosts = posts.map(({ id, ...rest }) => rest);

// Assemble final JSON
seedData.posts = cleanedPosts;
seedData.comments = comments;

// Write the fully populated data back to the file
fs.writeFileSync('prisma/seed-data.json', JSON.stringify(seedData, null, 2));

console.log('✅ Successfully generated 100 posts, 200 comments, and 200 replies!');