import React, { useState } from "react";
import AdminDepartments from "./content/AdminDepartments";
import AdminPages from "./content/AdminPages";
import AdminTopics from "./content/AdminTopics";
import AdminPosts from "./content/AdminPosts";

export default function ContentVerwaltung() {
  const [activeTab, setActiveTab] = useState("departments");

  return (
    <div className="container mt-4">
      <h2>Content Verwaltung</h2>

      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "departments" ? "active" : ""}`}
            onClick={() => setActiveTab("departments")}
            type="button"
          >
            Abteilungen
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "pages" ? "active" : ""}`}
            onClick={() => setActiveTab("pages")}
            type="button"
          >
            Seiten
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "topics" ? "active" : ""}`}
            onClick={() => setActiveTab("topics")}
            type="button"
          >
            Themen
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "posts" ? "active" : ""}`}
            onClick={() => setActiveTab("posts")}
            type="button"
          >
            Beiträge
          </button>
        </li>
      </ul>

      <div>
        {activeTab === "departments" && <AdminDepartments />}
        {activeTab === "pages" && <AdminPages />}
        {activeTab === "topics" && <AdminTopics />}
        {activeTab === "posts" && <AdminPosts />}
      </div>
    </div>
  );
}
