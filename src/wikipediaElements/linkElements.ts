const WIKIPEDIA_LINK_SELECTOR = 'body > a[href*=".wikipedia.org/wiki/"]';

export function doesDocumentHaveWikipediaLinks(document: Document): boolean {
	return document.querySelectorAll(WIKIPEDIA_LINK_SELECTOR).length > 0;
}

export function replaceWikipediaLinks(document: Document): void {
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
