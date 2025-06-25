const WIKIPEDIA_CITATION_SELECTOR = 'sup.reference[id^="cite_ref"]';

export enum KeptCitationPasteMethod {
	KeepLink = "Keep link",
	RemoveLink = "Remove link",
}

export function doesDocumentHaveCitations(document: Document): boolean {
	return document.querySelectorAll(WIKIPEDIA_CITATION_SELECTOR).length > 0;
}

export function removeCitations(document: Document): void {
	for (const citation of document.querySelectorAll(
		WIKIPEDIA_CITATION_SELECTOR,
	)) {
		citation.remove();
	}
}

export function keepCitations(
	document: Document,
	keptCitationPasteMethod: string,
): void {
	document
		.querySelectorAll(WIKIPEDIA_CITATION_SELECTOR)
		.forEach((citation) => {
			// Get the square brackets and the citation number
			let output = citation.textContent || "";

			if (keptCitationPasteMethod == KeptCitationPasteMethod.KeepLink) {
				// Turn the citation number into a link that goes to the target of the citation
				output =
					"[" +
					output +
					`(${citation.querySelector("a")?.getAttribute("href")})]`;
			}

			citation.replaceWith(output);
		});
}
