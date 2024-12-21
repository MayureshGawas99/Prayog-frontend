import React, { useContext, useEffect, useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { formatDistanceToNow } from "date-fns";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import DeleteCommentModaL from "./DeleteCommentModal";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import Loading from "./Loading";
import { toast } from "react-toastify";

function CommentCard({ comment, replyDepth, projectId }) {
  const [replyOpen, setReplyOpen] = useState(false);
  const [reply, setReply] = useState("");
  const [commentLike, setCommentLike] = useState(false);
  const [commentLikeCount, setCommentLikeCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [openReplyBox, setOpenReplyBox] = useState(false);
  const {
    user,
    jwt,
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
  const [state, setState] = useState("reply");
  const [replies, setReplies] = useState([]);

  const editOrReplyComment = async () => {
    try {
      if (state === "edit") {
        editComment();
      } else {
        addComment(comment._id);
      }
      setReply("");
      setOpenReplyBox(false);
    } catch (error) {
      console.log(error);
    }
  };

  const likeComment = async () => {
    try {
      if (!user) {
        toast.warning("Please login to like the comment");
        return;
      }
      const { data } = await commonAxios.get(
        `/api/comment/like/${comment?._id}`
      );
      toast.success(data.message);
      if (commentLike) {
        setCommentLikeCount(commentLikeCount - 1);
      } else {
        setCommentLikeCount(commentLikeCount + 1);
      }
      setCommentLike(!commentLike);
    } catch (error) {
      console.log(error);
    }
  };
  const deleteComment = async (commentId) => {
    try {
      if (!user) {
        toast.warning("Please login to delete the comment");
        return;
      }
      const { data } = await commonAxios.delete(
        `/api/comment/delete/${commentId}`
      );
      toast.success(data);
      setFetchCommentsAgain(!fetchCommentsAgain);
    } catch (error) {
      console.log(error);
    }
  };
  const addComment = async (parent = null) => {
    try {
      if (!user) {
        toast.warning("Please login to Reply a comment");
        return;
      }
      if (reply === "") return;
      const body = {
        content: reply,
        parent,
        projectId: comment.projectId,
      };
      const data = await commonAxios.post("/api/comment/create", body);
      setReply("");
      setCommentCount(commentCount + 1);
      setFetchCommentsAgain(!fetchCommentsAgain);

      if (data) {
        toast.success("Comment created successfully");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const editComment = async () => {
    try {
      if (!user) {
        toast.warning("Please login to edit the comment");
        return;
      }
      const body = {
        newContent: reply,
        commentId: comment._id,
      };
      const data = await commonAxios.put("/api/comment/edit", body);
      console.log(data);
      setFetchCommentsAgain(!fetchCommentsAgain);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchCommentsReplies = async () => {
    try {
      setLoading(true);
      const { data } = await commonAxios.get(
        `/api/comment/get-replies/${comment?._id}`
      );
      setReplies(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent page reload
    await editOrReplyComment(comment._id);
  };

  useEffect(() => {
    if (comment) {
      fetchCommentsReplies();
      setCommentLike(comment?.isLiked);
      setCommentLikeCount(comment?.likeCount);
    }
  }, []);
  return (
    <div className={` flex flex-col ou overflow-x-auto my-2`}>
      <div className={`flex flex-row items-center`}>
        <div
          className={`comment-line flex flex-col px-2 py-1 w-full rounded-lg border  border-black bg-gray-100`}
        >
          <div className="flex flex-row items-center gap-2">
            <img
              alt="natali craig"
              src={comment?.author?.pic}
              className="inline-block relative object-cover object-center !rounded-full w-12 h-12  border-2 border-white cursor-pointer hover:z-10"
            />
            <div className="flex-grow overflow-x-hidden">
              <div className="w-full overflow-x-auto text-sm font-bold cursor-pointer md:text-base">
                <div className="flex flex-row items-center gap-2">
                  <span className="whitespace-nowrap h-fit">
                    {comment?.author?.name}
                  </span>
                  <span className="text-xs text-gray-500 md:text-sm whitespace-nowrap h-fit">
                    {"("}
                    {formatDistanceToNow(new Date(comment?.createdAt), {
                      addSuffix: true,
                    })}
                    {")"}
                  </span>
                </div>
              </div>
              <div className={`text-sm md:text-base`}>
                {comment.content === "" ? (
                  <span className="text-gray-500">Comment was deleted</span>
                ) : (
                  comment.content
                )}
              </div>
              <div className="flex flex-row items-center w-full overflow-x-auto ">
                <div className="flex flex-row items-center text-lg">
                  {commentLike ? (
                    <FaHeart
                      className="text-red-500 cursor-pointer"
                      onClick={likeComment}
                    />
                  ) : (
                    <FaRegHeart
                      className="cursor-pointer "
                      onClick={likeComment}
                    />
                  )}
                  <div className="pl-2 text-base">{commentLikeCount}</div>
                </div>
                <div
                  className="pl-5 text-sm cursor-pointer"
                  onClick={() => {
                    if (openReplyBox && state === "edit") {
                      // setReply("");
                      setReply("");
                      setState("reply");
                      return;
                    }
                    setReply("");

                    setState("reply");
                    setOpenReplyBox(!openReplyBox);
                  }}
                >
                  Reply
                </div>
                {comment?.content !== "" &&
                  comment?.author._id === user?._id && (
                    <>
                      {/* <div
                        className="pl-5 text-sm cursor-pointer"
                          onClick={() => {
                            setDeleteId(comment?._id);
                            setIsDisclaimerOpen(true);
                          }}
                      >
                        Delete
                      </div> */}
                      <DeleteCommentModaL
                        commentId={comment._id}
                        handleDelete={deleteComment}
                      />
                      <div
                        className="pl-5 text-sm cursor-pointer"
                        onClick={() => {
                          if (openReplyBox && state === "reply") {
                            // setReply("");
                            setReply(comment.content);
                            setState("edit");
                            return;
                          }
                          setReply(comment.content);
                          setState("edit");
                          setOpenReplyBox(!openReplyBox);
                        }}
                      >
                        Edit
                      </div>
                    </>
                  )}
              </div>
            </div>
          </div>
          <form onSubmit={handleSubmit}>
            <div
              className={`flex flex-row overflow-y-hidden gap-2 my-1 h-0 ${
                openReplyBox && "h-auto"
              } transition-all duration-500`}
            >
              <input
                placeholder={"Reply..."}
                className={`w-full  ${
                  openReplyBox && "p-2"
                } rounded-md  focus:outline-none bg-white/15 border border-gray-300 backdrop-blur-sm`}
                value={reply}
                onChange={(e) => setReply(e.target.value)}
              ></input>
              <div className="flex justify-start">
                <button
                  type="submit"
                  class="inline-flex items-center justify-center px-5 py-3 text-base font-bold text-center text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 "
                >
                  {state === "reply" ? "Reply" : "Edit"}
                </button>
              </div>
            </div>
          </form>

          {/* )} */}
        </div>
        {comment?.replies.length > 0 && (
          <div
            className="text-3xl cursor-pointer"
            onClick={() => setReplyOpen(!replyOpen)}
          >
            {replyOpen ? (
              <a
                data-tooltip-id="my-tooltip"
                data-tooltip-content="Hide replies"
              >
                <p>
                  <IoIosArrowUp />
                </p>
              </a>
            ) : (
              <a
                data-tooltip-id="my-tooltip"
                data-tooltip-content="Show replies"
              >
                <p>
                  <IoIosArrowDown />
                </p>
              </a>
            )}
          </div>
        )}
      </div>
      {replyOpen && (
        <div
          className={`border-l-2 border-gray-500  overflow-y-hidden ${
            replyOpen && "h-auto"
          } transition-all duration-700 pl-5`}
        >
          {loading ? (
            <div className="flex items-center justify-center mb-8 ">
              <Loading color="indigo" />
            </div>
          ) : (
            replies.map((reply, index) => {
              return (
                <CommentCard
                  key={index}
                  comment={reply}
                  replyDepth={replyDepth + 1}
                  projectId={projectId}
                />
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

export default CommentCard;
