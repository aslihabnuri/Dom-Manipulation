"""Caption generation from what the clip actually says."""

import unittest
from pathlib import Path

from clipper.edit.caption import (
    build_caption, build_captions, extract_facts, _find_price, _normalise_size, _word_in,
)

KAOS = ("Nah ini kaos katun combed 30s ya kak, bahannya adem banget. "
        "Ukuran S, M, L, XL. Warna hitam, navy, maroon. "
        "Harga cuma Rp79.000 plus gratis ongkir. Yuk klik keranjang kuning.")


class TestWordBoundaries(unittest.TestCase):
    """Substring matching turned a t-shirt clip into a handbag one."""

    def test_tas_not_matched_inside_terbatas(self):
        self.assertFalse(_word_in("tas", "stoknya terbatas nih"))
        self.assertTrue(_word_in("tas", "tas kulit asli"))

    def test_rak_not_matched_inside_kerakusan(self):
        self.assertFalse(_word_in("rak", "kerakusan"))

    def test_indonesian_nya_suffix_still_matches(self):
        self.assertTrue(_word_in("hitam", "warna hitamnya bagus"))

    def test_category_ignores_embedded_substring(self):
        facts = extract_facts("Stoknya terbatas nih, buruan checkout")
        self.assertEqual(facts.category, "")
        self.assertEqual(facts.product, "")


class TestPrice(unittest.TestCase):
    """Hosts anchor high before revealing the real price."""

    def test_discount_wins_over_anchor(self):
        self.assertEqual(_find_price("dari Rp129.000 jadi Rp89.000"), "Rp89.000")

    def test_sekarang_cuma_pattern(self):
        self.assertEqual(_find_price("normalnya 150rb sekarang cuma 99rb"), "Rp99rb")

    def test_plain_price(self):
        self.assertEqual(_find_price("harganya Rp79.000 aja"), "Rp79.000")

    def test_no_price(self):
        self.assertEqual(_find_price("bahannya adem banget"), "")


class TestMaterials(unittest.TestCase):
    def test_kulit_is_skin_not_leather_without_a_qualifier(self):
        self.assertEqual(extract_facts("ringan di kulit, cocok untuk kulit sensitif").materials, [])

    def test_kulit_is_leather_when_qualified(self):
        self.assertIn("kulit", extract_facts("tasnya dari kulit asli ya kak").materials)

    def test_multi_word_fabric_stays_together(self):
        self.assertIn("katun combed", build_caption(KAOS))


class TestSizes(unittest.TestCase):
    def test_acronyms_stay_upper_case(self):
        self.assertEqual(extract_facts(KAOS).sizes, ["S", "M", "L", "XL"])

    def test_normalise(self):
        self.assertEqual(_normalise_size("m"), "M")
        self.assertEqual(_normalise_size("size L"), "L")
        self.assertEqual(_normalise_size("allsize"), "all size")

    def test_sentence_final_size_is_caught(self):
        self.assertIn("XL", extract_facts("tersedia ukuran L, XL.").sizes)

    def test_stray_letters_are_not_sizes(self):
        self.assertEqual(extract_facts("kemarin malam lah").sizes, [])


class TestCategoryAndBeat(unittest.TestCase):
    def test_shopping_cart_is_not_a_product(self):
        facts = extract_facts("yuk klik keranjang kuning, buruan checkout")
        self.assertEqual(facts.product, "")

    def test_detects_product_and_category(self):
        facts = extract_facts(KAOS)
        self.assertEqual(facts.category, "fashion")
        self.assertEqual(facts.product, "kaos")

    def test_beat_reflects_dominant_cue(self):
        self.assertEqual(extract_facts("yuk klik keranjang kuning, checkout sekarang").beat, "cta")
        self.assertEqual(extract_facts("bahannya tebal, jahitannya rapi banget").beat, "demo")

    def test_offers_detected(self):
        self.assertIn("gratis ongkir", extract_facts(KAOS).offers)


