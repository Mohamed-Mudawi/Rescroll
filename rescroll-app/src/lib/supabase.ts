// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database Types
export interface DatabasePost {
  id: number
  title: string
  content: string | null
  image_url: string | null
  upvotes: number
  created_at: string
  updated_at: string
}

export interface DatabaseComment {
  id: number
  post_id: number
  text: string
  created_at: string
}

export interface DatabaseUser {
  id: string
  username: string
  email: string
  created_at: string
}

export interface Resume {
  id: string
  filename: string
  file_url: string
  industry: string | null
  level: string | null
  uploaded_at: string
}

// Transformed types for frontend
export interface Post {
  id: number
  title: string
  content: string
  imageUrl: string
  upvotes: number
  createdAt: Date
  comments: Comment[]
}

export interface Comment {
  id: number
  text: string
  createdAt: Date
}

// API functions for posts
export const postsApi = {
  // Fetch all posts with their comments (optimized with single query)
  async fetchAllPosts(): Promise<Post[]> {
    try {
      // Single query to get posts with comments using JOIN
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          comments (
            id,
            text,
            created_at
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error

      // Transform data to match frontend expectations
      return data?.map(post => ({
        id: post.id,
        title: post.title,
        content: post.content || '',
        imageUrl: post.image_url || '',
        upvotes: post.upvotes,
        createdAt: new Date(post.created_at),
        comments: post.comments?.map((comment: any) => ({
          id: comment.id,
          text: comment.text,
          createdAt: new Date(comment.created_at)
        })) || []
      })) || []
    } catch (error) {
      console.error('Error fetching posts:', error)
      throw error
    }
  },

  // Create a new post
  async createPost(postData: { title: string; content: string; imageUrl: string }): Promise<Post> {
    try {
      const { data, error } = await supabase
        .from('posts')
        .insert([{
          title: postData.title,
          content: postData.content || null,
          image_url: postData.imageUrl || null
        }])
        .select()
        .single()

      if (error) throw error

      return {
        id: data.id,
        title: data.title,
        content: data.content || '',
        imageUrl: data.image_url || '',
        upvotes: data.upvotes,
        createdAt: new Date(data.created_at),
        comments: []
      }
    } catch (error) {
      console.error('Error creating post:', error)
      throw error
    }
  },

  // Update an existing post
  async updatePost(postId: number, postData: { title: string; content: string; imageUrl: string }): Promise<DatabasePost> {
    try {
      const { data, error } = await supabase
        .from('posts')
        .update({
          title: postData.title,
          content: postData.content || null,
          image_url: postData.imageUrl || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', postId)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating post:', error)
      throw error
    }
  },

  // Delete a post (will cascade delete comments if FK is set up)
  async deletePost(postId: number): Promise<void> {
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId)

      if (error) throw error
    } catch (error) {
      console.error('Error deleting post:', error)
      throw error
    }
  },

  // Upvote a post (atomic operation)
  async upvotePost(postId: number): Promise<number> {
    try {
      const { data, error } = await supabase
        .rpc('increment_upvotes', { post_id: postId })

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error upvoting post:', error)
      throw error
    }
  }
}

// API functions for comments
export const commentsApi = {
  // Add a comment to a post
  async addComment(postId: number, text: string): Promise<Comment> {
    try {
      const { data, error } = await supabase
        .from('comments')
        .insert([{ post_id: postId, text }])
        .select()
        .single()

      if (error) throw error

      return {
        id: data.id,
        text: data.text,
        createdAt: new Date(data.created_at)
      }
    } catch (error) {
      console.error('Error adding comment:', error)
      throw error
    }
  }
}

// API functions for resumes
export const resumesApi = {
  // Fetch resumes with filters
  async fetchResumes(industry?: string, level?: string): Promise<Resume[]> {
    try {
      let query = supabase
        .from('resume_urls')
        .select('id, filename, file_url, industry, level, uploaded_at')
        .order('uploaded_at', { ascending: true })

      if (industry && industry !== 'all' && industry.trim() !== '') {
        query = query.ilike('industry', `%${industry}%`)
      }

      if (level && level !== 'all') {
        query = query.ilike('level', level)
      }

      const { data, error } = await query

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching resumes:', error)
      throw error
    }
  }
}

// API functions for users
export const usersApi = {
  // Get user by username
  async getUserByUsername(username: string): Promise<DatabaseUser | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .single()

      if (error) {
        if (error.code === 'PGRST116') return null // Not found
        throw error
      }
      return data
    } catch (error) {
      console.error('Error fetching user by username:', error)
      throw error
    }
  },

  // Check if username exists
  async usernameExists(username: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('username')
        .eq('username', username)
        .single()

      if (error && error.code === 'PGRST116') return false // Not found
      if (error) throw error
      return !!data
    } catch (error) {
      console.error('Error checking username:', error)
      throw error
    }
  },

  // Create user record
  async createUser(userData: { id: string; username: string; email: string }): Promise<DatabaseUser> {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert([{
          id: userData.id,
          username: userData.username,
          email: userData.email,
          created_at: new Date().toISOString()
        }])
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating user:', error)
      throw error
    }
  }
}