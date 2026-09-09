// import React, { useState } from "react";
// import dayjs from "dayjs";
// import { Typography, Box, TextField, Card, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
// import Grid from "@mui/material/Grid";
// import useCalendarCardstyles from "./style";

// export default function CalendarCard() {
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [storedDate1, setStoredDate1] = useState(null);
//   const [storedDate2, setStoredDate2] = useState(null);
//   const [storedDate3, setStoredDate3] = useState(null);
//   const [timeSlot1, setTimeSlot1] = useState(null);
//   const [timeSlot2, setTimeSlot2] = useState(null);
//   const [timeSlot3, setTimeSlot3] = useState(null);
//   const [selectedTimeZone, setSelectedTimeZone] = useState("UTC");
//   const classes = useCalendarCardstyles();
//   const handleTimeZoneChange = (event) => {
//     setSelectedTimeZone(event.target.value);
//   };
//   const handleDateChange = (newValue) => {
//     setSelectedDate(newValue);
//     if (!storedDate1) {
//       setStoredDate1(newValue);
//     } else if (!storedDate2) {
//       setStoredDate2(newValue);
//     } else if (!storedDate3) {
//       setStoredDate3(newValue);
//     }
//   };

//   return (
//     <LocalizationProvider dateAdapter={AdapterDayjs}>
//       <Box className={classes.root1}>
//       <Box className={classes.root2}>
//         <Grid container spacing={3} display={"flex"} width={"100%"}>
//           <Grid item flex={1} sx={{padding:"15px"}} >
//             {[{ label: "First", date: storedDate1, setDate: setStoredDate1, time: timeSlot1, setTime: setTimeSlot1 },
//             { label: "Second", date: storedDate2, setDate: setStoredDate2, time: timeSlot2, setTime: setTimeSlot2 },
//             { label: "Third", date: storedDate3, setDate: setStoredDate3, time: timeSlot3, setTime: setTimeSlot3 }].map(
//               (slot, index) => (
//                 <Grid container alignItems="center" key={index} spacing={2}>
//                   <Grid item size={{ xs: 12, sm: 6, md: 4 }} sx={{padding:"15px"}}>
//                     <Box sx={{width:"100%"}}>
//                       <Typography variant="h6" className={classes.slotText}>
//                         {slot.label} Slot Date:
//                       </Typography>
//                       <TextField
//                         type="date"
//                         className={classes.datePickerStyle}
//                         value={slot.date ? dayjs(slot.date).format("YYYY-MM-DD") : ""}
//                         onChange={(e) => slot.setDate(dayjs(e.target.value))}
//                         fullWidth
//                       />
//                     </Box>
//                   </Grid>
//                   <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
//                     <Box sx={{width:"90%"}}>
//                       <Typography variant="h6" className={classes.slotText}>
//                         {slot.label} Slot Time:
//                       </Typography>
//                       <TextField
//                         type="time"
//                         className={classes.timePickerTextField}
//                         value={slot.time || ""}
//                         sx={{
//                           // "& .MuiInputLabel-root": {
//                           //   left: "50%",
//                           //    transform: "translateX(-50%)",
//                           //   textAlign: "center",
//                           //    padding: "15px"
//                           // },
//                         }}
//                         onChange={(e) => slot.setTime(e.target.value)}
//                         fullWidth
//                       />
//                     </Box>
//                   </Grid>
//                   <Grid item size={{ xs: 12, sm: 12  , md: 4 }} sx={{marginTop:"15px",width:"90%"}}>
//                     <FormControl fullWidth>
//                       <InputLabel sx={{ color: "white", marginTop: "-12px", borderRadius: "30px",fontSize:"20px" }}>Time Zone</InputLabel>
//                       <Select
//                         sx={{
//                           borderRadius:"20px",
//                           backgroundColor: "white",
//                           "& .MuiSelect-root": {
//                             padding: "10px",
//                           },
//                         }}
//                         MenuProps={{
//                           PaperProps: {
//                             sx: {
//                               backgroundColor: "white",
//                               zIndex: 1300,
//                             },
//                           },
//                         }}
//                         labelId="timezone-label"
//                         value={selectedTimeZone}
//                         onChange={handleTimeZoneChange}
//                         label="Time Zone"
//                       >
//                         <MenuItem value="UTC">UTC</MenuItem>
//                         <MenuItem value="America/New_York">US Eastern</MenuItem>
//                         <MenuItem value="Europe/London">UK</MenuItem>
//                         <MenuItem value="Asia/Kolkata">India</MenuItem>
//                         <MenuItem value="Australia/Sydney">Australia</MenuItem>
//                       </Select>
//                     </FormControl>
//                   </Grid>
//                 </Grid>
//               )
//             )}
//           </Grid>
//         </Grid>
//         </Box>
//       </Box>
//     </LocalizationProvider>
//   );
// }
import * as React from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { Card, CardContent, CardHeader } from '@mui/material';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import Button from '@mui/material/Button';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useNavigate } from 'react-router-dom';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('America/New_York');

