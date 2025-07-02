import { describe, expect, test } from "vitest";
import {
	doesDocumentHaveWikipediaLinks,
	replaceWikipediaLinks,
} from "src/wikipediaElements/linkElements";

describe("doesDocumentHaveWikipediaLinks - no wikipedia links", () => {
	test("test 1", () => {
		const parser = new DOMParser();
		const inputHTML = `
 <meta http-equiv="content-type" content="text/html; charset=utf-8"><b>Wikipedia</b> is a free online encyclopedia that is written and maintained by a community of volunteers, known as Wikipedians, through open collaboration and the wiki software MediaWiki.
	`;
		expect(
			doesDocumentHaveWikipediaLinks(
				parser.parseFromString(inputHTML, "text/html"),
			),
		).toBeFalsy();
	});

	test("test 2", () => {
		const parser = new DOMParser();
		const inputHTML = `<meta http-equiv="content-type" content="text/html; charset=utf-8">With a capacity of over 1,600 seats, the venue was erected between 1891 and 1894<span class="noprint"> (131 years ago)</span> and was originally the cultural centre of the`;
		expect(
			doesDocumentHaveWikipediaLinks(
				parser.parseFromString(inputHTML, "text/html"),
			),
		).toBeFalsy();
	});
});

describe("doesDocumentHaveWikipediaLinks - has wikipedia links", () => {
	test("test 1", () => {
		const parser = new DOMParser();
		const inputHTML = ` <meta http-equiv="content-type" content="text/html; charset=utf-8">Initially available only in <a href="https://en.wikipedia.org/wiki/English_language" title="English language">English</a>, Wikipedia exists <a href="https://en.wikipedia.org/wiki/List_of_Wikipedias" title="List of Wikipedias">in over 340 languages</a>. The <a href="https://en.wikipedia.org/wiki/English_Wikipedia" title="English Wikipedia">English Wikipedia</a>, with over 7 million <a href="https://en.wikipedia.org/wiki/Article_(publishing)" title="Article (publishing)">articles</a>,
 remains the largest of the editions, which together comprise more than 
65 million articles and attract more than 1.5 billion unique device 
visits and 13 million edits per month (about 5<span class="nowrap"> </span>edits per second on average)  as of April 2024.`;
		expect(
			doesDocumentHaveWikipediaLinks(
				parser.parseFromString(inputHTML, "text/html"),
			),
		).toBeTruthy();
	});
	test("test 2", () => {
		const parser = new DOMParser();
		const inputHTML = `<meta http-equiv="content-type" content="text/html; charset=utf-8"><i><b>Vedikkettu</b></i> is a 2023 Indian <a href="https://en.wikipedia.org/wiki/Malayalam" title="Malayalam">Malayalam</a>-language film directed by Vishnu Unnikrishnan and Bibin George and produced under Sree Gokulam Movies.`;
		expect(
			doesDocumentHaveWikipediaLinks(
				parser.parseFromString(inputHTML, "text/html"),
			),
		).toBeTruthy();
	});
});

describe("doesDocumentHaveWikipediaLinks - has citation links", () => {
	test("test 1", () => {
		const parser = new DOMParser();
		const inputHTML = `<meta http-equiv="content-type" content="text/html; charset=utf-8">it has improved over time, receiving greater praise from the late 2010s onward.<sup id="cite_ref-Wiki20_5-1" class="reference"><a href="https://en.wikipedia.org/wiki/Wikipedia#cite_note-Wiki20-5"><span class="cite-bracket">[</span>3<span class="cite-bracket">]</span></a></sup><sup id="cite_ref-Econ21_13-0" class="reference"><a href="https://en.wikipedia.org/wiki/Wikipedia#cite_note-Econ21-13"><span class="cite-bracket">[</span>10<span class="cite-bracket">]</span></a></sup><sup id="cite_ref-Last_best_14-0" class="reference"><a href="https://en.wikipedia.org/wiki/Wikipedia#cite_note-Last_best-14"><span class="cite-bracket">[</span>11<span class="cite-bracket">]</span></a></sup>`;

		expect(
			doesDocumentHaveWikipediaLinks(
				parser.parseFromString(inputHTML, "text/html"),
			),
		).toBeFalsy();
	});

	test("test 2", () => {
		const parser = new DOMParser();
		const inputHTML = `<meta http-equiv="content-type" content="text/html; charset=utf-8">However, Castro and the other rebels were not kept in the circular buildings with their small cells and harsh conditions, but were instead kept in the hospital wing, which had a larger living area with better beds and living conditions.<sup class="noprint Inline-Template Template-Fact" style="white-space:nowrap;">[<i><a href="https://en.wikipedia.org/wiki/Wikipedia:Citation_needed" title="Wikipedia:Citation needed"><span title="This claim needs references to reliable sources. (August 2021)">citation needed</span></a></i>]</sup>`;

		expect(
			doesDocumentHaveWikipediaLinks(
				parser.parseFromString(inputHTML, "text/html"),
			),
		).toBeFalsy();
	});
});

