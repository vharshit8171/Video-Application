import React from 'react'
import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import PageLoader from './components/ui/PageLoader.jsx';
import Navbar from './components/ui/Navbar.jsx';
import NotFound from './components/ui/NotFound.jsx';
const LandingPage = lazy(() => import("../pages/LandingPage.jsx"))
const LogIn = lazy(() => import("../pages/LogIn.jsx"));
const Signup = lazy(() => import("../pages/SignUp.jsx"));
const Home = lazy(() => import("../pages/Home.jsx"));
const VideoPlay = lazy(() => import("../pages/VideoPlay.jsx"));
const SearchResult = lazy(() => import("../src/components/ui/SearchResult.jsx"));
const VideoWatch = lazy(() => import("../src/components/ui/VideoWatch.jsx"));
const Profile = lazy(() => import("../pages/Profile.jsx"));
const EditProfile = lazy(() => import("../src/components/ui/EditProfile.jsx"));
const VideoUpload = lazy(() => import("../pages/UploadVideo.jsx"));
const EditVideo = lazy(() => import("../pages/EditVideo.jsx"));
const CreateChannel = lazy(() => import("../pages/CreateChannel.jsx"));
const ChannelPage = lazy(() => import("../pages/ChannelPage.jsx"));
const EditChannel = lazy(() => import("../pages/EditChannel.jsx"));
const About = lazy(() => import("../pages/About.jsx"));
const Playlist = lazy(() => import("../pages/Playlist.jsx"));
const PlaylistVideos = lazy(() => import("../src/components/ui/PlaylistVideos.jsx"));
const MenuPage = lazy(() => import("../pages/MenuPage.jsx"));
import ProtectedRoute from '../routes/ProtectedRoute.jsx';
import ChannelOwnerRoute from '../routes/ChannelOwnerRoute.jsx';

const AppRoutes = () => {
  return (
    <>
      <Navbar />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<LogIn />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } />
          <Route
            path="/video/:id"
            element={
              < ProtectedRoute >
                <VideoPlay />
              </ProtectedRoute>
            } />
          <Route
            path="/search"
            element={
              < ProtectedRoute >
                <SearchResult />
              </ProtectedRoute>
            } />
          <Route
            path="/watch/:videoId"
            element={
              < ProtectedRoute >
                <VideoWatch />
              </ProtectedRoute>
            } />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
          <Route
            path="/playlist"
            element={
              <ProtectedRoute>
                <Playlist />
              </ProtectedRoute>
            } />
          <Route
            path="/playlist/:playlistId"
            element={
              <ProtectedRoute>
                <PlaylistVideos />
              </ProtectedRoute>
            } />
          <Route
            path="/update-Profile"
            element={
              <ProtectedRoute>
                <EditProfile />
              </ProtectedRoute>
            } />
          <Route
            path="/upload/create"
            element={
              <ProtectedRoute>
                <CreateChannel />
              </ProtectedRoute>
            } />
          <Route
            path="/channel/:handle"
            element={
              <ProtectedRoute>
                <ChannelPage />
              </ProtectedRoute>
            } />
          <Route
            path="/channel/:handle/upload"
            element={
              <ProtectedRoute>
                <ChannelOwnerRoute>
                  <VideoUpload />
                </ChannelOwnerRoute>
              </ProtectedRoute>
            } />
          <Route
            path="/video/:videoId/edit"
            element={
              <ProtectedRoute>
                <ChannelOwnerRoute>
                  <EditVideo />
                </ChannelOwnerRoute>
              </ProtectedRoute>
            } />
          <Route
            path="/channel/:handle/edit"
            element={
              <ProtectedRoute>
                <ChannelOwnerRoute>
                  <EditChannel />
                </ChannelOwnerRoute>
              </ProtectedRoute>
            } />
          <Route
            path="/about"
            element={
              <ProtectedRoute>
                  <About />
              </ProtectedRoute>
            } />
          <Route path='/menu' element={<MenuPage />} />

          <Route path='*' element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  )
}

export default AppRoutes