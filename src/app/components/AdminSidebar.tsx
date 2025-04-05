import React from "react";

interface AdminSidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ activeSection, setActiveSection }) => {
  const commonClassName =
    "w-full text-left py-2 px-3 rounded hover:bg-blue-600 hover:cursor-pointer";

  const navItems = [
    { id: "users", label: "Manage Users" },
    { id: "questions", label: "Manage Questions" },
    { id: "store-items", label: "Manage Store Products" },
    { id: "create-category", label: "Create Blog Category" },
    { id: "create-blog", label: "Create Blog Post" },
  ];

  return (
    <aside className="w-64 bg-blue-800 text-white flex flex-col">
      <div className="text-center py-4 text-2xl font-bold border-b border-blue-700">
        Admin Panel
      </div>
      <nav className="flex-1 px-4 py-6 space-y-4">
        {navItems.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setActiveSection(id)}
            className={`${commonClassName} ${activeSection === id ? "bg-blue-700" : ""}`}
          >
            {label}
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
