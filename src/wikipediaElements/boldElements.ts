const BOLD_SELECTOR = "b";

export function doesDocumentHaveBoldText(document: Document): boolean {
    return document.querySelectorAll(BOLD_SELECTOR).length > 0;
}

export function translateBoldElements(document: Document): void {
    document.querySelectorAll(BOLD_SELECTOR).forEach((boldText) => {
        let output = boldText.textContent || "";

        boldText.replaceWith(`**${output.trim()}**`);
    });
}
