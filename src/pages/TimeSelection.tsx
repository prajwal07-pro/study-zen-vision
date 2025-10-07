import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Clock, Timer } from "lucide-react";

const TimeSelection = () => {
  const navigate = useNavigate();
  const [selectedMinutes, setSelectedMinutes] = useState<number | null>(null);
  const [customMinutes, setCustomMinutes] = useState("");

  const presetDurations = [15, 25, 45, 60, 90];

  const handleStart = () => {
    const duration = selectedMinutes || parseInt(customMinutes);
    if (duration && duration > 0) {
      navigate(`/focus?duration=${duration}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/10 via-background to-accent/10">
      <Card className="w-full max-w-2xl p-8 space-y-8 backdrop-blur-sm bg-card/80 border-border/50">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent mb-4">
            <Timer className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Focus Mode
          </h1>
          <p className="text-muted-foreground text-lg">
            Select your focus duration and stay productive
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-sm font-medium mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Quick Select
            </h2>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
              {presetDurations.map((minutes) => (
                <Button
                  key={minutes}
                  variant={selectedMinutes === minutes ? "default" : "outline"}
                  className="h-20 flex flex-col gap-1"
                  onClick={() => {
                    setSelectedMinutes(minutes);
                    setCustomMinutes("");
                  }}
                >
                  <span className="text-2xl font-bold">{minutes}</span>
                  <span className="text-xs">minutes</span>
                </Button>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          <div>
            <h2 className="text-sm font-medium mb-4">Custom Duration</h2>
            <div className="flex gap-3">
              <Input
                type="number"
                placeholder="Enter minutes"
                value={customMinutes}
                onChange={(e) => {
                  setCustomMinutes(e.target.value);
                  setSelectedMinutes(null);
                }}
                className="text-lg"
                min="1"
                max="480"
              />
              <span className="flex items-center text-muted-foreground">min</span>
            </div>
          </div>

          <Button
            size="lg"
            className="w-full text-lg h-14 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
            onClick={handleStart}
            disabled={!selectedMinutes && !customMinutes}
          >
            Start Focus Session
          </Button>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          We'll monitor your focus using your camera and screen activity
        </p>
      </Card>
    </div>
  );
};

export default TimeSelection;
