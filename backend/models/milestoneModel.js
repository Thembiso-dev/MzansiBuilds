/**
 * Milestone Model
 *
 * Data access layer for milestones.
 * All database queries for milestones live here.
 * Routes never query the database directly.
 *
 * @module models/milestoneModel
 */

const supabase = require('../supabaseClient');

const MilestoneModel = {

  /**
   * Retrieves all milestones for a specific project.
   * Joins with profiles to include the author's username.
   * Orders by oldest first to show progress chronologically.
   *
   * @param {string} projectId - The project UUID
   * @returns {Promise<Array>} array of milestone objects
   */
  getByProject: async (projectId) => {
    const { data, error } = await supabase
      .from('milestones')
      .select(`
        *,
        profiles (
          username,
          avatar_url
        )
      `)
      .eq('project_id', projectId)
      .order('achieved_at', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  /**
   * Creates a new milestone for a project.
   *
   * @param {string} projectId - The project UUID
   * @param {string} userId - The authenticated user's ID
   * @param {string} title - The milestone title
   * @param {string} description - Optional milestone description
   * @returns {Promise<object>} the created milestone
   */
  create: async (projectId, userId, title, description = '') => {
    const { data, error } = await supabase
      .from('milestones')
      .insert({
        project_id: projectId,
        user_id: userId,
        title: title.trim(),
        description: description.trim()
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
  }

};

module.exports = MilestoneModel;