import { promises as fs } from 'fs';
import * as path from 'path';
import { WorkspaceManifest } from './types';

export async function getWorkspaceManifest(
  workspacePath: string,
): Promise<WorkspaceManifest> {
  let manifestPath = path.resolve(workspacePath, 'package.json');
  let manifestString = await fs.readFile(manifestPath, 'utf8');
  let manifest = JSON.parse(manifestString);

  return manifest;
}
