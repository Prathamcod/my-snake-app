import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Direction } from "@/lib/snake-game";

interface DirectionPadProps {
  onDirection: (direction: Direction) => void;
  disabled: boolean;
}

const controls = [
  { direction: "up" as const, label: "Move up", icon: ArrowUp, position: "col-start-2 row-start-1" },
  { direction: "left" as const, label: "Move left", icon: ArrowLeft, position: "col-start-1 row-start-2" },
  { direction: "down" as const, label: "Move down", icon: ArrowDown, position: "col-start-2 row-start-2" },
  { direction: "right" as const, label: "Move right", icon: ArrowRight, position: "col-start-3 row-start-2" },
];

export function DirectionPad({ onDirection, disabled }: DirectionPadProps) {
  return (
    <div className="grid w-fit grid-cols-3 grid-rows-2 gap-2" aria-label="Touch direction controls">
      {controls.map(({ direction, label, icon: Icon, position }) => (
        <Button
          key={direction}
          type="button"
          size="gameIcon"
          variant="control"
          className={position}
          aria-label={label}
          disabled={disabled}
          onPointerDown={(event) => {
            event.preventDefault();
            onDirection(direction);
          }}
        >
          <Icon aria-hidden="true" />
        </Button>
      ))}
    </div>
  );
}
