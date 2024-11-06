import * as vscode from 'vscode';

let startTime: number = 0;
let totalTime: number = 0;
let timerInterval: NodeJS.Timeout | null = null;

function formatTime(timeInMilliseconds: number): string {
    const minutes = Math.floor(timeInMilliseconds / 60000);
    const seconds = Math.floor((timeInMilliseconds % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
}

export function activate(context: vscode.ExtensionContext) {
    totalTime = context.globalState.get<number>('totalTime') || 0;

    const timeStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    timeStatusBarItem.text = `Time Spent: ${formatTime(totalTime)}`;
    timeStatusBarItem.show();

    startTime = Date.now() - totalTime;

    timerInterval = setInterval(() => {
        totalTime = Date.now() - startTime;
        timeStatusBarItem.text = `Time Spent: ${formatTime(totalTime)}`;
        context.globalState.update('totalTime', totalTime);
    }, 1000);

    context.subscriptions.push({
        dispose: () => {
            if (timerInterval) {
                clearInterval(timerInterval);
            }
        }
    });
}

export function deactivate() {
    if (timerInterval) {
        clearInterval(timerInterval);
    }
}
