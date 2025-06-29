import { z } from "zod";
export const COMP_NAME = "MyComp";

export const CompositionProps = z.object({
  title: z.string(),
});

export const defaultMyCompProps: z.infer<typeof CompositionProps> = {
  title: "Next.js and Remotion",
};


export const RedditStyleProps = z.object({
  title: z.string(),
  transcript: z
    .array(
      z.object({
        text: z.string(),
        start: z.number(),
        end: z.number(),
        timestamp: z.number(), // required by Remotion captions
        confidence: z.number().optional(), // optional, default to 1.0
      })
    )
    .min(1),
  audioUrl: z.string(),
  backgroundUrl: z.string().optional(),
});

export const defaultRedditStyleProps: z.infer<typeof RedditStyleProps> = {
  title: "Today I F***ed Up",
  transcript: [
    {
      text: "Example line",
      start: 0,
      end: 2,
      timestamp: 0,
      confidence: 1,
    },
    {
      text: "Next line",
      start: 2,
      end: 4,
      timestamp: 2,
      confidence: 1,
    },
  ],
  audioUrl: "/script.mp3",
  backgroundUrl: "/background.mp4"
};

export const DURATION_IN_FRAMES = 200;
export const VIDEO_WIDTH = 1280;
export const VIDEO_HEIGHT = 720;
export const VIDEO_FPS = 30;
