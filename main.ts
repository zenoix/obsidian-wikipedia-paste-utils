import { MarkdownView, Plugin } from "obsidian";

const WIKIPEDIA_LINK_SELECTOR = 'a[href*=".wikipedia.org/wiki/"]';
const WIKIPEDIA_CITATION_SELECTOR = 'sup.reference[id^="cite_ref"]';

export default class WikipediaLatexPastePlugin extends Plugin {
	parser = new DOMParser();

	async onload() {
		console.log("plugin started");

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
					console.log(`non-html paste detected: ${pastedPlain}`);
					return;
				}

				let toPasteHTML = this.parser.parseFromString(
					pastedHTML,
					"text/html",
				);

				console.log(`before HTML:\n`, toPasteHTML);

				if (!doesDocumentContainWikipediaElements(toPasteHTML)) {
					console.log(
						"no wikipedia elements found in pasted text - pasting as is",
					);
					return;
				}

				toPasteHTML = replaceWikipediaLinks(toPasteHTML);
				toPasteHTML = removeCitations(toPasteHTML);

				console.log("after HTML:\n", toPasteHTML);

				view.editor.replaceSelection(toPasteHTML.body.getText());

				evt.preventDefault();
			}),
		);
	}

	onunload() {
		console.log("plugin ended");
	}
}

function doesDocumentContainWikipediaElements(document: Document): boolean {
	const wikipediaElementCheckers = [
		doesDocumentHaveWikipediaLinks,
		doesDocumentHaveCitations,
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

function replaceWikipediaLinks(document: Document): Document {
	for (const link of document.querySelectorAll(WIKIPEDIA_LINK_SELECTOR)) {
		const linkTitle = link.getAttribute("title");
		const linkText = link.getText();
		link.replaceWith(`[[${linkTitle}|${linkText}]]`);
	}

	return document;
}

function doesDocumentHaveCitations(document: Document): boolean {
	return document.querySelectorAll(WIKIPEDIA_CITATION_SELECTOR).length > 0;
}

function removeCitations(document: Document): Document {
	for (const citation of document.querySelectorAll(
		WIKIPEDIA_CITATION_SELECTOR,
	)) {
		citation.remove();
	}
	return document;
}
