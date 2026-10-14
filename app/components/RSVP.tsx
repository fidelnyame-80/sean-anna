"use client";

import { useId, useRef, useState, type FormEvent } from "react";

type Attendance = "yes" | "no" | "";

type RSVPDetails = {
  name: string;
  email: string;
  attending: Attendance;
  guestCount: string;
  dietaryNote: string;
};

const storageKey = "sean-anna-rsvp-draft";

export default function RSVP({ recipientEmail = "" }: { recipientEmail?: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const titleId = useId();
  const introId = useId();

  const [details, setDetails] = useState<RSVPDetails>({
    name: "",
    email: "",
    attending: "",
    guestCount: "1",
    dietaryNote: "",
  });
  const [dialogMessage, setDialogMessage] = useState("");
  const [savedMessage, setSavedMessage] = useState("");

  function openDialog() {
    setDialogMessage("");
    setSavedMessage("");

    try {
      const saved = window.localStorage.getItem(storageKey);
      if (saved) {
        const draft = JSON.parse(saved) as Partial<RSVPDetails>;
        setDetails({
          name: typeof draft.name === "string" ? draft.name : "",
          email: typeof draft.email === "string" ? draft.email : "",
          attending:
            draft.attending === "yes" || draft.attending === "no"
              ? draft.attending
              : "",
          guestCount:
            typeof draft.guestCount === "string" ? draft.guestCount : "1",
          dietaryNote:
            typeof draft.dietaryNote === "string" ? draft.dietaryNote : "",
        });
      }
    } catch {
      // Guests can still use the form when storage is unavailable.
    }

    if (!dialogRef.current?.open) {
      dialogRef.current?.showModal();
      nameRef.current?.focus();
    }
  }

  function closeDialog() {
    dialogRef.current?.close();
  }

  function updateDetails(next: Partial<RSVPDetails>) {
    setDetails((current) => ({ ...current, ...next }));
    setDialogMessage("");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const name = details.name.trim();
    const email = details.email.trim();
    if (!name || !email || !details.attending) {
      setDialogMessage("Please add your name, email, and attendance choice.");
      return;
    }

    const response: RSVPDetails = {
      name,
      email,
      attending: details.attending,
      guestCount: details.attending === "yes" ? details.guestCount : "0",
      dietaryNote:
        details.attending === "yes" ? details.dietaryNote.trim() : "",
    };

    if (recipientEmail.trim()) {
      const body = [
        `Name: ${response.name}`,
        `Email: ${response.email}`,
        `Attending: ${response.attending === "yes" ? "Yes" : "No"}`,
        `Guests (including me): ${response.guestCount}`,
        `Dietary notes: ${response.dietaryNote || "None"}`,
      ].join("\n");

      setDialogMessage(
        "Your email app is opening. Please send the draft there to finish your RSVP.",
      );
      window.location.href = `mailto:${recipientEmail.trim()}?subject=${encodeURIComponent(`Wedding RSVP from ${response.name}`)}&body=${encodeURIComponent(body)}`;
      return;
    }

    try {
      window.localStorage.setItem(storageKey, JSON.stringify(response));
      setSavedMessage(
        "Your RSVP draft is saved on this device. It has not been sent yet.",
      );
      closeDialog();
    } catch {
      setDialogMessage(
        "This browser could not save your draft. Please try again or copy your answers before closing.",
      );
    }
  }

  return (
    <div className="rsvp">
      <button
        ref={triggerRef}
        type="button"
        className="button button--accent rsvp-trigger"
        onClick={openDialog}
      >
        RSVP HERE
      </button>

      {savedMessage && (
        <p className="rsvp-feedback" role="status">
          {savedMessage}
        </p>
      )}

      <dialog
        ref={dialogRef}
        className="rsvp-dialog"
        aria-labelledby={titleId}
        aria-describedby={introId}
        onClose={() => triggerRef.current?.focus()}
        onClick={(event) => {
          if (event.target === event.currentTarget) closeDialog();
        }}
      >
        <div className="rsvp-panel">
          <button
            type="button"
            className="rsvp-close"
            aria-label="Close RSVP form"
            onClick={closeDialog}
          >
            ×
          </button>
          <p className="rsvp-eyebrow">WE HOPE YOU CAN JOIN US</p>
          <h2 className="rsvp-title" id={titleId}>
            Kindly RSVP
          </h2>
          <p className="rsvp-intro" id={introId}>
            Let us know if you&apos;ll be celebrating with us.
          </p>

          <form className="rsvp-form" onSubmit={handleSubmit}>
            <label className="rsvp-field">
              <span>Your name</span>
              <input
                ref={nameRef}
                name="name"
                type="text"
                autoComplete="name"
                required
                value={details.name}
                onChange={(event) => updateDetails({ name: event.target.value })}
              />
            </label>

            <label className="rsvp-field">
              <span>Email address</span>
              <input
                name="email"
                type="email"
                autoComplete="email"
                required
                value={details.email}
                onChange={(event) => updateDetails({ email: event.target.value })}
              />
            </label>

            <fieldset className="rsvp-fieldset">
              <legend>Will you attend?</legend>
              <div className="rsvp-options">
                <label className="rsvp-option">
                  <input
                    type="radio"
                    name="attending"
                    value="yes"
                    required
                    checked={details.attending === "yes"}
                    onChange={() => updateDetails({ attending: "yes" })}
                  />
                  Joyfully accepts
                </label>
                <label className="rsvp-option">
                  <input
                    type="radio"
                    name="attending"
                    value="no"
                    required
                    checked={details.attending === "no"}
                    onChange={() => updateDetails({ attending: "no" })}
                  />
                  Regretfully declines
                </label>
              </div>
            </fieldset>

            {details.attending === "yes" && (
              <>
                <label className="rsvp-field">
                  <span>Number of guests, including you</span>
                  <input
                    name="guestCount"
                    type="number"
                    inputMode="numeric"
                    min="1"
                    required
                    value={details.guestCount}
                    onChange={(event) =>
                      updateDetails({ guestCount: event.target.value })
                    }
                  />
                </label>
                <label className="rsvp-field">
                  <span>Dietary notes (optional)</span>
                  <textarea
                    name="dietaryNote"
                    rows={3}
                    value={details.dietaryNote}
                    onChange={(event) =>
                      updateDetails({ dietaryNote: event.target.value })
                    }
                  />
                </label>
              </>
            )}

            {!recipientEmail.trim() && (
              <p className="rsvp-note">
                This saves a draft on your device. It will not be sent to the
                couple yet.
              </p>
            )}
            {dialogMessage && (
              <p className="rsvp-feedback" role="status">
                {dialogMessage}
              </p>
            )}
            <div className="rsvp-actions">
              <button type="submit" className="button button--accent">
                {recipientEmail.trim() ? "Prepare email RSVP" : "Save RSVP draft"}
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
}
