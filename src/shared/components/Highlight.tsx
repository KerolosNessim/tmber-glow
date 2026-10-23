import { Fragment } from 'react'

/** Renders "Built for *cold* mornings" with the starred words in `className`. */
export function Highlight({ text, className }: { text: string; className: string }) {
  return (
    <>
      {text.split(/\*([^*]+)\*/g).map((part, i) =>
        i % 2 === 1 ? (
          <span key={i} className={className}>
            {part}
          </span>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  )
}
