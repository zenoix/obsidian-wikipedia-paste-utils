import { MarkdownView, Plugin } from "obsidian";

import {
    doesDocumentHaveCitations,
    removeCitations,
    keepCitations,
} from "./wikipediaElements/citationElements";
import {
    doesDocumentHaveInlineLatex,
    replaceInlineLatex,
} from "./wikipediaElements/inlineLatexElements";
import {
    doesDocumentHaveBlockLatex,
    replaceBlockLatex,
} from "./wikipediaElements/blockLatexElements";
import {
    doesDocumentHaveWikipediaLinks,
    replaceWikipediaLinks,
} from "./wikipediaElements/linkElements";
import { translateBoldElements } from "./wikipediaElements/boldElements";

import {
    DEFAULT_SETTINGS,
    WikipediaPastePluginSettingTab,
    WikipediaPastePluginSettings,
} from "./settings";

import { Logger } from "./utils";

export default class WikipediaPastePlugin extends Plugin {
    settings: WikipediaPastePluginSettings;
    logger = new Logger(this);
    parser = new DOMParser();

    async onload() {
        await this.loadSettings();
        this.addSettingTab(new WikipediaPastePluginSettingTab(this.app, this));

        const logger = this.logger;
        logger.debugLog("plugin started");

        this.registerEvent(
            this.app.workspace.on("editor-paste", (evt) => {
                if (evt.defaultPrevented) {
                    return;
                }

                const view =
                    this.app.workspace.getActiveViewOfType(MarkdownView);

                // Make sure the user is editing a Markdown file.
                if (!view) {
                    return;
                }

                const pastedPlain = evt.clipboardData?.getData("text/plain");

                // Wikipedia stores html data when copying
                const pastedHTML = evt.clipboardData?.getData("text/html");

                // Check if the paste only contains plain text
                if (pastedHTML == null || pastedHTML?.length == 0) {
                    logger.debugLog(`non-html paste detected: ${pastedPlain}`);
                    return;
                }

                logger.debugLog(`raw paste:\n`, pastedHTML);

                let toPasteHTML = this.parser.parseFromString(
                    pastedHTML,
                    "text/html",
                );

                logger.debugLog(`before HTML:\n`, toPasteHTML);

                if (!doesDocumentContainWikipediaElements(toPasteHTML)) {
                    logger.debugLog(
                        "no wikipedia elements found in pasted text - pasting as is",
                    );
                    return;
                }

                if (this.settings.enableLinkTranslating) {
                    replaceWikipediaLinks(toPasteHTML);
                }

                if (this.settings.enableCitationRemoval) {
                    removeCitations(toPasteHTML);
                } else {
                    console.log(this.settings.keptCitationPasteMethod);
                    keepCitations(
                        toPasteHTML,
                        this.settings.keptCitationPasteMethod,
                    );
                }

                if (this.settings.enableBoldTranslating) {
                    translateBoldElements(toPasteHTML);
                }

                replaceInlineLatex(toPasteHTML);
                replaceBlockLatex(toPasteHTML);

                logger.debugLog("after HTML:\n", toPasteHTML);

                view.editor.replaceSelection(
                    toPasteHTML.body.textContent || "",
                );

                evt.preventDefault();
            }),
        );
    }

    onunload() {
        this.logger.debugLog("plugin ended");
    }

    async loadSettings() {
        this.settings = Object.assign(
            {},
            DEFAULT_SETTINGS,
            await this.loadData(),
        );
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }
}

function doesDocumentContainWikipediaElements(document: Document): boolean {
    const wikipediaElementCheckers = [
        doesDocumentHaveWikipediaLinks,
        doesDocumentHaveCitations,
        doesDocumentHaveInlineLatex,
        doesDocumentHaveBlockLatex,
    ];

    for (let i = 0; i < wikipediaElementCheckers.length; i++) {
        if (wikipediaElementCheckers[i](document)) {
            return true;
        }
    }
    return false;
}
