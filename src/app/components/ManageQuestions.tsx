import React from "react";
import { Loader2, Edit } from "lucide-react";

interface Question {
  id: string;
  category: string;
  points: number;
  question: string;
  options: string[];
  correctAnswer: string;
}

interface ManageQuestionsProps {
  questions: Question[];
  loadingQuestions: boolean;
  handleEditQuestion: (question: Question) => void;
}

const ManageQuestions: React.FC<ManageQuestionsProps> = ({
  questions,
  loadingQuestions,
  handleEditQuestion,
}) => {
  return (
    <div className="bg-white p-6 rounded shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-center">MCQ Questions</h2>
      {loadingQuestions ? (
        <Loader2 className="animate-spin w-6 h-6 text-blue-500 mx-auto" />
      ) : questions.length === 0 ? (
        <p className="text-center text-gray-500">No questions found</p>
      ) : (
        questions.map((q) => (
          <div key={q.id} className="bg-gray-100 p-4 rounded shadow mb-4">
            <p className="font-bold">
              {q.category} - {q.points} pts
            </p>
            <p className="mt-1">{q.question}</p>
            <ul className="list-disc ml-5 mt-1 text-sm text-gray-600">
              {q.options.map((opt, idx) => (
                <li key={idx}>{opt}</li>
              ))}
            </ul>
            <p className="text-green-600 mt-1">Correct Answer: {q.correctAnswer}</p>
            <button
              onClick={() => handleEditQuestion(q)}
              className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 mt-3 flex items-center gap-2 cursor-pointer"
            >
              <Edit size={16} />
              Edit
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default ManageQuestions;