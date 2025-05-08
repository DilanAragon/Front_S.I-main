// StatsCard.jsx
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faGraduationCap,
  faBriefcase,
  faChartLine,
  faMapMarkerAlt,
  faGlobe,
  faFileAlt,
  faCogs,
  faUserGraduate,
  faUserTie,
  faUser,
  faChalkboardTeacher,
  faBalanceScale,
} from "@fortawesome/free-solid-svg-icons";

const iconMap = {
  users: faUsers,
  "graduation-cap": faGraduationCap,
  briefcase: faBriefcase,
  "chart-line": faChartLine,
  "map-marker-alt": faMapMarkerAlt,
  globe: faGlobe,
  "file-alt": faFileAlt,
  cogs: faCogs,
  "user-graduate": faUserGraduate,
  "user-tie": faUserTie,
  user: faUser,
  "chalkboard-teacher": faChalkboardTeacher,
  "balance-scale": faBalanceScale,
};

const StatsCard = ({ title, value, icon }) => {
  const iconElement = iconMap[icon] || faUsers; // Default to users if icon not found

  return (
    <div className="stat-card">
      <div className="stat-card-icon">
        <FontAwesomeIcon icon={iconElement} />
      </div>
      <div className="stat-card-content">
        <div className="stat-card-title">{title}</div>
        <div className="stat-card-value">{value}</div>
      </div>
    </div>
  );
};

export default StatsCard;
