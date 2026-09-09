import { makeStyles } from "@mui/styles";

const useCalendarCardstyles = makeStyles((theme) => ({
  root1: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "80vh",
    width:"100%",
  },
  root2: {
    width:"1100px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: theme.palette.primary.main,
    borderRadius: "30px",
    padding: "20px",
    boxSizing: "border-box",
  },
  root3: {
    marginTop: "30px",
  },
  dateCalendarStyle: {
    // padding: "10px",
    // width: "10px",
  },
  datePickerStyle: {
    background: "white",
    // width:"100%",
    borderRadius: "20px",
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        border: "none",
      },
    },
  },
  slotText: {
    color: "white",
    marginBottom: "10px",
  },
  timePickerTextField: {
    background: "white",
    borderRadius: "20px",
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        border: "none",
      },
    },
  },
}));

export default useCalendarCardstyles;
