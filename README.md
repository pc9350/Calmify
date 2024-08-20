# 🌟 Calmify – AI-Powered Emotional Support Platform

<img src="./public/calmify-logo.png" alt="Calmify Logo" width="200" height="200">

[![Vercel](https://vercel.com/button)](https://calmify-ten.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-Framework-black)](https://nextjs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-Backend-orange)](https://firebase.google.com/)

## 🚀 About the Project

**Calmify** is an AI-powered platform designed to provide personalized emotional support through custom flashcards. Whether you're feeling sad, confused, or in need of some encouragement, Calmify offers tailored advice and positive affirmations to help you navigate your emotions.

[Calmify Demo video](https://www.youtube.com/watch?v=6Bv7J_ynfhs)

## 🌐 Live Demo

👉 [Try Calmify Now](https://calmify-ten.vercel.app/)

## ✨ Features

- **AI-Powered Flashcards**: Leveraging OpenAI's GPT-4o-mini to generate content that resonates with your current emotional state.
- **Real-Time Emotion Detection**: Using AWS Rekognition to analyze facial expressions and provide the most relevant flashcards.
- **Secure User Authentication**: Powered by Clerk for seamless login and account management.
- **Subscription Management**: Integrated with Stripe to handle premium features and subscriptions.
- **Responsive Design**: Built with Next.js and Material-UI, ensuring a smooth experience across all devices.

## 🛠️ Tech Stack

- **Frontend**: Next.js, React, Material-UI
- **Backend**: Firebase (Firestore, Storage, Authentication)
- **AI Integration**: OpenAI's GPT-4o-mini
- **Facial Recognition**: AWS Rekognition
- **Payments**: Stripe
- **Deployment**: Vercel

## 🎨 UI/UX

Calmify's interface is designed with user experience in mind, offering a clean, intuitive, and responsive design. The use of Material-UI ensures consistency and accessibility across all devices.

## 🧠 How It Works

1. **User Input**: Enter your current mood or emotion, or use the facial recognition feature to automatically detect your emotional state.
2. **AI Processing**: OpenAI GPT-4o-mini processes your input to generate personalized flashcards that offer advice, support, and affirmations.
3. **Display Flashcards**: The app presents the flashcards to help guide you through your emotional journey.

## 🚧 Challenges & Solutions

- **Optimizing AI Response Time**: Balanced between performance and content richness by refining API calls and prompt structures, resulting in reduced latency.
- **Seamless Integration**: Ensured smooth integration of multiple services (Clerk, Stripe, AWS) to maintain a high-quality user experience.

## 📸 Screenshots

![Home Page](./assets/screenshot1.png)
![Flashcards](./assets/screenshot2.png)

## 📈 Future Enhancements

- **Expanded Emotion Categories**: Adding more nuanced emotional categories to improve flashcard personalization.
- **Enhanced AI Capabilities**: Exploring advanced AI features to further refine the content generation process.
- **User Feedback Integration**: Allowing users to provide feedback on the effectiveness of flashcards to improve the AI's responses over time.

## 💡 Getting Started

### Prerequisites

- Node.js
- Firebase Account
- Clerk Account
- Stripe Account
- AWS Account (for Rekognition)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/calmify.git

2. Navigate to the project directory:

   ```bash
   cd calmify
   
3. Install dependencies:

   ```bash
   npm install
4. Set up environment variables:

   Create a `.env.local` file in the root of your project and add your API keys and configuration settings:

   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_CLERK_FRONTEND_API=your_clerk_frontend_api
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key
   
5. Start the development server:

   ```bash
   npm run dev

6. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/YourFeature`)
3. Commit your Changes (`git commit -m 'Add some YourFeature'`)
4. Push to the Branch (`git push origin feature/YourFeature`)
5. Open a Pull Request

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📞 Contact

Pranav - [LinkedIn](https://www.linkedin.com/in/pranavchhabra/) - chhabrapranav2001@gmail.com

Project Link: [https://github.com/pc9350/calmify](https://github.com/pc9350/calmify)
