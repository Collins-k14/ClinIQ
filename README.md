<img width="700" height="350" alt="Banner" src="https://github.com/user-attachments/assets/d4334151-eedc-4201-8186-6c850bf9cedc" />


# 🏥🩺ClinIQ – AI-Powered Medical Triage & Facility Booking Platform 
## 
ClinIQ is a web-based medical triage and facility appointment system designed to help users quickly understand their symptoms using AI, find nearby healthcare facilities, and book appointments seamlessly. Healthcare facilities can also register, list their services, and manage appointments from an admin dashboard.

This project supports SDG 3: Universal Health Coverage, by improving access to reliable symptom assessment and quality health services.

##
# 🚀 Key Features

🔍AI Symptom Triage – Users can input symptoms and receive AI-generated triage suggestions

📍Find Nearby Facilities – Integrated with Google Maps to show nearby hospitals/clinics

📅Book Appointments – Users can schedule medical visits directly from the platform

🏥Facility Management – Facilities can list services and accept appointments

🔐Auth & Role Management – Secure login/signup using Clerk authentication

📊User Dashboard – Shows previous triage results & appointment history

📊Admin Dashboard – Facility owners can manage bookings, services & schedules

📂Full CRUD Support – Facilities, appointments, and triage records

## 

🌐 Live Demo
https://cliniq-zeta.vercel.app/

🖼️ Screenshots

AI Chat
![AI chat](https://github.com/user-attachments/assets/ae557470-ee78-4c33-a4d5-dc3216e514a3)

Find facilities page
![find facility](https://github.com/user-attachments/assets/0a4e5667-6936-4de4-9684-f034bdb3917f)

Appointment booking page
![booking](https://github.com/user-attachments/assets/f18fc1e8-f20f-41cf-8338-1ce21a831c9b)

Booking success page
![booking sucess](https://github.com/user-attachments/assets/31be59cb-99a3-463d-a8d8-040a0e537ca8)

Dashboard
![Dashboard](https://github.com/user-attachments/assets/da4198f4-ab5b-4122-8b9f-880fbddd3f8e)

##
🛠️ Tech Stack
Frontend

React + Vite

HTML, CSS, TailwindCSS

Axios

Clerk Authentication

Backend

Node.js

Express.js

MongoDB + Mongoose

Other Tools & Services

Google Maps API

Git & GitHub

Vercel (Frontend deployment)

Render  (Backend deployment)

## 

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

Full AI medical chatbot (integrated with an api for a wider triage results)

Real-time notifications

Facility ratings & reviews

Mobile app version

👨‍💻 Author

Collins Karani
GitHub | LinkedIn https://www.linkedin.com/in/collins-karani/ | Email collinskarani014@gmail.com
