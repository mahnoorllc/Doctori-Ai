
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock } from "lucide-react";

const AppointmentBooking = () => {
  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calendar className="h-5 w-5" />
          <span>Book Appointment</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center py-8">
          <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Appointment Booking</h3>
          <p className="text-muted-foreground mb-4">
            Schedule your consultation with qualified healthcare providers
          </p>
          <Button variant="medical" size="lg">
            Coming Soon
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AppointmentBooking;
