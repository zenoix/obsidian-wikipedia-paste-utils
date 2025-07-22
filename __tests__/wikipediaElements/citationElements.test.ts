import { describe, expect, test } from "vitest";
import {
    doesDocumentHaveCitations,
    removeCitations,
    keepCitations,
    KeptCitationPasteMethod,
} from "src/wikipediaElements/citationElements";

describe("doesDocumentHaveCitations", () => {
    describe("no citations", () => {
        test("test 1", () => {
            const parser = new DOMParser();
            const inputHTML = `<html><head><meta http-equiv="content-type" content="text/html; charset=utf-8"></head><body><b>Phare Petit-Canal</b> is a <a href="https://en.wikipedia.org/wiki/Guadeloupe" title="Guadeloupe">Guadeloupean</a> professional <a href="https://en.wikipedia.org/wiki/Association_football" title="Association football">football</a> club that is based in the commune of <a href="https://en.wikipedia.org/wiki/Petit-Canal" title="Petit-Canal">Petit-Canal</a>. The club competes in the <a href="https://en.wikipedia.org/wiki/Guadeloupe_Division_of_Honor" class="mw-redirect" title="Guadeloupe Division of Honor">Guadeloupe Division of Honor</a>, the top tier of football on the island.
</body></html>`;
            expect(
                doesDocumentHaveCitations(
                    parser.parseFromString(inputHTML, "text/html"),
                ),
            ).toBeFalsy();
        });

        test("test 2", () => {
            const parser = new DOMParser();
            const inputHTML = `<html><head><meta http-equiv="content-type" content="text/html; charset=utf-8"></head><body>Hank Locklin reached the zenith of his commercial success with the 1960 single "<a href="https://en.wikipedia.org/wiki/Please_Help_Me,_I%27m_Falling" title="Please Help Me, I'm Falling">Please Help Me, I'm Falling</a>." </body></html>`;
            expect(
                doesDocumentHaveCitations(
                    parser.parseFromString(inputHTML, "text/html"),
                ),
            ).toBeFalsy();
        });
    });

    describe("has citations", () => {
        test("test 1", () => {
            const parser = new DOMParser();
            const inputHTML = `<html><head><meta http-equiv="content-type" content="text/html; charset=utf-8"></head><body><p><b>"Lower Niger Bronze Industry"</b> is essentially a catch-all term<sup id="cite_ref-Herbert_1-0" class="reference"><a href="https://en.wikipedia.org/wiki/Lower_Niger_Bronze_Industries#cite_note-Herbert-1"><span class="cite-bracket">[</span>1<span class="cite-bracket">]</span></a></sup> referring either to any unattributed "<a href="https://en.wikipedia.org/wiki/Bronze" title="Bronze">Bronze</a>" (in reality, <a href="https://en.wikipedia.org/wiki/List_of_copper_alloys" title="List of copper alloys">copper alloy</a>) work produced in the <a href="https://en.wikipedia.org/w/index.php?title=Lower_Niger&amp;action=edit&amp;redlink=1" class="new" title="Lower Niger (page does not exist)">Lower Niger</a>,<sup id="cite_ref-2" class="reference"><a href="https://en.wikipedia.org/wiki/Lower_Niger_Bronze_Industries#cite_note-2"><span class="cite-bracket">[</span>2<span class="cite-bracket">]</span></a></sup> or, more commonly, to every "Bronze" work produced in the Lower Niger which cannot be immediately attributed to more famous traditions of <a href="https://en.wikipedia.org/wiki/Benin_Bronzes" title="Benin Bronzes">Benin</a> and <a href="https://en.wikipedia.org/wiki/Yoruba_art#Metal_arts" title="Yoruba art">Yoruba</a> (particularly <a href="https://en.wikipedia.org/wiki/Ile-Ife" class="mw-redirect" title="Ile-Ife">Ife</a>) metallurgy. These works, referred to in recent texts as <b>LNBs</b>, are quite distinct from previously mentioned ones in both style and production, but are also internally diverse; they do not comprise a single tradition: "while this omnibus term is still with us, no one would continue to lump the Tada-Jebba bronzes together with those excavated at <a href="https://en.wikipedia.org/wiki/Igbo-Ukwu" title="Igbo-Ukwu">Igbo-Ukwu</a>, even as sub-styles. These and the other provisional groupings reflect distinctly different traditions. Today even the search for a single alternate bronzecasting center has broadened as several independent workshops have been confirmed."<sup id="cite_ref-3" class="reference"><a href="https://en.wikipedia.org/wiki/Lower_Niger_Bronze_Industries#cite_note-3"><span class="cite-bracket">[</span>3<span class="cite-bracket">]</span></a></sup> As such, one may consider "Lower Bronze Industry" to actually mean Bronze-works which have not yet been assigned to broader traditions, or whose encapsulating traditions/contexts are (for now) poorly understood - different scholars additionally do not agree on which pieces should be given the classification. However, though little is known about them, their mere existence suggests that Bronze working was more widely spread in <a href="https://en.wikipedia.org/wiki/Nigeria" title="Nigeria">Nigeria</a> than was once known.<sup id="cite_ref-MetMuseum_4-0" class="reference"><a href="https://en.wikipedia.org/wiki/Lower_Niger_Bronze_Industries#cite_note-MetMuseum-4"><span class="cite-bracket">[</span>4<span class="cite-bracket">]</span></a></sup> </p></body></html>`;
            expect(
                doesDocumentHaveCitations(
                    parser.parseFromString(inputHTML, "text/html"),
                ),
            ).toBeTruthy();
        });
        test("test 2", () => {
            const parser = new DOMParser();
            const inputHTML = `<html><head><meta http-equiv="content-type" content="text/html; charset=utf-8"></head><body>An earlier version of this thesis for classical computers was stated by Alan Turing's friend and student <a href="https://en.wikipedia.org/wiki/Robin_Gandy" title="Robin Gandy">Robin Gandy</a> in 1980.<sup id="cite_ref-2" class="reference"><a href="https://en.wikipedia.org/wiki/Church%E2%80%93Turing%E2%80%93Deutsch_principle#cite_note-2"><span class="cite-bracket">[</span>2<span class="cite-bracket">]</span></a></sup><sup id="cite_ref-3" class="reference"><a href="https://en.wikipedia.org/wiki/Church%E2%80%93Turing%E2%80%93Deutsch_principle#cite_note-3"><span class="cite-bracket">[</span>3<span class="cite-bracket">]</span></a></sup></body></html>`;
            expect(
                doesDocumentHaveCitations(
                    parser.parseFromString(inputHTML, "text/html"),
                ),
            ).toBeTruthy();
        });
    });
});

