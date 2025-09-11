# 🗳️ Election Web App

A full-stack election web application built with the MERN stack (MongoDB, Express, React, Node.js) that allows voters to securely cast their votes for candidates in various positions.

## 🏗️ Architecture

- **Frontend**: React + Vite with Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT-based with bcrypt password hashing
- **Image Storage**: Cloudinary for candidate profile pictures

## 📁 Project Structure

```
election-app/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── models/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── scripts/
│   │   └── app.js
│   ├── package.json
│   └── .env
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── services/
    │   ├── context/
    │   ├── App.jsx
    │   └── main.jsx
    ├── package.json
    └── .env
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Cloudinary account
- SMTP server for emails

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Update .env with your configuration
npm run seed:admin
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
# Update .env with your configuration
npm run dev
```

## 🔐 Authentication

The system supports three user roles:

- **Admin**: Manage voters, candidates, and view statistics
- **Voter**: Cast votes for candidates
- **Candidate**: Appear as voting options (no login access)

## 🛡️ Security Features

- JWT-based authentication with HttpOnly cookies
- bcrypt password hashing
- Role-based access control
- Input validation and sanitization
- CORS protection
- Rate limiting (to be implemented)

## 📱 Features

### For Voters

- Secure login with email and password
- View all candidates grouped by position
- Cast votes for candidates
- See voting status and remaining positions

### For Admins

- Dashboard with voting statistics
- Manage voters (view, filter)
- Manage candidates (view)
- Monitor election progress

## 🎨 UI Design

The application follows a clean, professional design with:

- Responsive layout for all device sizes
- Accessible color scheme with proper contrast
- Intuitive navigation and user flows
- Loading states and error handling
- Consistent component library

## 📚 API Endpoints

### Authentication

- `POST /api/auth/login` - User login
- `POST /api/auth/verify-token` - Verify JWT token

### Candidates

- `GET /api/candidates` - Get all candidates grouped by position

### Voting

- `POST /api/votes` - Cast a vote
- `GET /api/votes/my-votes` - Get current user's voting status

### Admin

- `GET /api/admin/voters` - Get all voters with voting status
- `GET /api/admin/vote-stats` - Get voting statistics by position

## 🛠️ Scripts

- `npm run seed:admin` - Create initial admin user
- `npm run seed:voters` - Register voters in bulk
- `npm run seed:candidates` - Register candidates in bulk

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📧 Contact

For any questions or feedback, please open an issue on GitHub.
