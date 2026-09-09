import { makeStyles } from "@mui/styles";

export const appBarStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.common.white,
    },
    pageTextStyle: {
        textAlign: 'center'
    }
    
}));    