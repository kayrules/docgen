import React, { useState } from 'react';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

export default function NewProject() {
  const [formData, setFormData] = useState({
    projectTitle: '',
    repositoryUrl: '',
    branchName: 'master',
    description: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Helper function to generate project slug from title
  const generateSlug = (title) => {
    console.log('Generating slug for title:', title);
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-/, '')
      .replace(/-$/, '');
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('http://localhost:3001/api/project', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setMessage('✅ Project created successfully! Redirecting to documentation...');
        // Reset form
        setFormData({
          projectTitle: '',
          repositoryUrl: '',
          branchName: 'master',
          description: ''
        });

        // Generate project slug and redirect to project documentation
        const projectSlug = generateSlug(formData.projectTitle);
        setTimeout(() => {
          window.location.href = `/${projectSlug}`;
        }, 1500); // Give user time to see success message
      } else {
        setMessage(`❌ Error: ${result.message}`);
      }
    } catch (error) {
      console.error('Error creating project:', error);
      setMessage('❌ Failed to create project. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout
      title="New Project"
      description="Create a new project documentation">
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh',
        padding: '2rem'
      }}>
        <div style={{ maxWidth: '600px', width: '100%' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <Heading as="h1">Create New Project</Heading>
            <p style={{ fontSize: '18px', color: 'var(--ifm-color-emphasis-700)' }}>
              Fill in the details below to create a new project documentation.
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{
            backgroundColor: 'var(--ifm-color-emphasis-100)',
            padding: '2rem',
            borderRadius: '8px',
            border: '1px solid var(--ifm-color-emphasis-300)'
          }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label htmlFor="projectTitle" style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: 'bold',
                color: 'var(--ifm-color-emphasis-800)'
              }}>
                Project Title *
              </label>
              <input
                type="text"
                id="projectTitle"
                name="projectTitle"
                value={formData.projectTitle}
                onChange={handleInputChange}
                required
                placeholder="Enter your project title"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '4px',
                  border: '1px solid var(--ifm-color-emphasis-300)',
                  fontSize: '16px',
                  backgroundColor: 'white'
                }}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label htmlFor="repositoryUrl" style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: 'bold',
                color: 'var(--ifm-color-emphasis-800)'
              }}>
                Repository URL *
              </label>
              <input
                type="text"
                id="repositoryUrl"
                name="repositoryUrl"
                value={formData.repositoryUrl}
                onChange={handleInputChange}
                required
                placeholder="https://github.com/username/repository, git@github.com:username/repository.git, or ssh://git@host/path/repo.git"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '4px',
                  border: '1px solid var(--ifm-color-emphasis-300)',
                  fontSize: '16px',
                  backgroundColor: 'white'
                }}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label htmlFor="branchName" style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: 'bold',
                color: 'var(--ifm-color-emphasis-800)'
              }}>
                Branch Name
              </label>
              <input
                type="text"
                id="branchName"
                name="branchName"
                value={formData.branchName}
                onChange={handleInputChange}
                placeholder="main"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '4px',
                  border: '1px solid var(--ifm-color-emphasis-300)',
                  fontSize: '16px',
                  backgroundColor: 'white'
                }}
              />
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label htmlFor="description" style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: 'bold',
                color: 'var(--ifm-color-emphasis-800)'
              }}>
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your project..."
                rows="4"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '4px',
                  border: '1px solid var(--ifm-color-emphasis-300)',
                  fontSize: '16px',
                  backgroundColor: 'white',
                  resize: 'vertical'
                }}
              />
            </div>

            {message && (
              <div style={{
                marginBottom: '1.5rem',
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

            <div style={{ textAlign: 'center' }}>
              <button
                type="submit"
                disabled={isLoading}
                className="button button--primary button--lg"
                style={{
                  padding: '0.75rem 2rem',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  opacity: isLoading ? 0.6 : 1,
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  marginRight: '1rem'
                }}
              >
                {isLoading ? 'Creating Project...' : 'Create Project'}
              </button>
              <a
                href="/projects"
                className="button button--secondary button--lg"
                style={{
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '0.75rem 2rem',
                  fontSize: '18px',
                  fontWeight: 'bold'
                }}
              >
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16" style={{ marginRight: '8px' }}>
                  <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3zM2.5 2a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zm6.5.5A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zM1 10.5A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zm6.5.5A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3z" />
                </svg>
                View Projects
              </a>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}