import { MarkdownView, Plugin } from "obsidian";
import {
	DEFAULT_SETTINGS,
	WikipediaPastePluginSettingTab,
	WikipediaPastePluginSettings,
} from "./settings";
import { Logger } from "./utils";

const WIKIPEDIA_LINK_SELECTOR = 'a[href*=".wikipedia.org/wiki/"]';
const WIKIPEDIA_CITATION_SELECTOR = 'sup.reference[id^="cite_ref"]';
const WIKIPEDIA_INLINE_LATEX_SELECTOR = "body span.mwe-math-element-inline";
const WIKIPEDIA_SPAN_BLOCK_LATEX_MATH_SELECTOR =
	"body span.mwe-math-element-block";
const WIKIPEDIA_DL_BLOCK_LATEX_MATH_SELECTOR =
	"body > dl span.mwe-math-element-inline math";

const WIKIPEDIA_LATEX_EXTRACT = /\{\\displaystyle (.*) ?\}/;

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

				replaceWikipediaLinks(toPasteHTML);
				removeCitations(toPasteHTML);
				replaceInlineLatex(toPasteHTML);
				replaceBlockLatex(toPasteHTML);

				logger.debugLog("after HTML:\n", toPasteHTML);

				view.editor.replaceSelection(toPasteHTML.body.getText());

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

function doesDocumentHaveWikipediaLinks(document: Document): boolean {
	return document.querySelectorAll(WIKIPEDIA_LINK_SELECTOR).length > 0;
}

function replaceWikipediaLinks(document: Document): void {
	for (const link of document.querySelectorAll(WIKIPEDIA_LINK_SELECTOR)) {
		const linkTitle = link.getAttribute("title");
		let linkText = link.getText();

		const linkHref = link.getAttribute("href");

		// A '#' in the href means that the link is linking to a header in a page
		if (!linkHref?.includes("#")) {
			link.replaceWith(`[[${linkTitle}|${linkText}]]`);
			return;
		}

		const splitHref = linkHref.split("#");
		const header = splitHref[splitHref.length - 1];
		linkText = linkText.split("#")[0];
		link.replaceWith(`[[${linkTitle}#${header}|${linkText}]]`);
	}
}

function doesDocumentHaveCitations(document: Document): boolean {
	return document.querySelectorAll(WIKIPEDIA_CITATION_SELECTOR).length > 0;
}

function removeCitations(document: Document): void {
	for (const citation of document.querySelectorAll(
		WIKIPEDIA_CITATION_SELECTOR,
	)) {
		citation.remove();
	}
}

function doesDocumentHaveInlineLatex(document: Document): boolean {
	return (
		document.querySelectorAll(WIKIPEDIA_INLINE_LATEX_SELECTOR).length > 0
	);
}

function extractLatexFromAltText(alttext: string): string {
	const matches = alttext.match(WIKIPEDIA_LATEX_EXTRACT);
	if (matches == null) {
		return "";
	}
	return matches[1].trim();
}

function replaceInlineLatex(document: Document): void {
	for (const inlineLatexContainingSpan of document.querySelectorAll(
		WIKIPEDIA_INLINE_LATEX_SELECTOR,
	)) {
		const rawLatex = inlineLatexContainingSpan
			.getElementsByTagName("math")[0]
			.getAttribute("alttext");

		if (rawLatex == null) {
			continue;
		}

		const latex = extractLatexFromAltText(rawLatex);
		inlineLatexContainingSpan.replaceWith(`$${latex}$`);
	}
}

function doesDocumentHaveBlockLatex(document: Document): boolean {
	const numDlBlockLatex = document.querySelectorAll(
		WIKIPEDIA_DL_BLOCK_LATEX_MATH_SELECTOR,
	).length;

	const numSpanBlockLatex = document.querySelectorAll(
		WIKIPEDIA_SPAN_BLOCK_LATEX_MATH_SELECTOR,
	).length;

	return numDlBlockLatex + numSpanBlockLatex > 0;
}

function replaceBlockLatex(document: Document): void {
	for (const dlElement of document.querySelectorAll("dl")) {
		for (const blockLatexMathElement of dlElement.querySelectorAll(
			WIKIPEDIA_DL_BLOCK_LATEX_MATH_SELECTOR,
		)) {
			const rawLatex = blockLatexMathElement.getAttribute("alttext");

			if (rawLatex == null) {
				continue;
			}

			const latex = extractLatexFromAltText(rawLatex);
			dlElement.replaceWith(`$$${latex}$$\n`);
		}
	}

	for (const blockLatexContainingSpan of document.querySelectorAll(
		WIKIPEDIA_SPAN_BLOCK_LATEX_MATH_SELECTOR,
	)) {
		const rawLatex = blockLatexContainingSpan
			.getElementsByTagName("math")[0]
			.getAttribute("alttext");

		if (rawLatex == null) {
			continue;
		}

		const latex = extractLatexFromAltText(rawLatex);
		blockLatexContainingSpan.replaceWith(`$$${latex}$$`);
	}
}
