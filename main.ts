import {
	MarkdownView,
	Plugin,
} from "obsidian";

export default class WikipediaLatexPastePlugin extends Plugin {
	async onload() {
		console.log("plugin started");

		this.registerEvent(
			this.app.workspace.on("editor-paste", (evt) => {
				if (evt.defaultPrevented) { return }

				console.log("paste detected");

				let pasted = evt.clipboardData?.getData("text")

				if (pasted == null || pasted.length == 0) { return }

				const view = this.app.workspace.getActiveViewOfType(MarkdownView);

				// Make sure the user is editing a Markdown file.
				if (view) {
					const modifiedPasted = replaceWikipediaLatex(pasted)
					console.log(`original text: ${pasted}, modified text: ${modifiedPasted}`)

					view.editor.replaceSelection(modifiedPasted);

					evt.preventDefault()

				}
			})
		);
	}

	onunload() {
		console.log("plugin ended");
	}
}

function replaceWikipediaLatex(text: string): string {
	return ""
}

