import { X } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export function LogSearchByEventId({
  searchEventId,
  setSearchEventId,
  onKeyDown,
  onClick,
}: {
  searchEventId: string;
  setSearchEventId: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onClick: () => void;
}) {
  return (
    <div className="relative w-[250px]">
      <Input
        type="text"
        placeholder="Search by Event ID..."
        value={searchEventId}
        onChange={(e) => setSearchEventId(e.target.value)}
        onKeyDown={onKeyDown}
      />
      {searchEventId && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6"
          onClick={onClick}
        >
          <X className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
}
