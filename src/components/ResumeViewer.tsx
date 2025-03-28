
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ResumeViewerProps {
  isOpen: boolean;
  onClose: () => void;
  resumeText: string;
  title: string;
  description?: string;
}

const ResumeViewer = ({ isOpen, onClose, resumeText, title, description }: ResumeViewerProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && (
            <DialogDescription>
              {description}
            </DialogDescription>
          )}
        </DialogHeader>
        <ScrollArea className="h-[60vh] border rounded-md p-4 bg-muted/20">
          <pre className="text-sm whitespace-pre-wrap font-mono">{resumeText}</pre>
        </ScrollArea>
        <div className="flex justify-end">
          <Button onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ResumeViewer;
