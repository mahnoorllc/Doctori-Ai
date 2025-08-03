import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

interface TermsOfServiceModalProps {
  isOpen: boolean;
  onAccept: () => void;
}

export const TermsOfServiceModal = ({ isOpen, onAccept }: TermsOfServiceModalProps) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleAccept = () => {
    if (isChecked) {
      onAccept();
    }
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Terms of Service</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            <p className="mb-4">
              Before we begin your health consultation, please confirm that you understand 
              and agree to discuss all Doctori AI output with a qualified healthcare provider.
            </p>
            
            <div className="bg-amber-50 dark:bg-amber-950/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
              <p className="text-amber-800 dark:text-amber-200 font-medium">
                ⚠️ Important: This AI provides general health information only and is not 
                a substitute for professional medical advice, diagnosis, or treatment.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Checkbox 
              id="terms-agreement"
              checked={isChecked}
              onCheckedChange={setIsChecked}
              className="mt-1"
            />
            <label 
              htmlFor="terms-agreement" 
              className="text-sm font-medium leading-relaxed cursor-pointer"
            >
              I agree to the Doctori AI Terms of Service and will discuss all 
              Doctori AI output with a doctor.
            </label>
          </div>

          <Button 
            onClick={handleAccept}
            disabled={!isChecked}
            className="w-full"
          >
            Continue to Health Consultation
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};