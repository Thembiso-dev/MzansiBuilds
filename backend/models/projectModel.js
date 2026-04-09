/**
 * Project Model
 *
 * Data access layer for projects.
 * All database queries for projects live here.
 * Routes never query the database directly — they use this model.
 *
 * @module models/projectModel
 */

const supabase = require('../supabaseClient');

const ProjectModel = {

  /**
   * Retrieves all projects ordered by newest first.
   * Joins with profiles to include the author's username and avatar.
   *
   * @returns {Promise<Array>} array of project objects
   */
  getAll: async () => {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        profiles (
          username,
          avatar_url
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  /**
   * Retrieves a single project by its ID.
   * Joins with profiles to include author details.
   *
   * @param {string} id - The project UUID
   * @returns {Promise<object|null>} project object or null
   */
  getById: async (id) => {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        profiles (
          username,
          avatar_url
        )
      `)
      .eq('id', id)
      .single();

    if (error) return null;
    return data;
  },

  /**
   * Creates a new project in the database.
   *
   * @param {object} projectData - The project details
   * @param {string} userId - The authenticated user's ID
   * @returns {Promise<object>} the created project
   */
  create: async (projectData, userId) => {
    const { data, error } = await supabase
      .from('projects')
      .insert({
        user_id: userId,
        title: projectData.title,
        description: projectData.description,
        stage: projectData.stage || 'idea',
        support_needed: projectData.support_needed || ''
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Updates an existing project.
   * Only the owner can update their project.
   *
   * @param {string} id - The project UUID
   * @param {string} userId - The authenticated user's ID
   * @param {object} updates - The fields to update
   * @returns {Promise<object>} the updated project
   */
  update: async (id, userId, updates) => {
    const { data, error } = await supabase
      .from('projects')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
        // Set completed_at if stage is being marked complete
        ...(updates.stage === 'completed' && {
          completed_at: new Date().toISOString()
        })
      })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Deletes a project by ID.
   * Only the owner can delete their project.
   *
   * @param {string} id - The project UUID
   * @param {string} userId - The authenticated user's ID
   * @returns {Promise<boolean>} true if deleted
   */
  delete: async (id, userId) => {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw error;
    return true;
  }

};

module.exports = ProjectModel;