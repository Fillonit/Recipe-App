import React, { useState, useEffect, useRef } from 'react';
// import ChefCard from '../components/ChefCard';
import SingleRecipe from '../components/SingleRecipe';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPen, faThumbsUp } from '@fortawesome/free-solid-svg-icons';

const RecipePage = () => {
  const { id } = useParams();
  const [data, setData] = useState({});
  const comment = useRef();
  const [comments, setComments] = useState([]);
  async function likeComment(liked, id, index) {
    try {
      const response = await fetch(`http://localhost:5000/api/comments/like/${id}`, {
        method: liked === 1 ? "DELETE" : "POST",
        headers: {
          'R-A-Token': localStorage.getItem('token')
        }
      });
      if (response.status !== (liked === 1 ? 204 : 201)) return;
      setData((prev) => {
        const newComments = prev.comments.slice();
        newComments[index] = {
          ...newComments[index],
          AlreadyLiked: liked === 1 ? 0 : 1,
          Likes: liked === 1 ? newComments[index].Likes - 1 : newComments[index].Likes + 1
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
      if (response.status !== 201) return;
      const json = await response.json();
      setComments((prev) => {
        return [...prev, json.response[0].Content];
      })
      setData((prev) => {
        return { ...prev, comments: [...prev.comments, json.response[0]] };
      })
    } catch (error) {
      console.log(error);
    }
  }
  console.log(data);
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
      const comments = [...json.response[1]];
      for (let i = 0; i < comments.length; i++)
        if (comments[i].IsOwnComment === 1) comments[i]['editingMode'] = false;
      obj["comments"] = [...comments];
      obj["ingredients"] = json.response[2].slice();
      obj['steps'] = json.response[3].slice();
      console.log(obj)
      for (let i = 0; i < comments.length; i++)
        comments[i] = comments[i].Content
      setComments([...comments]);
      setData(obj);
    } catch (error) {
      console.log(error);
    }
  }
  function handleCommentChange(e, index) {
    setComments((prev) => {
      const comments = [...prev];
      comments[index] = e.target.value;
      return comments
    })
  }
  async function editComment(commentId, ref, index) {
    try {
      const response = await fetch(`http://localhost:5000/api/comments/${commentId}`, {
        method: "PUT",
        headers: {
          'R-A-Token': localStorage.getItem('token'),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: comments[index]
        })
      });
      if (response.status !== 200) return;
      const json = await response.json();
      setComments((prev) => {
        const comments = [...prev];
        comments[index] = json.response;
        return comments;
      })
      setData((prev) => {
        const comments = [...prev.comments];
        comments[index] = { ...comments[index], Content: json.response, editingMode: false, Edited: true };
        return { ...prev, comments: comments };
      })
    } catch (error) {
      console.log(error);
    }
  }
  console.log(comments);
  async function setLike(liked) {
    try {
      const response = await fetch(`http://localhost:5000/api/recipe/like/${id}`, {
        method: liked === true ? "DELETE" : "POST",
        headers: {
          'R-A-Token': localStorage.getItem('token')
        }
      });
      console.log(liked + ", " + response.status);
      if (response.status !== (liked === true ? 204 : 201)) return;
      setData((prev) => {
        return { ...prev, AlreadyLiked: !liked, Likes: liked === true ? prev.Likes - 1 : prev.Likes + 1 };
      })
    } catch (error) {
      console.log(error);
    }
  }
  async function deleteComment(commentId, index) {
    try {
      const response = await fetch(`http://localhost:5000/api/comments/${commentId}`, {
        method: "DELETE",
        headers: {
          'r-a-token': localStorage.getItem('token')
        }
      });
      if (response.status !== 204) return;
      setComments((prev) => {
        const comments = [...prev.slice(0, index), ...prev.slice(index + 1, prev.length)];
        return comments;
      })
      setData((prev) => {
        const comments = [...prev.comments.slice(0, index), ...prev.comments.slice(index + 1, prev.comments.length)];
        return { ...prev, comments: comments };
      })
    } catch (error) {
      console.log(error);
    }
  }
  function setEditingMode(index) {
    setData((prev) => {
      const comments = [...prev.comments];
      comments[index] = { ...comments[index], editingMode: true };
      return { ...prev, comments: [...comments] };
    })
  }
  useEffect(() => {
    setComponents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (Object.keys(data).length !== 0)
    return (
      <div>
        <SingleRecipe recipe={data} setLike={setLike} />
        <div className="w-full h-auto flex flex-col items-center">
          <div className="mt-4">
            <textarea ref={comment} type="text" className="w-full px-4 py-2 border border-gray-300 rounded" ></textarea>
            <button
              className="px-4 py-2 ml-2 text-white bg-blue-500 rounded hover:bg-blue-600"
              onClick={publishComment}
            >
              COMMENT
            </button>
          </div>

          <ol className="mt-4 w-full h-auto flex flex-col items-center">
            {data.comments.map((item, index) => (
              <div className="w-1/2 h-200 border-2 border-black p-2">
                <li key={item.CommentId} className="mb-4 h-200">
                  <div className="flex w-full h-100">
                    <div className="flex items-center mb-2 w-1/2">
                      <span className="mr-2 font-bold">{item.Username}:</span>
                      {item.editingMode ? (
                        <input
                          value={comments[index]}
                          ref={item.ref}
                          onChange={(e) => handleCommentChange(e, index)}
                          type="text"
                          className="w-full px-4 py-2 border border-gray-300 rounded"
                        />
                      ) : (
                        <span>{item.Content}</span>
                      )}
                      <span className="ml-2 text-xs text-gray-500">{item.TimeDifference} ago</span>
                      <span className="ml-2 text-xs text-gray-500">{item.Edited === 1 ? "(Edited)" : ""}</span>
                    </div>
                    <div className="w-1/2 h-100 flex justify-end">
                      <FontAwesomeIcon className="px-4 py-2 ml-2 text-gray hover:text-gray-600 cursor-pointer"
                        onClick={() => {
                          if (item.editingMode) editComment(item.CommentId, item.ref, index);
                          else setEditingMode(index);
                        }} icon={faPen} />
                      <FontAwesomeIcon className="px-4 py-2 ml-2 text-red-400 rounded hover:text-red-700 cursor-pointer"
                        onClick={() => deleteComment(item.CommentId, index)} icon={faTrash} />
                    </div>
                  </div>
                  <div className="flex items-center">
                    <button
                      className={`px-4 py-2 text-white rounded ${item.AlreadyLiked ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-500 hover:bg-gray-600'
                        }`}
                      onClick={() => likeComment(item.AlreadyLiked, item.CommentId, index)}
                    >
                      <FontAwesomeIcon icon={faThumbsUp} />
                    </button>
                    {item.CanEdit === 1 && (
                      <>
                        <button

                        >
                        </button>
                      </>
                    )}
                  </div>
                </li></div>
            ))}
          </ol>
        </div>
      </div>
    );
};

export default RecipePage;