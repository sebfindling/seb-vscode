// src/extension.ts
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
  // Create GitHub status bar item
  const githubStatusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    1000
  );
  githubStatusBarItem.command = 'github-link.openRepository';
  githubStatusBarItem.text = "$(github)";
  githubStatusBarItem.tooltip = "Abrir repositorio de GitHub";

  // Create Deployment status bar item
  const deploymentStatusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    1001
  );
  deploymentStatusBarItem.command = 'github-link.openDeployment';
  deploymentStatusBarItem.text = "$(cloud)";
  deploymentStatusBarItem.tooltip = "Abrir URL de deployment";

  //poner juntos
  context.subscriptions.push(githubStatusBarItem);
  context.subscriptions.push(deploymentStatusBarItem);

  // Register GitHub repository command
  let repoDisposable = vscode.commands.registerCommand('github-link.openRepository', () => {
    const packageJson = readPackageJson();
    if (!packageJson) return;

    if (!packageJson.repository) {
      vscode.window.showErrorMessage('No repository field found in package.json');
      return;
    }

    let repoUrl = '';

    if (typeof packageJson.repository === 'string') {
      repoUrl = packageJson.repository;
    } else if (typeof packageJson.repository === 'object' && packageJson.repository.url) {
      repoUrl = packageJson.repository.url;
    }

    if (!repoUrl) {
      vscode.window.showErrorMessage('Invalid repository URL in package.json');
      return;
    }

    // Clean up the URL if it's in SSH format or contains git+https
    repoUrl = repoUrl
      .replace('git+', '')
      .replace('git@github.com:', 'https://github.com/')
      .replace('.git', '');

    vscode.env.openExternal(vscode.Uri.parse(repoUrl));
  });

  // Register Deployment URL command
  let deployDisposable = vscode.commands.registerCommand('github-link.openDeployment', () => {
    const packageJson = readPackageJson();
    if (!packageJson) return;

    if (!packageJson.deployment_url) {
      vscode.window.showErrorMessage('No deployment_url field found in package.json');
      return;
    }

    const deployUrl = packageJson.deployment_url;

    if (typeof deployUrl !== 'string') {
      vscode.window.showErrorMessage('Invalid deployment URL in package.json');
      return;
    }

    vscode.env.openExternal(vscode.Uri.parse(deployUrl));
  });

  // Helper function to read package.json
  function readPackageJson() {
    const workspaceFolders = vscode.workspace.workspaceFolders;

    if (!workspaceFolders) {
      vscode.window.showErrorMessage('No workspace folder found');
      return null;
    }

    const packageJsonPath = path.join(workspaceFolders[0].uri.fsPath, 'package.json');

    try {
      const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf8');
      return JSON.parse(packageJsonContent);
    } catch (error) {
      vscode.window.showErrorMessage('Error reading package.json');
      return null;
    }
  }

  context.subscriptions.push(repoDisposable);
  context.subscriptions.push(deployDisposable);
  githubStatusBarItem.show();
  deploymentStatusBarItem.show();
}

export function deactivate() { }