export default function TimezoneScheduler() {
  const [selectedDateTime, setSelectedDateTime] = React.useState(null);
  const [currentTimezone, setCurrentTimezone] = React.useState('UTC');
  const [slots, setSlots] = React.useState([]);
  const [showAddButton, setShowAddButton] = React.useState(true);
  const [isPickerOpen, setIsPickerOpen] = React.useState(false);
  const [editIndex, setEditIndex] = React.useState(null);

  const TIMEZONES = [
    'UTC',
    'America/New_York',
    'Asia/Tokyo',
    'Asia/Kolkata',
    'Europe/London',
  ];
  const navigate=useNavigate()
  const handleDateTimeChange = (newDateTime) => {
    setSelectedDateTime(newDateTime);
    setShowAddButton(true);
  };

  const addSlot = () => {
    if (selectedDateTime) {
      const slot = selectedDateTime.format('YYYY-MM-DD HH:mm');
      if (editIndex !== null) {
        const updatedSlots = [...slots];
        updatedSlots[editIndex] = slot;
        setSlots(updatedSlots);
        setEditIndex(null);
      } else {
        setSlots([...slots, slot]);
      }
      setSelectedDateTime(null);
      setShowAddButton(false);
    }
  };

  const handlePickerOpen = () => {
    setIsPickerOpen(true);
  };

  const handlePickerClose = () => {
    setIsPickerOpen(false);
  };

  const handleSubmit = () => {
    console.log('Submitting the following slots:', slots);
    navigate("/Dashboard")
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Card
        sx={{
          maxWidth: 600,
          margin: 'auto',
          marginTop: 4,
          boxShadow: 3,
          borderRadius: 2,
        }}
      >
        <CardHeader title="Timezone Scheduler" sx={{ textAlign: 'center' }} />
        <CardContent>
          <Stack spacing={3}>
            <ToggleButtonGroup
              value={currentTimezone}
              exclusive
              fullWidth
              onChange={(event, newTimezone) => {
                if (newTimezone != null) {
                  setCurrentTimezone(newTimezone);
                }
              }}
            >
              {TIMEZONES.map((timezoneName) => (
                <ToggleButton key={timezoneName} value={timezoneName}>
                  {timezoneName}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>

            <DateTimePicker
              label="Select Date & Time"
              value={selectedDateTime}
              onChange={handleDateTimeChange}
              sx={{
                marginTop: '20px'
              }}
              slotProps={{
                popper: {
                  sx: {
                    marginTop: '30px !important'
                  },
                },
              }}
              onOpen={handlePickerOpen}
              onClose={handlePickerClose}
            />

            {!isPickerOpen && showAddButton && (
              <Button
                variant="contained"
                onClick={addSlot}
                sx={{
                  width: '100%',
                  borderRadius: '8px',
                }}
              >
                {editIndex !== null ? 'Update Slot' : '+ Add Slot'}
              </Button>
            )}

            {!isPickerOpen && slots.length > 0 && (
              <Stack
                spacing={1.5}
                sx={{
                  backgroundColor: '#f9f9f9',
                  padding: '15px',
                  borderRadius: '10px',
                  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                  borderLeft: '5px solid #1976d2',
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                  Selected Slots:
                </Typography>

                {slots.map((slot, index) => {
                  const [date, time] = slot.split(' ');

                  return (
                    <Stack
                      key={index}
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{
                        padding: '12px',
                        borderRadius: '8px',
                        backgroundColor: '#e3f2fd',
                        boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.1)',
                        border: '1px solid #90caf9',
                      }}
                    >
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: 'bold',
                          fontSize: '14px',
                          color: '#0d47a1',
                          backgroundColor: '#bbdefb',
                          padding: '5px 10px',
                          borderRadius: '5px',
                          textTransform: 'uppercase',
                        }}
                      >
                        Slot {index + 1}
                      </Typography>

                      <Stack
                        spacing={0.5}
                        sx={{ textAlign: 'center' }}
                      >
                        <Typography variant="body1" sx={{ fontWeight: '500', color: '#333' }}>
                          {date}
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: 'bold',
                            color: '#d32f2f',
                            fontSize: '15px',
                          }}
                        >
                          {time}
                        </Typography>
                      </Stack>

                      <Stack direction="row" spacing={1}>
                        <Button
                          size="small"
                          variant="contained"
                          color="warning"
                          sx={{
                            fontSize: '12px',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            textTransform: 'capitalize',
                          }}
                          onClick={() => {
                            setSelectedDateTime(dayjs(slot));
                            setEditIndex(index);
                          }}
                        >
                          Edit
                        </Button>

                        <Button
                          size="small"
                          variant="contained"
                          color="error"
                          sx={{
                            fontSize: '12px',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            textTransform: 'capitalize',
                          }}
                          onClick={() => {
                            setSlots(slots.filter((_, i) => i !== index));
                          }}
                        >
                          Remove
                        </Button>
                      </Stack>
                    </Stack>
                  );
                })}
              </Stack>
            )}

            {/* Submit Button */}
            {slots.length > 0 && !isPickerOpen && (
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                sx={{
                  width: '100%',
                  borderRadius: '8px',
                  marginTop: 2,
                }}
              >
                Submit
              </Button>
            )}
          </Stack>
        </CardContent>
      </Card>
    </LocalizationProvider>
  );
}



