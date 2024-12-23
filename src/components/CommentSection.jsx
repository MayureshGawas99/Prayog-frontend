import React, { useContext, useEffect, useState } from "react";
import CommentCard from "./CommentCard";
import { toast } from "react-toastify";
import axios from "axios";
import Loading from "./Loading";
import { AppContext } from "../context/AppContext";

function CommentSection({ project }) {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const getTotalPages = (count, per) => {
    let total = count / per;
    return Math.ceil(total);
  };
  const [totalPages, setTotalPages] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);
  const {
    jwt,
    user,
    fetchCommentsAgain,
    setFetchCommentsAgain,
    commentCount,
    setCommentCount,
  } = useContext(AppContext);
  const commonAxios = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
    },
  });

  const addComment = async (parent = null) => {
    try {
      if (!user) {
        toast.warning("Please login to comment");
        return;
      }
      if (comment === "") return;
      const body = { content: comment, parent, projectId: project?._id };
      const data = await commonAxios.post("/api/comment/create", body);
      setComment("");
      setFetchCommentsAgain(!fetchCommentsAgain);
      setCommentCount(commentCount + 1);
      if (data) {
        toast.success("Comment created successfully");
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.message);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent page reload
    await addComment(); // Call the addComment function
  };

  const fetchComments = async () => {
    try {
      setLoading(true);
      const { data } = await commonAxios.get(
        `/api/comment/get-comments/${project?._id}?page=${currentPage}`
      );

      setComments([...data]);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (project?._id) {
      fetchComments();
      setTotalPages(getTotalPages(project?.commentCount, 5));
    }
  }, [project, currentPage, fetchCommentsAgain]);

  return (
    <div className="mb-8 bg-white">
      <h2 className="mb-4 text-lg font-semibold">Comments:</h2>
      <form onSubmit={handleSubmit}>
        <div className="flex gap-2 mb-4">
          <div className="flex-grow">
            <input
              type="text"
              className="w-full h-full px-2 py-2 border rounded-lg focus:outline-none bg-white/15 backdrop-blur-md"
              placeholder="Add a comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center justify-center px-5 py-3 text-base font-bold text-center text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 "
          >
            Send
          </button>
        </div>
      </form>
      {loading ? (
        <div className="flex justify-center w-full py-6">
          <div className="flex items-center justify-center mb-8 ">
            <Loading color="indigo" />
          </div>
        </div>
      ) : (
        <div>
          {comments?.map((comment, index) => {
            return (
              <div key={index}>
                <CommentCard
                  comment={comment}
                  replyDepth={0}
                  projectId={comment.projectId}
                />
              </div>
            );
          })}
          {currentPage < totalPages && (
            <div
              className="text-xs font-semibold text-gray-500 cursor-pointer hover:text-indigo-500"
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              See More Comments
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default CommentSection;