class TestAccessoriesAndColourWords(unittest.TestCase):
    """A real watch live was tagged #skincareroutine because "warna krim"
    matched the skincare product "krim", and watches were in no category."""

    def test_watches_are_recognised(self):
        facts = extract_facts("Jam tangannya bahan slepnya dari kulit sintetis")
        self.assertEqual(facts.category, "aksesoris")
        self.assertEqual(facts.product, "jam tangan")

    def test_colour_krim_is_not_a_skincare_product(self):
        facts = extract_facts("kasi tau warna krimnya warna krim tunjukin kalian")
        self.assertEqual(facts.category, "")

    def test_krim_with_skincare_context_still_counts(self):
        self.assertEqual(extract_facts("krim malam ini bagus untuk wajah").category, "skincare")

    def test_colour_cream_does_not_hijack_a_clothing_clip(self):
        facts = extract_facts("kaosnya ada warna cream dan hitam, bahan katun")
        self.assertEqual(facts.category, "fashion")
        self.assertEqual(facts.product, "kaos")

    def test_watch_hashtags(self):
        self.assertIn("#jamtangan", build_caption("jam tangan ini water resistant"))

    def test_longer_product_name_wins(self):
        """"jam tangan" must not lose to a bare earlier word."""
        self.assertEqual(extract_facts("jam tangan water resistant").product, "jam tangan")


class TestVocabularyIntegrity(unittest.TestCase):
    """A blind string replace once inserted the product word list into the
    hashtag table, and the duplicate key silently won -- watch clips then
    carried un-hashed words like "jam tangan" in place of tags."""

    def test_no_duplicate_keys_in_any_table(self):
        import ast
        import inspect

        from clipper.edit import caption as module

        # Resolved from the module itself, so the test does not depend on cwd.
        source = Path(inspect.getfile(module)).read_text(encoding="utf-8")
        for node in ast.walk(ast.parse(source)):
            if isinstance(node, ast.Dict):
                keys = [k.value for k in node.keys if isinstance(k, ast.Constant)]
                self.assertEqual(len(keys), len(set(keys)), f"kunci ganda: {keys}")

    def test_every_hashtag_starts_with_hash(self):
        from clipper.edit.caption import HASHTAGS
        for category, tags in HASHTAGS.items():
            for tag in tags:
                self.assertTrue(tag.startswith("#"), f"{category}: {tag!r}")

    def test_every_category_has_hashtags(self):
        from clipper.edit.caption import CATEGORIES, HASHTAGS
        for category in CATEGORIES:
            self.assertIn(category, HASHTAGS, f"kategori {category} tanpa hashtag")

    def test_generated_tags_are_all_hashes(self):
        from clipper.edit.caption import build_hashtags, extract_facts
        for text in ("jam tangan water resistant", "kaos katun warna hitam",
                     "serum untuk wajah", "keripik pedas enak"):
            for tag in build_hashtags(extract_facts(text)):
                self.assertTrue(tag.startswith("#"), f"{text}: {tag!r}")


class TestCaptionOutput(unittest.TestCase):
    def test_uses_only_facts_from_the_transcript(self):
        caption = build_caption(KAOS)
        self.assertIn("Rp79.000", caption)
        self.assertIn("katun combed", caption)
        self.assertIn("gratis ongkir", caption)

    def test_quotes_the_discounted_price(self):
        caption = build_caption("Celana linen ini dari Rp129.000 jadi Rp89.000 aja kak")
        self.assertIn("Rp89.000", caption)
        self.assertNotIn("Rp129.000", caption)

    def test_variants_differ(self):
        options = build_captions(KAOS, variants=3)
        self.assertEqual(len(options), 3)
        self.assertEqual(len(set(options)), 3)

    def test_hook_leads_when_supplied(self):
        caption = build_caption(KAOS, hook="Kaos adem dipakai seharian")
        self.assertTrue(caption.startswith("Kaos adem dipakai seharian."))

    def test_hashtags_match_the_category(self):
        self.assertIn("#fashionmurah", build_caption(KAOS))
        self.assertIn("#skincareroutine", build_caption("serum ini ringan banget teksturnya"))

    def test_thin_transcript_stays_short_and_honest(self):
        facts = extract_facts("iya kak betul, oke lanjut ya")
        self.assertTrue(facts.thin)
        caption = build_caption("iya kak betul, oke lanjut ya", session_id="2026-08-18")
        self.assertIn("2026-08-18", caption)
        self.assertNotIn("Rp", caption)

    def test_empty_transcript_does_not_crash(self):
        self.assertTrue(build_caption(""))

    def test_every_variant_carries_hashtags(self):
        for caption in build_captions(KAOS, variants=3):
            self.assertIn("#tiktokshop", caption)


if __name__ == "__main__":
    unittest.main()
