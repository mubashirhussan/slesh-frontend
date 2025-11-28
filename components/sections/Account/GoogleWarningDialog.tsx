/* eslint-disable @next/next/no-img-element */
"use client";

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  onProceed: () => void;
}

export default function GoogleWarningDialog({
  isOpen,
  onClose,
  onProceed,
}: DialogProps) {
  if (!isOpen) return null;

  return (
    <div
      className={`dialog-overlay ${isOpen ? "show" : ""}`}
      id="googleWarningDialog"
      onClick={onClose}
    >
      <div
        className="dialog-container"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="dialog-header">
          <h2 className="dialog-title">Google App Verification Notice</h2>
          <button className="dialog-close" id="closeDialogBtn" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="dialog-content">
          <div className="warning-text">
            <p>
              When connecting to Google services, you may see a security warning
              from Google. We are in the process of getting our application
              verified, this warning will disappear soon.
            </p>
            <p>
              <strong>
                Please follow the instructions shown in the screenshot below to
                proceed safely:
              </strong>
            </p>
          </div>
          <div className="warning-screenshot">
            <img
              src="/warning.png"
              alt="Google Security Warning Screenshot"
            />
          </div>
          <div className="warning-instructions">
            <p>To continue connecting your Google account:</p>
            <ol>
              <li>
                Click &quot;Advanced&quot; at the bottom of the Google warning
                page
              </li>
              <li>
                Click &quot;Go to slesh.ai (unsafe)&quot; at the bottom of the
                Google warning page
              </li>
              <li>
                This will redirect you to complete the connection process
              </li>
              <li>Your account will be securely connected to Slesh</li>
            </ol>
          </div>
        </div>
        <div className="dialog-actions">
          <button
            className="dialog-button secondary"
            id="cancelConnectionBtn"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="dialog-button primary"
            id="proceedConnectionBtn"
            onClick={onProceed}
          >
            I Understand, Continue
          </button>
        </div>
      </div>
    </div>
  );
}
