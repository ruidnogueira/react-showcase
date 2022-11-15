/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  options: {
    doNotFollow: {
      path: '^node_modules',
    },

    exclude: {
      path: ['.test.(ts|tsx)$', '.stories.tsx$', '.module.scss$'],
    },

    includeOnly: {
      path: ['^src/main.tsx', '^src/app/[^/]+'],
    },

    tsPreCompilationDeps: true,

    tsConfig: {
      fileName: 'tsconfig.json',
    },

    reporterOptions: {
      dot: {
        collapsePattern: [
          '^node_modules/[^/]+',
          '^src/app/(components|core)/[^/]+',
          '^src/app/(api|utils|hooks|types)',
        ],

        theme: {
          graph: {
            splines: 'ortho',
          },
          modules: [
            {
              criteria: { source: '^src/app/components' },
              attributes: { fillcolor: '#fced79' },
            },
            {
              criteria: { source: '^src/app/api' },
              attributes: { fillcolor: '#7e99f2' },
            },
            {
              criteria: { source: '^src/app/core' },
              attributes: { fillcolor: '#89f786' },
            },
            {
              criteria: { source: '^src/app/features' },
              attributes: { fillcolor: '#f27e7e' },
            },
            {
              criteria: { source: '^src/app/(hooks|utils|types)' },
              attributes: { fillcolor: '#9b69ff' },
            },
          ],
          dependencies: [
            {
              criteria: { resolved: '^src/app/components' },
              attributes: { color: '#bfa90677' },
            },
            {
              criteria: { resolved: '^src/app/api' },
              attributes: { color: '#073ceb77' },
            },
            {
              criteria: { resolved: '^src/app/core' },
              attributes: { color: '#09c20477' },
            },
            {
              criteria: { resolved: '^src/app/features' },
              attributes: { color: '#c2040477' },
            },
          ],
        },
      },
    },
  },
};
