import { describe, expect, test } from "@jest/globals";
import { extractLatexFromAltText } from "src/utils";

describe("extractLatexFromAltText - has latex", () => {
	test("test 1", () => {
		expect(
			extractLatexFromAltText(
				"{\\displaystyle f(x)=\\int _{c}^{x}R{\\left({\\textstyle t,{\\sqrt {P(t)}}}\\right)}\\,dt,}",
			),
		).toBe(
			"f(x)=\\int _{c}^{x}R{\\left({\\textstyle t,{\\sqrt {P(t)}}}\\right)}\\,dt,",
		);
	});

	test("test 2", () => {
		expect(
			extractLatexFromAltText("{\\displaystyle {\\mathcal {C}}_{1}}"),
		).toBe("{\\mathcal {C}}_{1}");
	});

	test("test 3", () => {
		expect(
			extractLatexFromAltText(
				"{\\displaystyle H(t,x)={\\frac {x-tf(x)}{\\sup _{y\\in K}\\left|y-tf(y)\\right|}}}",
			),
		).toBe(
			"H(t,x)={\\frac {x-tf(x)}{\\sup _{y\\in K}\\left|y-tf(y)\\right|}}",
		);
	});
});

describe("extractLatexFromAltText - has no latex", () => {
	test("empty string", () => {
		expect(extractLatexFromAltText("")).toBe("");
	});

	test("no latex string", () => {
		expect(extractLatexFromAltText("testing testing")).toBe("");
	});

	test("no display style string", () => {
		expect(extractLatexFromAltText("4+4")).toBe("");
	});
});
