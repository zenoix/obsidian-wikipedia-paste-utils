import { describe, expect, test } from "vitest";
import {
    doesDocumentHaveInlineLatex,
    replaceInlineLatex,
} from "src/wikipediaElements/inlineLatexElements";

describe("doesDocumentHaveInlineLatex", () => {
    describe("no inline latex", () => {
        test("test 1", () => {
            const parser = new DOMParser();
            const inputHTML = `<meta http-equiv="content-type" content="text/html; charset=utf-8">The purpose of the Committee is "to examine regional strategies and the work of regional bodies" in <a href="https://en.wikipedia.org/wiki/Yorkshire_and_the_Humber" title="Yorkshire and the Humber">Yorkshire and the Humber</a>.`;
            expect(
                doesDocumentHaveInlineLatex(
                    parser.parseFromString(inputHTML, "text/html"),
                ),
            ).toBeFalsy();
        });

        test("test 2", () => {
            const parser = new DOMParser();
            const inputHTML = `<meta http-equiv="content-type" content="text/html; charset=utf-8">In December 2021, Harrison was handed a three-month suspension without salary by his club <a href="https://en.wikipedia.org/wiki/LISCR_FC" title="LISCR FC">LISCR FC</a> due to a violation of the club's code of conduct.<sup id="cite_ref-4" class="reference"><a href="https://en.wikipedia.org/wiki/Marlon_Harrison#cite_note-4"><span class="cite-bracket">[</span>4<span class="cite-bracket">]</span></a></sup> After spending one month on the sidelines, his suspension was lifted and he returned to training.<sup id="cite_ref-5" class="reference"><a href="https://en.wikipedia.org/wiki/Marlon_Harrison#cite_note-5"><span class="cite-bracket">[</span>5<span class="cite-bracket">]</span></a></sup>`;
            expect(
                doesDocumentHaveInlineLatex(
                    parser.parseFromString(inputHTML, "text/html"),
                ),
            ).toBeFalsy();
        });

        test("test 3", () => {
            const parser = new DOMParser();
            const inputHTML = `<meta http-equiv="content-type" content="text/html; charset=utf-8"><p>It turns out that
</p>
<dl><dd><span class="mwe-math-element mwe-math-element-inline"><span class="mwe-math-mathml-inline mwe-math-mathml-a11y" style="display: none;"><math xmlns="http://www.w3.org/1998/Math/MathML" alttext="{\displaystyle {\textsf {ZPP}}={\textsf {RP}}\cap {\textsf {co-RP}}}">
  <semantics>
    <mrow class="MJX-TeXAtom-ORD">
      <mstyle displaystyle="true" scriptlevel="0">
        <mrow class="MJX-TeXAtom-ORD">
          <mrow class="MJX-TeXAtom-ORD">
            <mtext mathvariant="sans-serif">ZPP</mtext>
          </mrow>
        </mrow>
        <mo>=</mo>
        <mrow class="MJX-TeXAtom-ORD">
          <mrow class="MJX-TeXAtom-ORD">
            <mtext mathvariant="sans-serif">RP</mtext>
          </mrow>
        </mrow>
        <mo>∩</mo>
        <mrow class="MJX-TeXAtom-ORD">
          <mrow class="MJX-TeXAtom-ORD">
            <mtext mathvariant="sans-serif">co-RP</mtext>
          </mrow>
        </mrow>
      </mstyle>
    </mrow>
    
  </semantics>
</math></span><img src="https://wikimedia.org/api/rest_v1/media/math/render/svg/9223c18ceef162a448a54bc3ede774a5371f92aa" class="mwe-math-fallback-image-inline mw-invert skin-invert" aria-hidden="true" style="vertical-align: -0.338ex; width:19.015ex; height:2.176ex;" alt="{\displaystyle {\textsf {ZPP}}={\textsf {RP}}\cap {\textsf {co-RP}}}"></span></dd></dl>
<p>which is intimately connected with the way Las Vegas algorithms are sometimes constructed.</p>`;

            expect(
                doesDocumentHaveInlineLatex(
                    parser.parseFromString(inputHTML, "text/html"),
                ),
            ).toBeFalsy();
        });
    });

    describe("has inline latex", () => {
        test("test 1", () => {
            const parser = new DOMParser();
            const inputHTML = `<meta http-equiv="content-type" content="text/html; charset=utf-8">A probabilistic Turing machine can be formally defined as the 7-tuple <span class="mwe-math-element mwe-math-element-inline"><span class="mwe-math-mathml-inline mwe-math-mathml-a11y" style="display: none;"><math xmlns="http://www.w3.org/1998/Math/MathML" alttext="{\displaystyle M=(Q,\Sigma ,\Gamma ,q_{0},A,\delta _{1},\delta _{2})}">
  <semantics>
    <mrow class="MJX-TeXAtom-ORD">
      <mstyle displaystyle="true" scriptlevel="0">
        <mi>M</mi>
        <mo>=</mo>
        <mo stretchy="false">(</mo>
        <mi>Q</mi>
        <mo>,</mo>
        <mi mathvariant="normal">Σ</mi>
        <mo>,</mo>
        <mi mathvariant="normal">Γ</mi>
        <mo>,</mo>
        <msub>
          <mi>q</mi>
          <mrow class="MJX-TeXAtom-ORD">
            <mn>0</mn>
          </mrow>
        </msub>
        <mo>,</mo>
        <mi>A</mi>
        <mo>,</mo>
        <msub>
          <mi>δ</mi>
          <mrow class="MJX-TeXAtom-ORD">
            <mn>1</mn>
          </mrow>
        </msub>
        <mo>,</mo>
        <msub>
          <mi>δ</mi>
          <mrow class="MJX-TeXAtom-ORD">
            <mn>2</mn>
          </mrow>
        </msub>
        <mo stretchy="false">)</mo>
      </mstyle>
    </mrow>
    
  </semantics>
</math></span><img src="https://wikimedia.org/api/rest_v1/media/math/render/svg/6fd6c65cdd5db3f5ff59dfabfcf52219fb561510" class="mwe-math-fallback-image-inline mw-invert skin-invert" aria-hidden="true" style="vertical-align: -0.838ex; width:26.53ex; height:2.843ex;" alt="{\displaystyle M=(Q,\Sigma ,\Gamma ,q_{0},A,\delta _{1},\delta _{2})}"></span>, where`;
            expect(
                doesDocumentHaveInlineLatex(
                    parser.parseFromString(inputHTML, "text/html"),
                ),
            ).toBeTruthy();
        });

        test("test 2", () => {
            const parser = new DOMParser();
            const inputHTML = `<meta http-equiv="content-type" content="text/html; charset=utf-8"><i>A</i> is computable if and only if it is at level <span class="mwe-math-element mwe-math-element-inline"><span class="mwe-math-mathml-inline mwe-math-mathml-a11y" style="display: none;"><math xmlns="http://www.w3.org/1998/Math/MathML" alttext="{\displaystyle \Delta _{1}^{0}}">
  <semantics>
    <mrow class="MJX-TeXAtom-ORD">
      <mstyle displaystyle="true" scriptlevel="0">
        <msubsup>
          <mi mathvariant="normal">Δ</mi>
          <mrow class="MJX-TeXAtom-ORD">
            <mn>1</mn>
          </mrow>
          <mrow class="MJX-TeXAtom-ORD">
            <mn>0</mn>
          </mrow>
        </msubsup>
      </mstyle>
    </mrow>
    
  </semantics>
</math></span><img src="https://wikimedia.org/api/rest_v1/media/math/render/svg/472ac09286b20746e38e3a31a9f4feccbd4a0a23" class="mwe-math-fallback-image-inline mw-invert skin-invert" aria-hidden="true" style="vertical-align: -1.005ex; width:2.99ex; height:3.176ex;" alt="{\displaystyle \Delta _{1}^{0}}"></span> of the <a href="https://en.wikipedia.org/wiki/Arithmetical_hierarchy" title="Arithmetical hierarchy">arithmetical hierarchy</a>.`;
            expect(
                doesDocumentHaveInlineLatex(
                    parser.parseFromString(inputHTML, "text/html"),
                ),
            ).toBeTruthy();
        });
    });
});

