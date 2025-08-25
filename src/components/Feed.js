import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faComment,
  faEdit,
  faTrash,
  faTimes,
  faCheck,
  faImage,
  faVideo,
  faUser
} from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import CommentSection from "./CommentSection";

const Feed = ({ posts, onLikePost, onDeletePost, onEditPost }) => {
  const [expandedComments, setExpandedComments] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [editedText, setEditedText] = useState("");
  const [postToDelete, setPostToDelete] = useState(null);

  const handleCommentClick = (postId) => {
    setExpandedComments(expandedComments === postId ? null : postId);
  };

  const handleEditClick = (post) => {
    setEditingPost(post.id);
    setEditedText(post.text);
  };

  const handleSaveEdit = () => {
    if (editedText.trim()) {
      onEditPost(editingPost, editedText);
      setEditingPost(null);
      toast.success("Post updated successfully!");
    } else {
      toast.error("Post content cannot be empty!");
    }
  };

  const handleDeleteClick = (postId) => {
    setPostToDelete(postId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    onDeletePost(postToDelete);
    setDeleteDialogOpen(false);
    toast.success("Post deleted successfully!");
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const postVariants = {
    hidden: { y: 50, opacity: 0, scale: 0.95 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <div className="w-full flex justify-center mt-1">
      <div className="w-full max-w-4xl space-y-6 px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {posts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div className="w-24 h-24 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FontAwesomeIcon icon={faComment} className="text-violet-500 text-3xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No posts yet</h3>
              <p className="text-gray-600">Be the first to share something amazing!</p>
            </motion.div>
          ) : (
            posts.map((post) => (
              <motion.div
                key={post.id}
                variants={postVariants}
                whileHover={{ y: -4, scale: 1.01 }}
                className="group relative mx-auto"
              >
                {/* Glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 rounded-3xl blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
                
                {/* Main post card */}
                <div className="relative bg-gradient-to-br from-slate-800 via-violet-900 to-slate-800 rounded-3xl shadow-2xl overflow-hidden border border-violet-700/30 backdrop-blur-sm">
                  {/* Card content */}
                  <div className="p-6 sm:p-8">
                    {/* Post Header */}
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="relative">
                        <div className="w-14 h-14 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                          {post.user.profile_picture ? (
                            <img
                              src={post.user.profile_picture}
                              alt={post.user.username}
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            <FontAwesomeIcon icon={faUser} className="text-white text-xl" />
                          )}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-slate-800"></div>
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white">
                          @{post.user.username}
                        </h3>
                        <p className="text-violet-300 text-sm">
                          {new Date(post.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>

                      {/* Category Badge */}
                      {post.category && (
                        <div className="bg-violet-600/20 backdrop-blur-sm border border-violet-500/30 rounded-full px-3 py-1">
                          <span className="text-violet-300 text-xs font-medium capitalize">
                            {post.category}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Post Content */}
                    <div className="mb-6">
                      {editingPost === post.id ? (
                        <div className="space-y-4">
                          <textarea
                            value={editedText}
                            onChange={(e) => setEditedText(e.target.value)}
                            className="w-full p-4 bg-slate-800/50 border border-violet-600/30 rounded-xl text-white placeholder-violet-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all duration-200 resize-none"
                            rows={4}
                            placeholder="Share your thoughts..."
                          />
                          <div className="flex justify-center space-x-3">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={handleSaveEdit}
                              className="px-6 py-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-lg font-medium hover:from-violet-700 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2"
                            >
                              <FontAwesomeIcon icon={faCheck} className="text-sm" />
                              <span>Save</span>
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setEditingPost(null)}
                              className="px-6 py-2 bg-slate-700 text-violet-300 rounded-lg font-medium hover:bg-slate-600 transition-all duration-200 flex items-center space-x-2"
                            >
                              <FontAwesomeIcon icon={faTimes} className="text-sm" />
                              <span>Cancel</span>
                            </motion.button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center">
                          <p className="text-violet-100 text-lg leading-relaxed text-left">
                            {post.text}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Post Media - Centered */}
                    {post.image && (
                      <div className="mb-6 relative overflow-hidden rounded-2xl flex justify-center">
                        <img
                          src={post.image}
                          alt="Post content"
                          className="max-w-full max-h-96 object-cover hover:scale-105 transition-transform duration-500 rounded-2xl"
                        />
                        <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-sm rounded-lg p-2">
                          <FontAwesomeIcon icon={faImage} className="text-violet-400" />
                        </div>
                      </div>
                    )}

                    {post.video && (
                      <div className="mb-6 relative overflow-hidden rounded-2xl flex justify-center">
                        <video
                          controls
                          src={post.video}
                          className="max-w-full max-h-96 object-cover rounded-2xl"
                        />
                        <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-sm rounded-lg p-2">
                          <FontAwesomeIcon icon={faVideo} className="text-violet-400" />
                        </div>
                      </div>
                    )}

                    {/* Post Actions - Centered */}
                    <div className="flex items-center justify-center pt-6 border-t border-violet-700/30">
                      <div className="flex items-center justify-between w-full max-w-md">
                        <div className="flex items-center space-x-4">
                          {/* Like Button */}
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onLikePost(post.id)}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                              post.is_liked
                                ? "bg-pink-600/20 text-pink-400 border border-pink-500/30"
                                : "bg-slate-800/50 text-violet-300 hover:bg-violet-600/20 hover:text-violet-200 border border-violet-700/30"
                            }`}
                          >
                            <FontAwesomeIcon 
                              icon={faHeart} 
                              className={`text-lg ${post.is_liked ? "animate-pulse" : ""}`}
                            />
                            <span className="font-medium">{post.total_likes || post.likes?.length || 0}</span>
                          </motion.button>

                          {/* Comment Button */}
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleCommentClick(post.id)}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                              expandedComments === post.id
                                ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                                : "bg-slate-800/50 text-violet-300 hover:bg-violet-600/20 hover:text-violet-200 border border-violet-700/30"
                            }`}
                          >
                            <FontAwesomeIcon icon={faComment} className="text-lg" />
                            <span className="font-medium">{post.comments?.length || 0}</span>
                          </motion.button>
                        </div>

                        {/* Edit/Delete Actions */}
                        {post.user.username === localStorage.getItem("username") && editingPost !== post.id && (
                          <div className="flex items-center space-x-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleEditClick(post)}
                              className="w-10 h-10 bg-violet-600/20 hover:bg-violet-600/30 text-violet-400 rounded-lg flex items-center justify-center transition-all duration-200 border border-violet-500/30"
                            >
                              <FontAwesomeIcon icon={faEdit} className="text-sm" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleDeleteClick(post.id)}
                              className="w-10 h-10 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg flex items-center justify-center transition-all duration-200 border border-red-500/30"
                            >
                              <FontAwesomeIcon icon={faTrash} className="text-sm" />
                            </motion.button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Comment Section */}
                    <AnimatePresence>
                      {expandedComments === post.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="mt-6 pt-6 border-t border-violet-700/30"
                        >
                          <div className="bg-slate-800/30 rounded-2xl p-4 border border-violet-700/20">
                            <CommentSection postId={post.id} />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>

      {/* Enhanced Delete Dialog */}
      <AnimatePresence>
        {deleteDialogOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              className="bg-gradient-to-br from-slate-800 to-violet-900 rounded-2xl p-6 w-full max-w-md border border-violet-700/30 shadow-2xl"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-red-600/20 rounded-full flex items-center justify-center">
                  <FontAwesomeIcon icon={faTrash} className="text-red-400 text-xl" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Delete Post</h3>
                  <p className="text-violet-300 text-sm">This action cannot be undone</p>
                </div>
              </div>
              
              <p className="text-violet-200 mb-6 leading-relaxed">
                Are you sure you want to delete this post? All comments and interactions will be permanently removed.
              </p>
              
              <div className="flex space-x-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setDeleteDialogOpen(false)}
                  className="flex-1 px-4 py-3 bg-slate-700 text-violet-300 rounded-xl font-medium hover:bg-slate-600 transition-all duration-200"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-medium hover:from-red-700 hover:to-red-800 transition-all duration-200"
                >
                  Delete
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Feed;