describe("removeCitations", () => {
    describe("has citations", () => {
        test("test 1", () => {
            const parser = new DOMParser();
            const inputHTML = `<html><head><meta http-equiv="content-type" content="text/html; charset=utf-8"></head><body><p><i><b>Calliostoma virginicum</b></i> is an <a href="https://en.wikipedia.org/wiki/Extinction" title="Extinction">extinct</a> <a href="https://en.wikipedia.org/wiki/Species" title="Species">species</a> of <a href="https://en.wikipedia.org/wiki/Sea_snail" title="Sea snail">sea snail</a>, a <a href="https://en.wikipedia.org/wiki/Marine_(ocean)" class="mw-redirect" title="Marine (ocean)">marine</a> <a href="https://en.wikipedia.org/wiki/Gastropod" class="mw-redirect" title="Gastropod">gastropod</a> <a href="https://en.wikipedia.org/wiki/Mollusk" class="mw-redirect" title="Mollusk">mollusk</a>, in the <a href="https://en.wikipedia.org/wiki/Family_(biology)" title="Family (biology)">family</a> <a href="https://en.wikipedia.org/wiki/Calliostomatidae" title="Calliostomatidae">Calliostomatidae</a> within the superfamily <a href="https://en.wikipedia.org/wiki/Trochoidea_(superfamily)" title="Trochoidea (superfamily)">Trochoidea</a>, the top snails, turban snails and their allies.<sup id="cite_ref-WoRMS_1-1" class="reference"><a href="https://en.wikipedia.org/wiki/Calliostoma_virginicum#cite_note-WoRMS-1"><span class="cite-bracket">[</span>1<span class="cite-bracket">]</span></a></sup></p></body></html>`;

            let doc = parser.parseFromString(inputHTML, "text/html");
            removeCitations(doc);

            expect(doc.body.textContent).toBe(
                "Calliostoma virginicum is an extinct species of sea snail, a marine gastropod mollusk, in the family Calliostomatidae within the superfamily Trochoidea, the top snails, turban snails and their allies.",
            );
        });

        test("test 2", () => {
            const parser = new DOMParser();
            const inputHTML = `<html><head><meta http-equiv="content-type" content="text/html; charset=utf-8"></head><body><p><b>Lothar Kalinowsky</b> (December 28, 1899, in Berlin – June 28, 1992, in New York) was an American <a href="https://en.wikipedia.org/wiki/Psychiatrist" title="Psychiatrist">psychiatrist</a> best known for advocating <a href="https://en.wikipedia.org/wiki/Electroconvulsive_therapy" title="Electroconvulsive therapy">electroconvulsive therapy</a>.<sup id="cite_ref-nytobit_1-0" class="reference"><a href="https://en.wikipedia.org/wiki/Lothar_Kalinowsky#cite_note-nytobit-1"><span class="cite-bracket">[</span>1<span class="cite-bracket">]</span></a></sup><sup id="cite_ref-kneeland2002_2-0" class="reference"><a href="https://en.wikipedia.org/wiki/Lothar_Kalinowsky#cite_note-kneeland2002-2"><span class="cite-bracket">[</span>2<span class="cite-bracket">]</span></a></sup>
</p></body></html>`;

            let doc = parser.parseFromString(inputHTML, "text/html");
            removeCitations(doc);

            expect(doc.body.textContent?.trim()).toBe(
                "Lothar Kalinowsky (December 28, 1899, in Berlin – June 28, 1992, in New York) was an American psychiatrist best known for advocating electroconvulsive therapy.",
            );
        });

        test("test 3", () => {
            const parser = new DOMParser();
            const inputHTML = `<html><head><meta http-equiv="content-type" content="text/html; charset=utf-8"></head><body>which was written into the season's storyline,<sup id="cite_ref-1" class="reference"><a href="https://en.wikipedia.org/wiki/Alias_season_5#cite_note-1"><span class="cite-bracket">[</span>1<span class="cite-bracket">]</span></a></sup><sup id="cite_ref-2" class="reference"><a href="https://en.wikipedia.org/wiki/Alias_season_5#cite_note-2"><span class="cite-bracket">[</span>2<span class="cite-bracket">]</span></a></sup> as well as news of the show's cancellation.<sup id="cite_ref-3" class="reference"><a href="https://en.wikipedia.org/wiki/Alias_season_5#cite_note-3"><span class="cite-bracket">[</span>3<span class="cite-bracket">]</span></a></sup><sup id="cite_ref-4" class="reference"><a href="https://en.wikipedia.org/wiki/Alias_season_5#cite_note-4"><span class="cite-bracket">[</span>4<span class="cite-bracket">]</span></a></sup> Season 5 consisted of 17 episodes, i</body></html>`;

            let doc = parser.parseFromString(inputHTML, "text/html");
            removeCitations(doc);

            expect(doc.body.textContent?.trim()).toBe(
                "which was written into the season's storyline, as well as news of the show's cancellation. Season 5 consisted of 17 episodes, i",
            );
        });
    });

    describe("no citations", () => {
        test("test 1", () => {
            const parser = new DOMParser();
            const inputHTML = ` <html><head><meta http-equiv="content-type" content="text/html; charset=utf-8"></head><body><li>Bjorn Stiggson - guitar</li>
<li>Sonny Larson - vocalist</li>
<li>Hakan Andersson - bass (-1993)</li>
<li>P-O Larsson - bass (1993–1995)</li></body></html>`;

            let doc = parser.parseFromString(inputHTML, "text/html");
            removeCitations(doc);
            expect(doc.body.textContent?.trim()).toBe(
                `Bjorn Stiggson - guitar
Sonny Larson - vocalist
Hakan Andersson - bass (-1993)
P-O Larsson - bass (1993–1995)`,
            );
        });

        test("test 2", () => {
            const parser = new DOMParser();
            const inputHTML = `<html><head><meta http-equiv="content-type" content="text/html; charset=utf-8"></head><body>All tracks were written by <a href="https://en.wikipedia.org/wiki/Jim_Reid" title="Jim Reid">Jim Reid</a> and <a href="https://en.wikipedia.org/wiki/William_Reid_(musician)" title="William Reid (musician)">William Reid</a>.</body></html>`;

            let doc = parser.parseFromString(inputHTML, "text/html");
            removeCitations(doc);
            expect(doc.body.textContent?.trim()).toBe(
                "All tracks were written by Jim Reid and William Reid.",
            );
        });
    });
});

