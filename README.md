# DocuSign Clone

A comprehensive digital document signing platform built with modern web technologies. This application enables users to upload documents, apply digital signatures, and maintain complete audit trails of all signing activities.

## 🚀 Features

### Core Functionality
- **Document Management**: Upload, store, and manage documents for signing
- **Digital Signatures**: Electronic signature capabilities with signature canvas
- **User Authentication**: Secure JWT-based user registration and login system
- **Audit Trail**: Complete tracking of document signing activities and changes
- **Document Preview**: View documents before signing with PDF viewer
- **Signature Status Tracking**: Monitor the status of signatures (pending, signed, rejected)
- **Multi-page Support**: Handle multi-page PDF documents
- **File Upload**: Secure file upload with validation

### Technical Features
- **Responsive Design**: Modern UI built with Tailwind CSS
- **Real-time Updates**: Live status updates for document signing
- **Secure File Storage**: Local file system with proper access controls
- **API Security**: CORS configuration and authentication middleware
- **Database Integration**: MongoDB with Mongoose ODM for data persistence

## 🛠️ Tech Stack

### Frontend
- **React.js** - User interface framework
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API calls
- **React PDF** - PDF viewing and manipulation
- **React Signature Canvas** - Digital signature component
- **Lucide React** - Icon library

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **Multer** - File upload middleware
- **Bcrypt** - Password hashing
- **Nodemailer** - Email functionality
- **PDF-lib** - PDF manipulation library

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas account)

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd docu_sign
```

### 2. Install Dependencies

#### Backend Setup
```bash
cd server
npm install
```

#### Frontend Setup
```bash
cd client
npm install
```

### 3. Environment Configuration

#### Backend Environment Variables
Create a `.env` file in the `server` directory:

```env
MONGODB_URI=mongodb://localhost:27017/docu_sign
JWT_SECRET=your_jwt_secret_key_here
PORT=5000
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
```

#### Frontend Environment Variables
Create a `.env` file in the `client` directory:

```env
REACT_APP_API_URL=http://localhost:5000
```

### 4. Database Setup

Make sure MongoDB is running on your system or update the `MONGODB_URI` in your environment variables to point to your MongoDB instance.

## 🏃‍♂️ Running the Application

### Development Mode

#### Start the Backend Server
```bash
cd server
npm start
```

The server will start on `http://localhost:5000`

#### Start the Frontend Development Server
```bash
cd client
npm start
```

The React app will start on `http://localhost:3000`

### Production Build

#### Build the Frontend
```bash
cd client
npm run build
```

## 📁 Project Structure

```
docu_sign/
├── client/                 # React frontend
│   ├── public/            # Static files
│   ├── src/
│   │   ├── components/    # Reusable React components
│   │   ├── pages/         # Page components
│   │   ├── utils/         # Utility functions
│   │   └── styles/        # CSS styles
│   └── package.json
├── server/                # Node.js backend
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Custom middleware
│   ├── models/           # MongoDB schemas
│   ├── routes/           # API routes
│   ├── uploads/          # File upload directory
│   └── package.json
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `POST /register` - User registration
- `POST /login` - User login
- `GET /protected` - Protected route example

### Documents
- `POST /upload` - Upload a document
- `GET /documents` - Get user's documents
- `GET /documents/:id` - Get specific document
- `DELETE /documents/:id` - Delete document

### Signatures
- `POST /signatures` - Create signature request
- `GET /signatures` - Get signatures
- `PUT /signatures/:id` - Update signature status
- `DELETE /signatures/:id` - Delete signature

### Audit Trail
- `GET /audit/:documentId` - Get document audit trail

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt for password security
- **CORS Protection**: Configured for specific origins
- **File Upload Security**: Validation and secure storage
- **Protected Routes**: Middleware-based route protection

## 📱 Usage

### For Users

1. **Registration/Login**: Create an account or sign in
2. **Upload Documents**: Upload PDF documents for signing
3. **Add Signatures**: Place digital signatures on documents
4. **Track Status**: Monitor signature status and completion
5. **View Audit Trail**: Access complete document history

### For Developers

The application follows RESTful API principles and includes comprehensive error handling. All API responses include appropriate HTTP status codes and error messages.

## 🧪 Testing

### Frontend Testing
```bash
cd client
npm test
```

### Backend Testing
```bash
cd server
npm test
```

## 🚀 Deployment

### Backend Deployment
1. Set up environment variables for production
2. Configure MongoDB connection
3. Deploy to your preferred hosting service (Heroku, Vercel, etc.)

### Frontend Deployment
1. Build the production version: `npm run build`
2. Deploy the `build` folder to your hosting service

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the existing issues in the repository
2. Create a new issue with detailed information
3. Include error messages and steps to reproduce

## 🔮 Future Enhancements

- [ ] Email notifications for signature requests
- [ ] Multi-user signature workflows
- [ ] Document templates
- [ ] Advanced PDF editing capabilities
- [ ] Mobile app development
- [ ] Integration with cloud storage services
- [ ] Advanced audit reporting
- [ ] Digital certificate integration

---

**Note**: This is a demonstration project and should not be used for production document signing without proper security audits and compliance verification. 