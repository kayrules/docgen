const express = require('express');
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// Helper function to generate camelCase sidebar ID from project slug
function generateSidebarId(projectSlug) {
  return projectSlug
    .split('-')
    .map((word, index) => index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1))
    .join('') + 'Sidebar';
}

// Helper function to generate project slug from title
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-/, '')
    .replace(/-$/, '');
}

// Helper function to update Docusaurus config
async function updateDocusaurusConfig(projectTitle) {
  const projectSlug = generateSlug(projectTitle);
  const sidebarId = generateSidebarId(projectSlug);
  const configPath = path.join(__dirname, '../../docupilot/docusaurus.config.js');
  
  // Create backup before making changes
  const backupPath = path.join(__dirname, '../../docupilot/docusaurus.config.backup.js');
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const timestampedBackupPath = path.join(__dirname, `../../docupilot/docusaurus.config.${timestamp}.backup.js`);
  
  // Check if config file exists
  if (!fs.existsSync(configPath)) {
    throw new Error(`Config file not found at: ${configPath}`);
  }
  
  // Read current config
  const configContent = fs.readFileSync(configPath, 'utf8');
  
  // Create backup with timestamp
  fs.writeFileSync(timestampedBackupPath, configContent, 'utf8');
  console.log(`Config backup created: ${timestampedBackupPath}`);
  
  // Check if plugin already exists
  if (configContent.includes(`id: '${projectSlug}'`)) {
    console.log(`Plugin for ${projectSlug} already exists in config`);
    return;
  }
  
  // Add plugin configuration
  const pluginConfig = `    [
      '@docusaurus/plugin-content-docs',
      {
        id: '${projectSlug}',
        path: '${projectSlug}',
        routeBasePath: '${projectSlug}',
        sidebarPath: './${projectSlug}/sidebars.js',
        editUrl: 'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
      },
    ],`;
  
  // Add sidebar item to navbar
  const sidebarItem = `              {
                type: 'docSidebar',
                sidebarId: '${sidebarId}',
                label: '${projectTitle}',
                docsPluginId: '${projectSlug}',
              },`;
  
  let updatedConfig = configContent;
  
  // Insert plugin configuration before the closing bracket of plugins array
  const pluginsMatch = updatedConfig.match(/(plugins:\s*\[)([\s\S]*?)(\],)/);
  if (pluginsMatch) {
    let pluginsContent = pluginsMatch[2];
    
    // Build new plugins array content with proper formatting
    let newPluginsContent;
    if (pluginsContent.trim() === '') {
      // Empty plugins array - add first plugin
      newPluginsContent = '\n    ' + pluginConfig.replace(/^    /, '') + '\n  ';
    } else {
      // Has existing plugins - add comma and new plugin
      // Remove trailing whitespace and add comma + new plugin
      const cleanContent = pluginsContent.replace(/\s+$/, '');
      newPluginsContent = cleanContent + ',\n    ' + pluginConfig.replace(/^    /, '') + '\n  ';
    }
    
    updatedConfig = updatedConfig.replace(
      pluginsMatch[0],
      pluginsMatch[1] + newPluginsContent + pluginsMatch[3]
    );
  }
  
  // Insert sidebar item in the navbar dropdown items array
  // Look for the Projects dropdown specifically - more flexible regex
  const navbarItemsMatch = updatedConfig.match(/(type:\s*'dropdown',\s*[\s\S]*?label:\s*'Projects',\s*[\s\S]*?items:\s*\[)([\s\S]*?)(\n\s*\]\s*\n\s*\})/);
  if (navbarItemsMatch) {
    let navbarItemsContent = navbarItemsMatch[2];
    
    // Build new navbar items content with proper formatting
    let newNavbarContent;
    if (navbarItemsContent.trim() === '') {
      // Empty items array - add first item
      newNavbarContent = '\n              ' + sidebarItem.replace(/^              /, '') + '\n            ';
    } else {
      // Has existing items - add comma and new item
      // Remove trailing whitespace and add comma + new item
      const cleanContent = navbarItemsContent.replace(/\s+$/, '');
      newNavbarContent = cleanContent + ',\n              ' + sidebarItem.replace(/^              /, '') + '\n            ';
    }
    
    updatedConfig = updatedConfig.replace(
      navbarItemsMatch[0],
      navbarItemsMatch[1] + newNavbarContent + navbarItemsMatch[3]
    );
  }
  
  // Write updated config
  fs.writeFileSync(configPath, updatedConfig, 'utf8');
  
  // Create sidebar file for the project
  const sidebarPath = path.join(__dirname, `../../docupilot/${projectSlug}/sidebars.js`);
  const sidebarDir = path.dirname(sidebarPath);
  
  // Ensure directory exists
  if (!fs.existsSync(sidebarDir)) {
    fs.mkdirSync(sidebarDir, { recursive: true });
  }
  
  const sidebarContent = `// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  ${sidebarId}: [
    {
      type: 'doc',
      id: 'intro',
      label: 'Introduction'
    },
    {
      type: 'autogenerated',
      dirName: '.',
    },
  ],
};

export default sidebars;
`;
  
  fs.writeFileSync(sidebarPath, sidebarContent, 'utf8');
}

