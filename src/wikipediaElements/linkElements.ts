const WIKIPEDIA_LINK_SELECTOR = 'body a[href*=".wikipedia.org/wiki/"]';

function isAnchorTagWikipediaLink(link: Element): boolean {
	const linkHref = link.getAttribute("href");

	if (
		linkHref === "https://en.wikipedia.org/wiki/Wikipedia:Citation_needed"
	) {
		return false;
	}

	if (!linkHref?.includes("#")) {
		return true;
	}

	const splitHref = linkHref.split("#");
	const header = splitHref[splitHref.length - 1];
	return !header.startsWith("cite_note");
}

export function doesDocumentHaveWikipediaLinks(document: Document): boolean {
	return (
		[...document.querySelectorAll(WIKIPEDIA_LINK_SELECTOR)].filter(
			isAnchorTagWikipediaLink,
		).length > 0
	);
}

export function replaceWikipediaLinks(document: Document): void {
	document.querySelectorAll(WIKIPEDIA_LINK_SELECTOR).forEach((link) => {
		if (!isAnchorTagWikipediaLink(link)) {
			return;
		}

		const linkTitle = link.getAttribute("title");
		let linkText = link.textContent;

		const linkHref = link.getAttribute("href");

		// A '#' in the href means that the link is linking to a header in a page
		if (!linkHref?.includes("#")) {
			if (linkTitle === linkText) {
				link.replaceWith(`[[${linkTitle}]]`);
			} else {
				link.replaceWith(`[[${linkTitle}|${linkText}]]`);
			}
			return;
		}

		const splitHref = linkHref.split("#");
		const header = splitHref[splitHref.length - 1];
		linkText = (linkText || "").split("#")[0];
		link.replaceWith(`[[${linkTitle}#${header}|${linkText}]]`);
	});
}
