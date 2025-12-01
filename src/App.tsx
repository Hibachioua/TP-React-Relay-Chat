import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider, CssBaseline, Container } from "@mui/material";
import { theme } from "./theme";
import { NavBar } from "./components/NavBar";
import { Login } from "./user/Login";
import { Register } from "./user/Register";
import ChatLayout from "./chat/ChatLayout";
import RequireAuth from "./router/RequireAuth";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NavBar />
      <Container maxWidth="lg" disableGutters>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<RequireAuth />}>
            <Route path="/chat" element={<ChatLayout />} />
          </Route>
          <Route path="*" element={<Navigate to="/chat" replace />} />
        </Routes>
      </Container>
    </ThemeProvider>
  );
}
export default App;