// Helper function to remove project from Docusaurus config
async function removeFromDocusaurusConfig(projectSlug) {
  const configPath = path.join(__dirname, '../../docupilot/docusaurus.config.js');
  
  if (!fs.existsSync(configPath)) {
    throw new Error(`Config file not found at: ${configPath}`);
  }
  
  // Create backup before making changes
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const timestampedBackupPath = path.join(__dirname, `../../docupilot/docusaurus.config.${timestamp}.backup.js`);
  
  const configContent = fs.readFileSync(configPath, 'utf8');
  fs.writeFileSync(timestampedBackupPath, configContent, 'utf8');
  console.log(`Config backup created: ${timestampedBackupPath}`);
  
  let updatedConfig = configContent;
  
  // Remove plugin configuration - use a more precise approach
  // First find the plugins array
  const pluginsMatch = updatedConfig.match(/(plugins:\s*\[)([\s\S]*?)(\],\s*\n\s*themeConfig)/);
  if (pluginsMatch) {
    let pluginsContent = pluginsMatch[2];
    
    // Split into individual plugin blocks and filter out the target
    const pluginBlocks = [];
    let currentBlock = '';
    let bracketCount = 0;
    let inPlugin = false;
    
    const lines = pluginsContent.split('\n');
    for (let line of lines) {
      // Check if this line starts a new plugin block
      if (line.trim().startsWith('[') && line.includes('@docusaurus/plugin-content-docs')) {
        if (currentBlock.trim() && !currentBlock.includes(`id: '${projectSlug}'`)) {
          pluginBlocks.push(currentBlock);
        }
        currentBlock = line + '\n';
        inPlugin = true;
        bracketCount = 1;
      } else if (inPlugin) {
        currentBlock += line + '\n';
        // Count brackets to know when plugin block ends
        bracketCount += (line.match(/\[/g) || []).length;
        bracketCount -= (line.match(/\]/g) || []).length;
        
        if (bracketCount === 0) {
          // Plugin block is complete
          if (!currentBlock.includes(`id: '${projectSlug}'`)) {
            pluginBlocks.push(currentBlock.replace(/,\s*$/, ''));
          }
          currentBlock = '';
          inPlugin = false;
        }
      } else {
        // Line outside plugin blocks (whitespace, comments)
        if (currentBlock === '' && line.trim() === '') {
          // Skip empty lines between plugins
        } else {
          currentBlock += line + '\n';
        }
      }
    }
    
    // Handle the last block if it doesn't end the plugin array
    if (currentBlock.trim() && !currentBlock.includes(`id: '${projectSlug}'`)) {
      pluginBlocks.push(currentBlock);
    }
    
    // Reconstruct the plugins array
    let newPluginsContent = pluginBlocks.join(',\n').replace(/,\s*$/, '');
    if (newPluginsContent.trim() === '') {
      newPluginsContent = '\n  ';
    } else {
      newPluginsContent = '\n' + newPluginsContent + '\n  ';
    }
    
    updatedConfig = updatedConfig.replace(
      pluginsMatch[0],
      pluginsMatch[1] + newPluginsContent + pluginsMatch[3]
    );
  }
  
  // Remove sidebar item from navbar
  const sidebarId = generateSidebarId(projectSlug);
  const sidebarItemRegex = new RegExp(`\\s*\\{\\s*type:\\s*'docSidebar',\\s*sidebarId:\\s*'${sidebarId}'[\\s\\S]*?\\},?`, 'g');
  updatedConfig = updatedConfig.replace(sidebarItemRegex, '');
  
  // Clean up any double commas or trailing commas - be more specific and safe
  updatedConfig = updatedConfig.replace(/,(\s*,)+/g, ',');
  
  // Fix empty plugins array if all plugins were removed
  updatedConfig = updatedConfig.replace(/plugins:\s*\[\s*\]/g, 'plugins: []');
  
  // Remove trailing commas in specific contexts only
  // 1. Before closing ] in plugins array when it's followed by themeConfig
  updatedConfig = updatedConfig.replace(/,(\s*\],\s*\n\s*themeConfig)/g, '$1');
  
  // 2. Before closing ] in navbar items array
  updatedConfig = updatedConfig.replace(/,(\s*\]\s*\n\s*\}\s*,\s*\n\s*\{.*?to:\s*'\/blog')/g, '$1');
  
  fs.writeFileSync(configPath, updatedConfig, 'utf8');
  console.log(`Removed ${projectSlug} from Docusaurus config`);
  
  // Remove sidebar file
  const sidebarPath = path.join(__dirname, `../../docupilot/${projectSlug}/sidebars.js`);
  if (fs.existsSync(sidebarPath)) {
    fs.unlinkSync(sidebarPath);
  }
  
  // Remove project directory if empty
  const projectDir = path.join(__dirname, `../../docupilot/${projectSlug}`);
  if (fs.existsSync(projectDir)) {
    try {
      fs.rmdirSync(projectDir);
    } catch (e) {
      // Directory not empty, leave it
    }
  }
}

