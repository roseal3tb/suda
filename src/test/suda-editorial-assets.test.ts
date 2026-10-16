import { describe, expect, it } from "vitest";
import { existsSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { designerQuotes } from "@/features/suda/designers";
import { editorialMedia, fashionMedia } from "@/features/suda/mock-data";

const publicRoot = resolve(process.cwd(), "public");
const actualAsset = (pathname: string) => resolve(publicRoot, pathname.replace(/^\//, ""));

describe("2026 SUDA editorial restoration", () => {
  it("uses all four user-provided Angham portraits in the homepage collage", () => {
    expect(fashionMedia.profile).toHaveLength(4);
    expect(new Set(fashionMedia.profile.map((p) => p.src)).size).toBe(4);
    fashionMedia.profile.forEach(({ src, alt }) => {
      expect(src).toContain("angham-");
      expect(alt).toContain("أنغام");
      expect(existsSync(actualAsset(src))).toBe(true);
    });
  });

  it("retains the atelier film and original loops", () => {
    for (const src of [editorialMedia.montageWebm, editorialMedia.montageMp4, editorialMedia.sewing, editorialMedia.draping, editorialMedia.beading]) {
      expect(existsSync(actualAsset(src))).toBe(true);
    }
  });

  it("keeps four complete restored films alongside lightweight previews", () => {
    for (let i = 1; i <= 4; i++) {
      for (const suffix of ["full.mp4", "preview.mp4", "poster.jpg"]) {
        const path = resolve(publicRoot, `editorial/runway/runway-${i}-${suffix}`);
        expect(existsSync(path)).toBe(true);
        expect(statSync(path).size).toBeGreaterThan(0);
      }
    }
  });

  it("credits only verified interview extracts and discloses translation", () => {
    expect(designerQuotes).toHaveLength(4);
    designerQuotes.forEach((item) => {
      expect(item.source.startsWith("https://")).toBe(true);
      expect(item.quote.length).toBeGreaterThan(30);
    });
  });
});
