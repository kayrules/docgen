import React, { useState, useEffect } from 'react';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [deletingProject, setDeletingProject] = useState(null);
  const [message, setMessage] = useState('');

  // Load projects on component mount and when page becomes visible
  useEffect(() => {
    loadProjects();

    // Refresh when user returns to the tab/page
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadProjects();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const loadProjects = async () => {
    try {
      setLoadingProjects(true);
      // Add timestamp to prevent caching
      const timestamp = new Date().getTime();
      const response = await fetch(`http://localhost:3001/api/project/projects?_t=${timestamp}`, {
        cache: 'no-cache',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      const result = await response.json();
      if (result.success) {
        setProjects(result.projects);
      }
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoadingProjects(false);
    }
  };

  const handleDeleteProject = async (projectSlug) => {
    if (!confirm(`Are you sure you want to delete the project "${projectSlug}"? This will create a backup but remove it from the documentation site.`)) {
      return;
    }

    try {
      setDeletingProject(projectSlug);
      const response = await fetch(`http://localhost:3001/api/project/projects/${projectSlug}`, {
        method: 'DELETE'
      });
      const result = await response.json();

      if (result.success) {
        setMessage('✅ Project deleted successfully!');
        // Reload the project list immediately
        loadProjects();
        // Clear message after 3 seconds
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage(`❌ Error deleting project: ${result.message}`);
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      setMessage('❌ Failed to delete project. Please try again.');
    } finally {
      setDeletingProject(null);
    }
  };

  return (
    <Layout
      title="Projects"
      description="Manage your project documentation">
      <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <Heading as="h1">Projects</Heading>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => loadProjects()}
              className="button button--secondary"
              disabled={loadingProjects}
              style={{ opacity: loadingProjects ? 0.6 : 1 }}
            >
              {loadingProjects ? 'Refreshing...' : '🔄 Refresh'}
            </button>
            <a
              href="/new-project"
              className="button button--primary"
              style={{ textDecoration: 'none' }}
            >
              + Add Project
            </a>
          </div>
        </div>

        {message && (
          <div style={{
            marginBottom: '2rem',
            padding: '1rem',
            borderRadius: '4px',
            backgroundColor: message.includes('✅') ? '#d4edda' : '#f8d7da',
            border: `1px solid ${message.includes('✅') ? '#c3e6cb' : '#f5c6cb'}`,
            color: message.includes('✅') ? '#155724' : '#721c24',
            textAlign: 'center'
          }}>
            {message}
          </div>
        )}

        {loadingProjects ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p>Loading projects...</p>
          </div>
        ) : projects.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', backgroundColor: 'var(--ifm-color-emphasis-100)', borderRadius: '8px' }}>
            <h3 style={{ marginBottom: '1rem' }}>No projects found</h3>
            <p style={{ color: 'var(--ifm-color-emphasis-600)', fontSize: '18px', marginBottom: '2rem' }}>
              Get started by creating your first project!
            </p>
            <a
              href="/new-project"
              className="button button--primary button--lg"
              style={{ textDecoration: 'none' }}
            >
              Create Your First Project
            </a>
          </div>
        ) : (
          <div style={{
            overflow: 'hidden',
            width: '100%'
          }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              backgroundColor: 'white'
            }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa' }}>
                  <th style={{
                    padding: '12px 16px',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#495057',
                    borderBottom: '1px solid #dee2e6'
                  }}>
                    Project Title
                  </th>
                  <th style={{
                    padding: '12px 16px',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#495057',
                    borderBottom: '1px solid #dee2e6'
                  }}>
                    Slug
                  </th>
                  <th style={{
                    padding: '12px 16px',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#495057',
                    borderBottom: '1px solid #dee2e6'
                  }}>
                    Repository URL
                  </th>
                  <th style={{
                    padding: '12px 16px',
                    textAlign: 'center',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#495057',
                    borderBottom: '1px solid #dee2e6',
                    width: '100px'
                  }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr key={project.slug} style={{
                    borderBottom: '1px solid #f1f3f4'
                  }}>
                    <td style={{
                      padding: '12px 16px',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#1976d2'
                    }}>
                      {project.title}
                    </td>
                    <td style={{
                      padding: '12px 16px',
                      fontSize: '13px',
                      fontFamily: 'SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace',
                      color: '#6c757d'
                    }}>
                      {project.slug}
                    </td>
                    <td style={{
                      padding: '12px 16px',
                      fontSize: '13px',
                      color: '#6c757d',
                      wordBreak: 'break-word',
                      maxWidth: '500px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {project.repositoryUrl || '-'}
                    </td>
                    <td style={{
                      padding: '12px 16px',
                      textAlign: 'center'
                    }}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                        <a
                          href={`/${project.slug}`}
                          title="View Documentation"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '28px',
                            height: '28px',
                            borderRadius: '4px',
                            backgroundColor: '#28a745',
                            textDecoration: 'none',
                            transition: 'opacity 0.2s'
                          }}
                        >
                          <svg width="14" height="14" fill="white" viewBox="0 0 16 16">
                            <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" />
                            <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
                          </svg>
                        </a>
                        <button
                          onClick={() => handleDeleteProject(project.slug)}
                          disabled={deletingProject === project.slug}
                          title="Delete Project"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '28px',
                            height: '28px',
                            borderRadius: '4px',
                            backgroundColor: deletingProject === project.slug ? '#6c757d' : '#dc3545',
                            border: 'none',
                            cursor: deletingProject === project.slug ? 'not-allowed' : 'pointer',
                            transition: 'opacity 0.2s'
                          }}
                        >
                          {deletingProject === project.slug ? (
                            <svg width="14" height="14" fill="white" viewBox="0 0 16 16">
                              <path d="M8 3.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9zM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8z" fillOpacity=".5" />
                              <path d="m5.354 4.646-.708.708L7.293 8l-2.647 2.646.708.708L8 8.707l2.646 2.647.708-.708L8.707 8l2.647-2.646-.708-.708L8 7.293 5.354 4.646z" />
                            </svg>
                          ) : (
                            <svg width="14" height="14" fill="white" viewBox="0 0 16 16">
                              <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                              <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
}