import React from "react";
import { Loader2, Trash2 } from "lucide-react";

interface User {
  id: string;
  username?: string;
  email: string;
  role: string;
  totalAmount?: number;
}

interface ManageUsersProps {
  users: User[];
  loadingUsers: boolean;
  deletingUserId: string | null;
  handleDeleteUser: (id: string) => void;
}

const ManageUsers: React.FC<ManageUsersProps> = ({ users, loadingUsers, deletingUserId, handleDeleteUser }) => {
  return (
    <div className="bg-white p-6 rounded shadow-md flex flex-col items-center">
      <h2 className="text-2xl font-semibold mb-4 text-center">User Profiles</h2>
      {loadingUsers ? (
        <Loader2 className="animate-spin w-6 h-6 text-blue-500" />
      ) : users.length === 0 ? (
        <p className="text-center text-gray-500">No users found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table-auto w-full text-left border-collapse">
            <thead>
              <tr className="bg-blue-200">
                <th className="px-4 py-2 border">Name</th>
                <th className="px-4 py-2 border">Email</th>
                <th className="px-4 py-2 border">Role</th>
                <th className="px-4 py-2 border">Total Amount</th>
                <th className="px-4 py-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="bg-gray-50 hover:bg-gray-100">
                  <td className="px-4 py-2 border">{user.username || "N/A"}</td>
                  <td className="px-4 py-2 border">{user.email}</td>
                  <td className="px-4 py-2 border capitalize">{user.role}</td>
                  <td className="px-4 py-2 border">{user.totalAmount || 0}</td>
                  <td className="px-4 py-2 border">
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      disabled={deletingUserId === user.id}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                    >
                      {deletingUserId === user.id ? (
                        <Loader2 className="animate-spin w-4 h-4" />
                      ) : (
                        <Trash2 size={16} />
                      )}
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;