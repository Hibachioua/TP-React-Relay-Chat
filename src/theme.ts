import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#2563eb" },        // indigo-600
    secondary: { main: "#0ea5e9" },      // sky-500
    background: { default: "#f7f8fa", paper: "#ffffff" },
    grey: { 50: "#f9fafb", 100: "#f3f4f6", 200: "#e5e7eb", 300: "#d1d5db" },
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily:
      `Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif`,
    h6: { fontWeight: 700 },
    subtitle1: { fontWeight: 600 },
    button: { textTransform: "none", fontWeight: 600 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        // flat, subtle scrollbars
        body: { scrollbarColor: "#d1d5db transparent" },
        "*::-webkit-scrollbar": { height: 8, width: 8 },
        "*::-webkit-scrollbar-thumb": { background: "#d1d5db", borderRadius: 8 },
        "*::-webkit-scrollbar-track": { background: "transparent" },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: { boxShadow: "none", borderBottom: "1px solid #e5e7eb" },
      },
    },
    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        outlined: { borderColor: "#e5e7eb" },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 9999, paddingInline: 16, height: 36 },
      },
    },
    MuiIconButton: {
      styleOverrides: { root: { borderRadius: 12 } },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          "&.Mui-selected": {
            backgroundColor: "#e8f0ff",
            "&:hover": { backgroundColor: "#e1eaff" },
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          ".MuiOutlinedInput-root": {
            backgroundColor: "#fff",
            borderRadius: 14,
          },
        },
      },
    },
    MuiTooltip: { defaultProps: { arrow: true } },
  },
});
