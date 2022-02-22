import { createMuiTheme, responsiveFontSizes } from "@material-ui/core";

const blue = "#10384f";
const darkMagenta = "#624963";
const red = "#f44336";
const pink = "#bd3c5a";
const green = "#A0D781";
const grey = "#E8E8E8";

const theme = createMuiTheme({
  palette: {
    text: {
      primary: `${darkMagenta}`,
    },
    primary: {
      main: `${darkMagenta}`,
    },
    secondary: {
      main: `${blue}`,
    },
    error: {
      main: `${red}`,
    },
    common: {
      darkMagenta: `${darkMagenta}`,
      blue: `${blue}`,
      red: `${red}`,
      pink: `${pink}`,
      green: `${green}`,
      grey: `${grey}`,
    },
  },
  typography: {
    fontFamily: ["Open Sans", "sans-serif"].join(","),
    h3: {
      fontSize: "1rem",
      fontWeight: "bold",
      marginBottom: "0.5rem",
      marginTop: "1rem",
    },
    h4: {
      fontSize: "0.9rem",
      fontWeight: "bold",
      marginBottom: "0.5rem",
    },
  },
  overrides: {
    MuiCssBaseline: {
      "@global": {
        fontFamily: [
          "Open Sans",
          "sans-serif",
          "Didact Gothic",
          "sans-serif",
        ].join(","),
        body: {
          fontFamily: "Open Sans, sans-serif",
          margin: 0,
          padding: 0,
          boxSizing: "border-box",
        },
        a: {
          textDecoration: "none",
          color: "inherit",
        },
        p: {
          margin: 0,
        },
      },
    },
    MuiInput: {
      input: {
        "&::-webkit-input-placeholder": {
          color: "black",
        },
      },
    },
  },
});

export default responsiveFontSizes(theme);
