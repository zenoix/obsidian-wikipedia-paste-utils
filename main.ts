import { MarkdownView, Plugin } from "obsidian";

const WIKIPEDIA_LINK_SELECTOR = 'a[href*=".wikipedia.org/wiki/"]';
const WIKIPEDIA_CITATION_SELECTOR = 'sup.reference[id^="cite_ref"]';
const WIKIPEDIA_INLINE_LATEX_SELECTOR = "body span.mwe-math-element-inline";
const WIKIPEDIA_SPAN_BLOCK_LATEX_MATH_SELECTOR =
	"body span.mwe-math-element-block";
const WIKIPEDIA_DL_BLOCK_LATEX_MATH_SELECTOR =
	"body > dl span.mwe-math-element-inline math";

const WIKIPEDIA_LATEX_EXTRACT = /\{\\displaystyle (.*) ?\}/;

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

				replaceWikipediaLinks(toPasteHTML);
				removeCitations(toPasteHTML);
				replaceInlineLatex(toPasteHTML);
				replaceBlockLatex(toPasteHTML);

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

	console.log(matches);
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
