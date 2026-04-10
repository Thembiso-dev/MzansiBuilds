/**
 * Comment Model
 *
 * Data access layer for comments.
 * All database queries for comments live here.
 * Routes never query the database directly.
 *
 * @module models/commentModel
 */

const supabase = require('../supabaseClient');

const CommentModel = {

  /**
   * Retrieves all comments for a specific project.
   * Joins with profiles to include the author's username.
   * Orders by oldest first so comments read naturally.
   *
   * @param {string} projectId - The project UUID
   * @returns {Promise<Array>} array of comment objects
   */
  getByProject: async (projectId) => {
    const { data, error } = await supabase
      .from('comments')
      .select(`
        *,
        profiles (
          username,
          avatar_url
        )
      `)
      .eq('project_id', projectId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  /**
   * Creates a new comment on a project.
   *
   * @param {string} projectId - The project UUID
   * @param {string} userId - The authenticated user's ID
   * @param {string} content - The comment text
   * @returns {Promise<object>} the created comment
   */
  create: async (projectId, userId, content) => {
    const { data, error } = await supabase
      .from('comments')
      .insert({
        project_id: projectId,
        user_id: userId,
        content: content.trim()
      })
      .select(`
        *,
        profiles (
          username,
          avatar_url
        )
      `)
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Deletes a comment.
   * Only the comment author can delete their comment.
   *
   * @param {string} commentId - The comment UUID
   * @param {string} userId - The authenticated user's ID
   * @returns {Promise<boolean>} true if deleted
   */
  delete: async (commentId, userId) => {
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId)
      .eq('user_id', userId);

    if (error) throw error;
    return true;
  }

};

module.exports = CommentModel;