import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles((theme) => ({
  container: {
    color: theme.palette.common.blue,
  },
  title: {
    fontSize: "1.3rem",
    fontWeight: 900,
    marginBottom: "0.5rem",
  },
  label: {
    fontSize: "0.9rem",
    fontWeight: 800,
  },
  info: {
    fontSize: "0.9rem",
    fontWeight: "normal",
  },
}));

export default useStyles;
