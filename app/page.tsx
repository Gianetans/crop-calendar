import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <div className="text-6xl mb-6">🌱</div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            CropCalendar
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-4 max-w-3xl mx-auto">
            Plant the right crop at the right time, every time
          </p>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Know exactly when to plant each crop based on your location and frost dates. 
            Get personalized planting schedules, companion planting advice, and harvest predictions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button variant="primary" size="lg" className="text-lg px-8">
                Get Started Free
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button variant="secondary" size="lg" className="text-lg px-8">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Everything You Need for a Successful Garden
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-4xl mb-4">📅</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Personalized Planting Dates
            </h3>
            <p className="text-gray-600">
              Get exact planting dates based on your location&apos;s last frost date. 
              Know when to start seeds indoors, transplant, and direct sow.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Comprehensive Crop Library
            </h3>
            <p className="text-gray-600">
              Access detailed information on 30+ crops including days to maturity, 
              frost tolerance, spacing, and growing tips.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-4xl mb-4">🌿</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Garden Planning
            </h3>
            <p className="text-gray-600">
              Track your garden plan with status updates, actual plant dates, 
              and harvest predictions. Never miss a planting window.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-4xl mb-4">🗓️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Visual Calendar
            </h3>
            <p className="text-gray-600">
              See your entire planting schedule at a glance with a beautiful 
              calendar view. Plan succession plantings with ease.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-4xl mb-4">🤝</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Companion Planting Guide
            </h3>
            <p className="text-gray-600">
              Learn which plants grow well together and which to keep apart. 
              Maximize your garden&apos;s potential with smart companion planting.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-4xl mb-4">📱</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Mobile Friendly
            </h3>
            <p className="text-gray-600">
              Access your garden plan from anywhere. Check planting dates while 
              you&apos;re in the garden on your phone or tablet.
            </p>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">1</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Create Account</h3>
              <p className="text-gray-600">Sign up for free and set up your profile</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Add Location</h3>
              <p className="text-gray-600">Enter your location and frost dates</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">3</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Choose Crops</h3>
              <p className="text-gray-600">Select crops from our comprehensive library</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">4</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Start Growing</h3>
              <p className="text-gray-600">Follow your personalized planting schedule</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl shadow-xl p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Grow Your Best Garden Yet?
          </h2>
          <p className="text-xl text-green-50 mb-8">
            Join CropCalendar today and never miss a planting window again
          </p>
          <Link href="/auth/signup">
            <Button variant="secondary" size="lg" className="text-lg px-8 bg-white text-green-600 hover:bg-gray-100">
              Get Started Free →
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            © 2024 CropCalendar. Plant the right crop at the right time, every time.
          </p>
        </div>
      </footer>
    </div>
  );
}
