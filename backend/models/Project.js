const { query, transaction } = require('../config/database');
const fs = require('fs');
const path = require('path');

class Project {
  constructor(data) {
    this.id = data.id;
    this.title = data.title;
    this.slug = data.slug;
    this.description = data.description;
    this.repository_url = data.repository_url;
    this.branch_name = data.branch_name;
    this.creator = data.creator;
    this.status = data.status;
    this.has_repository = data.has_repository;
    this.has_documentation = data.has_documentation;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  // Generate project slug from title
  static generateSlug(title) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-/, '')
      .replace(/-$/, '');
  }

  // Create a new project
  static async create(projectData) {
    const slug = this.generateSlug(projectData.title);
    
    // Check if project with this slug already exists
    const existingProject = await this.findBySlug(slug);
    if (existingProject) {
      throw new Error(`Project with slug "${slug}" already exists`);
    }

    const result = await query(`
      INSERT INTO projects (title, slug, description, repository_url, branch_name, creator)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [
      projectData.title,
      slug,
      projectData.description || `Brief description of ${projectData.title}`,
      projectData.repository_url,
      projectData.branch_name || 'master',
      projectData.creator
    ]);

    return new Project(result.rows[0]);
  }

  // Find project by ID
  static async findById(id) {
    const result = await query('SELECT * FROM projects WHERE id = $1', [id]);
    return result.rows.length ? new Project(result.rows[0]) : null;
  }

  // Find project by slug
  static async findBySlug(slug) {
    const result = await query('SELECT * FROM projects WHERE slug = $1', [slug]);
    return result.rows.length ? new Project(result.rows[0]) : null;
  }

  // Get all projects
  static async findAll(options = {}) {
    const { status = 'active', limit, offset, orderBy = 'created_at', orderDirection = 'DESC' } = options;
    
    let queryText = 'SELECT * FROM projects WHERE status = $1';
    const queryParams = [status];
    
    queryText += ` ORDER BY ${orderBy} ${orderDirection}`;
    
    if (limit) {
      queryText += ` LIMIT $${queryParams.length + 1}`;
      queryParams.push(limit);
    }
    
    if (offset) {
      queryText += ` OFFSET $${queryParams.length + 1}`;
      queryParams.push(offset);
    }

    const result = await query(queryText, queryParams);
    return result.rows.map(row => new Project(row));
  }

  // Update project
  async update(updates) {
    const allowedFields = ['title', 'description', 'repository_url', 'branch_name', 'status', 'has_repository', 'has_documentation'];
    const updateFields = [];
    const values = [];
    let paramIndex = 1;

    for (const [key, value] of Object.entries(updates)) {
      if (allowedFields.includes(key)) {
        updateFields.push(`${key} = $${paramIndex}`);
        values.push(value);
        paramIndex++;
      }
    }

    if (updateFields.length === 0) {
      throw new Error('No valid fields to update');
    }

    values.push(this.id);
    const queryText = `
      UPDATE projects 
      SET ${updateFields.join(', ')} 
      WHERE id = $${paramIndex} 
      RETURNING *
    `;

    const result = await query(queryText, values);
    
    if (result.rows.length) {
      Object.assign(this, result.rows[0]);
    }
    
    return this;
  }

  // Delete project (soft delete by default)
  async delete(hard = false) {
    if (hard) {
      await query('DELETE FROM projects WHERE id = $1', [this.id]);
      return true;
    } else {
      await this.update({ status: 'deleted' });
      return this;
    }
  }

  // Check filesystem status
  async syncFilesystemStatus() {
    const docupilotPath = path.join(__dirname, '../../docupilot');
    const docPath = path.join(docupilotPath, this.slug);
    const digestPath = path.join(docPath, 'digest.txt');
    
    // We no longer keep repository files, but check if digest.txt exists as proof of processing
    const has_repository = fs.existsSync(digestPath);
    const has_documentation = fs.existsSync(docPath);
    
    await this.update({ has_repository, has_documentation });
    
    return { has_repository, has_documentation };
  }

  // Get project statistics
  static async getStatistics() {
    const result = await query(`
      SELECT 
        COUNT(*) as total_projects,
        COUNT(CASE WHEN status = 'active' THEN 1 END) as active_projects,
        COUNT(CASE WHEN status = 'deleted' THEN 1 END) as deleted_projects,
        COUNT(CASE WHEN has_repository = true THEN 1 END) as projects_with_repo,
        COUNT(CASE WHEN has_documentation = true THEN 1 END) as projects_with_docs
      FROM projects
    `);
    
    return result.rows[0];
  }

  // Search projects
  static async search(searchTerm, options = {}) {
    const { status = 'active', limit = 50 } = options;
    
    const result = await query(`
      SELECT * FROM projects 
      WHERE status = $1 
        AND (title ILIKE $2 OR description ILIKE $2 OR slug ILIKE $2)
      ORDER BY created_at DESC
      LIMIT $3
    `, [status, `%${searchTerm}%`, limit]);
    
    return result.rows.map(row => new Project(row));
  }

  // Convert to JSON (for API responses)
  toJSON() {
    return {
      id: this.id,
      title: this.title,
      slug: this.slug,
      description: this.description,
      repositoryUrl: this.repository_url,
      branchName: this.branch_name,
      creator: this.creator,
      status: this.status,
      hasRepository: this.has_repository,
      hasDocumentation: this.has_documentation,
      createdAt: this.created_at,
      updatedAt: this.updated_at
    };
  }
}

module.exports = Project;