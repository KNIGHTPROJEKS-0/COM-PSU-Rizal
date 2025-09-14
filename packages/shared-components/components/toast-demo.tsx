"use client"

import { toast } from "sonner"
import { Button } from "@/components/ui/button"

export function ToastDemo() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={() =>
            toast("Event has been created", {
              description: "Sunday, December 03, 2023 at 9:00 AM",
              action: {
                label: "Undo",
                onClick: () => console.log("Undo"),
              },
            })
          }
        >
          Show Toast
        </Button>
        <Button
          variant="outline"
          onClick={() => toast.success("Successfully updated!")}
        >
          Success Toast
        </Button>
        <Button
          variant="outline"
          onClick={() => toast.error("Something went wrong!")}
        >
          Error Toast
        </Button>
      </div>
    </div>
  )
}