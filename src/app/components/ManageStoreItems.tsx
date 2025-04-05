import React from "react";
import { Loader2, Trash2, Edit, PlusCircle } from "lucide-react";

interface StoreItem {
  id: string;
  name: string;
  category: string;
  basePrice: number;
  imageUrl: string;
}

interface ManageStoreItemsProps {
  items: StoreItem[];
  loadingItems: boolean;
  deletingItemId: string | null;
  handleEditItem: (item: StoreItem) => void;
  handleDeleteItem: (id: string) => void;
  setIsEditingItem: (isEditing: boolean) => void;
}

const ManageStoreItems: React.FC<ManageStoreItemsProps> = ({
  items,
  loadingItems,
  deletingItemId,
  handleEditItem,
  handleDeleteItem,
  setIsEditingItem,
}) => {
  return (
    <div className="bg-white p-6 rounded shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-center">Store Products</h2>
      <button
        onClick={() => setIsEditingItem(true)}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mb-4 flex items-center gap-2 cursor-pointer"
      >
        <PlusCircle size={16} />
        Add New Product
      </button>
      {loadingItems ? (
        <Loader2 className="animate-spin w-6 h-6 text-blue-500 mx-auto" />
      ) : items.length === 0 ? (
        <p className="text-center text-gray-500">No products found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table-auto w-full text-left border-collapse">
            <thead>
              <tr className="bg-blue-200">
                <th className="px-4 py-2 border">Name</th>
                <th className="px-4 py-2 border">Category</th>
                <th className="px-4 py-2 border">Base Price</th>
                <th className="px-4 py-2 border">Image URL</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="bg-gray-50 hover:bg-gray-100">
                  <td className="px-4 py-2 border">{item.name}</td>
                  <td className="px-4 py-2 border">{item.category}</td>
                  <td className="px-4 py-2 border">${item.basePrice}</td>
                  <td className="px-4 py-2 border">
                    <a
                      href={item.imageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      View
                    </a>
                  </td>
                  <td className="px-4 py-2 border flex gap-2">
                    <button
                      onClick={() => handleEditItem(item)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 flex items-center gap-2 cursor-pointer"
                    >
                      <Edit size={16} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      disabled={deletingItemId === item.id}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                    >
                      {deletingItemId === item.id ? (
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

export default ManageStoreItems;
