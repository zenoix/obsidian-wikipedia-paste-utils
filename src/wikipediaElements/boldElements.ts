const BOLD_SELECTOR = "b";

export function doesDocumentHaveBoldText(document: Document): boolean {
    return document.querySelectorAll(BOLD_SELECTOR).length > 0;
}
