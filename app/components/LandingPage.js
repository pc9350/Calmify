export default function LandingPage() {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to Your Dashboard</h1>
          <p className="text-lg mb-8">You have successfully signed in!</p>
          <a href="#" className="px-8 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300">
            Explore More
          </a>
        </div>
      </div>
    );
  }
  