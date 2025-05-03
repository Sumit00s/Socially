# Socially 📱  
*Social Media Platform*

Socially is a modern social media platform that allows users to register, create posts, follow others, comment, like, and interact with a dynamic feed. Built with Next.js, Prisma, and Postgres on NeonDB, the platform features responsive UI components and seamless authentication using Clerk. Users can also upload media with UploadThing.

---

## 🚀 Features

- 📝 **Create Posts**: Share your thoughts with text, images, and videos.
- 🔔 **Follow & Unfollow**: Connect with other users and keep up with their posts.
- ❤️ **Like & Comment**: Interact with posts by liking and commenting.
- 🔐 **Authentication**: Register, log in, and manage your profile with Clerk.
- 🖼 **Media Upload**: Upload images and media files with UploadThing.
- 📱 **Responsive Design**: Optimized for mobile and desktop use.

---

## 🛠 Tech Stack

| Technology         | Role |
|--------------------|------|
| **Next.js**         | Full-stack React framework |
| **Prisma**          | ORM for database access |
| **PostgreSQL**      | Database management system |
| **NeonDB**          | Serverless Postgres database |
| **Tailwind CSS**    | Utility-first CSS styling |
| **ShadCN UI**       | Beautiful, reusable UI components |
| **Clerk**           | Authentication service for user sessions |
| **UploadThing**     | Media upload service for handling images and videos |

---

## 📦 Project Setup

To run Socially locally, follow these steps:

```bash
# 1. Clone the repository
git clone https://github.com/Sumit00s/Socially.git
cd Socially

# 2. Install dependencies
npm install

# 3. Create .env.local file and add the following environment variables:

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your-clerk-publishable-key
CLERK_SECRET_KEY=your-clerk-secret-key
DATABASE_URL=your-postgres-database-url
UPLOADTHING_TOKEN=your-uploadthing-token

# 4. Run the development server
npm run dev
