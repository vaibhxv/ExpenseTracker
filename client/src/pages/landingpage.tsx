import { Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function LandingPage() {
    const navigate = useNavigate();
  return (
    <div className=" bg-[#fffaf5] flex items-center">
     
      <header className="w-full py-16 mt-16">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="md:w-1/2 max-w-2xl mx-auto md:mx-0">
              <div className="inline-block px-4 py-2 bg-orange-100 rounded-full text-orange-600 font-medium text-sm mb-6">
                ✨ Your money, your story
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Making money management 
                <span className="relative">
                  <span className="bg-gradient-to-r from-orange-500 to-pink-500 text-transparent bg-clip-text"> fun</span>
                  <svg className="absolute -bottom-4 left-0 w-full" viewBox="0 0 100 12" preserveAspectRatio="none">
                    <path d="M0,0 Q50,12 100,0" fill="none" stroke="#f97316" strokeWidth="3"/>
                  </svg>
                </span>
                <br />& simple
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Stop stressing about expenses. ExpenseTrackeroo helps you understand your spending with a dash of joy! 🎯
              </p>
              <button  onClick={() => navigate('/login')} className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-8 py-4 rounded-full text-lg font-medium hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2">
                Start Your Journey <Sparkles className="w-5 h-5" />
              </button>
            </div>
            <div className="md:w-1/2 relative max-w-xl mx-auto md:mx-0">
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-orange-100 rounded-full -z-10"></div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-pink-100 rounded-full -z-10"></div>
              <img
                src="https://images.unsplash.com/photo-1579621970795-87facc2f976d?auto=format&fit=crop&w=800&q=80"
                alt="Financial dashboard"
                className="rounded-3xl shadow-2xl rotate-1 hover:rotate-0 transition-transform duration-300"
              />
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

export default LandingPage;