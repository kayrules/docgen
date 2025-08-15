// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import { themes as prismThemes } from 'prism-react-renderer';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'DocuPilot',
  tagline: 'Documentations are cool',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://your-docusaurus-site.example.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'facebook', // Usually your GitHub org/user name.
  projectName: 'docusaurus', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en']
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          // Default docs instance - keep existing tutorial docs
          sidebarPath: './docs/sidebars.js',
          routeBasePath: 'tutorials',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/'
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn'
        },
        theme: {
          customCss: './src/css/custom.css'
        }
      })
    ]
  ],

  plugins: [[
    '@docusaurus/plugin-content-docs',
    {
      id: 'tesla-rhbme',
      path: 'tesla-rhbme',
      routeBasePath: 'tesla-rhbme',
      sidebarPath: './tesla-rhbme/sidebars.js',
    },
  ], [
    '@docusaurus/plugin-content-docs',
    {
      id: 'ubeda-afb',
      path: 'ubeda-afb',
      routeBasePath: 'ubeda-afb',
      sidebarPath: './ubeda-afb/sidebars.js',
    },
  ]],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      navbar: {
        title: 'DocuPilot',
        logo: {
          alt: 'DocuPilot Logo',
          src: 'img/logo docupilot.png'
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            label: 'Tutorials',
            position: 'left'
          },
          { to: '/blog', label: 'Blog', position: 'left' },
          {
            type: 'dropdown',
            label: 'Projects',
            position: 'left',
            items: [
              {
                type: 'docSidebar',
                sidebarId: 'teslaRhbmeSidebar',
                label: 'Tesla RHBme',
                docsPluginId: 'tesla-rhbme',
              },
              {
                type: 'docSidebar',
                sidebarId: 'ubedaAfbSidebar',
                label: 'UBEDA AFB',
                docsPluginId: 'ubeda-afb',
              }
            ]
          },
          {
            to: '/projects',
            label: 'Manage Projects',
            position: 'right'
          },
          {
            href: 'https://github.com/facebook/docusaurus',
            label: 'GitHub',
            position: 'right'
          }
        ]
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Documentation',
            items: [
              {
                label: 'Home',
                to: '/'
              },
              {
                label: 'Tutorials',
                to: '/tutorials/intro'
              },
              {
                label: 'New Project',
                to: '/new-project'
              }

            ]
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Stack Overflow',
                href: 'https://stackoverflow.com/questions/tagged/docusaurus'
              },
              {
                label: 'Discord',
                href: 'https://discordapp.com/invite/docusaurus'
              },
              {
                label: 'X',
                href: 'https://x.com/docusaurus'
              }
            ]
          },
          {
            title: 'More',
            items: [
              {
                label: 'Blog',
                to: '/blog'
              },
              {
                label: 'GitHub',
                href: 'https://github.com/facebook/docusaurus'
              }
            ]
          }
        ],
        copyright: `Copyright © ${new Date().getFullYear()} My Project, Inc. Built with Docusaurus.`
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula
      }
    }),

  scripts: [
    {
      src: "https://cdn.jsdelivr.net/npm/@n8n/chat/dist/chat.bundle.es.js",
      type: "module",
    },
    {
      src: "/js/n8n-chat-init.js",
      type: "module",
    },
  ],

};

export default config;
