import { describe, expect, test } from "vitest";
import {
    doesDocumentHaveBoldText,
    translateBoldElements,
} from "src/wikipediaElements/boldElements";

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

describe("translateBoldElements", () => {
    describe("no bold elements", () => {
        test("test 1", () => {
            const parser = new DOMParser();
            const inputHTML = `<meta http-equiv="content-type" content="text/html; charset=utf-8"><i>Tom and Jerry</i> won seven Academy Awards, while Hanna and Barbera were nominated for two others and won eight Emmy Awards. Their cartoons have become cultural icons, and their cartoon characters have appeared in other media such as films, books, and toys.`;

            let doc = parser.parseFromString(inputHTML, "text/html");
            translateBoldElements(doc);
            expect(doc.body.textContent?.trim()).toBe(
                "Tom and Jerry won seven Academy Awards, while Hanna and Barbera were nominated for two others and won eight Emmy Awards. Their cartoons have become cultural icons, and their cartoon characters have appeared in other media such as films, books, and toys.",
            );
        });

        test("test 2", () => {
            const parser = new DOMParser();
            const inputHTML = `<meta http-equiv="content-type" content="text/html; charset=utf-8">This species is found both in forests and on moors. The larvae feed on <i><a href="https://en.wikipedia.org/wiki/Betula" class="mw-redirect" title="Betula">Betula</a></i> spp. The adult butterflies fly in June–July.`;

            let doc = parser.parseFromString(inputHTML, "text/html");
            translateBoldElements(doc);
            expect(doc.body.textContent?.trim()).toBe(
                "This species is found both in forests and on moors. The larvae feed on Betula spp. The adult butterflies fly in June–July.",
            );
        });
    });

    describe("has bold elements", () => {
        test("test 1", () => {
            const parser = new DOMParser();
            const inputHTML = `<meta http-equiv="content-type" content="text/html; charset=utf-8"><b>Wysin</b> <span class="IPA" lang="pl-fonipa" style="white-space:nowrap"><a href="https://en.wikipedia.org/wiki/Help:IPA/Polish" title="Help:IPA/Polish">[ˈvɨɕin]</a></span> is a <a href="https://en.wikipedia.org/wiki/Village" title="Village">village</a> in the administrative district of <a href="https://en.wikipedia.org/wiki/Gmina_Liniewo" title="Gmina Liniewo">Gmina Liniewo</a>, within <a href="https://en.wikipedia.org/wiki/Ko%C5%9Bcierzyna_County" title="Kościerzyna County">Kościerzyna County</a>, <a href="https://en.wikipedia.org/wiki/Pomeranian_Voivodeship" title="Pomeranian Voivodeship">Pomeranian Voivodeship</a>, in northern Poland.<sup id="cite_ref-TERYT_1-0" class="reference"><a href="https://en.wikipedia.org/wiki/Wysin#cite_note-TERYT-1"><span class="cite-bracket">[</span>1<span class="cite-bracket">]</span></a></sup>`;

            let doc = parser.parseFromString(inputHTML, "text/html");
            translateBoldElements(doc);
            expect(doc.body.textContent?.trim()).toBe(
                "**Wysin** [ˈvɨɕin] is a village in the administrative district of Gmina Liniewo, within Kościerzyna County, Pomeranian Voivodeship, in northern Poland.[1]",
            );
        });

        test("test 2", () => {
            const parser = new DOMParser();
            const inputHTML = `<meta http-equiv="content-type" content="text/html; charset=utf-8"><i><b>The Jefferson County Courier</b></i> was a <a href="https://en.wikipedia.org/wiki/Weekly_newspaper" title="Weekly newspaper">weekly newspaper</a> covering <a href="https://en.wikipedia.org/wiki/Jefferson_County,_Montana" title="Jefferson County, Montana">Jefferson County, Montana</a>.`;

            let doc = parser.parseFromString(inputHTML, "text/html");
            translateBoldElements(doc);
            expect(doc.body.textContent?.trim()).toBe(
                "**The Jefferson County Courier** was a weekly newspaper covering Jefferson County, Montana.",
            );
        });

        test("test 3", () => {
            const parser = new DOMParser();
            const inputHTML = `<meta http-equiv="content-type" content="text/html; charset=utf-8">The <b>Dancing Hot Dog</b> is the name often used to refer to a character and an <a href="https://en.wikipedia.org/wiki/Internet_meme" title="Internet meme">Internet meme</a> that originated in 2017, after the <a href="https://en.wikipedia.org/wiki/Snapchat" title="Snapchat">Snapchat</a> mobile app released an <a href="https://en.wikipedia.org/wiki/Augmented_reality" title="Augmented reality">augmented reality</a> camera lens that includes an animated rendering of a dancing <a href="https://en.wikipedia.org/wiki/Anthropomorphic" class="mw-redirect" title="Anthropomorphic">anthropomorphic</a> hot dog.`;

            let doc = parser.parseFromString(inputHTML, "text/html");
            translateBoldElements(doc);
            expect(doc.body.textContent?.trim()).toBe(
                "The **Dancing Hot Dog** is the name often used to refer to a character and an Internet meme that originated in 2017, after the Snapchat mobile app released an augmented reality camera lens that includes an animated rendering of a dancing anthropomorphic hot dog.",
            );
        });
    });
});
