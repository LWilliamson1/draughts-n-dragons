"use client";

import { useState, useTransition } from "react";

interface Props {
  id: string;
  deleteAction: (id: string) => Promise<void>;
  label: string;
}

export default function DeleteButton({ id, deleteAction, label }: Props) {
  const [confirm, setConfirm] = useState(false);
  const [pending, startTransition] = useTransition();

  if (confirm) {
    return (
      <div className="flex items-center gap-2">
        <span className="font-im-fell text-dragon-crimson text-xs italic">Sure?</span>
        <button
          onClick={() => startTransition(() => deleteAction(id))}
          disabled={pending}
          className="font-cinzel text-xs text-dragon-crimson hover:text-parchment transition-colors"
        >
          {pending ? "…" : "Yes"}
        </button>
        <button
          onClick={() => setConfirm(false)}
          className="font-cinzel text-xs text-parchment-dark opacity-50 hover:opacity-100 transition-opacity"
        >
          No
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirm(true)}
      className="font-cinzel text-xs text-parchment-dark opacity-40 hover:text-dragon-crimson hover:opacity-100 transition-all"
    >
      Delete
    </button>
  );
}
