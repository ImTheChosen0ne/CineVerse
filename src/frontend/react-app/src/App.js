import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import SignupFormPage from "./components/SignupFormPage";
import LoginFormPage from "./components/LoginFormPage";
import { authenticate } from "./store/session";
import Navigation from "./components/Navigation";
import SplashPage from "./pages/SplashPage";
import SelectProfilePage from "./pages/SelectProfilePage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import BrowsePage from "./pages/BrowsePage";
import ManageProfiles from "./pages/ManageProfilesPage";
import Account from "./pages/AccountPage";


function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(authenticate()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <div className="app-container">
      <Navigation isLoaded={isLoaded}/>
      {isLoaded && (
        <Switch>
          <ProtectedRoute exact path="/manage_profiles" >
            <ManageProfiles />
          </ProtectedRoute>
          <ProtectedRoute exact path="/account" >
            <Account />
          </ProtectedRoute>
          <ProtectedRoute exact path="/profile" >
            <SelectProfilePage />
          </ProtectedRoute>
          <ProtectedRoute exact path="/browse/:profileName" >
            <BrowsePage />
          </ProtectedRoute>
          <Route exact path="/login" >
            <LoginFormPage />
          </Route>
          <Route exact path="/signup">
            <SignupFormPage />
          </Route>
          <Route exact path="/" >
            <SplashPage />
          </Route>
        </Switch>
      )}
    </div>
  );
}

export default App;
