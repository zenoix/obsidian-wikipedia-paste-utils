import { extractLatexFromAltText, parseUnicodeToLatex } from "src/utils";

const MWL_MATH_ELEMENT_INLINE_SELECTOR = "body span.mwe-math-element-inline";
const TEXHTML_SPAM_SELECTOR = "body span.texhtml";

export function doesDocumentHaveInlineLatex(document: Document): boolean {
	const inlineLatexCount =
		document.querySelectorAll(MWL_MATH_ELEMENT_INLINE_SELECTOR).length +
		document.querySelectorAll(TEXHTML_SPAM_SELECTOR).length;
	return inlineLatexCount > 0;
}

export function replaceInlineLatex(document: Document): void {
	for (const inlineLatexContainingSpan of document.querySelectorAll(
		MWL_MATH_ELEMENT_INLINE_SELECTOR,
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

	// TODO: Sup and sub tags
	for (const inlineLatexContainingSpan of document.querySelectorAll(
		TEXHTML_SPAM_SELECTOR,
	)) {
		const text = inlineLatexContainingSpan.textContent;
		if (text == null) {
			continue;
		}

		let latex = "";

		for (const char of text) {
			latex += parseUnicodeToLatex(char);
		}

		inlineLatexContainingSpan.replaceWith(`$${latex}$`);
	}
}
