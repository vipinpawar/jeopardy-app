import React from "react";

interface FormData {
  category: string;
  points: number;
  question: string;
  options: string[];
  correctAnswer: string;
}

interface EditQuestionModalProps {
  isEditing: boolean;
  formData: FormData;
  handleChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, index?: number) => void;
  handleSaveEdit: () => void;
  clearForm: () => void;
  saving: boolean;
}

const categories: string[] = ["SCIENCE", "HISTORY", "SPORTS"];

const EditQuestionModal: React.FC<EditQuestionModalProps> = ({
  isEditing,
  formData,
  handleChange,
  handleSaveEdit,
  clearForm,
  saving,
}) => {
  return (
    isEditing && (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-4xl relative">
          <h2 className="text-2xl font-semibold mb-6 text-center">Edit Question</h2>
          <button
            onClick={clearForm}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-3xl cursor-pointer"
            aria-label="Close"
          >
            ×
          </button>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSaveEdit();
            }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div className="flex flex-col">
              <label className="font-medium mb-1">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="border rounded px-3 py-2"
                required
              >
                <option value="">Select Category</option>
                {categories.map((cat, idx) => (
                  <option key={idx} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col">
              <label className="font-medium mb-1">Points</label>
              <input
                type="number"
                name="points"
                value={formData.points}
                onChange={handleChange}
                className="border rounded px-3 py-2"
                required
              />
            </div>
            <div className="flex flex-col md:col-span-2">
              <label className="font-medium mb-1">Question</label>
              <textarea
                name="question"
                value={formData.question}
                onChange={handleChange}
                className="border rounded px-3 py-2"
                rows={3}
                required
              />
            </div>
            {formData.options.map((option, index) => (
              <div className="flex flex-col" key={index}>
                <label className="font-medium mb-1">Option {index + 1}</label>
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleChange(e, index)}
                  className="border rounded px-3 py-2"
                  required
                />
              </div>
            ))}
            <div className="flex flex-col md:col-span-2">
              <label className="font-medium mb-1">Correct Answer</label>
              <input
                type="text"
                name="correctAnswer"
                value={formData.correctAnswer}
                onChange={handleChange}
                className="border rounded px-3 py-2"
                required
              />
            </div>
            <div className="flex gap-4 md:col-span-2 justify-end mt-4">
              <button
                type="button"
                onClick={clearForm}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className={`flex items-center gap-2 bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 cursor-pointer${saving ? " opacity-50 cursor-not-allowed" : ""}`}
              >
                {saving && (
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4l5-5-5-5v4a12 12 0 00-12 12h4z"
                    ></path>
                  </svg>
                )}
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default EditQuestionModal;
