import { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, MessageSquare, Monitor, Camera, Brain } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import CameraFeed from "@/components/FocusMode/CameraFeed";
import Chatbot from "@/components/FocusMode/Chatbot";
import FocusTimer from "@/components/FocusMode/FocusTimer";
import FocusStatus from "@/components/FocusMode/FocusStatus";

const FocusMode = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showChat, setShowChat] = useState(false);
  const [focusState, setFocusState] = useState<string>("Loading...");
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const duration = parseInt(searchParams.get("duration") || "25");

  useEffect(() => {
    requestScreenAccess();
  }, []);

  const requestScreenAccess = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false,
      });
      setScreenStream(stream);
      toast({
        title: "Screen sharing enabled",
        description: "Your screen activity is being monitored",
      });
    } catch (error) {
      toast({
        title: "Screen access denied",
        description: "Focus mode works best with screen monitoring",
        variant: "destructive",
      });
    }
  };

  const handleEndSession = () => {
    if (screenStream) {
      screenStream.getTracks().forEach((track) => track.stop());
    }
    navigate("/");
  };

  const handleTimeUp = () => {
    toast({
      title: "Focus session complete! 🎉",
      description: "Great work staying focused!",
    });
    setTimeout(() => handleEndSession(), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <Brain className="w-6 h-6 text-primary" />
              Focus Mode Active
            </div>
            <FocusTimer durationMinutes={duration} onTimeUp={handleTimeUp} />
          </div>
          <Button variant="outline" size="sm" onClick={handleEndSession}>
            <X className="w-4 h-4 mr-2" />
            End Session
          </Button>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-4">
          {/* Camera Feed - Main Area */}
          <Card className="lg:col-span-2 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Camera className="w-5 h-5 text-primary" />
                Focus Detection
              </h2>
              {screenStream && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Monitor className="w-4 h-4 text-success" />
                  Screen monitored
                </div>
              )}
            </div>
            <CameraFeed onFocusStateChange={setFocusState} />
          </Card>

          {/* Status Panel */}
          <div className="space-y-4">
            <FocusStatus focusState={focusState} />
            
            <Card className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                Need Help?
              </h3>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowChat(!showChat)}
              >
                {showChat ? "Hide" : "Show"} AI Assistant
              </Button>
            </Card>
          </div>
        </div>

        {/* Chatbot Overlay */}
        {showChat && (
          <div className="fixed bottom-4 right-4 w-96 h-[600px] z-50">
            <Chatbot onClose={() => setShowChat(false)} />
          </div>
        )}
      </div>
    </div>
  );
};

export default FocusMode;
