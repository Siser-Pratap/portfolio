"use client"

export type StepId = "duration" | "date" | "time" | "details"

/**
 * Length comes first so the calendar can grey out days that have no room for
 * a meeting that long — otherwise the visitor picks a date, picks a length,
 * and only then discovers the day is full.
 */
export const STEP_ORDER: StepId[] = ["duration", "date", "time", "details"]

const LABELS: Record<StepId, string> = {
  duration: "Length",
  date: "Date",
  time: "Time",
  details: "Details",
}

type Props = {
  current: StepId
  /** Steps already answered — these stay clickable so the visitor can go back. */
  completed: StepId[]
  onJump: (step: StepId) => void
}

const StepIndicator = ({ current, completed, onJump }: Props) => {
  const currentIndex = STEP_ORDER.indexOf(current)

  return (
    <nav aria-label="Booking progress" className="flex items-center gap-2 mb-10">
      {STEP_ORDER.map((step, index) => {
        const isCurrent = step === current
        const isDone = completed.includes(step) && !isCurrent
        const reachable = isDone || index < currentIndex

        return (
          <div key={step} className="flex items-center gap-2 flex-1 last:flex-none">
            <button
              type="button"
              disabled={!reachable}
              aria-current={isCurrent ? "step" : undefined}
              onClick={() => reachable && onJump(step)}
              className={[
                "flex items-center gap-2 text-[12px] font-semibold tracking-wide uppercase transition-colors",
                reachable ? "cursor-pointer hover:text-[#FF4B1F]" : "cursor-default",
                isCurrent ? "text-[#0D0505]" : isDone ? "text-[#8A8A8A]" : "text-[#C9C9C9]",
              ].join(" ")}
            >
              <span
                className={[
                  "w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold border transition-colors",
                  isCurrent
                    ? "bg-gradient-to-b from-[#FF4B1F] to-[#FF6A21] text-white border-transparent"
                    : isDone
                      ? "bg-[#0D0505] text-white border-transparent"
                      : "bg-transparent text-[#C9C9C9] border-[#EAEAEA]",
                ].join(" ")}
              >
                {isDone ? "✓" : index + 1}
              </span>
              <span className="hidden sm:inline">{LABELS[step]}</span>
            </button>

            {index < STEP_ORDER.length - 1 && (
              <span className="flex-1 h-px bg-[#EAEAEA] relative overflow-hidden">
                <span
                  className="absolute inset-0 bg-[#FF4B1F] origin-left transition-transform duration-500"
                  style={{ transform: `scaleX(${index < currentIndex ? 1 : 0})` }}
                />
              </span>
            )}
          </div>
        )
      })}
    </nav>
  )
}

export default StepIndicator
