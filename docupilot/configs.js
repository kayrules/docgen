const plugins = [
    [
        '@docusaurus/plugin-content-docs',
        {
            'id': 'ubeda-mfe',
            'path': 'ubeda-mfe',
            'routeBasePath': 'ubeda-mfe',
            'sidebarPath': './ubeda-mfe/sidebars.js'
        }
    ],
    [
        '@docusaurus/plugin-content-docs',
        {
            'id': 'tesla-rhbme',
            'path': 'tesla-rhbme',
            'routeBasePath': 'tesla-rhbme',
            'sidebarPath': './tesla-rhbme/sidebars.js'
        }
    ],
    [
        '@docusaurus/plugin-content-docs',
        {
            'id': 'ubeda-afb',
            'path': 'ubeda-afb',
            'routeBasePath': 'ubeda-afb',
            'sidebarPath': './ubeda-afb/sidebars.js'
        }
    ],
    [
        '@docusaurus/plugin-content-docs',
        {
            'id': 'try-test-2',
            'path': 'try-test-2',
            'routeBasePath': 'try-test-2',
            'sidebarPath': './try-test-2/sidebars.js'
        }
    ]
];

const navbarItems = [
    {
        'type': 'docSidebar',
        'sidebarId': 'ubedaMfeSidebar',
        'label': 'UBEDA MFE',
        'docsPluginId': 'ubeda-mfe'
    },
    {
        'type': 'docSidebar',
        'sidebarId': 'teslaRhbmeSidebar',
        'label': 'Tesla RHBme',
        'docsPluginId': 'tesla-rhbme'
    },
    {
        'type': 'docSidebar',
        'sidebarId': 'ubedaAfbSidebar',
        'label': 'UBEDA AFB',
        'docsPluginId': 'ubeda-afb'
    },
    {
        'type': 'docSidebar',
        'sidebarId': 'tryTest2Sidebar',
        'label': 'TRY TEST 2',
        'docsPluginId': 'try-test-2'
    }
];

export {
    plugins,
    navbarItems,
}