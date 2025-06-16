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

	protected parseArgs(args: any[]): string[] {
		let output = [];
		for (const arg of args) {
			switch (typeof arg) {
				case "string":
					output.push(arg);
					break;

				case "object":
					if (arg instanceof Document) {
						output.push(arg.documentElement.innerHTML);
					} else {
						output.push(JSON.stringify(arg));
					}
					break;

				default:
					output.push(arg.toString());
			}
		}
		return output;
	}

	protected formatLog(level: LogLevelStrings, args: any[]): string {
		const parsedArgs = this.parseArgs(args);
		return `${new Date().toISOString()} ${level} ${parsedArgs.join(" ")}`;
	}

	debugLog(...args: any[]): void {
		if (!this.plugin.settings.debugMode) {
			return;
		}
		const logMessage = this.formatLog("DEBUG", args);
		console.log(logMessage);
	}
}
