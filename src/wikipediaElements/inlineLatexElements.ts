import { extractLatexFromAltText, parseUnicodeToLatex } from "src/utils";

const MWL_MATH_ELEMENT_INLINE_SELECTOR = "body > span.mwe-math-element-inline";
const TEXHTML_SPAM_SELECTOR = "body span.texhtml";

export function doesDocumentHaveInlineLatex(document: Document): boolean {
    const inlineLatexCount =
        document.querySelectorAll(MWL_MATH_ELEMENT_INLINE_SELECTOR).length +
        document.querySelectorAll(TEXHTML_SPAM_SELECTOR).length;
    return inlineLatexCount > 0;
}

export function translateSupElements(htmlString: string): string {
    return htmlString.replace(/<sup>/g, "^{").replace(/<\/sup>/g, "}");
}

export function translateSubElements(htmlString: string): string {
    return htmlString.replace(/<sub>/g, "_{").replace(/<\/sub>/g, "}");
}

export function replaceInlineLatex(document: Document): void {
    for (const inlineLatexContainingSpan of document.querySelectorAll(
        MWL_MATH_ELEMENT_INLINE_SELECTOR,
    )) {
        const mathElement =
            inlineLatexContainingSpan.getElementsByTagName("math")[0];

        const rawLatex =
            mathElement != undefined
                ? mathElement.getAttribute("alttext")
                : inlineLatexContainingSpan
                      .getElementsByTagName("img")[0]
                      .getAttribute("alt");

        if (rawLatex == null) {
            continue;
        }

        const latex = extractLatexFromAltText(rawLatex).trim();
        inlineLatexContainingSpan.replaceWith(`$${latex}$`);
    }

    for (const inlineLatexContainingSpan of document.querySelectorAll(
        TEXHTML_SPAM_SELECTOR,
    )) {
        const text = inlineLatexContainingSpan.innerHTML;
        console.log(text);
        if (text == null) {
            continue;
        }

        let latex = "";

        for (const char of text) {
            latex += parseUnicodeToLatex(char);
        }

        latex = translateSupElements(latex);
        latex = translateSubElements(latex);

        inlineLatexContainingSpan.replaceWith(`$${latex}$`);
    }
}
