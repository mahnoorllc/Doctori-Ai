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