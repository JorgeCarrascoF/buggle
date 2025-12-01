import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./routes/Home";
import NotFound from "./routes/NotFound";
import Login from "./routes/Login";
import Register from "./routes/Register";
import Users from "./routes/Users";
import PrivateRoute from "./components/PrivateRoute";
import LogPage from "./routes/LogPage";
import LogCreatePage from "./routes/LogCreatePage";
import AdminPrivateRoute from "./components/AdminPrivateRoute";
import LogCommentsPage from "./routes/LogCommentsPage";
import Unauthorized from "./routes/Unauthorized";
import Layout from "./components/Layout";
import Logs from "./routes/Logs";
import Profile from "./routes/Profile";
import UserDetail from "./routes/UserDetail";
import ChangePasswordOnFirstLogin from "./routes/ChangePasswordOnFirstLogin";
import Onboarding from "./routes/Onboarding";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/change-password-first"
          element={<ChangePasswordOnFirstLogin />}
        />
        <Route element={<Layout />}>
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route
            path="/users/register"
            element={
              <AdminPrivateRoute>
                <Register />
              </AdminPrivateRoute>
            }
          />
          <Route
            path="/users"
            element={
              <AdminPrivateRoute>
                <Users />
              </AdminPrivateRoute>
            }
          />
          <Route
            path="/users/:id"
            element={
              <AdminPrivateRoute>
                <UserDetail />
              </AdminPrivateRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Logs />
              </PrivateRoute>
            }
          />
          <Route
            path="/onboarding"
            element={
              <PrivateRoute>
                <Onboarding />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard/log/:id"
            element={
              <PrivateRoute>
                <LogPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard/log/:id/comments"
            element={
              <PrivateRoute>
                <LogCommentsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard/log/create"
            element={
              <PrivateRoute>
                <LogCreatePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
