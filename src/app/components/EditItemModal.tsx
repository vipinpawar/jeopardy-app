import React, { useState } from "react";

interface ItemFormData {
  id?: string;
  name: string;
  category: string;
  basePrice: number;
  imageUrl: string;
}

interface EditItemModalProps {
  isEditingItem: boolean;
  itemFormData: ItemFormData;
  handleItemChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleCreateItem: () => void;
  handleUpdateItem: () => void;
  clearItemForm: () => void;
  saving: boolean;
  categoryList: string[];
  setCategoryList: React.Dispatch<React.SetStateAction<string[]>>;
}

const EditItemModal: React.FC<EditItemModalProps> = ({
  isEditingItem,
  itemFormData,
  handleItemChange,
  handleCreateItem,
  handleUpdateItem,
  clearItemForm,
  saving,
  categoryList,
  setCategoryList,
}) => {
  const [newCategory, setNewCategory] = useState<string>("");
  const [isAddingNewCategory, setIsAddingNewCategory] = useState<boolean>(false);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === "new") {
      setIsAddingNewCategory(true);
      setNewCategory("");
    } else {
      setIsAddingNewCategory(false);
      handleItemChange(e);
    }
  };

  const addNewCategory = () => {
    if (newCategory.trim() !== "" && !categoryList.includes(newCategory)) {
      setCategoryList([...categoryList, newCategory]);
      handleItemChange({ target: { name: "category", value: newCategory } } as React.ChangeEvent<HTMLInputElement>);
      setIsAddingNewCategory(false);
    }
  };

  return (
    isEditingItem && (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-4xl relative">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            {itemFormData.id ? "Edit Product" : "Create New Product"}
          </h2>
          <button
            onClick={clearItemForm}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-3xl cursor-pointer"
            aria-label="Close"
          >
            ×
          </button>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              itemFormData.id ? handleUpdateItem() : handleCreateItem();
            }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div className="flex flex-col">
              <label className="font-medium mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={itemFormData.name}
                onChange={handleItemChange}
                className="border rounded px-3 py-2"
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="font-medium mb-1">Category</label>
              <select
                name="category"
                value={itemFormData.category}
                onChange={handleCategoryChange}
                className="border rounded px-3 py-2"
                required
              >
                <option value="">Select Category</option>
                {categoryList.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
                <option value="new">+ Add New Category</option>
              </select>
            </div>
            {isAddingNewCategory && (
              <div className="flex flex-col">
                <label className="font-medium mb-1">New Category</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="border rounded px-3 py-2 flex-1"
                    placeholder="Enter new category"
                  />
                  <button
                    type="button"
                    onClick={addNewCategory}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              </div>
            )}
            <div className="flex flex-col">
              <label className="font-medium mb-1">Base Price</label>
              <input
                type="number"
                name="basePrice"
                value={itemFormData.basePrice}
                onChange={handleItemChange}
                className="border rounded px-3 py-2"
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="font-medium mb-1">Image URL</label>
              <input
                type="text"
                name="imageUrl"
                value={itemFormData.imageUrl}
                onChange={handleItemChange}
                className="border rounded px-3 py-2"
                required
              />
            </div>
            <div className="flex gap-4 md:col-span-2 justify-end mt-4">
              <button
                type="button"
                onClick={clearItemForm}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className={`flex items-center gap-2 bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 cursor-pointer ${saving ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {saving ? "Saving..." : itemFormData.id ? "Update Product" : "Create Product"}
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default EditItemModal;