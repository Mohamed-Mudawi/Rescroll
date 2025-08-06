"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Search, Plus, ArrowUp, Clock, TrendingUp, Edit, Trash2, MessageSquare, Loader2 } from 'lucide-react';
import { postsApi, commentsApi, type Post } from '../../lib/supabase';

interface FormData {
  title: string;
  content: string;
  image_url: string;
}

type ViewType = 'home' | 'post' | 'create' | 'edit';
type SortType = 'time' | 'upvotes';

export default function DiscussionPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [sortBy, setSortBy] = useState<SortType>('time');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [newComment, setNewComment] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Form states
  const [formData, setFormData] = useState<FormData>({
    title: '',
    content: '',
    image_url: ''
  });

  // Load posts from Supabase (optimized)
  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      
      const postsData = await postsApi.fetchAllPosts();
      setPosts(postsData);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Failed to load posts. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Memoized time formatting function
  const formatTimeAgo = useCallback((dateString: string): string => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  }, []);

  // Create post handler
  const handleCreatePost = useCallback(async () => {
    if (!formData.title.trim()) return;

    try {
      setSubmitting(true);
      const newPost = await postsApi.createPost({
        title: formData.title,
        content: formData.content,
        imageUrl: formData.image_url
      });
      
      setPosts(prevPosts => [newPost, ...prevPosts]);
      setFormData({ title: '', content: '', image_url: '' });
      setCurrentView('home');
    } catch (err) {
      console.error('Error creating post:', err);
      setError('Failed to create post. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }, [formData]);

  // Edit post handler
  const handleEditPost = useCallback(async () => {
    if (!formData.title.trim() || !editingPost) return;

    try {
      setSubmitting(true);
      const updatedPost = await postsApi.updatePost(editingPost.id, {
        title: formData.title,
        content: formData.content,
        imageUrl: formData.image_url
      });

      setPosts(prevPosts => prevPosts.map(post => 
        post.id === editingPost.id 
          ? { 
              ...post, 
              title: updatedPost.title,
              content: updatedPost.content || '',
              imageUrl: updatedPost.image_url || ''
            }
          : post
      ));
      
      if (selectedPost && selectedPost.id === editingPost.id) {
        setSelectedPost(prev => prev ? {
          ...prev,
          title: updatedPost.title,
          content: updatedPost.content || '',
          imageUrl: updatedPost.image_url || ''
        } : null);
      }
      
      setFormData({ title: '', content: '', image_url: '' });
      setEditingPost(null);
      setCurrentView(selectedPost ? 'post' : 'home');
    } catch (err) {
      console.error('Error updating post:', err);
      setError('Failed to update post. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }, [formData, editingPost, selectedPost]);

  // Delete post handler
  const handleDeletePost = useCallback(async (postId: number) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      setSubmitting(true);
      await postsApi.deletePost(postId);
      setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
      setCurrentView('home');
      setSelectedPost(null);
    } catch (err) {
      console.error('Error deleting post:', err);
      setError('Failed to delete post. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }, []);

  // Upvote handler (optimistic updates)
  const handleUpvote = useCallback(async (postId: number) => {
    // Optimistic update
    setPosts(prevPosts => prevPosts.map(post => 
      post.id === postId 
        ? { ...post, upvotes: post.upvotes + 1 }
        : post
    ));
    
    if (selectedPost && selectedPost.id === postId) {
      setSelectedPost(prev => prev ? { ...prev, upvotes: prev.upvotes + 1 } : null);
    }

    try {
      const newUpvotes = await postsApi.upvotePost(postId);
      
      // Update with server response
      setPosts(prevPosts => prevPosts.map(post => 
        post.id === postId 
          ? { ...post, upvotes: newUpvotes }
          : post
      ));
      
      if (selectedPost && selectedPost.id === postId) {
        setSelectedPost(prev => prev ? { ...prev, upvotes: newUpvotes } : null);
      }
    } catch (err) {
      console.error('Error upvoting post:', err);
      // Revert optimistic update
      setPosts(prevPosts => prevPosts.map(post => 
        post.id === postId 
          ? { ...post, upvotes: post.upvotes - 1 }
          : post
      ));
      if (selectedPost && selectedPost.id === postId) {
        setSelectedPost(prev => prev ? { ...prev, upvotes: prev.upvotes - 1 } : null);
      }
      setError('Failed to upvote post. Please try again.');
    }
  }, [selectedPost]);

  // Add comment handler
  const handleAddComment = useCallback(async (postId: number) => {
    if (!newComment.trim()) return;

    try {
      setSubmitting(true);
      const comment = await commentsApi.addComment(postId, newComment);

      setPosts(prevPosts => prevPosts.map(post => 
        post.id === postId 
          ? { ...post, comments: [...post.comments, comment] }
          : post
      ));

      if (selectedPost && selectedPost.id === postId) {
        setSelectedPost(prev => prev ? { 
          ...prev, 
          comments: [...prev.comments, comment] 
        } : null);
      }

      setNewComment('');
    } catch (err) {
      console.error('Error adding comment:', err);
      setError('Failed to add comment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }, [newComment, selectedPost]);

  // Memoized filtered and sorted posts
  const filteredAndSortedPosts = useMemo(() => {
    let filtered = posts.filter(post => 
      post.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return filtered.sort((a, b) => {
      if (sortBy === 'upvotes') {
        return b.upvotes - a.upvotes;
      }
      return b.createdAt.getTime() - a.createdAt.getTime();
    });
  }, [posts, searchTerm, sortBy]);

  // Start edit handler
  const startEdit = useCallback((post: Post) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      content: post.content,
      image_url: post.imageUrl
    });
    setCurrentView('edit');
  }, []);

  // Reset form handler
  const resetForm = useCallback(() => {
    setFormData({ title: '', content: '', image_url: '' });
    setEditingPost(null);
    setCurrentView('home');
  }, []);

  // Error message component
  const ErrorMessage = React.memo(({ message }: { message: string }) => (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
      <p className="text-red-800">{message}</p>
      <button 
        onClick={() => setError('')}
        className="text-red-600 underline text-sm mt-2"
      >
        Dismiss
      </button>
    </div>
  ));

  // Loading spinner
  const LoadingSpinner = React.memo(() => (
    <div className="flex justify-center items-center py-8">
      <Loader2 className="animate-spin" size={32} />
    </div>
  ));

  // Home view
  if (currentView === 'home') {
    return (
      <main className="min-h-screen bg-gray-50 pt-8">
        <div className="max-w-4xl mx-auto px-4">
          {error && <ErrorMessage message={error} />}
          
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h1 className="text-3xl font-bold mb-2">Discussion Forum</h1>
            <p className="text-gray-600 mb-6">
              Share knowledge, ask questions, and connect with the community about careers and professional development.
            </p>
            
            <button
              onClick={() => setCurrentView('create')}
              disabled={loading || submitting}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors"
            >
              <Plus size={20} />
              Create New Post
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search posts by title..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setSortBy('time')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    sortBy === 'time' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Clock size={16} />
                  Latest
                </button>
                <button
                  onClick={() => setSortBy('upvotes')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    sortBy === 'upvotes' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <TrendingUp size={16} />
                  Popular
                </button>
              </div>
            </div>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="space-y-4">
              {filteredAndSortedPosts.map(post => (
                <div key={post.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                  <div 
                    className="p-6 cursor-pointer"
                    onClick={() => {
                      setSelectedPost(post);
                      setCurrentView('post');
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                          {post.title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock size={14} />
                            {formatTimeAgo(post.createdAt.toISOString())}
                          </span>
                          <span className="flex items-center gap-1">
                            <ArrowUp size={14} />
                            {post.upvotes} upvotes
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageSquare size={14} />
                            {post.comments.length} comments
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {filteredAndSortedPosts.length === 0 && !loading && (
                <div className="bg-white rounded-lg p-8 text-center">
                  <p className="text-gray-500">
                    {searchTerm ? 'No posts found. Try a different search term.' : 'No posts yet. Be the first to create a post!'}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    );
  }

  // Create/Edit form view
  if (currentView === 'create' || currentView === 'edit') {
    return (
      <main className="min-h-screen bg-gray-50 pt-8">
        <div className="max-w-2xl mx-auto px-4">
          {error && <ErrorMessage message={error} />}
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={resetForm}
                className="text-gray-600 hover:text-gray-800"
                disabled={submitting}
              >
                ← Back
              </button>
              <h1 className="text-2xl font-bold">
                {currentView === 'create' ? 'Create New Post' : 'Edit Post'}
              </h1>
            </div>

            <div className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Post Title *
                </label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  disabled={submitting}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                  placeholder="Enter your post title..."
                />
              </div>

              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                  Content (optional)
                </label>
                <textarea
                  id="content"
                  rows={6}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  disabled={submitting}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical disabled:bg-gray-100"
                  placeholder="Share your thoughts, questions, or insights..."
                />
              </div>

              <div>
                <label htmlFor="image_url" className="block text-sm font-medium text-gray-700 mb-2">
                  Image URL (optional)
                </label>
                <input
                  type="url"
                  id="image_url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  disabled={submitting}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                  placeholder="https://example.com/image.jpg"
                />
                {formData.image_url && (
                  <img 
                    src={formData.image_url} 
                    alt="Preview" 
                    className="mt-3 max-w-full h-48 object-cover rounded-lg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={currentView === 'create' ? handleCreatePost : handleEditPost}
                  disabled={submitting || !formData.title.trim()}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  {submitting && <Loader2 className="animate-spin" size={16} />}
                  {currentView === 'create' ? 'Create Post' : 'Update Post'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={submitting}
                  className="bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 text-gray-800 px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Individual post view
  if (currentView === 'post' && selectedPost) {
    return (
      <main className="min-h-screen bg-gray-50 pt-8">
        <div className="max-w-4xl mx-auto px-4">
          {error && <ErrorMessage message={error} />}
          
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={() => setCurrentView('home')}
                className="text-gray-600 hover:text-gray-800"
                disabled={submitting}
              >
                ← Back to Forum
              </button>
            </div>

            <div className="mb-6">
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-3xl font-bold text-gray-900">{selectedPost.title}</h1>
                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(selectedPost)}
                    disabled={submitting}
                    className="text-gray-500 hover:text-blue-600 disabled:text-gray-300 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    title="Edit post"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDeletePost(selectedPost.id)}
                    disabled={submitting}
                    className="text-gray-500 hover:text-red-600 disabled:text-gray-300 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    title="Delete post"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-6 text-sm text-gray-500 mb-6">
                <span className="flex items-center gap-1">
                  <Clock size={14} />
                  {formatTimeAgo(selectedPost.createdAt.toISOString())}
                </span>
                <button
                  onClick={() => handleUpvote(selectedPost.id)}
                  disabled={submitting}
                  className="flex items-center gap-2 px-3 py-1 bg-gray-100 hover:bg-blue-100 disabled:bg-gray-50 text-gray-700 hover:text-blue-700 rounded-full transition-colors"
                >
                  <ArrowUp size={16} />
                  {selectedPost.upvotes} upvotes
                </button>
              </div>

              {selectedPost.content && (
                <div className="prose max-w-none mb-6">
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {selectedPost.content}
                  </p>
                </div>
              )}

              {selectedPost.imageUrl && (
                <img 
                  src={selectedPost.imageUrl} 
                  alt="Post image" 
                  className="max-w-full h-auto rounded-lg mb-6"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              )}
            </div>

            <div className="border-t pt-6">
              <h3 className="text-xl font-semibold mb-4">
                Comments ({selectedPost.comments.length})
              </h3>

              <div className="mb-6">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your thoughts..."
                  rows={3}
                  disabled={submitting}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical mb-3 disabled:bg-gray-50"
                />
                <button
                  onClick={() => handleAddComment(selectedPost.id)}
                  disabled={submitting || !newComment.trim()}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  {submitting && <Loader2 className="animate-spin" size={16} />}
                  Add Comment
                </button>
              </div>

              <div className="space-y-4">
                {selectedPost.comments.map(comment => (
                  <div key={comment.id} className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-800 mb-2">{comment.text}</p>
                    <p className="text-sm text-gray-500">{formatTimeAgo(comment.createdAt.toISOString())}</p>
                  </div>
                ))}
                
                {selectedPost.comments.length === 0 && (
                  <p className="text-gray-500 text-center py-6">
                    No comments yet. Be the first to share your thoughts!
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return null;}