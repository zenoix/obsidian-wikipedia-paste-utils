const WIKIPEDIA_CITATION_SELECTOR = 'sup.reference[id^="cite_ref"]';

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