describe("replaceInlineLatex", () => {
    describe("has inline latex", () => {
        test("test 1", () => {
            const parser = new DOMParser();
            const inputHTML = String.raw`<meta http-equiv="content-type" content="text/html; charset=utf-8">The <b>homomorphism density</b> <span class="mwe-math-element mwe-math-element-inline"><span class="mwe-math-mathml-inline mwe-math-mathml-a11y" style="display: none;"><math xmlns="http://www.w3.org/1998/Math/MathML" alttext="{\displaystyle t(H,G)}">
  <semantics>
    <mrow class="MJX-TeXAtom-ORD">
      <mstyle displaystyle="true" scriptlevel="0">
        <mi>t</mi>
        <mo stretchy="false">(</mo>
        <mi>H</mi>
        <mo>,</mo>
        <mi>G</mi>
        <mo stretchy="false">)</mo>
      </mstyle>
    </mrow>
    
  </semantics>
</math></span><img src="https://wikimedia.org/api/rest_v1/media/math/render/svg/889afd12e40d5337e1255589a5c00f69009c28b6" class="mwe-math-fallback-image-inline mw-invert skin-invert" aria-hidden="true" style="vertical-align: -0.838ex; width:7.573ex; height:2.843ex;" alt="{\displaystyle t(H,G)}"></span> of a graph <span class="mwe-math-element mwe-math-element-inline"><span class="mwe-math-mathml-inline mwe-math-mathml-a11y" style="display: none;"><math xmlns="http://www.w3.org/1998/Math/MathML" alttext="{\displaystyle H}">
  <semantics>
    <mrow class="MJX-TeXAtom-ORD">
      <mstyle displaystyle="true" scriptlevel="0">
        <mi>H</mi>
      </mstyle>
    </mrow>
    
  </semantics>
</math></span><img src="https://wikimedia.org/api/rest_v1/media/math/render/svg/75a9edddcca2f782014371f75dca39d7e13a9c1b" class="mwe-math-fallback-image-inline mw-invert skin-invert" aria-hidden="true" style="vertical-align: -0.338ex; width:2.064ex; height:2.176ex;" alt="{\displaystyle H}"></span> in a graph <span class="mwe-math-element mwe-math-element-inline"><span class="mwe-math-mathml-inline mwe-math-mathml-a11y" style="display: none;"><math xmlns="http://www.w3.org/1998/Math/MathML" alttext="{\displaystyle G}">
  <semantics>
    <mrow class="MJX-TeXAtom-ORD">
      <mstyle displaystyle="true" scriptlevel="0">
        <mi>G</mi>
      </mstyle>
    </mrow>
    
  </semantics>
</math></span><img src="https://wikimedia.org/api/rest_v1/media/math/render/svg/f5f3c8921a3b352de45446a6789b104458c9f90b" class="mwe-math-fallback-image-inline mw-invert skin-invert" aria-hidden="true" style="vertical-align: -0.338ex; width:1.827ex; height:2.176ex;" alt="{\displaystyle G}"></span> describes the probability that a randomly chosen map from the vertex set of <span class="mwe-math-element mwe-math-element-inline"><span class="mwe-math-mathml-inline mwe-math-mathml-a11y" style="display: none;"><math xmlns="http://www.w3.org/1998/Math/MathML" alttext="{\displaystyle H}">
  <semantics>
    <mrow class="MJX-TeXAtom-ORD">
      <mstyle displaystyle="true" scriptlevel="0">
        <mi>H</mi>
      </mstyle>
    </mrow>
    
  </semantics>
</math></span><img src="https://wikimedia.org/api/rest_v1/media/math/render/svg/75a9edddcca2f782014371f75dca39d7e13a9c1b" class="mwe-math-fallback-image-inline mw-invert skin-invert" aria-hidden="true" style="vertical-align: -0.338ex; width:2.064ex; height:2.176ex;" alt="{\displaystyle H}"></span> to the vertex set of <span class="mwe-math-element mwe-math-element-inline"><span class="mwe-math-mathml-inline mwe-math-mathml-a11y" style="display: none;"><math xmlns="http://www.w3.org/1998/Math/MathML" alttext="{\displaystyle G}">
  <semantics>
    <mrow class="MJX-TeXAtom-ORD">
      <mstyle displaystyle="true" scriptlevel="0">
        <mi>G</mi>
      </mstyle>
    </mrow>
    
  </semantics>
</math></span><img src="https://wikimedia.org/api/rest_v1/media/math/render/svg/f5f3c8921a3b352de45446a6789b104458c9f90b" class="mwe-math-fallback-image-inline mw-invert skin-invert" aria-hidden="true" style="vertical-align: -0.338ex; width:1.827ex; height:2.176ex;" alt="{\displaystyle G}"></span> is also a <a href="https://en.wikipedia.org/wiki/Graph_homomorphism" title="Graph homomorphism">graph homomorphism</a>. It is closely related to the <b>subgraph density</b>, which describes how often a graph <span class="mwe-math-element mwe-math-element-inline"><span class="mwe-math-mathml-inline mwe-math-mathml-a11y" style="display: none;"><math xmlns="http://www.w3.org/1998/Math/MathML" alttext="{\displaystyle H}">
  <semantics>
    <mrow class="MJX-TeXAtom-ORD">
      <mstyle displaystyle="true" scriptlevel="0">
        <mi>H</mi>
      </mstyle>
    </mrow>
    
  </semantics>
</math></span><img src="https://wikimedia.org/api/rest_v1/media/math/render/svg/75a9edddcca2f782014371f75dca39d7e13a9c1b" class="mwe-math-fallback-image-inline mw-invert skin-invert" aria-hidden="true" style="vertical-align: -0.338ex; width:2.064ex; height:2.176ex;" alt="{\displaystyle H}"></span> is found as a subgraph of <span class="mwe-math-element mwe-math-element-inline"><span class="mwe-math-mathml-inline mwe-math-mathml-a11y" style="display: none;"><math xmlns="http://www.w3.org/1998/Math/MathML" alttext="{\displaystyle G}">
  <semantics>
    <mrow class="MJX-TeXAtom-ORD">
      <mstyle displaystyle="true" scriptlevel="0">
        <mi>G</mi>
      </mstyle>
    </mrow>
    
  </semantics>
</math></span><img src="https://wikimedia.org/api/rest_v1/media/math/render/svg/f5f3c8921a3b352de45446a6789b104458c9f90b" class="mwe-math-fallback-image-inline mw-invert skin-invert" aria-hidden="true" style="vertical-align: -0.338ex; width:1.827ex; height:2.176ex;" alt="{\displaystyle G}"></span>`;

            let doc = parser.parseFromString(inputHTML, "text/html");
            replaceInlineLatex(doc);
            expect(doc.body.textContent?.trim()).toBe(
                "The homomorphism density $t(H,G)$ of a graph $H$ in a graph $G$ describes the probability that a randomly chosen map from the vertex set of $H$ to the vertex set of $G$ is also a graph homomorphism. It is closely related to the subgraph density, which describes how often a graph $H$ is found as a subgraph of $G$",
            );
        });

        test("test 2", () => {
            const parser = new DOMParser();
            const inputHTML = String.raw`<meta http-equiv="content-type" content="text/html; charset=utf-8"><span class="mwe-math-element mwe-math-element-inline"><img src="https://wikimedia.org/api/rest_v1/media/math/render/svg/2e714f725a86a41858c71de7c5d04ebfa2141c9b" class="mwe-math-fallback-image-inline mw-invert skin-invert" aria-hidden="true" style="vertical-align: -0.838ex; width:24.453ex; height:2.843ex;" alt="{\textstyle (\lambda x.M[x])\rightarrow (\lambda y.M[y])}"></span> : <a href="https://en.wikipedia.org/wiki/Lambda_calculus#α-conversion">α-conversion</a>, renaming the bound variables in the expression. Used to avoid <a href="https://en.wikipedia.org/wiki/Name_collision" title="Name collision">name collisions</a>.`;

            let doc = parser.parseFromString(inputHTML, "text/html");
            replaceInlineLatex(doc);
            expect(doc.body.textContent?.trim()).toBe(
                String.raw`$(\lambda x.M[x])\rightarrow(\lambda y.M[y])`,
            );
        });

        test("test 3", () => {
            const parser = new DOMParser();
            const inputHTML = String.raw`<meta http-equiv="content-type" content="text/html; charset=utf-8">Thus in <a href="https://en.wikipedia.org/wiki/Normal_modal_logic" title="Normal modal logic">normal modal logic</a>, Löb's axiom is equivalent to the conjunction of the axiom schema <b>4</b>, <span class="mwe-math-element mwe-math-element-inline"><span class="mwe-math-mathml-inline mwe-math-mathml-a11y" style="display: none;"><math xmlns="http://www.w3.org/1998/Math/MathML" alttext="{\displaystyle (\Box A\rightarrow \Box \Box A)}">
  <semantics>
    <mrow class="MJX-TeXAtom-ORD">
      <mstyle displaystyle="true" scriptlevel="0">
        <mo stretchy="false">(</mo>
        <mi>◻</mi>
        <mi>A</mi>
        <mo stretchy="false">→</mo>
        <mi>◻</mi>
        <mi>◻</mi>
        <mi>A</mi>
        <mo stretchy="false">)</mo>
      </mstyle>
    </mrow>
    
  </semantics>
</math></span><img src="https://wikimedia.org/api/rest_v1/media/math/render/svg/b362557caed662dcc8a498ce394523c4d3f734c2" class="mwe-math-fallback-image-inline mw-invert skin-invert" aria-hidden="true" style="vertical-align: -0.838ex; width:14.334ex; height:2.843ex;" alt="{\displaystyle (\Box A\rightarrow \Box \Box A)}"></span>, and the existence of modal fixed points.`;

            let doc = parser.parseFromString(inputHTML, "text/html");
            replaceInlineLatex(doc);
            expect(doc.body.textContent?.trim()).toBe(
                String.raw`Thus in normal modal logic, Löb's axiom is equivalent to the conjunction of the axiom schema 4, $(\Box A\rightarrow \Box \Box A)$, and the existence of modal fixed points.`,
            );
        });
    });
});

describe("translateSupElements", () => {});
describe("translateSubElements", () => {});
