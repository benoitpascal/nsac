/** The mascot's voice: reads a line aloud, or stays silent when muted or with no recording. */
export type Voice = {
  say: (text: string) => void;
  stop: () => void;
  isMuted: () => boolean;
  setMuted: (muted: boolean) => void;
};
