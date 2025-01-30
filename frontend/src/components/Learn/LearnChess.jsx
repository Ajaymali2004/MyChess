import React, { useState } from "react";
import lessons from "./lessons";
import LessonModal from "./LessonModal";

export default function LearnChess() {
  const lessonKeys = Object.keys(lessons);
  const [selectedLesson, setSelectedLesson] = useState(null); // Store the selected lesson
  const [isModalOpen, setIsModalOpen] = useState(false); // Track modal visibility

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
    <div className="p-6">
      <h1 className="text-4xl font-bold text-center text-white mb-8">Learn Chess Moves</h1>

      {/* Flexible Layout for Lessons */}
      <div className="flex flex-wrap justify-center gap-6">
        {lessonKeys.map((lesson) => (
          <div
            key={lesson}
            className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 border p-6 rounded-lg cursor-pointer hover:bg-slate-800 hover:scale-105 transform transition-all duration-200 ease-in-out text-center bg-slate-700"
            onClick={() => openModal(lesson)}
          >
            <h3 className="text-xl text-white font-semibold">
              {lesson
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (str) => str.toUpperCase())}
            </h3>
          </div>
        ))}
      </div>

      {/* Lesson Modal */}
      {isModalOpen && selectedLesson && (
        <LessonModal lessonKey={selectedLesson} closeModal={closeModal} nextLesson={nextLesson} />
      )}
    </div>
  );
}
