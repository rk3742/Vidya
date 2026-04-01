# VIDYA - AI-Powered JEE/NEET Tutoring Platform

![VIDYA Banner](https://img.shields.io/badge/VIDYA-AI%20Tutor-blueviolet?style=for-the-badge)
[![Live Demo](https://img.shields.io/badge/Live-Demo-success?style=for-the-badge)](https://vidya-ai-coral.vercel.app)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

**VIDYA** is a comprehensive AI-powered tutoring platform designed specifically for JEE and NEET aspirants. It combines adaptive learning, spaced repetition, and multi-language AI explanations to provide personalized learning experiences.

**Deployed link : https://vidya-ai-coral.vercel.app/**

## 🌟 Features

### 📚 **Practice Mode**
- **160+ Curated Questions** across Physics, Chemistry, Mathematics, and Biology
- Filter by subject, difficulty (easy/medium/hard), and chapters
- Real-time AI analysis of submitted answers
- Detailed step-by-step solutions
- Performance tracking with accuracy metrics

### 🎯 **Mock Tests**
- **JEE Mains**: 90 questions (3 hours) - Physics, Chemistry, Math
- **JEE Advanced**: 54 questions (3 hours) - Multi-correct and numerical
- **NEET**: 180 questions (3 hours) - Physics, Chemistry, Botany, Zoology
- **Chapter Tests**: Custom tests for specific chapters
- Live timer with auto-submit
- Comprehensive result analysis with percentile ranking

### 🔄 **Smart Revision System**
- **SM-2 Spaced Repetition Algorithm** for optimal retention
- Adaptive scheduling based on performance
- Due/upcoming revision tracking
- Quality rating (1-5) to adjust repetition intervals
- Visual progress tracking

### 🤖 **AI Doubt Chat**
- Powered by **Groq LLaMA 3.3 70B**
- Multi-language support: **English, Hindi, Tamil, Telugu**
- Context-aware explanations
- Step-by-step hints without giving away the answer
- Interactive conversation history

### 📊 **Analytics Dashboard**
- Subject-wise performance charts (Chart.js)
- Difficulty breakdown analysis
- Recent activity timeline
- Accuracy trends over time
- Study streak tracking

### 🏆 **Leaderboard**
- Weekly, Monthly, and All-Time rankings
- Separate leaderboards for Practice and Mock Tests
- Real-time score updates
- Competitive motivation system

### 👤 **User Profile**
- Personalized study statistics
- Preferred language selection
- Goal setting and tracking
- Study streak monitoring
- Performance history

## 🛠️ Tech Stack

### **Frontend**
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Charts**: Chart.js & React-Chartjs-2
- **Icons**: Lucide React

### **Backend**
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth (Google OAuth + Email/Password)
- **AI**: Groq API (LLaMA 3.3 70B Versatile)
- **Image Hosting**: Cloudinary
- **Admin SDK**: Firebase Admin for server-side operations

### **Deployment**
- **Platform**: Vercel
- **CI/CD**: Automatic deployments via GitHub integration

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- Firebase project with Firestore enabled
- Groq API key
- (Optional) Cloudinary account for image uploads

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/rk3742/Vidya.git
cd Vidya
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:

```env
# Firebase Client SDK
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Admin SDK
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_service_account@your_project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Groq AI
GROQ_API_KEY=your_groq_api_key

# Cloudinary (Optional)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (Optional - for notifications)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. **Seed the database**

Run the seed script to populate Firestore with questions:

```bash
# Start the development server
npm run dev

# In another terminal, seed the database
curl -X POST http://localhost:3000/api/admin/seed
```

5. **Run the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## 📁 Project Structure

```
vidya/
├── src/
│   ├── app/                      # Next.js 14 App Router
│   │   ├── api/                  # API routes
│   │   │   ├── questions/        # Question CRUD
│   │   │   ├── submissions/      # Answer submissions
│   │   │   ├── analytics/        # Performance analytics
│   │   │   ├── revisions/        # Spaced repetition
│   │   │   ├── mocktest/         # Mock test management
│   │   │   ├── leaderboard/      # Rankings
│   │   │   ├── doubts/           # AI chat
│   │   │   └── admin/seed/       # Database seeding
│   │   ├── dashboard/            # Main dashboard
│   │   ├── practice/             # Practice mode
│   │   ├── mocktest/             # Mock tests
│   │   ├── revision/             # Revision system
│   │   ├── analytics/            # Analytics page
│   │   ├── leaderboard/          # Leaderboard page
│   │   ├── profile/              # User profile
│   │   ├── onboarding/           # New user onboarding
│   │   └── auth/                 # Authentication pages
│   ├── components/
│   │   ├── landing/              # Landing page components
│   │   ├── layout/               # App layout wrapper
│   │   └── chat/                 # Doubt chat component
│   ├── lib/
│   │   ├── firebase.ts           # Firebase client SDK
│   │   ├── firebase-admin.ts     # Firebase Admin SDK
│   │   └── groq.ts               # Groq AI client
│   ├── store/
│   │   └── authStore.ts          # Zustand auth store
│   └── styles/
│       └── globals.css           # Global styles
├── public/                       # Static assets
├── .env.local                    # Environment variables
├── next.config.js                # Next.js configuration
├── tailwind.config.ts            # Tailwind CSS config
└── tsconfig.json                 # TypeScript config
```

## 🔐 Firebase Setup

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable **Firestore Database**
3. Enable **Authentication** → Google and Email/Password providers
4. Add your domain to **Authentication → Settings → Authorized domains**
5. Download service account key from **Project Settings → Service accounts**

## 🤖 Groq API Setup

1. Sign up at [console.groq.com](https://console.groq.com)
2. Create an API key
3. Add to `.env.local` as `GROQ_API_KEY`

## 📊 Database Schema

### Questions Collection
```typescript
{
  questionId: string;           // Unique ID (e.g., "PHY-001")
  exam: 'JEE' | 'NEET' | 'BOTH';
  subject: 'physics' | 'chemistry' | 'mathematics' | 'biology';
  chapter: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  questionType: 'single-correct' | 'multi-correct' | 'numerical';
  questionText: string;
  options: Array<{ id: string; text: string }>;
  correctAnswer: string | string[];
  solution: {
    steps: string[];
    explanation: string;
  };
  source: string;
  year: number;
  isActive: boolean;
  attemptCount: number;
  correctCount: number;
}
```

### Users Collection
```typescript
{
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  examPreference: 'JEE' | 'NEET';
  preferredLanguage: 'english' | 'hindi' | 'tamil' | 'telugu';
  studyStreak: number;
  totalQuestionsSolved: number;
  accuracy: number;
  createdAt: Date;
}
```

### Submissions Collection
```typescript
{
  userId: string;
  questionId: string;
  userAnswer: string | string[];
  isCorrect: boolean;
  timeTaken: number;
  submittedAt: Date;
  revisionSchedule: {
    nextReview: Date;
    interval: number;
    easeFactor: number;
    repetitions: number;
  };
}
```

## 🌐 Deployment

### Deploy to Vercel

1. **Push to GitHub**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Import to Vercel**
- Go to [vercel.com](https://vercel.com)
- Import your GitHub repository
- Add all environment variables from `.env.local`
- Deploy!

3. **Update Firebase Authorized Domains**
- Add your Vercel domain (e.g., `your-app.vercel.app`)
- Go to Firebase Console → Authentication → Settings → Authorized domains

4. **Update Environment Variable**
```env
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

## 📈 Key Algorithms

### SM-2 Spaced Repetition
```
- Quality 0-2: Restart (interval = 1 day)
- Quality 3: Repeat (interval = 6 days)
- Quality 4-5: Increase interval exponentially
- EaseFactor adjusts based on performance
```

### Mock Test Scoring
```
- Correct: +4 marks
- Incorrect: -1 mark
- Unattempted: 0 marks
- Percentile calculated from all submissions
```

## 🎨 Features Highlights

- ✅ **Fully Responsive** - Works on mobile, tablet, and desktop
- ✅ **Dark Mode Ready** - Modern UI with dark purple theme
- ✅ **Real-time Updates** - Instant feedback and leaderboard changes
- ✅ **Offline Support** - Firebase handles network interruptions
- ✅ **SEO Optimized** - Next.js 14 with metadata API
- ✅ **Performance** - Optimized images, lazy loading, code splitting
- ✅ **Accessibility** - ARIA labels, keyboard navigation
- ✅ **Security** - Firebase security rules, environment variables

## 🔮 Future Enhancements

- [ ] Video explanations for complex problems
- [ ] Peer-to-peer doubt solving
- [ ] Live classes integration
- [ ] Mobile app (React Native)
- [ ] Personalized study plans with AI
- [ ] Community forums
- [ ] Gamification with badges and achievements
- [ ] Advanced analytics with ML predictions

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**RithikSaikumarKona**
- GitHub: [@rk3742](https://github.com/rk3742)

## 🙏 Acknowledgments

- **Groq** for lightning-fast AI inference
- **Firebase** for robust backend infrastructure
- **Vercel** for seamless deployment
- **Next.js** team for the amazing framework
- All JEE/NEET aspirants who inspired this project

## 📧 Support

For support, email [konarithiksai@gmail.com] or open an issue in the GitHub repository.

---

**Made with ❤️ for JEE/NEET Aspirants**

🌟 **Star this repo if you find it helpful!** 🌟
