import FacialRecognitionButton from "./FacialRecognitionButton"; 

export default function LandingPage({ isSubscribed }) {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to Your Dashboard</h1>
        <p className="text-lg mb-8">You have successfully signed in!</p>
        
        {/* Explore More Button */}
        <a href="#" className="px-8 py-3 bg-lime-600 text-white hover:bg-lime-900 transition duration-300">
          Explore More
        </a>

        {/* Facial Recognition Button - Only visible if the user is a premium subscriber */}
        {/* {isSubscribed && ( */}
          <div className="mt-12">
            <FacialRecognitionButton />
          </div>
        {/* )} */}
      </div>
    </div>
  );
}
