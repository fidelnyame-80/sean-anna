"use client";

import { useEffect, useRef, useState } from "react";

type Choice = "Bride" | "Both" | "Groom";

const choices: Choice[] = ["Bride", "Both", "Groom"];

const questions = [
  "Who said 'I love you' first?",
  "Who takes longer to get ready?",
  "Who is more likely to plan a surprise date?",
  "Who is more likely to pack extra snacks for a trip?",
  "Who is more likely to ask for one more song?",
  "Who is more likely to make friends with the next table?",
  "Who is more likely to remember every anniversary?",
  "Who is more likely to suggest a spontaneous road trip?",
  "Who is more likely to take the most photos?",
  "Who is more likely to keep the party going?",
] as const;

export default function Quiz() {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<(Choice | null)[]>(() =>
    Array(questions.length).fill(null),
  );
  const [hasInteracted, setHasInteracted] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const isComplete = questionIndex === questions.length;

  useEffect(() => {
    if (hasInteracted) headingRef.current?.focus({ preventScroll: true });
  }, [questionIndex, hasInteracted]);

  function choose(choice: Choice) {
    setAnswers((previous) => {
      const updated = [...previous];
      updated[questionIndex] = choice;
      return updated;
    });
    setQuestionIndex((previous) => Math.min(previous + 1, questions.length));
    setHasInteracted(true);
  }

  function goBack() {
    setQuestionIndex((previous) => Math.max(previous - 1, 0));
    setHasInteracted(true);
  }

  function startAgain() {
    setAnswers(Array(questions.length).fill(null));
    setQuestionIndex(0);
    setHasInteracted(true);
  }

  const counts = choices.map((choice) => ({
    choice,
    count: answers.filter((answer) => answer === choice).length,
  }));

  return (
    <section className="quiz" aria-label="Wedding quiz">
      <div className="quiz-card">
        <div className="quiz-topline">
          <p className="quiz-eyebrow">The little love quiz</p>
          <p className="quiz-counter">
            {isComplete ? "10 OF 10" : `${questionIndex + 1} OF ${questions.length}`}
          </p>
        </div>

        <div
          className="quiz-progress"
          role="progressbar"
          aria-label="Quiz progress"
          aria-valuemin={0}
          aria-valuemax={questions.length}
          aria-valuenow={questionIndex}
          aria-valuetext={
            isComplete
              ? "All 10 questions answered"
              : `Question ${questionIndex + 1} of ${questions.length}`
          }
        >
          <span
            className="quiz-progress-fill"
            style={{ width: `${(questionIndex / questions.length) * 100}%` }}
          />
        </div>

        {isComplete ? (
          <div className="quiz-summary">
            <h2 className="quiz-question" ref={headingRef} tabIndex={-1}>
              Your picks
            </h2>
            <p className="quiz-summary-intro">
              A little glimpse of your guesses. There are no right answers.
            </p>
            <div className="quiz-summary-counts" aria-label="Pick totals">
              {counts.map(({ choice, count }) => (
                <div className="quiz-summary-count" key={choice}>
                  <strong>{count}</strong>
                  <span>{choice}</span>
                </div>
              ))}
            </div>
            <ol className="quiz-summary-list">
              {questions.map((question, index) => (
                <li className="quiz-summary-item" key={question}>
                  <span className="quiz-summary-question">{question}</span>
                  <strong className="quiz-summary-answer">
                    {answers[index]}
                  </strong>
                </li>
              ))}
            </ol>
            <div className="quiz-actions">
              <button className="quiz-back" type="button" onClick={goBack}>
                Back to last question
              </button>
              <button className="quiz-reset" type="button" onClick={startAgain}>
                Start again
              </button>
            </div>
          </div>
        ) : (
          <div className="quiz-question-panel" key={questionIndex}>
            <h2 className="quiz-question" ref={headingRef} tabIndex={-1}>
              {questions[questionIndex]}
            </h2>
            <span className="quiz-motif" aria-hidden="true">
              {questionIndex === 1 ? (
                <svg viewBox="0 0 24 24" fill="none" focusable="false">
                  <circle cx="12" cy="12" r="9" fill="currentColor" />
                  <path d="M12 6.5v5.8l3.5 2.2" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" focusable="false">
                  <path
                    d="M12 20.3 3.8 12.7C-.1 9.1 5.7 2.5 10 6.5L12 8.4l2-1.9c4.3-4 10.1 2.6 6.2 6.2L12 20.3Z"
                    fill="currentColor"
                  />
                </svg>
              )}
            </span>
            <div
              className="quiz-options"
              role="group"
              aria-label={`Your pick for question ${questionIndex + 1}`}
            >
              {choices.map((choice) => (
                <button
                  className="quiz-option"
                  type="button"
                  key={choice}
                  aria-pressed={answers[questionIndex] === choice}
                  onClick={() => choose(choice)}
                >
                  {choice}
                </button>
              ))}
            </div>
            {questionIndex > 0 && (
              <div className="quiz-actions">
                <button className="quiz-back" type="button" onClick={goBack}>
                  Previous
                </button>
                <button
                  className="quiz-reset"
                  type="button"
                  onClick={startAgain}
                >
                  Start again
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
