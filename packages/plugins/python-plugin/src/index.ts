import {
    CreateNodesContextV2,
    CreateNodesV2,
    TargetConfiguration,
    createNodesFromFiles,
  } from '@nx/devkit';
  import { readdirSync } from 'fs';
  import { dirname, join } from 'path';
  
  // Expected format of the plugin options defined in nx.json
  export interface PythonPluginOptions {
    lintTargetName?: string;
  }
  
  // File glob to find all the configuration files for this plugin
  const pythonConfigGlob = '**/pyproject.toml';
  
  // Entry function that Nx calls to modify the graph
  export const createNodesV2: CreateNodesV2<PythonPluginOptions> = [
    pythonConfigGlob,
    async (configFiles, options, context) => {
      return await createNodesFromFiles(
        (configFile, options, context) =>
          createNodesInternal(configFile, options, context),
        configFiles,
        options,
        context
      );
    },
  ];
  
  async function createNodesInternal(
    configFilePath: string,
    options: PythonPluginOptions,
    context: CreateNodesContextV2
  ) {
    const projectRoot = dirname(configFilePath);
  
    // Verify project.json exists
    const siblingFiles = readdirSync(join(context.workspaceRoot, projectRoot));
    if (!siblingFiles.includes('project.json')) {
      return {};
    }

    const segments = [];
    for (const segment of ['src', 'tests']) {
        if (siblingFiles.includes(segment)) {
            segments.push(`./${segment}`);
        }
    }
    const paths = segments.join(" ")

    // Inferred task final output
    const lintTarget: TargetConfiguration = {
      executor: 'nx:run-commands',
      options: { 
        cwd: projectRoot,
        parallel: false,
      },
      configurations: {
        check: {
          commands: [
            `uv run ruff check --config ../../ruff.toml --preview ${paths}`,
            `uv run ruff format --config ../../ruff.toml --preview --check ${paths}`
          ]
        },
        fix: {
          commands: [
            `uv run ruff check --config ../../ruff.toml --preview --fix ${paths}`,
            `uv run ruff format --config ../../ruff.toml --preview ${paths}`
          ]
        }
      },
      cache: true,
      inputs: [
        '{projectRoot}/pyproject.toml',
        '{projectRoot}/src/**/*',
        '{projectRoot}/tests/**/*',
      ],
      outputs: [
        '{projectRoot}/build',
        '{projectRoot}/dist',
      ],
    };
  
    // Project configuration to be merged into the rest of the Nx configuration
    return {
      projects: {
        [projectRoot]: {
          targets: {
            [options.lintTargetName]: lintTarget,
          },
        },
      },
    };
  }