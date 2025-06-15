import WikipediaPastePlugin from "./main";

enum LogLevel {
	ERROR,
	WARN,
	INFO,
	DEBUG,
}

type LogLevelStrings = keyof typeof LogLevel;

export class Logger {
	plugin: WikipediaPastePlugin;

	constructor(plugin: WikipediaPastePlugin) {
		this.plugin = plugin;
	}

	protected formatLog(level: LogLevelStrings, ...args: any[]): string {
		return `${new Date().toISOString()} ${level} ${args.join(" ")}`;
	}

	debugLog(...args: any[]): void {
		if (!this.plugin.settings.debugMode) {
			return;
		}
		const logMessage = this.formatLog("DEBUG", args);
		console.log(logMessage);
	}
}
