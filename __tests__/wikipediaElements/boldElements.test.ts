import { describe, expect, test } from "vitest";
import { doesDocumentHaveBoldText } from "src/wikipediaElements/boldElements";

describe("doesDocumentHaveBoldText", () => {
    describe("no bold text", () => {
        test("test 1", () => {
            const parser = new DOMParser();
            const inputHTML = `<meta http-equiv="content-type" content="text/html; charset=utf-8">He became a well-respected New Zealander, noted for his contributions to industry, sport and local government.`;
            expect(
                doesDocumentHaveBoldText(
                    parser.parseFromString(inputHTML, "text/html"),
                ),
            ).toBeFalsy();
        });

        test("test 2", () => {
            const parser = new DOMParser();
            const inputHTML = `<meta http-equiv="content-type" content="text/html; charset=utf-8">Merinda Park station opened as part of the <a href="https://en.wikipedia.org/wiki/Railway_electrification" title="Railway electrification">electrification</a> of the line to <a href="https://en.wikipedia.org/wiki/Cranbourne_railway_station" title="Cranbourne railway station">Cranbourne</a>.<sup id="cite_ref-5" class="reference"><a href="https://en.wikipedia.org/wiki/Merinda_Park_railway_station#cite_note-5"><span class="cite-bracket">[</span>5<span class="cite-bracket">]</span></a></sup> The station is named after an adjacent <a href="https://en.wikipedia.org/wiki/Housing_estate" title="Housing estate">housing estate</a>, opened in the 1980s.<sup id="cite_ref-6" class="reference"><a href="https://en.wikipedia.org/wiki/Merinda_Park_railway_station#cite_note-6"><span class="cite-bracket">[</span>6<span class="cite-bracket">]</span></a></sup>`;
            expect(
                doesDocumentHaveBoldText(
                    parser.parseFromString(inputHTML, "text/html"),
                ),
            ).toBeFalsy();
        });

        test("test 3", () => {
            const parser = new DOMParser();
            const inputHTML = `<meta http-equiv="content-type" content="text/html; charset=utf-8">100.4 Jazz FM played its own music from its Salford studio during the day, whereas specialist shows like <i>Dinner Jazz</i> and <i>Legends of Jazz</i> with <a href="https://en.wikipedia.org/wiki/Ramsey_Lewis" title="Ramsey Lewis">Ramsey Lewis</a> were networked from London's <a href="https://en.wikipedia.org/wiki/102.2_Jazz_FM" title="102.2 Jazz FM">102.2 Jazz FM</a>. The station was replaced by <a href="https://en.wikipedia.org/wiki/Smooth_FM_100.4" class="mw-redirect" title="Smooth FM 100.4">Smooth FM 100.4</a> in 2004.`;
            expect(
                doesDocumentHaveBoldText(
                    parser.parseFromString(inputHTML, "text/html"),
                ),
            ).toBeFalsy();
        });
    });

    describe("has bold text", () => {
        test("test 1", () => {
            const parser = new DOMParser();
            const inputHTML = `<meta http-equiv="content-type" content="text/html; charset=utf-8"><b>Alginic acid</b>, also called <b>algin</b>, is a naturally occurring, edible <a href="https://en.wikipedia.org/wiki/Polysaccharide" title="Polysaccharide">polysaccharide</a> found in <a href="https://en.wikipedia.org/wiki/Brown_algae" title="Brown algae">brown algae</a>.`;
            expect(
                doesDocumentHaveBoldText(
                    parser.parseFromString(inputHTML, "text/html"),
                ),
            ).toBeTruthy();
        });

        test("test 2", () => {
            const parser = new DOMParser();
            const inputHTML = `<meta http-equiv="content-type" content="text/html; charset=utf-8">This is a list of <b>seasons of the <a href="https://en.wikipedia.org/wiki/United_States_Hockey_League" title="United States Hockey League">United States Hockey League</a></b> since its transition to a <a href="https://en.wikipedia.org/wiki/Junior_ice_hockey" title="Junior ice hockey">junior hockey</a> league in 1979.`;
            expect(
                doesDocumentHaveBoldText(
                    parser.parseFromString(inputHTML, "text/html"),
                ),
            ).toBeTruthy();
        });

        test("test 3", () => {
            const parser = new DOMParser();
            const inputHTML = `<meta http-equiv="content-type" content="text/html; charset=utf-8"><i><b>Heterocaprella krishnaensis</b></i> is a species of <a href="https://en.wikipedia.org/wiki/Crustacean" title="Crustacean">crustacean</a> from the <a href="https://en.wikipedia.org/wiki/Caprellidae" title="Caprellidae">Caprellidae</a> family.`;
            expect(
                doesDocumentHaveBoldText(
                    parser.parseFromString(inputHTML, "text/html"),
                ),
            ).toBeTruthy();
        });
    });
});
