import * as vscode from 'vscode';

let startTime: number = 0;
let totalTime: number = 0;
let timerInterval: NodeJS.Timeout | null = null;

function formatTime(timeInMilliseconds: number): string {
    const days = Math.floor(timeInMilliseconds / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeInMilliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeInMilliseconds % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeInMilliseconds % (1000 * 60)) / 1000);

    let formattedTime = '';
    
    if (days > 0) {
        formattedTime += `${days}d `;
    }
    if (hours > 0 || days > 0) {
        formattedTime += `${hours}h `;
    }
    if (minutes > 0 || hours > 0 || days > 0) {
        formattedTime += `${minutes}m `;
    }

    formattedTime += `${seconds}s`;

    return formattedTime;
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
