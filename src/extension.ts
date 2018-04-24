"use strict";

// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below

import * as vscode from "vscode";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  enum ThemeColor {
    Dark = "Dark",
    Light = "Light"
  }

  // all the themes you can choose
  const themes: string[] = [
    "Default Dark+",
    "Abyss",
    "Default Light+",
    "Visual Studio Dark",
    "Visual Studio Light",
    "Default High Contrast",
    "Kimbie Dark",
    "Monokai",
    "Monokai Dimmed",
    "Quiet Light",
    "Red",
    "Solarized Dark",
    "Solarized Light",
    "Tomorrow Night Blue"
  ];
  const namespace = "workbench";
  const themeField = "colorTheme";
  const isDarkField = "themer.isDark";
  const hasInit = "themer.hasInit";

  const config = vscode.workspace.getConfiguration(namespace);
  const currentTheme: string | void = config.get(themeField);
  const ctx = {
    isDark: currentTheme ? currentTheme.indexOf(ThemeColor.Light) < 0 : true
  };

  vscode.commands.executeCommand("setContext", hasInit, true);
  vscode.commands.executeCommand("setContext", isDarkField, ctx.isDark);

  function toggleColorTheme() {
    const currentConfig = vscode.workspace.getConfiguration(namespace);
    const currentUsingTheme: string | void = currentConfig.get(themeField);
    if (currentUsingTheme) {
      const isDark = currentUsingTheme.indexOf(ThemeColor.Dark) >= 0;
      const isLight = currentUsingTheme.indexOf(ThemeColor.Light) >= 0;
      const isColorFul = isDark || isLight;
      const newTheme: string = isColorFul
        ? isDark
          ? currentUsingTheme.replace(ThemeColor.Dark, ThemeColor.Light)
          : currentUsingTheme.replace(ThemeColor.Light, ThemeColor.Dark)
        : themes[0];
      currentConfig.update(
        themeField,
        newTheme,
        vscode.ConfigurationTarget.Global
      );
      ctx.isDark = !ctx.isDark;
      vscode.commands.executeCommand("setContext", isDarkField, ctx.isDark);
    }
  }

  context.subscriptions.push(
    vscode.commands.registerCommand("themer.turnLight", toggleColorTheme)
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("themer.turnDark", toggleColorTheme)
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("themer.toggle", toggleColorTheme)
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("themer.choose", async () => {
      const currentConfig = vscode.workspace.getConfiguration(namespace);
      const newTheme = await vscode.window.showQuickPick(themes);
      const currentUsingTheme: string | void = currentConfig.get(themeField);
      if (newTheme !== currentUsingTheme) {
        currentConfig.update(
          themeField,
          newTheme,
          vscode.ConfigurationTarget.Global
        );
      }
    })
  );
}

// this method is called when your extension is deactivated
export function deactivate(context: vscode.ExtensionContext) {
  //
}
