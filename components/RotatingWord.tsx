/**
 * Cycles through a list of words in place. Pure CSS: every word sits in the same grid cell
 * so the line never shifts, and each fades up on its own delay. Screen readers get the first
 * word only. Written for five words; the keyframes in globals.css assume that count.
 */
export default function RotatingWord({ words, interval = 2.4 }: { words: string[]; interval?: number }) {
  return (
    <span className="word-rotator" style={{ ["--t" as string]: `${interval}s`, ["--n" as string]: words.length }}>
      {words.map((word, i) => (
        <span
          key={word}
          className="word-rotator-item"
          style={{ animationDelay: `${i * interval}s` }}
          aria-hidden={i > 0 ? true : undefined}
        >
          {word}
        </span>
      ))}
    </span>
  );
}
