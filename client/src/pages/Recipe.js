import React, { useState, useEffect, useRef } from 'react';
import { useParams } from "react-router-dom";
import { resolve } from 'styled-jsx/css';

const Recipe = () => {
  const [selectedStep, setSelectedStep] = useState(1);
  const { id } = useParams();
  const [data, setData] = useState({});
  const comment = useRef();
  async function likeComment(liked, id, index) {
    try {
      const response = await fetch(`http://localhost:5000/api/comments/like/${id}`, {
        method: liked == 1 ? "DELETE" : "POST",
        headers: {
          'R-A-Token': localStorage.getItem('token')
        }
      });
      if (response.status != (liked == 1 ? 204 : 201)) return;
      setData((prev) => {
        const newComments = prev.comments.slice();
        newComments[index] = {
          ...newComments[index],
          AlreadyLiked: liked == 1 ? 0 : 1,
          Likes: liked == 1 ? newComments[index].Likes - 1 : newComments[index].Likes + 1
        }
        return { ...prev, comments: newComments };
      })
    } catch (error) {
      console.log(error);
    }
  }
  async function publishComment() {
    try {
      const response = await fetch(`http://localhost:5000/api/comments`, {
        method: "POST",
        headers: {
          'R-A-Token': localStorage.getItem('token'),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          comment: comment.current.value,
          recipeId: id
        })
      });
      if (response.status != 201) return;
      const json = await response.json();

      setData((prev) => {
        return { ...prev, comments: [...prev.comments, json.response[0]] };
      })
    } catch (error) {
      console.log(error);
    }
  }
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
      console.log(json.response);
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

  async function setLike(liked) {
    try {
      const response = await fetch(`http://localhost:5000/api/recipe/like/${id}`, {
        method: liked == true ? "DELETE" : "POST",
        headers: {
          'R-A-Token': localStorage.getItem('token')
        }
      });
      console.log(liked + ", " + response.status);
      if (response.status != (liked == true ? 204 : 201)) return;
      setData((prev) => {
        return { ...prev, AlreadyLiked: !liked, Likes: liked == true ? prev.Likes - 1 : prev.Likes + 1 };
      })
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    setComponents();
  }, []);

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
              {selectedStep === 1 && (
                <>
                  <img
                    className="w-full rounded-lg mb-4"
                    src={data.ImageUrl}
                    alt="Step 1"
                  />
                </>
              )}
              {selectedStep === 2 && (
                <>
                  <img
                    className="w-full rounded-lg mb-4"
                    src={data.ImageUrl}
                    alt="Step 2"
                  />
                </>
              )}
              {selectedStep === 3 && (
                <>
                  <img
                    className="w-full rounded-lg mb-4"
                    src={data.ImageUrl}
                    alt="Step 3"
                  />
                </>
              )}
            </div>
          </div>
          <h1>LIKES: {data.Likes}</h1>
          <button onClick={() => {
            setLike(data.AlreadyLiked);
          }}>{data.AlreadyLiked == true ? 'UNLIKE' : 'LIKE'}</button><br />
          <input ref={comment} type='text' /><button onClick={publishComment}>COMMENT</button>
          <ol>
            {data.comments.map((item, index) => {
              return <> <li>{item.Username}: {item.Content}, {item.CreatedAt}, Likes: {item.Likes}</li><button onClick={() => {
                likeComment(item.AlreadyLiked, item.CommentId, index);
              }}>{item.AlreadyLiked == 1 ? 'UNLIKE' : "LIKE"}</button></>
            })}
          </ol>
        </div>
      </div>
    );
};

export default Recipe;