// Create new project
router.post('/create-project', async (req, res) => {
  try {
    const { projectTitle, repositoryUrl, branchName, description } = req.body;

    // Validate required fields
    if (!projectTitle || !repositoryUrl) {
      return res.status(400).json({ 
        success: false,
        message: 'Project title and repository URL are required' 
      });
    }

    // Validate repository URL format (HTTP/HTTPS/SSH)
    const httpPattern = /^https?:\/\/.+/;
    const sshPattern = /^(git@[^:]+:.+|ssh:\/\/git@.+)/; // Support both git@host:user/repo and ssh://git@host/path/repo formats
    
    if (!httpPattern.test(repositoryUrl) && !sshPattern.test(repositoryUrl)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid repository URL (http://, https://, git@host:user/repo.git, or ssh://git@host/path/repo.git)'
      });
    }

    // Path to the initialization script (now in backend/scripts)
    const scriptPath = path.join(__dirname, '../scripts/initialize-project.sh');
    
    // Build command string with proper escaping
    const escapedArgs = [
      `"${projectTitle.replace(/"/g, '\\"')}"`,
      `"${repositoryUrl.replace(/"/g, '\\"')}"`,
      branchName || 'master',
      description ? `"${description.replace(/"/g, '\\"')}"` : `"Brief description of ${projectTitle}"`
    ];

    const command = `bash "${scriptPath}" ${escapedArgs.join(' ')}`;
    
    console.log(`[${new Date().toISOString()}] Executing: ${command}`);
    
    const output = execSync(command, { 
      encoding: 'utf-8',
      cwd: path.join(__dirname, '..'), // Set working directory to backend root
      timeout: 120000, // 2 minute timeout
      maxBuffer: 1024 * 1024, // 1MB buffer for output
      shell: true // Use shell to execute the command
    });

    console.log(`[${new Date().toISOString()}] Script output:`, output);
    console.log(`[${new Date().toISOString()}] Project created successfully: ${projectTitle}`);
    
    // Update Docusaurus config after successful project creation
    try {
      await updateDocusaurusConfig(projectTitle);
      console.log(`[${new Date().toISOString()}] Updated Docusaurus config for: ${projectTitle}`);
    } catch (configError) {
      console.error(`[${new Date().toISOString()}] Warning: Failed to update Docusaurus config:`, configError.message);
      // Don't fail the entire operation if config update fails
    }

    return res.status(200).json({
      success: true,
      message: 'Project created successfully',
      data: {
        projectTitle,
        repositoryUrl,
        branchName: branchName || 'master',
        description: description || `Brief description of ${projectTitle}`
      },
      output: output ? output.toString().trim() : ''
    });

  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error creating project:`, error);
    console.error(`[${new Date().toISOString()}] Error stdout:`, error.stdout?.toString());
    console.error(`[${new Date().toISOString()}] Error stderr:`, error.stderr?.toString());
    
    // Parse error message for better user feedback
    let errorMessage = 'Failed to create project';
    let statusCode = 500;
    
    const stdout = error.stdout?.toString() || '';
    const stderr = error.stderr?.toString() || '';
    
    if (stdout.includes('Project workspace already exists')) {
      errorMessage = 'A project with this title already exists. Please choose a different project title or delete the existing project first.';
      statusCode = 409; // Conflict
    } else if (stderr.includes('not a valid repository name') || stderr.includes('fatal: remote error')) {
      errorMessage = 'Invalid repository URL. Please check that the repository exists and you have access to it.';
      statusCode = 400; // Bad Request
    } else if (error.message.includes('git clone') || stderr.includes('Cloning into')) {
      errorMessage = 'Failed to clone repository. Please check the repository URL and branch name.';
      statusCode = 400;
    } else if (error.message.includes('Permission denied')) {
      errorMessage = 'Permission denied. Please check file permissions or repository access.';
      statusCode = 403;
    } else if (error.message.includes('timeout')) {
      errorMessage = 'Operation timed out. The repository might be too large or network is slow.';
      statusCode = 408;
    } else if (stdout) {
      // Use stdout message if available (script error messages)
      errorMessage = stdout.trim();
    } else if (stderr) {
      errorMessage = stderr.trim();
    }
    
    return res.status(statusCode).json({
      success: false,
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      stdout: process.env.NODE_ENV === 'development' ? stdout : undefined,
      stderr: process.env.NODE_ENV === 'development' ? stderr : undefined
    });
  }
});

// Get project status/info
router.get('/projects', (req, res) => {
  try {
    const repositoriesPath = path.join(__dirname, '../../repositories');
    const docupilotPath = path.join(__dirname, '../../docupilot');
    
    if (!fs.existsSync(repositoriesPath)) {
      return res.json({
        success: true,
        message: 'No projects found',
        projects: []
      });
    }
    
    const projects = [];
    const projectDirs = fs.readdirSync(repositoriesPath).filter(dir => {
      const fullPath = path.join(repositoriesPath, dir);
      return fs.statSync(fullPath).isDirectory();
    });
    
    for (const projectSlug of projectDirs) {
      const repoPath = path.join(repositoriesPath, projectSlug);
      const docPath = path.join(docupilotPath, projectSlug);
      
      // Try to get project info
      let projectInfo = {
        slug: projectSlug,
        title: projectSlug.split('-').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' '),
        hasRepository: fs.existsSync(repoPath),
        hasDocumentation: fs.existsSync(docPath),
        createdAt: fs.statSync(repoPath).birthtime
      };
      
      // Try to get git info
      try {
        const gitConfigPath = path.join(repoPath, '.git', 'config');
        if (fs.existsSync(gitConfigPath)) {
          const gitConfig = fs.readFileSync(gitConfigPath, 'utf8');
          const urlMatch = gitConfig.match(/url = (.+)/);
          if (urlMatch) {
            projectInfo.repositoryUrl = urlMatch[1];
          }
        }
      } catch (gitError) {
        // Git info not available
      }
      
      projects.push(projectInfo);
    }
    
    // Sort by creation date (newest first)
    projects.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    res.json({
      success: true,
      projects: projects
    });
    
  } catch (error) {
    console.error('Error listing projects:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to list projects',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Delete project
router.delete('/projects/:projectSlug', async (req, res) => {
  try {
    const { projectSlug } = req.params;
    
    if (!projectSlug) {
      return res.status(400).json({
        success: false,
        message: 'Project slug is required'
      });
    }
    
    const repositoriesPath = path.join(__dirname, '../../repositories');
    const docupilotPath = path.join(__dirname, '../../docupilot');
    const repoPath = path.join(repositoriesPath, projectSlug);
    const docPath = path.join(docupilotPath, projectSlug);
    
    // Check if project exists
    if (!fs.existsSync(repoPath) && !fs.existsSync(docPath)) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }
    
    // Create backup before deletion
    const backupsPath = path.join(__dirname, '../../backups');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupDir = path.join(backupsPath, `${projectSlug}_deleted_${timestamp}`);
    
    fs.mkdirSync(backupDir, { recursive: true });
    
    // Backup repository if exists
    if (fs.existsSync(repoPath)) {
      const backupRepoPath = path.join(backupDir, 'repository');
      fs.renameSync(repoPath, backupRepoPath);
    }
    
    // Backup documentation if exists
    if (fs.existsSync(docPath)) {
      const backupDocPath = path.join(backupDir, 'documentation');
      fs.renameSync(docPath, backupDocPath);
    }
    
    // Remove from Docusaurus config
    try {
      await removeFromDocusaurusConfig(projectSlug);
    } catch (configError) {
      console.warn('Failed to remove from Docusaurus config:', configError.message);
      // Don't fail the deletion if config update fails
    }
    
    res.json({
      success: true,
      message: 'Project deleted successfully',
      backup: backupDir
    });
    
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete project',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;