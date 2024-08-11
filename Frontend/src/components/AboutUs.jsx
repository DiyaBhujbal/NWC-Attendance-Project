import React from 'react';
import './AboutUs.css';

const teamMembers = [
    {
        name: 'Diya Bhujbal',
        role: 'Student Developer',
        class:"MSC Computer Science Part 2",
        linkedin: 'https://www.linkedin.com/in/diya-bhujbal-542751264/',
    },
    {
        name: 'Ayusha Jadhav',
        role: 'Student Developer',
        class:"MSC Computer Science Part 2",
        linkedin: 'https://www.linkedin.com/in/ayusha-jadhav-0261852b5/',
    },
    {
        name: 'Rutuja Kirad',
        role: 'Student Developer',
        class:"MSC Computer Science Part 2",
        linkedin: 'https://www.linkedin.com/in/rutuja-kirad/',
    }
];

const ProfileCard = ({ member }) => (
    <div className="card">
        <h3 className="name">{member.name}</h3>
        <p className="role">{member.role}</p>
        <p className="role">{member.class}</p>
        <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="linkedin-link">
            LinkedIn Profile
        </a>
    </div>
);

const TeamProfiles = () => (
    <div className="profiles-container">
        {teamMembers.map((member, index) => (
            <ProfileCard key={index} member={member} />
        ))}
    </div>
);

const AboutUs = () => {
    return (
        <div className="about-us-background">
            <div className="background-overlay"></div>
            <div className="about-us-content">
                <h1 className="title">About The System</h1>
                <p className="text">Welcome to the Teacher Attendance Management System </p>
                
                <h2 className="subtitle">Project Overview</h2>
                <p className="text">
                    This system is designed to streamline attendance management and reporting for teachers.
                    It's a student-led initiative to enhance administrative efficiency within our academic community.
                </p>
                
                <h2 className="subtitle">Key Features</h2>
                <ul className="feature-list">
                    <li><span className="feature-icon">📊</span>Daily Attendance Reporting</li>
                    <li><span className="feature-icon">📅</span>Personal Timetable Management</li>
                    <li><span className="feature-icon">🔐</span>Secure Login System</li>
                    <li><span className="feature-icon">📈</span>Attendance Analytics</li>
                </ul>
                
                <h2 className="subtitle">Made By:- </h2>
                <TeamProfiles />
                
                <div className="guide-info">
                    <h3>Project Guide</h3>
                    <p className="guide-name">Dr. Reena Bharathi </p>
                    <p>We extend our sincere gratitude to our guide for her invaluable guidance and support throughout this project.</p>
                </div>
                
                
                <h2 className="subtitle">Our Goal</h2>
                <p className="text">
                    Our aim is to provide a user-friendly, efficient tool that simplifies attendance management for our teachers,
                    allowing them to focus more on education and less on administrative tasks.
                </p>
            </div>
        </div>
    );
};


export default AboutUs;