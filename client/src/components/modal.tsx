import React, { ReactNode } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";


interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: ReactNode;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  submitButtonText: string;
}

const Modal: React.FC<ModalProps> = ({ open, onOpenChange, title, children, onSubmit, submitButtonText }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md mx-auto bg-white/95 backdrop-blur-sm rounded-xl shadow-xl p-8 space-y-6 border border-gray-100">
        <DialogHeader>
          <DialogTitle className="text-xl font-medium text-gray-700 tracking-tight">
            {title}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="text-gray-600">
            {children}
          </div>
          <DialogFooter className="flex justify-end space-x-4 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="px-5 py-2 text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors duration-200"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="px-5 py-2 text-sm font-medium text-white  rounded-lg shadow-sm transition-all duration-200 hover:shadow-md"
            >
              {submitButtonText}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default Modal;