describe("replaceWikipediaLinks - no wikipedia links", () => {
	test("test 1", () => {
		const parser = new DOMParser();
		const inputHTML = `<meta http-equiv="content-type" content="text/html; charset=utf-8"><p>The currying of a function with more than two arguments can be defined by induction.</p>`;

		let doc = parser.parseFromString(inputHTML, "text/html");
		replaceWikipediaLinks(doc);

		expect(doc.body.textContent?.trim()).toBe(
			"The currying of a function with more than two arguments can be defined by induction.",
		);
	});

	test("test 2", () => {
		const parser = new DOMParser();
		const inputHTML = `<meta http-equiv="content-type" content="text/html; charset=utf-8">According to the terms of the will he must manage it himself, something he conceals from his family.`;

		let doc = parser.parseFromString(inputHTML, "text/html");
		replaceWikipediaLinks(doc);

		expect(doc.body.textContent?.trim()).toBe(
			"According to the terms of the will he must manage it himself, something he conceals from his family.",
		);
	});
});

describe("replaceWikipediaLinks - has wikipedia links", () => {
	test("test 1", () => {
		const parser = new DOMParser();
		const inputHTML = `<meta http-equiv="content-type" content="text/html; charset=utf-8"><i><b>Centemodon</b></i> (meaning "point tooth") is an <a href="https://en.wikipedia.org/wiki/Extinct" class="mw-redirect" title="Extinct">extinct</a> <a href="https://en.wikipedia.org/wiki/Genus" title="Genus">genus</a> of <a href="https://en.wikipedia.org/wiki/Basal_(phylogeny)" class="mw-redirect" title="Basal (phylogeny)">basal</a><sup id="cite_ref-Centemodon_2-0" class="reference"><a href="https://en.wikipedia.org/wiki/Centemodon#cite_note-Centemodon-2"><span class="cite-bracket">[</span>2<span class="cite-bracket">]</span></a></sup> <a href="https://en.wikipedia.org/wiki/Phytosaur" class="mw-redirect" title="Phytosaur">phytosaur</a> from the Late <a href="https://en.wikipedia.org/wiki/Triassic" title="Triassic">Triassic</a> Period.`;

		let doc = parser.parseFromString(inputHTML, "text/html");
		replaceWikipediaLinks(doc);

		expect(doc.body.textContent?.trim()).toBe(
			'Centemodon (meaning "point tooth") is an [[Extinct|extinct]] [[Genus|genus]] of [[Basal (phylogeny)|basal]][2] [[Phytosaur|phytosaur]] from the Late [[Triassic]] Period.',
		);
	});

	test("test 2", () => {
		const parser = new DOMParser();
		const inputHTML = `<meta http-equiv="content-type" content="text/html; charset=utf-8">The <b>Hunan University of Science and Technology</b> (<b>HNUST</b>; <a href="https://en.wikipedia.org/wiki/Simplified_Chinese_characters" title="Simplified Chinese characters">Chinese</a>: <span lang="zh-Hans">湖南科技大学</span>; <a href="https://en.wikipedia.org/wiki/Pinyin" title="Pinyin">pinyin</a>: <i><span lang="zh-Latn">Húnán Kējì Dàxué</span></i>) is a provincial public university in <a href="https://en.wikipedia.org/wiki/Xiangtan" title="Xiangtan">Xiangtan</a>, <a href="https://en.wikipedia.org/wiki/Hunan" title="Hunan">Hunan</a> of China, under the jointly jurisdiction of central government and provincial government, and is mainly administered by Hunan Province.<sup id="cite_ref-:0_2-0" class="reference"><a href="https://en.wikipedia.org/wiki/Hunan_University_of_Science_and_Technology#cite_note-:0-2"><span class="cite-bracket">[</span>2<span class="cite-bracket">]</span></a></sup>`;

		let doc = parser.parseFromString(inputHTML, "text/html");
		replaceWikipediaLinks(doc);

		expect(doc.body.textContent?.trim()).toBe(
			"The Hunan University of Science and Technology (HNUST; [[Simplified Chinese characters|Chinese]]: 湖南科技大学; [[Pinyin|pinyin]]: Húnán Kējì Dàxué) is a provincial public university in [[Xiangtan]], [[Hunan]] of China, under the jointly jurisdiction of central government and provincial government, and is mainly administered by Hunan Province.[2]",
		);
	});
});

describe("replaceWikipediaLinks - has citation links", () => {
	test("test 2", () => {
		const parser = new DOMParser();
		const inputHTML = `<meta http-equiv="content-type" content="text/html; charset=utf-8">The county was created in 1703.<sup id="cite_ref-5" class="reference"><a href="https://en.wikipedia.org/wiki/Newport_County,_Rhode_Island#cite_note-5"><span class="cite-bracket">[</span>5<span class="cite-bracket">]</span></a></sup>`;

		let doc = parser.parseFromString(inputHTML, "text/html");
		replaceWikipediaLinks(doc);

		expect(doc.body.textContent?.trim()).toBe(
			"The county was created in 1703.[5]",
		);
	});

	test("test 2", () => {
		const parser = new DOMParser();
		const inputHTML = `<meta http-equiv="content-type" content="text/html; charset=utf-8">Following the death of Asaf Jah VI in 1911, he returned to Britain and settled in <a href="https://en.wikipedia.org/wiki/Hove" title="Hove">Hove</a>.<sup id="cite_ref-Middleton,_Judy_2014_5-0" class="reference"><a href="https://en.wikipedia.org/wiki/George_Casson_Walker#cite_note-Middleton,_Judy_2014-5"><span class="cite-bracket">[</span>5<span class="cite-bracket">]</span></a></sup>`;

		let doc = parser.parseFromString(inputHTML, "text/html");
		replaceWikipediaLinks(doc);

		expect(doc.body.textContent?.trim()).toBe(
			"Following the death of Asaf Jah VI in 1911, he returned to Britain and settled in [[Hove]].[5]",
		);
	});
});
