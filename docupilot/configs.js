const plugins = [
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
            'id': 'try-test-1',
            'path': 'try-test-1',
            'routeBasePath': 'try-test-1',
            'sidebarPath': './try-test-1/sidebars.js'
        }
    ]
];

const navbarItems = [
    {
        'type': 'docSidebar',
        'sidebarId': 'ubedaAfbSidebar',
        'label': 'UBEDA AFB',
        'docsPluginId': 'ubeda-afb'
    },
    {
        'type': 'docSidebar',
        'sidebarId': 'tryTest1Sidebar',
        'label': 'TRY TEST 1',
        'docsPluginId': 'try-test-1'
    }
];

export {
    plugins,
    navbarItems,
}