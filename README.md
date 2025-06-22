# Attendance Management System

This is a comprehensive Attendance Management System designed to streamline attendance tracking for educational institutions. It provides features for teachers to mark attendance, students to view their attendance and apply for leaves, and an administrative panel for overall management. The system also includes robust notification features to keep students, parents, and teachers informed.

## Features

**For Teachers/Admins:**
*   **Attendance Marking:** Teachers can easily mark attendance for students, filtered by class, subject, date, and time slot.
*   **Leave Approval:** Teachers/Admins can approve or reject student leave requests.
*   **Timetable Management:** Functionality for managing class timetables.
*   **User Management:** (Implied by roles) Ability to manage student, teacher, and admin accounts.

**For Students:**
*   **Attendance Viewing:** Students can view their daily attendance details and overall attendance percentage.
*   **Leave Application:** Students can apply for leaves, which can then be approved or rejected by teachers/admins.
*   **Participation Tracking:** Students can view their participation records.

**Notifications:**
*   **Push Notifications:** Mobile push notifications for low attendance (below 75%), leave approval/rejection, and participation updates.
*   **Email Notifications:** Automatic email notifications to students and parents when attendance falls below 75% or for leave status updates.
*  **Leave
## Technologies Used

**Frontend:**
*   **React:** A JavaScript library for building user interfaces.
*   **Material-UI:** A popular React UI framework for fast and easy web development.
*   **Vite:** A fast build tool for modern web projects.
*   **React Router:** For navigation and routing within the application.
*   **date-fns & @mui/x-date-pickers:** For date handling and date picker UI components.
*   **react-toastify:** For displaying toast notifications.
*   **OneSignal Web SDK:** For implementing push notifications.

**Backend:**
*   **Node.js:** A JavaScript runtime built on Chrome's V8 JavaScript engine.
*   **Express.js:** A fast, unopinionated, minimalist web framework for Node.js.
*   **MongoDB:** A NoSQL database for storing application data.
*   **Mongoose:** An ODM (Object Data Modeling) library for MongoDB and Node.js.
*   **jsonwebtoken:** For implementing JWT-based authentication.
*   **bcryptjs:** For password hashing.
*   **nodemailer:** For sending email notifications.
*   **axios:** For making HTTP requests (used in some backend services).
*   **OneSignal Node.js SDK:** For sending push notifications.

## Setup Instructions

Follow these steps to get the Attendance Management System up and running on your local machine.

### Prerequisites

*   Node.js (LTS version recommended)
*   MongoDB (local instance or a cloud-hosted service like MongoDB Atlas)
*   OneSignal Account (for push notifications)
*   Email Service Provider (e.g., Gmail, SendGrid, for email notifications)

### 1. Clone the Repository

If you haven't already, clone the project repository:

```bash
git clone <repository_url>
cd attendence # Or the name of your project folder
```

### 2. Backend Setup

Navigate to the `backend` directory:

```bash
cd backend
```

**Install Dependencies:**

```bash
npm install
```

**Create Environment Variables:**

Create a `.env` file in the `backend` directory with the following variables. Replace the placeholder values with your actual credentials.

```
MONGO_URI=<Your MongoDB Connection String>
JWT_SECRET=<A strong, random secret key for JWT>
ONE_SIGNAL_APP_ID=<Your OneSignal App ID>
ONE_SIGNAL_API_KEY=<Your OneSignal REST API Key>
EMAIL_SERVICE_HOST=<Your Email Service Host (e.g., smtp.gmail.com)>
EMAIL_SERVICE_PORT=<Your Email Service Port (e.g., 587 for TLS, 465 for SSL)>
EMAIL_AUTH_USER=<Your Email Address for sending notifications>
EMAIL_AUTH_PASS=<Your Email Password or App Password>
```

**Run the Backend Server:**

```bash
npm start
```
The backend server will run on `http://localhost:5000`.

### 3. Frontend Setup

Open a new terminal and navigate to the `frontend` directory:

```bash
cd frontend
```

**Install Dependencies:**

```bash
npm install
```

**Create Environment Variables:**

Create a `.env` file in the `frontend` directory (if not already present from previous steps) with the following variable:

```
VITE_ONESIGNAL_APP_ID=<Your OneSignal App ID>
```

**Run the Frontend Development Server:**

The frontend development server is configured to run on `http://localhost:5000` to align with OneSignal's requirements.

```bash
npm run dev
```

The frontend application will open in your browser at `http://localhost:5000`.

### 4. Database Seeding (Optional)

If your application has initial data (e.g., classes, subjects, users) that needs to be populated in the MongoDB database, you might have a seeding script. Refer to your project's specific documentation for database seeding. (E.g., for `timetable.json` or initial user creation.)

## Usage

1.  **Register/Login:** Access the application through `http://localhost:5000` and register a new user or log in with existing credentials. Ensure you register users with appropriate roles (student, teacher, admin).
2.  **Teacher Flow:**
    *   Navigate to the "Attendance" page.
    *   Select the Class, Subject, Date, and Time Slot.
    *   Mark students as Present or Absent.
    *   Submit attendance.
3.  **Student Flow:**
    *   Login to view the student dashboard.
    *   Check daily timetable and attendance summary.
    *   Navigate to the "Leave" page to apply for new leaves or view leave history.
4.  **Notifications:** Ensure your browser has push notifications enabled for `localhost:5000` to receive real-time updates. Check your registered email for low attendance or leave status notifications.

## Planned & Advanced Features

**For Teachers/Admins:**
* Teachers can propose timetable changes (e.g., rescheduling classes, exam dates, or event notices).
* When a timetable change is made, teachers can send a notification to all affected students (and optionally parents).
* All notifications sent by teachers (including timetable changes, exam updates, event notices, etc.) are saved in a notification history and can be viewed later by both teachers and students.
* Admins can review and approve/reject timetable change requests if required.

**For Students:**
* Students receive real-time notifications about timetable changes, exam schedules, and college events.
* Students can view a history of all notifications (including past timetable changes and event notices) in their dashboard.

**For Events/Exams:**
* Teachers and admins can create and broadcast event or exam notifications to all students or specific classes/batches.
* Event and exam notifications are also saved in the notification history for future reference.

## Completed Core Features

- Time table management
- Attendance updation
- Fetch data/report
- Students leave record with remarks
- Students participation record
- Notification to students and parents in case of attendance shortfall

## Project Structure (High-Level)

*   `backend/`: Contains all server-side code (Node.js, Express, MongoDB models, controllers, routes, middleware, utilities).
*   `frontend/`: Contains all client-side code (React components, pages, public assets).
*   `public/`: (Frontend) Contains `index.html` and other static assets.

## Contributing

If you wish to contribute to this project, please follow standard Gitflow practices:
1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/your-feature-name`).
3.  Make your changes.
4.  Commit your changes (`git commit -m 'Add new feature'`).
5.  Push to the branch (`git push origin feature/your-feature-name`).
6.  Create a Pull Request.

---
**Note:** This README provides a general overview. For more detailed information on specific functionalities or troubleshooting, refer to individual file comments and console logs within the application.