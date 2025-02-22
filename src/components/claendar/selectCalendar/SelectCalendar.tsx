import { useEffect, useState } from 'react';
import { Select, Group, Alert } from '@mantine/core';
import { DatePicker, MonthPicker } from '@mantine/dates';
import { CalendarDayPicker } from '../Calendarday';
import '@mantine/dates/styles.css';
import { supabase } from '../../../conection/client.js';

export function SelectOptionComponent() {
 
  const [selectedValue, setSelectedValue] = useState<string | null>('pick day or range');
  const [minDate, setMinDate] = useState<Date | undefined>(undefined)
  const [maxDate, setMaxDate] = useState<Date |  undefined>(undefined)
  const [datesLoaded, setDatesLoaded] = useState(false);


  const fetchFromTo = async () => {
    try {
      const { data, error } = await supabase.rpc('maxymindates');
      const firstData = data && data[0];

      if (!firstData) {
        console.log(error);
        
        throw new Error('Error al conectar con la base de datos');
      }

      const { mindate, maxdate } = firstData;
      console.log('Fechas min:', mindate, 'Fechas max:', maxdate);
      setMinDate(new Date(mindate));
      setMaxDate(new Date(maxdate));
      setDatesLoaded(true);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchFromTo();
  }, []);

  if (!datesLoaded) {
    return <p>Cargando fechas...</p>;
  }

  const componentsMap: Record<string, React.ReactNode> = {
    'pick day or range': <CalendarDayPicker minDate={minDate} maxDate={maxDate} />,
    'One month': <MonthPicker />,
  };

  const handleSelectChange = (value: string ) => {
    console.log('valor', value);
    setSelectedValue(value);
  };

  return (
    <>
      <Group justify="center">
        <Select
          label="Input label"
          description="Input description"
          // placeholder="Select placeholder"
          // defaultValue= 'pick day or range'
          allowDeselect={false}
          onChange={handleSelectChange}
          data={['pick day or range', 'One month']}
          value={selectedValue}
        />
      </Group>
      <Group justify="center">{componentsMap[selectedValue]}</Group>
    </>
  );
}

