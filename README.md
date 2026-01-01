# 🌱 CropCalendar - Plant the Right Crop at the Right Time

CropCalendar is a comprehensive Next.js 14 application that helps farmers and gardeners know exactly when to plant each crop based on their location and frost dates. Get personalized planting schedules, companion planting advice, and harvest predictions.

## ✨ Features

### 🎯 Core Features

- **User Location Setup**: Collect and store user location data with last/first frost dates
- **Pre-loaded Crop Library**: 30+ crops with comprehensive data including:
  - Days to maturity
  - Frost tolerance
  - Planting depth and spacing
  - Indoor start and transplant timing
  - Direct sow windows
  - Companion plants and plants to avoid
  - Growing notes
- **Intelligent Planting Date Calculator**: Automatic calculation of:
  - Indoor start dates
  - Transplant dates
  - Direct sow windows
  - Estimated harvest dates
  - Planting window status (too-early, optimal, late, too-late)
- **Crop Detail Pages**: Full specifications with calculated planting dates
- **My Garden Plan**: Track crops with status updates (planned, planted, harvesting, harvested)
- **Visual Planting Calendar**: Monthly calendar view with all your crops
- **Companion Planting Guide**: Visual display of crop relationships
- **Dashboard**: Quick statistics and action items

### 🎨 UI/UX Features

- Mobile-first responsive design
- Color-coded badges for categories, status, and frost tolerance
- Search and filter functionality
- Sort options
- Touch-friendly interface
- Print-friendly garden plan
- Loading states
- Empty states

## 🚀 Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Date Handling**: date-fns

## 📋 Prerequisites

- Node.js 18+ and npm
- A Supabase account and project

## 🛠️ Installation

1. **Clone the repository**

```bash
git clone https://github.com/Gianetans/crop-calendar.git
cd crop-calendar
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Get these values from your Supabase project settings.

4. **Set up Supabase database**

   a. Create a new Supabase project at https://supabase.com
   
   b. Run the schema SQL in your Supabase SQL editor:
   
   ```bash
   # Copy the content from supabase/schema.sql and run it in your Supabase SQL editor
   ```
   
   c. Seed the database with crop data:
   
   ```bash
   # Copy the content from supabase/seed.sql and run it in your Supabase SQL editor
   ```

5. **Run the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🗄️ Database Schema

### Tables

- **user_profiles**: User location and frost date information
- **crops**: Pre-loaded crop data (30+ crops)
- **user_crops**: User's garden plan with crop tracking

### Row Level Security (RLS)

All tables have RLS enabled with appropriate policies:
- Users can only access their own profiles and garden data
- Crop library is readable by all authenticated users

## 📊 How Planting Dates are Calculated

The application uses your last frost date as the anchor point for all calculations:

1. **Indoor Start Date**: Last frost date - indoor_start_weeks
2. **Transplant Date**: Last frost date + transplant_weeks
3. **Direct Sow Earliest**: Last frost date - direct_sow_weeks_before_frost
4. **Direct Sow Latest**: Last frost date + direct_sow_weeks_after_frost
5. **Estimated Harvest**: Earliest plant date + days_to_maturity

### Planting Window Status

- **Too Early**: More than 4 weeks before optimal planting date
- **Optimal**: Within 4 weeks before to 1 week after planting date
- **Late**: 1-4 weeks past optimal planting date
- **Too Late**: More than 4 weeks past optimal planting date

## 📱 Pages Structure

- `/` - Landing page with features and call-to-action
- `/auth/login` - User login
- `/auth/signup` - User registration
- `/setup` - Location setup (first-time or settings update)
- `/dashboard` - Main dashboard with stats and actions
- `/crops` - Crop library with search and filters
- `/crops/[id]` - Individual crop detail page
- `/garden` - My garden plan (user's crops)
- `/calendar` - Visual planting timeline
- `/companion` - Companion planting guide

## 🎨 Component Structure

### UI Components (`components/ui/`)
- `Button.tsx` - Reusable button with variants
- `Input.tsx` - Form input with label and error handling
- `Card.tsx` - Container component
- `Badge.tsx` - Status/category badges

### Feature Components (`components/`)
- `CropCard.tsx` - Crop display card
- `LocationSetup.tsx` - Location setup form

## 🔧 Configuration Files

- `tsconfig.json` - TypeScript configuration
- `tailwind.config.ts` - Tailwind CSS configuration
- `next.config.mjs` - Next.js configuration
- `.eslintrc.json` - ESLint configuration

## 🚢 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy

### Environment Variables for Production

Make sure to set these in your Vercel dashboard:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 📝 Sample Crops Included

The seed data includes 30+ crops across categories:

**Vegetables**: Tomato, Lettuce, Carrot, Pepper, Cucumber, Spinach, Broccoli, Zucchini, Radish, Onion, Kale, Squash, Beets, Cabbage, Cauliflower, Brussels Sprouts, Arugula, Turnip, Swiss Chard, Eggplant, Corn, Pumpkin, Garlic

**Legumes**: Peas, Green Beans

**Herbs**: Basil, Cilantro, Parsley

**Fruits**: Strawberry, Melon

Each crop includes:
- Complete planting specifications
- Companion plants
- Plants to avoid
- Growing notes

## 🔐 Security

- Row Level Security (RLS) enabled on all tables
- User data isolated per account
- Secure authentication with Supabase Auth
- Environment variables for sensitive data

## 🎯 Future Enhancements

- Weather integration for more accurate frost date predictions
- Push notifications for planting reminders
- Garden layout planner with visual grid
- Harvest tracking and yield recording
- Photo upload for progress tracking
- Community features (share garden plans)
- Export garden plan to PDF
- Integration with seed vendors
- Multi-language support
- Dark mode

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Crop data sourced from agricultural extension services
- Built with Next.js, Supabase, and Tailwind CSS
- Icons from emoji

## 📧 Support

For support, please open an issue in the GitHub repository.

---

**Happy Growing! 🌱**
