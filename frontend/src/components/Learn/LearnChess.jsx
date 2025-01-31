import React, { useState } from "react";
import lessons from "./lessons";
import LessonModal from "./LessonModal";

export default function LearnChess() {
  const lessonKeys = Object.keys(lessons);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (lesson) => {
    setSelectedLesson(lesson);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedLesson(null);
    setIsModalOpen(false);
  };

  const nextLesson = () => {
    const currentIndex = lessonKeys.indexOf(selectedLesson);
    const nextIndex = currentIndex + 1;

    if (nextIndex < lessonKeys.length) {
      setSelectedLesson(lessonKeys[nextIndex]);
    } else {
      closeModal();
    }
  };

  return (
    <div className="p-6 ">
      <h1 className="text-4xl font-bold text-center text-white mb-8">
        Learn Chess Moves
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mx-2">
        {lessonKeys.map((lesson) => (
          <div
            key={lesson}
            className="border rounded-lg cursor-pointer hover:scale-105 transform transition-all duration-200 ease-in-out bg-slate-800 hover:bg-slate-700 shadow-lg overflow-hidden p-2"
            onClick={() => openModal(lesson)}
          >
            <h3 className="text-lg text-white font-semibold mb-1 text-center sm:text-sm md:text-base lg:text-lg xl:text-xl">
              {lesson
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (str) => str.toUpperCase())}
            </h3>
            <img
              src={lessons[lesson].image}
              alt={lesson}
              className="w-full object-contain"
            />
            <p className="text-white text-xs text-center sm:text-[10px] md:text-xs lg:text-sm xl:text-base">
              {lessons[lesson].text}
            </p>
          </div>
        ))}
      </div>

      {isModalOpen && selectedLesson && (
        <LessonModal
          lessonKey={selectedLesson}
          closeModal={closeModal}
          nextLesson={nextLesson}
        />
      )}
    </div>
  );
}
