import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { CheckedState } from '@radix-ui/react-checkbox';

interface ConsentScreenProps {
  onConsent: () => void;
}

export const ConsentScreen: React.FC<ConsentScreenProps> = ({ onConsent }) => {
  const [isAgreed, setIsAgreed] = useState(false);

  const handleCheckboxChange = (checked: CheckedState) => {
    setIsAgreed(checked === true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/5 to-secondary/5">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-primary">
            Terms of Service & Medical Disclaimer
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-muted-foreground space-y-4">
            <h3 className="text-lg font-semibold text-foreground">
              Important Information About Doctori AI
            </h3>
            
            <div className="space-y-3 text-sm">
              <p>
                <strong>Medical Disclaimer:</strong> Doctori AI is an artificial intelligence health assistant designed to provide general health information and guidance. It is NOT a substitute for professional medical advice, diagnosis, or treatment.
              </p>
              
              <p>
                <strong>For Medical Emergencies:</strong> If you are experiencing a medical emergency, please call 999 (Bangladesh Emergency) or go to your nearest emergency room immediately.
              </p>
              
              <p>
                <strong>Privacy & Data:</strong> Your health information will be handled with strict confidentiality and in compliance with Bangladesh data protection regulations. We use industry-standard encryption to protect your data.
              </p>
              
              <p>
                <strong>Limitations:</strong> While Doctori AI uses advanced AI technology, it cannot replace the expertise of qualified healthcare professionals. Always consult with a licensed doctor for proper medical evaluation and treatment.
              </p>
              
              <p>
                <strong>Accuracy:</strong> We strive for accuracy but cannot guarantee that all information provided is complete, current, or error-free. Medical knowledge is constantly evolving.
              </p>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
              <p className="text-sm font-medium text-yellow-800">
                ⚠️ <strong>By proceeding, you acknowledge that:</strong>
              </p>
              <ul className="text-sm text-yellow-700 mt-2 space-y-1 list-disc ml-4">
                <li>Doctori AI is for informational purposes only</li>
                <li>You will discuss all AI-generated recommendations with a qualified doctor</li>
                <li>You understand this is not a replacement for professional medical care</li>
                <li>You will seek immediate medical attention for emergencies</li>
              </ul>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-4 bg-muted/30 rounded-lg">
            <Checkbox
              id="consent"
              checked={isAgreed}
              onCheckedChange={handleCheckboxChange}
              className="mt-1"
            />
            <label
              htmlFor="consent"
              className="text-sm font-medium leading-relaxed cursor-pointer"
            >
              I have read and agree to the{' '}
              <Link 
                to="/terms-of-service" 
                className="text-primary hover:underline font-semibold"
                target="_blank"
              >
                Terms of Service
              </Link>{' '}
              and Medical Disclaimer. I understand that Doctori AI is for informational purposes only and I will discuss all AI output with a qualified doctor before making any medical decisions.
            </label>
          </div>

          <div className="flex justify-center pt-4">
            <Button
              onClick={onConsent}
              disabled={!isAgreed}
              size="lg"
              className="w-full sm:w-auto px-8"
            >
              Continue to Health Assistant
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};