import { extractLatexFromAltText } from "src/utils";

const WIKIPEDIA_SPAN_BLOCK_LATEX_MATH_SELECTOR =
    "body span.mwe-math-element-block";
const WIKIPEDIA_DL_BLOCK_LATEX_MATH_SELECTOR =
    "body > dl span.mwe-math-element-inline math";

export function doesDocumentHaveBlockLatex(document: Document): boolean {
    const numDlBlockLatex = document.querySelectorAll(
        WIKIPEDIA_DL_BLOCK_LATEX_MATH_SELECTOR,
    ).length;

    const numSpanBlockLatex = document.querySelectorAll(
        WIKIPEDIA_SPAN_BLOCK_LATEX_MATH_SELECTOR,
    ).length;

    return numDlBlockLatex + numSpanBlockLatex > 0;
}

export function replaceBlockLatex(document: Document): void {
    for (const dlElement of document.querySelectorAll("dl")) {
        for (const blockLatexMathElement of dlElement.querySelectorAll(
            WIKIPEDIA_DL_BLOCK_LATEX_MATH_SELECTOR,
        )) {
            const rawLatex = blockLatexMathElement.getAttribute("alttext");

            if (rawLatex == null) {
                continue;
            }

            const latex = extractLatexFromAltText(rawLatex);
            dlElement.replaceWith(`$$${latex}$$\n`);
        }
    }

    for (const blockLatexContainingSpan of document.querySelectorAll(
        WIKIPEDIA_SPAN_BLOCK_LATEX_MATH_SELECTOR,
    )) {
        const rawLatex = blockLatexContainingSpan
            .getElementsByTagName("math")[0]
            .getAttribute("alttext");

        if (rawLatex == null) {
            continue;
        }

        const latex = extractLatexFromAltText(rawLatex);
        blockLatexContainingSpan.replaceWith(`$$${latex}$$`);
    }
}
