"use client";

import Image from "next/image";

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
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">
            Google App Verification Notice
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-3">
            <p>
              When connecting to Google services, you may see a security warning
              from Google. We are in the process of getting our application
              verified, this warning will disappear soon.
            </p>
            <p className="font-medium">
              Please follow the instructions shown in the screenshot below to
              proceed safely:
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 border">
            <Image
              src="/warning.png"
              alt="Google Warning"
              className="w-full rounded-lg shadow"
              width={32}
              height={32}
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
            <p className="font-medium text-blue-800 mb-3">
              To continue connecting your Google account:
            </p>
            <ol className="space-y-2 text-sm">
              <li>
                1. Click &quot;Advanced&quot; at the bottom of the Google
                warning page
              </li>
              <li>
                2. Click &ldquo;Go to slesh.ai (unsafe)&quot; at the bottom
              </li>
              <li>
                3. This will redirect you to complete the connection process
              </li>
              <li>4. Your account will be securely connected to Slesh</li>
            </ol>
          </div>
        </div>

        <div className="flex gap-3 p-6 border-t justify-end">
          <button
            onClick={onClose}
            className="px-6 py-3 border border-gray-300 rounded-xl text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onProceed}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
          >
            I Understand, Continue
          </button>
        </div>
      </div>
    </div>
  );
}
