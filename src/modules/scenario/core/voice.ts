/** The mascot's voice: reads a line aloud, or stays silent when muted or with no recording. */
export type Voice = {
  say: (text: string) => void;
  /** Reads a line aloud even when muted: the player asked to hear it again. */
  repeat: (text: string) => void;
  stop: () => void;
  isMuted: () => boolean;
  setMuted: (muted: boolean) => void;
};
