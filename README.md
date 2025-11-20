ClinIQ – AI-Powered Medical Triage & Facility Booking Platform

ClinIQ is a web-based medical triage and facility appointment system designed to help users quickly understand their symptoms using AI, find nearby healthcare facilities, and book appointments seamlessly. Healthcare facilities can also register, list their services, and manage appointments from an admin dashboard.

This project supports SDG 3: Universal Health Coverage, by improving access to reliable symptom assessment and quality health services.

🚀 Key Features

🔍AI Symptom Triage – Users can input symptoms and receive AI-generated triage suggestions

📍Find Nearby Facilities – Integrated with Google Maps to show nearby hospitals/clinics

📅Book Appointments – Users can schedule medical visits directly from the platform

🏥Facility Management – Facilities can list services and accept appointments

🔐Auth & Role Management – Secure login/signup using Clerk authentication

📊User Dashboard – Shows previous triage results & appointment history

📊Admin Dashboard – Facility owners can manage bookings, services & schedules

📂Full CRUD Support – Facilities, appointments, and triage records

🌐 Live Demo

(Coming soon…)
https://cliniq-demo.vercel.app (placeholder)

🖼️ Screenshots

(To be added soon…)

🛠️ Tech Stack
Frontend

React + Vite

HTML, CSS, TailwindCSS

Axios

Redux Toolkit

Clerk Authentication

Backend

Node.js

Express.js

MongoDB + Mongoose

Other Tools & Services

Google Maps API

Git & GitHub

Vercel (Frontend deployment)

Render / Railway (Backend deployment)

📁 Folder Structure

/frontend
   /src
      /components
      /pages
      /redux
      /api
      /utils

/backend
   /routes
   /controllers
   /models
   /middleware
   /config

⚙️ Installation & Setup Guide
1. Clone the Repository
git clone https://github.com/yourusername/cliniq.git
cd cliniq

🔧 Frontend Setup
cd frontend
npm install

Create a .env file:
VITE_API_URL=
VITE_CLERK_PUBLISHABLE_KEY=
VITE_GOOGLE_MAPS_API_KEY=

Run the frontend:
npm run dev

🖥️ Backend Setup
cd backend
npm install

Create a .env file:
MONGO_URI=
JWT_SECRET=
CLERK_SECRET_KEY=

Start the backend:
npm run dev

📡 API Documentation

(Coming soon…)
Suggested structure:

Auth routes

Appointment routes

Facility routes

Triage routes

📌 Future Improvements

Full AI medical chatbot

Real-time notifications

Facility ratings & reviews

Mobile app version

👨‍💻 Author

Collins Karani
GitHub | LinkedIn | Email (Add links)