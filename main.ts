import {
	MarkdownView,
	Plugin,
} from "obsidian";

const WIKIPEDIA_LINK_SELECTOR = 'a,[href*=".wikipedia.org/wiki/"]'
const WIKIPEDIA_CITATION_SELECTOR = 'sup,.reference,[id^="cite_ref"]'

export default class WikipediaLatexPastePlugin extends Plugin {
	parser = new DOMParser()

	async onload() {
		console.log("plugin started");

		this.registerEvent(
			this.app.workspace.on("editor-paste", (evt) => {
				if (evt.defaultPrevented) { return }

				const view = this.app.workspace.getActiveViewOfType(MarkdownView);

				// Make sure the user is editing a Markdown file.
				if (!view) {
					return
				}

				const pastedPlain = evt.clipboardData?.getData("text/plain")

				// Wikipedia stores html data when copying
				const pastedHTML = evt.clipboardData?.getData("text/html")

				// Check if the paste only contains plain text
				if (pastedHTML == null || pastedHTML?.length == 0) {
					console.log(`non-html paste detected: ${pastedPlain}`)
					return
				}

				let toPasteHTML = this.parser.parseFromString(pastedHTML, "text/html")

				console.log(`before HTML:\n`, toPasteHTML)

				if (doesDocumentHaveWikipediaLinks(toPasteHTML)) {
					console.log("has wikipedia link")
					toPasteHTML = replaceWikipediaLinks(toPasteHTML)

				}
				else {
					console.log("does not have wikipedia link")
				}


				if (doesDocumentHaveCitations(toPasteHTML)) {
					console.log("has citations")
					toPasteHTML = removeCitations(toPasteHTML)
				}
				else {
					console.log("does not have citations")
				}

				console.log("after HTML:\n", toPasteHTML)

				view.editor.replaceSelection(toPasteHTML.body.getText());

				evt.preventDefault()

			})
		);
	}

	onunload() {
		console.log("plugin ended");
	}
}

function doesDocumentHaveWikipediaLinks(document: Document): boolean {
	return document.querySelectorAll(WIKIPEDIA_LINK_SELECTOR).length > 0
}

function replaceWikipediaLinks(document: Document): Document {
	for (const link of document.querySelectorAll(WIKIPEDIA_LINK_SELECTOR)) {
		const linkTitle = link.getAttribute("title")
		const linkText = link.getText()
		link.replaceWith(`[[${linkTitle}|${linkText}]]`)
	}

	return document
}

function doesDocumentHaveCitations(document: Document): boolean {
	return document.querySelectorAll(WIKIPEDIA_CITATION_SELECTOR).length > 0
}

function removeCitations(document: Document): Document {
	for (const citation of document.querySelectorAll(WIKIPEDIA_CITATION_SELECTOR)) {
		citation.remove()
	}
	return document
}
