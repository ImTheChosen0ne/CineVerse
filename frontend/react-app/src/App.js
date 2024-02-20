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
import EditProfilePage from "./pages/EditProfilePage";
import Search from "./pages/SearchPage";
import MyList from "./pages/MyListPage";
import BrowseByLanguage from "./pages/BrowseByLanguage";
import DeleteProfilePage from "./pages/DeleteProfilePage";
import NewAndPopular from "./pages/NewAndPopularPage";
import AddProfilePage from "./pages/AddProfilePage";
import Ratings from "./pages/RatingsPage";
import Viewed from "./pages/ViewedPage";
import Watch from "./pages/WatchPage";
import ChangePlan from "./pages/ChangePlanPage";


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
          <ProtectedRoute exact path="/browse/latest" >
            <NewAndPopular />
          </ProtectedRoute>
          <ProtectedRoute exact path="/browse/language" >
            <BrowseByLanguage />
          </ProtectedRoute>
          <ProtectedRoute exact path="/browse/MyList" >
            <MyList />
          </ProtectedRoute>
          <ProtectedRoute exact path="/search" >
            <Search />
          </ProtectedRoute>
          <ProtectedRoute exact path="/ManageProfiles" >
            <ManageProfiles />
          </ProtectedRoute>
          <ProtectedRoute exact path="/ManageProfiles/new" >
            <AddProfilePage />
          </ProtectedRoute>
          <ProtectedRoute exact path="/ManageProfiles/:profileName" >
            <EditProfilePage />
          </ProtectedRoute>
          <ProtectedRoute exact path="/ManageProfiles/:profileName/delete" >
            <DeleteProfilePage />
          </ProtectedRoute>
          <ProtectedRoute exact path="/account/:profileName/viewed" >
            <Viewed />
          </ProtectedRoute>
          <ProtectedRoute exact path="/account/:profileName/ratings" >
            <Ratings />
          </ProtectedRoute>
          <ProtectedRoute exact path="/account/changeplan" >
            <ChangePlan />
          </ProtectedRoute>
          <ProtectedRoute exact path="/account" >
            <Account />
          </ProtectedRoute>
          <ProtectedRoute exact path="/watch/:movieId" >
            <Watch />
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
          <Route>
            <h1>PAGE NOT FOUND</h1>
          </Route>
        </Switch>
      )}
    </div>
  );
}

export default App;
