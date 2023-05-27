import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";

const Recipe = () => {
  const [selectedStep, setSelectedStep] = useState(1);
  const { id } = useParams();
  const [data, setData] = useState({});
  async function setComponents() {
    try {
      const response = await fetch(`http://localhost:5000/api/recipe/get/${id}`, {
        method: "GET",
        headers: {
          'R-A-Token': localStorage.getItem('token')
        }
      });
      if (response.status !== 200) return;
      const json = await response.json();
      const obj = {};
      for (const prop in json.response[0][0])
        obj[prop] = json.response[0][0][prop];
      obj["comments"] = json.response[1].slice();
      obj["ingredients"] = json.response[2].slice();
      obj['steps'] = json.response[3].slice();
      console.log(obj)
      setData(obj);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    setComponents();
  }, []);
  console.log(data.ImageUrl)
  if (Object.keys(data).length != 0)
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gray-100 pt-[50rem]">
        <div className="w-full max-w-6xl p-8 bg-white rounded-lg shadow-md">
          <h1 className="text-4xl font-bold mb-4 text-center text-indigo-600">
            {data.Title}, by {data.Username}
          </h1>
          <img
            className="w-full rounded-lg mb-4"
            src={data.ImageUrl}
            alt="Recipe"
          />
          <h2 className="text-2xl font-bold mb-2 text-center text-indigo-600">
            Ingredients
          </h2>
          <ul className="list-disc list-inside mb-4">
            {data.ingredients.map((item) => {
              return <li>{`${item.Name}(${item.Amount} ${item.UnitName})`}</li>
            })}
          </ul>
          <h2 className="text-2xl font-bold mb-2 text-center text-indigo-600 pb-6">
            Instructions
          </h2>
          <div className="flex flex-col md:flex-row items-center justify-between mb-4">
            <ol className="list-none md:w-1/2 md:mr-8 flex flex-col items-center">
              {data.steps.map((item, index) => {
                return <button
                  className={`p-2 rounded-lg mb-2 ${selectedStep === 1 ? 'bg-indigo-600 text-white' : 'bg-indigo-100'
                    }`}
                  onClick={() => setSelectedStep(index)}
                >
                  {item.StepDescription}
                </button>
              })}
            </ol>
            <div className="md:w-1/2 flex flex-col items-center">
              {/* Replace the content of these divs with images or videos for each instruction step */}
              {selectedStep === 1 && (
                <>
                  <img
                    className="w-full rounded-lg mb-4"
                    src={data.ImageUrl}
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
                    src={data.ImageUrl}
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
                    src={data.ImageUrl}
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
