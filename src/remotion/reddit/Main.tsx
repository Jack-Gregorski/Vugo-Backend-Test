import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  useVideoConfig,
  OffthreadVideo,
} from "remotion";
import SubtitlePage from "./SubtitlePage";
import { createTikTokStyleCaptions, Caption } from "@remotion/captions";

const SWITCH_CAPTIONS_EVERY_MS = 1200;

export const RedditStyleMain: React.FC<{
  audioUrl: string;
  transcript: {
    text: string;
    start: number;   // seconds
    end: number;     // seconds
    confidence?: number;
  }[];
  backgroundUrl?: string;
}> = ({ audioUrl, transcript, backgroundUrl }) => {
  const { fps } = useVideoConfig();

  // ✅ Map AssemblyAI words[] to Caption[]
  const captions: Caption[] = transcript.map((entry) => ({
    text: entry.text,
    startMs: Math.floor(entry.start * 1000),
    endMs: Math.floor(entry.end * 1000),
    timestampMs: Math.floor(entry.start * 1000),
    confidence: entry.confidence ?? 1.0,
  }));

  const { pages } = createTikTokStyleCaptions({
    combineTokensWithinMilliseconds: SWITCH_CAPTIONS_EVERY_MS,
    captions,
  });

  return (
    <AbsoluteFill>
      {/* Background video */}
      <OffthreadVideo
        src={backgroundUrl ?? "/background.mp4"}
        onError={(e) => {
    console.error("Video error:", e);
  }}
        style={{ objectFit: "cover" }}
        startFrom={0}
        playbackRate={1}
        muted
      />

      {/* Audio track */}
      <Audio src={audioUrl} />

      {/* Subtitle sequences */}
      {pages.map((page, i) => {
        const next = pages[i + 1];
        const startFrame = Math.floor((page.startMs / 1000) * fps);
        const endFrame = next
          ? Math.floor((next.startMs / 1000) * fps)
          : startFrame + Math.floor((SWITCH_CAPTIONS_EVERY_MS / 1000) * fps);
        const durationInFrames = endFrame - startFrame;

        return (
          <Sequence key={i} from={startFrame} durationInFrames={durationInFrames}>
            <SubtitlePage page={page} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
