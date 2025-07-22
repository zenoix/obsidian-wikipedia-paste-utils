import WikipediaPastePlugin from "./main";
import { UNICODE_LATEX_MAP } from "./unicodeLatexMap";

const WIKIPEDIA_LATEX_EXTRACT = /\{(?:\\displaystyle|\\textstyle) (.*) ?\}/;

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

export function extractLatexFromAltText(alttext: string): string {
    const matches = alttext.match(WIKIPEDIA_LATEX_EXTRACT);
    if (matches == null) {
        return "";
    }
    return matches[1].trim();
}

export function parseUnicodeToLatex(input: string): string {
    const unicodeCodePoint = input.codePointAt(0);
    if (!unicodeCodePoint) {
        return input;
    }

    let hex = unicodeCodePoint.toString(16);
    let unicode;

    switch (hex.length) {
        case 1:
            unicode = "U+000" + hex;
            break;
        case 2:
            unicode = "U+00" + hex;
            break;

        case 3:
            unicode = "U+0" + hex;
            break;

        default:
            unicode = "U+" + hex;
            break;
    }

    return UNICODE_LATEX_MAP.get(unicode.toUpperCase()) || input;
}
