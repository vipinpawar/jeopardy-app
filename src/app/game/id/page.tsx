'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const categories = ['SCIENCE', 'HISTORY', 'SPORTS'];
const points = [100, 200, 300, 400];

interface Question {
  id: string;
  category: string;
  question: string;
  options: string[];
  correctAnswer: string;
  points: number;
}

const GamePage: React.FC = () => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [answeredQuestions, setAnsweredQuestions] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [answerFeedback, setAnswerFeedback] = useState<string>('');
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [questionResults, setQuestionResults] = useState<Record<string, 'correct' | 'wrong'>>({});

  // Fetch questions using React Query
  const { data: questions = [], isLoading, error } = useQuery<Question[]>({
    queryKey: ['questions'],
    queryFn: async () => {
      const res = await axios.get('/api/questions');
      return res.data;
    },
  });

  // Mutation for updating total amount
  const updateAmountMutation = useMutation({
    mutationFn: async (newTotalAmount: number) => {
      await axios.post('/api/update-amount', { totalAmount: newTotalAmount });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
    },
  });

  const handleTileClick = (category: string, points: number) => {
    const question = questions.find((q) => q.category === category && q.points === points);
    if (!question || answeredQuestions.includes(question.id)) return;
    setSelectedQuestion(question);
    setSelectedOption('');
    setAnswerFeedback('');
  };

  const handleOptionClick = async (option: string) => {
    if (!selectedQuestion) return;

    setSelectedOption(option);
    const isCorrect = option === selectedQuestion.correctAnswer;
    const newTotalAmount = isCorrect ? totalAmount + selectedQuestion.points : totalAmount;

    setAnswerFeedback(isCorrect ? 'Correct!' : 'Wrong!');
    setTotalAmount(newTotalAmount);
    setQuestionResults((prev) => ({ ...prev, [selectedQuestion.id]: isCorrect ? 'correct' : 'wrong' }));

    try {
      await updateAmountMutation.mutateAsync(newTotalAmount);
    } catch (err) {
      console.error('Failed to update amount:', err);
    }
  };

  const handleCloseModal = () => {
    if (selectedQuestion) {
      setAnsweredQuestions([...answeredQuestions, selectedQuestion.id]);
      setSelectedQuestion(null);
      setSelectedOption('');
      setAnswerFeedback('');
    }
  };

  const handleResetGame = () => {
    setAnsweredQuestions([]);
    setQuestionResults({});
    setSelectedQuestion(null);
    setSelectedOption('');
    setAnswerFeedback('');
    setTotalAmount(0);
  };

  if (isLoading) return <div>Loading questions...</div>;
  if (error) return <div>Error loading questions</div>;

  return (
    <div className="min-h-screen bg-blue-300 text-black flex flex-col items-center py-8 px-4">
      <h1 className="text-4xl mb-8 text-center">Jeopardy Game</h1>
      <div className="mb-6 text-2xl font-semibold text-green-800">Amount Won: ${totalAmount}</div>
      <button onClick={handleResetGame} className="bg-red-600 text-white px-4 py-2 mb-4 rounded cursor-pointer">Reset Game</button>
      <div className="grid grid-cols-3 gap-4 w-full max-w-4xl">
        {categories.map((category, index) => (
          <div key={index} className="text-center font-bold text-lg bg-yellow-500 p-4 rounded">
            {category}
          </div>
        ))}
        {points.map((pointValue, rowIndex) =>
          categories.map((category, colIndex) => {
            const question = questions.find((q) => q.category === category && q.points === pointValue);
            const isAnswered = question && answeredQuestions.includes(question.id);
            const result = question ? questionResults[question.id] : undefined;

            let bgColor = !question ? 'bg-gray-300' : result === 'correct' ? 'bg-green-500' : result === 'wrong' ? 'bg-red-500' : isAnswered ? 'bg-gray-500' : 'bg-blue-500 hover:bg-blue-700';

            return (
              <button key={`${colIndex}-${rowIndex}`} onClick={() => handleTileClick(category, pointValue)} disabled={isAnswered || !question} className={`h-24 flex justify-center items-center text-2xl font-bold rounded ${bgColor}`}>
                {question ? (isAnswered ? '' : `$${pointValue}`) : ''}
              </button>
            );
          })
        )}
      </div>
      {selectedQuestion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center px-4">
          <div className="bg-white text-black p-8 rounded max-w-md w-full shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-center">{selectedQuestion.category}</h2>
            <p className="mb-4 text-center">{selectedQuestion.question}</p>
            <div className="flex flex-col gap-2 mb-4">
              {selectedQuestion.options.map((option, index) => (
                <button key={index} onClick={() => handleOptionClick(option)} disabled={!!selectedOption} className={`border px-4 py-2 rounded hover:bg-gray-200 ${selectedOption === option ? (option === selectedQuestion.correctAnswer ? 'bg-green-400' : 'bg-red-400') : ''}`}>{option}</button>
              ))}
            </div>
            {answerFeedback && <p className={`font-semibold mb-4 text-center ${answerFeedback === 'Correct!' ? 'text-green-600' : 'text-red-600'}`}>{answerFeedback}</p>}
            <button onClick={handleCloseModal} className="bg-blue-600 text-white px-4 py-2 rounded w-full">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GamePage;