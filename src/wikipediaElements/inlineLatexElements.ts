import { extractLatexFromAltText } from "src/utils";

const WIKIPEDIA_INLINE_LATEX_SELECTOR = "body span.mwe-math-element-inline";

export function doesDocumentHaveInlineLatex(document: Document): boolean {
	return (
		document.querySelectorAll(WIKIPEDIA_INLINE_LATEX_SELECTOR).length > 0
	);
}

export function replaceInlineLatex(document: Document): void {
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