describe("keepCitations", () => {
    test("no citations", () => {
        const parser = new DOMParser();
        const inputHTML = `<html><head><meta http-equiv="content-type" content="text/html; charset=utf-8"></head><body>The <b>Spanish-Portuguese War</b> between 1735 and 1737 was fought over the <a href="https://en.wikipedia.org/wiki/Banda_Oriental" title="Banda Oriental">Banda Oriental</a>, roughly present-day <a href="https://en.wikipedia.org/wiki/Uruguay" title="Uruguay">Uruguay</a>.</body></html>`;

        let doc = parser.parseFromString(inputHTML, "text/html");
        keepCitations(doc, "");
        expect(doc.body.textContent?.trim()).toBe(
            "The Spanish-Portuguese War between 1735 and 1737 was fought over the Banda Oriental, roughly present-day Uruguay.",
        );
    });

    describe("keep link", () => {
        test("test 1", () => {
            const parser = new DOMParser();
            const inputHTML = `<html><head><meta http-equiv="content-type" content="text/html; charset=utf-8"></head><body><li><i><a href="https://en.wikipedia.org/wiki/Illuminations_(DVD)" class="mw-redirect" title="Illuminations (DVD)">Illuminations</a></i> (2001), <a href="https://en.wikipedia.org/wiki/Canadian_Recording_Industry_Association" class="mw-redirect" title="Canadian Recording Industry Association">certified platinum</a> in Canada<sup id="cite_ref-13" class="reference"><a href="https://en.wikipedia.org/wiki/The_Tea_Party_discography#cite_note-13"><span class="cite-bracket">[</span>13<span class="cite-bracket">]</span></a></sup></li></body></html>`;

            let doc = parser.parseFromString(inputHTML, "text/html");
            keepCitations(doc, KeptCitationPasteMethod.KeepLink.valueOf());
            expect(doc.body.textContent?.trim()).toBe(
                "Illuminations (2001), certified platinum in Canada[[13](https://en.wikipedia.org/wiki/The_Tea_Party_discography#cite_note-13)]",
            );
        });

        test("test 2", () => {
            const parser = new DOMParser();
            const inputHTML = `<html><head><meta http-equiv="content-type" content="text/html; charset=utf-8"></head><body>The game had been scheduled to be released in January 1998,<sup id="cite_ref-2" class="reference"><a href="https://en.wikipedia.org/wiki/Air_Warrior_III#cite_note-2"><span class="cite-bracket">[</span>2<span class="cite-bracket">]</span></a></sup> before being pushed forward for December 15, 1997.<sup id="cite_ref-release_1-1" class="reference"><a href="https://en.wikipedia.org/wiki/Air_Warrior_III#cite_note-release-1"><span class="cite-bracket">[</span>1<span class="cite-bracket">]</span></a></sup></body></html>`;

            let doc = parser.parseFromString(inputHTML, "text/html");
            keepCitations(doc, KeptCitationPasteMethod.KeepLink.valueOf());
            expect(doc.body.textContent?.trim()).toBe(
                "The game had been scheduled to be released in January 1998,[[2](https://en.wikipedia.org/wiki/Air_Warrior_III#cite_note-2)] before being pushed forward for December 15, 1997.[[1](https://en.wikipedia.org/wiki/Air_Warrior_III#cite_note-release-1)]",
            );
        });
        test("test 3", () => {
            const parser = new DOMParser();
            const inputHTML = `<html><head><meta http-equiv="content-type" content="text/html; charset=utf-8"></head><body>As of 2024, he is the only major league player to have been born in <a href="https://en.wikipedia.org/wiki/Finland" title="Finland">Finland</a>.<sup id="cite_ref-1" class="reference"><a href="https://en.wikipedia.org/wiki/John_Michaelson#cite_note-1"><span class="cite-bracket">[</span>1<span class="cite-bracket">]</span></a></sup><sup id="cite_ref-2" class="reference"><a href="https://en.wikipedia.org/wiki/John_Michaelson#cite_note-2"><span class="cite-bracket">[</span>2<span class="cite-bracket">]</span></a></sup></body></html>`;

            let doc = parser.parseFromString(inputHTML, "text/html");
            keepCitations(doc, KeptCitationPasteMethod.KeepLink.valueOf());
            expect(doc.body.textContent?.trim()).toBe(
                "As of 2024, he is the only major league player to have been born in Finland.[[1](https://en.wikipedia.org/wiki/John_Michaelson#cite_note-1)][[2](https://en.wikipedia.org/wiki/John_Michaelson#cite_note-2)]",
            );
        });
    });

    describe("remove link", () => {
        test("test 1", () => {
            const parser = new DOMParser();
            const inputHTML = `<html><head><meta http-equiv="content-type" content="text/html; charset=utf-8"></head><body>In March 2015 Sidcley was loaned to <a href="https://en.wikipedia.org/wiki/Clube_Atl%C3%A9tico_Goianiense" class="mw-redirect" title="Clube Atlético Goianiense">Atlético Goianiense</a> until the end of the year.<sup id="cite_ref-2" class="reference"><a href="https://en.wikipedia.org/wiki/Sidcley#cite_note-2"><span class="cite-bracket">[</span>2<span class="cite-bracket">]</span></a></sup></body></html>`;

            let doc = parser.parseFromString(inputHTML, "text/html");
            keepCitations(doc, KeptCitationPasteMethod.RemoveLink.valueOf());
            expect(doc.body.textContent?.trim()).toBe(
                "In March 2015 Sidcley was loaned to Atlético Goianiense until the end of the year.[2]",
            );
        });

        test("test 2", () => {
            const parser = new DOMParser();
            const inputHTML = `<html><head><meta http-equiv="content-type" content="text/html; charset=utf-8"></head><body>Wouldham was elected as <a href="https://en.wikipedia.org/wiki/Prior_(ecclesiastical)" title="Prior (ecclesiastical)">prior</a> of <a href="https://en.wikipedia.org/wiki/Rochester_Cathedral" title="Rochester Cathedral">Rochester Cathedral</a> on 24 December 1283.<sup id="cite_ref-BHOPriorRoch_1-0" class="reference"><a href="https://en.wikipedia.org/wiki/Thomas_Wouldham#cite_note-BHOPriorRoch-1"><span class="cite-bracket">[</span>1<span class="cite-bracket">]</span></a></sup> He was elected <a href="https://en.wikipedia.org/wiki/Bishop" title="Bishop">bishop</a> by the chapter but renounced the election.<sup id="cite_ref-BHORoch_2-0" class="reference"><a href="https://en.wikipedia.org/wiki/Thomas_Wouldham#cite_note-BHORoch-2"><span class="cite-bracket">[</span>2<span class="cite-bracket">]</span></a></sup></body></html>`;

            let doc = parser.parseFromString(inputHTML, "text/html");
            keepCitations(doc, KeptCitationPasteMethod.RemoveLink.valueOf());
            expect(doc.body.textContent?.trim()).toBe(
                "Wouldham was elected as prior of Rochester Cathedral on 24 December 1283.[1] He was elected bishop by the chapter but renounced the election.[2]",
            );
        });
    });
});
