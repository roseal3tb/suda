import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { AtelierFilm } from "@/components/suda/atelier-film";
import { Intro } from "@/components/suda/intro";
import { INTRO_KEY } from "@/features/suda/storage";
let reduce = false;
function matchMedia(query: string) {
  return {
    matches: reduce && query.includes("reduced-motion"),
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  };
}
describe("Editorial motion safeguards", () => {
  beforeEach(() => {
    reduce = false;
    sessionStorage.clear();
    vi.stubGlobal("matchMedia", matchMedia);
    vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue();
    vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
  });
  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });
  it("uses a static poster without requesting video or showing intro for reduced motion", () => {
    reduce = true;
    const view = render(
      <>
        <Intro />
        <AtelierFilm />
      </>,
    );
    expect(view.container.querySelector("video")).toBeNull();
    expect(
      screen.queryByRole("region", { name: "مقدمة سُدى" }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole("img")).toHaveAttribute(
      "src",
      "/editorial/images/hero_atelier_poster.webp",
    );
  });
  it("autoplays a muted inline film without a visible play control and falls back on failure", () => {
    const view = render(<AtelierFilm />);
    const video = view.container.querySelector("video")!;
    expect(video.muted).toBe(true);
    expect(video.defaultMuted).toBe(true);
    expect(video.controls).toBe(false);
    expect(video).toHaveAttribute("playsinline");
    expect(video.querySelectorAll("source")).toHaveLength(2);
    fireEvent.playing(video);
    expect(screen.getByRole("img")).toHaveClass("is-hidden");
    fireEvent.pause(video);
    expect(screen.getByRole("img")).not.toHaveClass("is-hidden");
    expect(video).toHaveAttribute("autoplay");
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    fireEvent.error(video);
    expect(view.container.querySelector("video")).toBeNull();
    expect(screen.getByRole("img")).toBeInTheDocument();
  });
  it("draws the intro once per session and lets Escape dismiss it without waiting for assets", () => {
    vi.useFakeTimers();
    let view = render(<Intro />);
    expect(
      screen.getByRole("region", { name: "مقدمة سُدى" }),
    ).toBeInTheDocument();
    expect(sessionStorage.getItem(INTRO_KEY)).toBe("1");
    fireEvent.keyDown(screen.getByRole("button", { name: "تخطّي المقدمة" }), {
      key: "Escape",
    });
    act(() => vi.advanceTimersByTime(301));
    expect(screen.queryByRole("region")).not.toBeInTheDocument();
    view.unmount();
    view = render(<Intro />);
    expect(screen.queryByRole("region")).not.toBeInTheDocument();
  });
});
