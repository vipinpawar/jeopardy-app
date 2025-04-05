"use client";

import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminSidebar from "@/app/components/AdminSidebar";
import ManageUsers from "@/app/components/ManageUsers";
import ManageQuestions from "@/app/components/ManageQuestions";
import ManageStoreItems from "@/app/components/ManageStoreItems";
import EditQuestionModal from "@/app/components/EditQuestionModal";
import EditItemModal from "@/app/components/EditItemModal";
import CreateCategoryForm from "@/app/components/CreateCategoryForm";
import CreateBlogForm from "@/app/components/CreateBlogForm";

interface Question {
  id: string;
  category: string;
  points: number;
  question: string;
  options: string[];
  correctAnswer: string;
}

interface User {
  id: string;
  email: string;
  role: string;
  totalAmount?: number;
}

interface StoreItem {
  id: string;
  name: string;
  category: string;
  basePrice: number;
  imageUrl: string;
}

const AdminPage: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingItem, setIsEditingItem] = useState(false);
  const [activeSection, setActiveSection] = useState("users");

  const queryClient = useQueryClient();

  // Fetch Users
  const { data: users = [], isLoading: loadingUsers } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axios.get("/api/users");
      return res.data.sort((a: User, b: User) => (b.totalAmount || 0) - (a.totalAmount || 0));
    },
  });

  // Fetch Questions
  const { data: questions = [], isLoading: loadingQuestions } = useQuery<Question[]>({
    queryKey: ["questions"],
    queryFn: async () => {
      const res = await axios.get("/api/questions");
      return res.data;
    },
  });

  // Fetch Store Items
  const { data: items = [], isLoading: loadingItems } = useQuery<StoreItem[]>({
    queryKey: ["store-items"],
    queryFn: async () => {
      const res = await axios.get("/api/store/items/getItem");
      return res.data.items || [];
    },
  });

  // Mutations
  const deleteUser = useMutation({
    mutationFn: async (userId: string) => {
      await axios.delete(`/api/deleteuser/${userId}`);
    },
    onSuccess: () => {
      toast.success("User deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: () => {
      toast.error("Error deleting user");
    },
  });

  const deleteItem = useMutation({
    mutationFn: async (itemId: string) => {
      await axios.delete(`/api/store/items/deleteItem?id=${itemId}`);
    },
    onSuccess: () => {
      toast.success("Item deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["store-items"] });
    },
    onError: () => {
      toast.error("Error deleting item");
    },
  });

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

        {activeSection === "users" && (
          <ManageUsers 
            users={users} 
            loadingUsers={loadingUsers} 
            deletingUserId={deleteUser.variables || null} 
            handleDeleteUser={(id) => deleteUser.mutate(id)} 
          />
        )}

        {activeSection === "questions" && (
          <ManageQuestions 
            questions={questions} 
            loadingQuestions={loadingQuestions} 
            handleEditQuestion={(question) => setIsEditing(true)} 
          />
        )}

        {activeSection === "store-items" && (
          <ManageStoreItems 
            items={items} 
            loadingItems={loadingItems} 
            handleDeleteItem={(id) => deleteItem.mutate(id)} 
            deletingItemId={deleteItem.variables || null} 
            handleEditItem={(item) => setIsEditingItem(true)} 
            setIsEditingItem={setIsEditingItem} 
          />
        )}

        {activeSection === "create-category" && <CreateCategoryForm />}
        {activeSection === "create-blog" && <CreateBlogForm />}
      </main>

      <EditQuestionModal 
        isEditing={isEditing} 
        formData={{
          category: "",
          points: 0,
          question: "",
          options: ["", "", "", ""],
          correctAnswer: ""
        }} 
        handleChange={() => {}} 
        handleSaveEdit={() => {}} 
        clearForm={() => {}} 
        saving={false} 
      />
      <EditItemModal 
        isEditingItem={isEditingItem} 
        itemFormData={{
          id: "",
          name: "",
          category: "",
          basePrice: 0,
          imageUrl: ""
        }}
        handleItemChange={() => {}}
        handleCreateItem={() => {}}
        handleUpdateItem={() => {}}
        clearItemForm={() => {}}
        saving={false}
        categoryList={[]}
        setCategoryList={() => {}}
      />
    </div>
  );
};

export default AdminPage;
