import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Clock, MapPin, User, Phone } from 'lucide-react';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

interface Doctor {
  id: string;
  user_id: string;
  specialty: string;
  consultation_fee: number;
  profiles: {
    first_name: string;
    last_name: string;
  };
}

interface Appointment {
  id: string;
  appointment_date: string;
  status: string;
  notes: string;
  doctor_id: string;
  user_id: string;
}

interface AppointmentEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: Appointment;
}

interface AppointmentBookingProps {
  doctorId?: string;
  className?: string;
}

export const AppointmentBooking: React.FC<AppointmentBookingProps> = ({
  doctorId,
  className,
}) => {
  const { user } = useAuth();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [appointments, setAppointments] = useState<AppointmentEvent[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<string>(doctorId || '');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Available time slots
  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
  ];

  useEffect(() => {
    fetchDoctors();
    if (user) {
      fetchAppointments();
    }
  }, [user]);

  const fetchDoctors = async () => {
    try {
      const { data, error } = await supabase
        .from('doctors')
        .select(`
          id,
          user_id,
          specialty,
          consultation_fee,
          profiles!doctors_user_id_fkey (
            first_name,
            last_name
          )
        `)
        .eq('verified', true);

      if (error) throw error;
      setDoctors(data || []);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      toast.error('Failed to load doctors');
    }
  };

  const fetchAppointments = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      const events: AppointmentEvent[] = (data || []).map(appointment => ({
        id: appointment.id,
        title: `Appointment - ${appointment.status}`,
        start: new Date(appointment.appointment_date),
        end: moment(appointment.appointment_date).add(30, 'minutes').toDate(),
        resource: appointment,
      }));

      setAppointments(events);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const handleSlotSelect = ({ start }: { start: Date; end: Date }) => {
    setSelectedDate(start);
    setIsDialogOpen(true);
  };

  const bookAppointment = async () => {
    if (!user || !selectedDoctor || !selectedDate || !selectedTime) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      const appointmentDateTime = moment(selectedDate)
        .set({
          hour: parseInt(selectedTime.split(':')[0]),
          minute: parseInt(selectedTime.split(':')[1]),
        })
        .toISOString();

      const { error } = await supabase
        .from('appointments')
        .insert({
          user_id: user.id,
          doctor_id: selectedDoctor,
          appointment_date: appointmentDateTime,
          notes: notes,
          status: 'scheduled',
        });

      if (error) throw error;

      toast.success('Appointment booked successfully!');
      setIsDialogOpen(false);
      setSelectedDate(null);
      setSelectedTime('');
      setNotes('');
      fetchAppointments();
    } catch (error) {
      console.error('Error booking appointment:', error);
      toast.error('Failed to book appointment');
    } finally {
      setIsLoading(false);
    }
  };

  const getEventStyle = (event: AppointmentEvent) => {
    const status = event.resource.status;
    let backgroundColor = '#3174ad';
    
    switch (status) {
      case 'scheduled':
        backgroundColor = '#10b981';
        break;
      case 'completed':
        backgroundColor = '#6b7280';
        break;
      case 'cancelled':
        backgroundColor = '#ef4444';
        break;
      default:
        backgroundColor = '#3174ad';
    }

    return {
      style: {
        backgroundColor,
        borderRadius: '4px',
        border: 'none',
        color: 'white',
      },
    };
  };

  if (!user) {
    return (
      <Card className={className}>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">Please log in to book appointments</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Book Appointment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Doctor Selection */}
            <div>
              <label className="text-sm font-medium">Select Doctor</label>
              <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a doctor" />
                </SelectTrigger>
                <SelectContent>
                  {doctors.map((doctor) => (
                    <SelectItem key={doctor.id} value={doctor.id}>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>
                          Dr. {doctor.profiles?.first_name} {doctor.profiles?.last_name}
                        </span>
                        <Badge variant="outline">{doctor.specialty}</Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Calendar */}
            <div className="h-96">
              <Calendar
                localizer={localizer}
                events={appointments}
                startAccessor="start"
                endAccessor="end"
                onSelectSlot={handleSlotSelect}
                selectable
                eventPropGetter={getEventStyle}
                views={['month', 'week', 'day']}
                defaultView="week"
                step={30}
                timeslots={1}
                min={moment().set({ hour: 8, minute: 0 }).toDate()}
                max={moment().set({ hour: 18, minute: 0 }).toDate()}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Booking Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Book Appointment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Date</label>
              <Input
                value={selectedDate ? moment(selectedDate).format('YYYY-MM-DD') : ''}
                readOnly
              />
            </div>

            <div>
              <label className="text-sm font-medium">Time</label>
              <Select value={selectedTime} onValueChange={setSelectedTime}>
                <SelectTrigger>
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Doctor</label>
              <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a doctor" />
                </SelectTrigger>
                <SelectContent>
                  {doctors.map((doctor) => (
                    <SelectItem key={doctor.id} value={doctor.id}>
                      Dr. {doctor.profiles?.first_name} {doctor.profiles?.last_name} - {doctor.specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Notes (Optional)</label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any specific concerns or notes for the doctor..."
                rows={3}
              />
            </div>

            <Button 
              onClick={bookAppointment} 
              disabled={isLoading || !selectedDoctor || !selectedTime}
              className="w-full"
            >
              {isLoading ? 'Booking...' : 'Book Appointment'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AppointmentBooking;