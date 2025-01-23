import {
  ImplicitDependency,
  DependencyType,
  CreateDependencies,
  CreateDependenciesContext,
  ProjectConfiguration,
  joinPathFragments,
} from '@nx/devkit';

import { readFileSync, existsSync } from 'fs';
import * as toml from '@iarna/toml';

type UVPyprojectToml = {
  project?: {
    name: string;
    version: string;
    dependencies: string[];
  };
  'dependency-groups': {
    [key: string]: string[];
  };
  tool?: {
    hatch?: {
      build?: {
        targets?: {
          wheel?: {
            packages: string[];
          };
        };
      };
      metadata?: {
        'allow-direct-references'?: boolean;
      };
    };
    uv?: {
      sources?: {
        [key: string]: {
          path?: string;
          workspace?: boolean;
          index?: string;
        };
      };
      index?: UVPyprojectTomlIndex[];
      workspace?: {
        members: string[];
      };
    };
  };
};

type UVPyprojectTomlIndex = {
  name: string;
  url: string;
};

export const createDependencies: CreateDependencies = async (
  options,
  context: CreateDependenciesContext
) => {
  const result: ImplicitDependency[] = [];

  for (const project in context.projects) {
    const deps = getDependencies(project, context.projects);

    deps.forEach((dep) => {
      result.push({
        source: project,
        target: dep,
        type: DependencyType.implicit,
      });
    });
  }
  return result;
};

const getDependencies = (
  projectName: string,
  projects: Record<string, ProjectConfiguration>
) => {
  const projectData = projects[projectName];
  const pyprojectToml = joinPathFragments(projectData.root, 'pyproject.toml');

  const deps: string[] = [];

  if (existsSync(pyprojectToml)) {
    const tomlData = getPyprojectData<UVPyprojectToml>(pyprojectToml);

    deps.push(
      ...resolveDependencies(tomlData, tomlData?.project?.dependencies || [])
    );

    for (const group in tomlData['dependency-groups']) {
      deps.push(
        ...resolveDependencies(tomlData, tomlData['dependency-groups'][group])
      );
    }
  }

  return deps;
};

const getPyprojectData = <T>(pyprojectToml: string): T => {
  const content = readFileSync(pyprojectToml).toString('utf-8');
  if (content.trim() === '') return {} as T;

  return toml.parse(readFileSync(pyprojectToml).toString('utf-8')) as T;
};

const resolveDependencies = (
  pyprojectData: UVPyprojectToml,
  dependencies: string[]
) => {
  const deps: string[] = [];
  const sources = pyprojectData.tool?.uv?.sources ?? {};

  for (const dep of dependencies) {
    if (sources[dep]) {
      deps.push(dep);
    }
  }

  return deps;
};
