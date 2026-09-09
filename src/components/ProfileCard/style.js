import { makeStyles } from '@mui/styles';

const useProfilestyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-around',
    marginTop: '10px',
    alignItems: "stretch",
  },

  // Card and Content Styles
  // cardHeader: {
  //   display: 'flex',
  //   justifyContent: 'space-between',
  //   alignItems: 'center',
  // },

  cardContent1: {
    // padding: theme.spacing(2),
    flexGrow: 1,

  },

  cardContent2: {
    // padding: theme.spacing(2),
    marginTop: '65px',
    flexGrow: 1,

  },

  experienceItem: {
    marginBottom: '1em',
  },

  titleBold: {
    fontWeight: 'bold',
  },

  subheader: {
    // color: theme.palette.text.secondary,
  },

  heading: {
    fontWeight: 'bold',
    // color: theme.palette.primary.main,
    // marginBottom: theme.spacing(1),
  },


  
  // Button Styles
  // button: {
  //   minWidth: 150,
  // },

  // buttonContainer: {
  //   display: 'flex',
  //   gap: '1em',
  //   justifyContent: 'end',
  // },
}));

export default useProfilestyles;
