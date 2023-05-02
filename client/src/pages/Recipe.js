import React, { useState } from 'react';
import Navbar from '../components/Navbar';

const Recipe = () => {
  const [selectedStep, setSelectedStep] = useState(1);

  return (
    <div className="flex flex-col items-center justify-center h-full bg-gray-100 pt-[50rem]">
        <Navbar />
      <div className="w-full max-w-6xl p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-4xl font-bold mb-4 text-center text-indigo-600">
          Recipe Title
        </h1>
        <img
          className="w-full rounded-lg mb-4"
          src="https://picsum.photos/800/400"
          alt="Recipe"
        />
        <h2 className="text-2xl font-bold mb-2 text-center text-indigo-600">
          Ingredients
        </h2>
        <ul className="list-disc list-inside mb-4">
          {/* Replace the content of this list with the ingredients for your recipe */}
          <li>Ingredient 1</li>
          <li>Ingredient 2</li>
          <li>Ingredient 3</li>
          {/* Add more list items for each ingredient */}
        </ul>
        <h2 className="text-2xl font-bold mb-2 text-center text-indigo-600 pb-6">
          Instructions
        </h2>
        <div className="flex flex-col md:flex-row items-center justify-between mb-4">
          <ol className="list-none md:w-1/2 md:mr-8 flex flex-col items-center">
            {/* Replace the content of this list with the instructions for your recipe */}
            <button
              className={`p-2 rounded-lg mb-2 ${
                selectedStep === 1 ? 'bg-indigo-600 text-white' : 'bg-indigo-100'
              }`}
              onClick={() => setSelectedStep(1)}
            >
              Step 1
            </button>
            <button
              className={`p-2 rounded-lg mb-2 ${
                selectedStep === 2 ? 'bg-indigo-600 text-white' : 'bg-indigo-100'
              }`}
              onClick={() => setSelectedStep(2)}
            >
              Step 2
            </button>
            <button
              className={`p-2 rounded-lg mb-2 ${
                selectedStep === 3 ? 'bg-indigo-600 text-white' : 'bg-indigo-100'
              }`}
              onClick={() => setSelectedStep(3)}
            >
              Step 3
            </button>
            {/* Add more buttons for each instruction */}
          </ol>
          <div className="md:w-1/2 flex flex-col items-center">
            {/* Replace the content of these divs with images or videos for each instruction step */}
            {selectedStep === 1 && (
              <>
                <img
                  className="w-full rounded-lg mb-4"
                  src="https://picsum.photos/400/200"
                  alt="Step 1"
                />
                {/* Example video */}
                <iframe
                  width="400"
                  height="315"
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </>
            )}
            {selectedStep === 2 && (
              <>
                <img
                  className="w-full rounded-lg mb-4"
                  src="https://picsum.photos/401/200"
                  alt="Step 2"
                />
                {/* Example video */}
                <iframe
                  width="400"
                  height="315"
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                  title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>
                </>
            )}
            {selectedStep === 3 && (
                <>
                    <img
                        className="w-full rounded-lg mb-4"
                        src="https://picsum.photos/402/200"
                        alt="Step 3"
                    />
                    {/* Example video */}
                    <iframe
                        width="400"
                        height="315"
                        src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </>
            )}
            </div>
        </div>
        </div>
    </div>
    );
};

export default Recipe;
