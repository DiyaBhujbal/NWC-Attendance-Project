# NWC-Attendance-Project

--INITIALISE YOUR PROJECT BY FOLLOWING THE STEPS GIVEN BELOW--

mkdir project_name
cd project_name
mkdir backend
cd backend
npm init -y
npm i bcryptjs cors crypto crypto-js dotenv express express-mongo-sanitize express-rate-limit express-session handlebars jsonwebtoken jwt-decode mongo-sanitize mongoose nodemailer nodemon validator  


cd ..
mkdir frontend
cd frontend
npm create vite@latest

cd frontend
npm i @fortawesome/fontawesome-free autoprefixer axios dotenv express file-server jsonwebtoken jwr-decode postcss react react-dom react-router-dom react-spreadsheet react-time-picker tailwindcss 


---Dependencies required for Frontend---

npm i @fortawesome/fontawesome-free autoprefixer axios dotenv express file-server jsonwebtoken jwr-decode postcss react react-dom react-router-dom react-spreadsheet react-time-picker tailwindcss 


---Dependencies required for Backend---

npm i bcryptjs cors crypto crypto-js dotenv express express-mongo-sanitize express-rate-limit express-session handlebars jsonwebtoken jwt-decode mongo-sanitize mongoose nodemailer nodemon validator 


## In your backend create a .env file with the following content:

PORT=YOUR_PORT_NUMBER
MONGO_URI= YOUR_MONGODB_URL
JWT_SECRET_KEY= YOUR_SECRET_KEY
SALT= 10


EMAIL_USER=YOUR_EMAIL_ID
EMAIL_PASS=YOUR_MAIL_PASSWORD
HOST=smtp.gmail.com
SERVICE=gmail
EMAIL_PORT=465
SECURE=true
