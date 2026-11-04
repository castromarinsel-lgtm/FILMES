'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import FeedView from '@/components/FeedView';
import CommunityView from '@/components/CommunityView';
import ProfileView from '@/components/ProfileView';
import AuthModal from '@/components/AuthModal';
import MovieFormModal from '@/components/MovieFormModal';
import DeleteMovieModal from '@/components/DeleteMovieModal';
import LoginScreen from '@/components/LoginScreen';
import { UserProfile, Movie, ProfileComment, ActiveView } from '@/types/cinema';
import {
  INITIAL_USERS,
  GUEST_USER,
  getStoredUsers,
  saveStoredUsers,
  getStoredCurrentUser,
  saveStoredCurrentUser,
} from '@/lib/initial-data';
import { Clapperboard, Heart, Sparkles, Film } from 'lucide-react';

export default function Home() {
  const [users, setUsers] = useState<UserProfile[]>(() => getStoredUsers());
  const [currentUser, setCurrentUser] = useState<UserProfile>(() =>
    getStoredCurrentUser(getStoredUsers())
  );
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeView, setActiveView] = useState<ActiveView>('feed');
  const [selectedProfileUser, setSelectedProfileUser] = useState<UserProfile | null>(null);

  // Modals
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMovieFormOpen, setIsMovieFormOpen] = useState(false);
  const [movieToEdit, setMovieToEdit] = useState<Movie | null>(null);
  const [movieToDelete, setMovieToDelete] = useState<Movie | null>(null);

  // Sync users to storage whenever updated
  const updateUsers = (newUsers: UserProfile[]) => {
    setUsers(newUsers);
    saveStoredUsers(newUsers);

    // If current user is in newUsers, update current user too
    const updatedCurrent = newUsers.find((u) => u.id === currentUser.id);
    if (updatedCurrent) {
      setCurrentUser(updatedCurrent);
    }

    // If selected profile user is updated, keep in sync
    if (selectedProfileUser) {
      const updatedProfile = newUsers.find((u) => u.id === selectedProfileUser.id);
      if (updatedProfile) {
        setSelectedProfileUser(updatedProfile);
      }
    }
  };

  // Enter as guest
  const handleEnterAsGuest = (guestName: string) => {
    const guest: UserProfile = {
      ...GUEST_USER,
      name: guestName.trim() || 'Cinéfilo Visitante',
    };
    setCurrentUser(guest);
    saveStoredCurrentUser(guest.id);
    setIsAuthenticated(true);
    setActiveView('feed');
  };

  // Login as existing user
  const handleLoginUser = (user: UserProfile) => {
    setCurrentUser(user);
    saveStoredCurrentUser(user.id);
    setIsAuthenticated(true);
    setActiveView('feed');
  };

  // Switch active user from modal
  const handleSelectUser = (user: UserProfile) => {
    setCurrentUser(user);
    saveStoredCurrentUser(user.id);
    setIsAuthenticated(true);
    if (activeView === 'profile' && selectedProfileUser?.id === currentUser.id) {
      setSelectedProfileUser(user);
    }
  };

  // Register new user
  const handleRegisterUser = (newUser: UserProfile) => {
    const updated = [newUser, ...users];
    updateUsers(updated);
    setCurrentUser(newUser);
    saveStoredCurrentUser(newUser.id);
    setSelectedProfileUser(newUser);
    setIsAuthenticated(true);
    setActiveView('profile');
  };

  // View specific user profile
  const handleOpenProfile = (user: UserProfile) => {
    // Find latest version of user
    const latest = users.find((u) => u.id === user.id) || user;
    setSelectedProfileUser(latest);
    setActiveView('profile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // View own profile
  const handleViewMyProfile = () => {
    setSelectedProfileUser(currentUser);
    setActiveView('profile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Open modal to add movie
  const handleOpenAddMovie = () => {
    setMovieToEdit(null);
    setIsMovieFormOpen(true);
  };

  // Open modal to edit movie
  const handleOpenEditMovie = (movie: Movie) => {
    setMovieToEdit(movie);
    setIsMovieFormOpen(true);
  };

  // Save Movie (Add or Edit)
  const handleSaveMovie = (
    movieData: Omit<Movie, 'id' | 'addedAt'>,
    editId?: string
  ) => {
    let updatedMovies: Movie[];

    if (editId) {
      // Edit existing movie
      updatedMovies = currentUser.movies.map((m) =>
        m.id === editId
          ? {
              ...m,
              ...movieData,
            }
          : m
      );
    } else {
      // Add new movie
      const newMovie: Movie = {
        id: `mov-${Date.now()}`,
        ...movieData,
        addedAt: new Date().toISOString().split('T')[0],
      };
      updatedMovies = [newMovie, ...currentUser.movies];
    }

    const updatedUser = {
      ...currentUser,
      movies: updatedMovies,
    };

    // If currentUser is guest and not in users list yet, add them
    const userExists = users.some((u) => u.id === currentUser.id);
    const updatedUsersList = userExists
      ? users.map((u) => (u.id === currentUser.id ? updatedUser : u))
      : [updatedUser, ...users];

    updateUsers(updatedUsersList);
    setCurrentUser(updatedUser);

    if (selectedProfileUser?.id === currentUser.id) {
      setSelectedProfileUser(updatedUser);
    }
  };

  // Confirm delete movie
  const handleConfirmDeleteMovie = (movieId: string) => {
    const updatedMovies = currentUser.movies.filter((m) => m.id !== movieId);
    const updatedUser = {
      ...currentUser,
      movies: updatedMovies,
    };

    const updatedUsersList = users.map((u) =>
      u.id === currentUser.id ? updatedUser : u
    );

    updateUsers(updatedUsersList);
    setCurrentUser(updatedUser);

    if (selectedProfileUser?.id === currentUser.id) {
      setSelectedProfileUser(updatedUser);
    }
    setMovieToDelete(null);
  };

  // Add Comment to Profile Guestbook
  const handleAddComment = (commentData: Omit<ProfileComment, 'id' | 'createdAt'>) => {
    if (!selectedProfileUser) return;

    const newComment: ProfileComment = {
      id: `comm-${Date.now()}`,
      ...commentData,
      createdAt: 'Agora mesmo',
    };

    const updatedGuestbook = [newComment, ...selectedProfileUser.guestbook];
    const updatedTargetUser = {
      ...selectedProfileUser,
      guestbook: updatedGuestbook,
    };

    const updatedUsersList = users.map((u) =>
      u.id === selectedProfileUser.id ? updatedTargetUser : u
    );

    updateUsers(updatedUsersList);
    setSelectedProfileUser(updatedTargetUser);
  };

  // Delete Comment from Profile Guestbook
  const handleDeleteComment = (commentId: string) => {
    if (!selectedProfileUser) return;

    const updatedGuestbook = selectedProfileUser.guestbook.filter(
      (c) => c.id !== commentId
    );
    const updatedTargetUser = {
      ...selectedProfileUser,
      guestbook: updatedGuestbook,
    };

    const updatedUsersList = users.map((u) =>
      u.id === selectedProfileUser.id ? updatedTargetUser : u
    );

    updateUsers(updatedUsersList);
    setSelectedProfileUser(updatedTargetUser);
  };

  // If not yet authenticated, start on the Login & Registration screen
  if (!isAuthenticated) {
    return (
      <LoginScreen
        allUsers={users}
        onEnterAsGuest={handleEnterAsGuest}
        onLoginUser={handleLoginUser}
        onRegisterUser={handleRegisterUser}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0f19] text-[#dfe2f1] relative selection:bg-[#a855f7]/30 selection:text-white flex flex-col justify-between">
      {/* Cinematic Top Radial Spotlight Beam (Sweeps across the page) */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-[#a855f7]/12 via-[#f43f5e]/06 to-transparent pointer-events-none blur-3xl z-0" />

      {/* Main Navigation */}
      <Navbar
        currentUser={currentUser}
        activeView={activeView}
        setActiveView={(view) => {
          setActiveView(view);
          if (view === 'profile') {
            setSelectedProfileUser(currentUser);
          }
        }}
        onOpenAddMovie={handleOpenAddMovie}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onViewMyProfile={handleViewMyProfile}
        onReturnToLogin={() => setIsAuthenticated(false)}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 flex-1 relative z-10 w-full">
        {activeView === 'feed' && (
          <FeedView
            users={users}
            currentUser={currentUser}
            onSelectProfile={handleOpenProfile}
            onOpenAddMovie={handleOpenAddMovie}
            onExploreCommunity={() => setActiveView('community')}
          />
        )}

        {activeView === 'community' && (
          <CommunityView
            users={users}
            currentUser={currentUser}
            onSelectProfile={handleOpenProfile}
            onOpenAddMovie={handleOpenAddMovie}
          />
        )}

        {activeView === 'profile' && (
          <ProfileView
            profileUser={selectedProfileUser || currentUser}
            currentUser={currentUser}
            onOpenAddMovie={handleOpenAddMovie}
            onEditMovie={handleOpenEditMovie}
            onDeleteMovie={(movie) => setMovieToDelete(movie)}
            onAddComment={handleAddComment}
            onDeleteComment={handleDeleteComment}
            onBackToFeed={() => setActiveView('feed')}
            onSwitchToAnotherProfile={handleOpenProfile}
          />
        )}
      </main>

      {/* Modals */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        allUsers={users}
        onSelectUser={handleSelectUser}
        onRegisterUser={handleRegisterUser}
      />

      <MovieFormModal
        key={movieToEdit ? movieToEdit.id : 'create-movie-form'}
        isOpen={isMovieFormOpen}
        onClose={() => setIsMovieFormOpen(false)}
        movieToEdit={movieToEdit}
        onSaveMovie={handleSaveMovie}
      />

      <DeleteMovieModal
        isOpen={!!movieToDelete}
        onClose={() => setMovieToDelete(null)}
        movie={movieToDelete}
        onConfirmDelete={handleConfirmDeleteMovie}
      />

      {/* Cinematic Footer */}
      <footer className="border-t border-white/[0.08] bg-[#0b0f19] py-10 px-4 sm:px-6 lg:px-8 mt-16 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-[#94a3b8]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#111827] border border-[#a855f7]/40 flex items-center justify-center text-[#ddb7ff]">
              <Clapperboard className="w-4 h-4" />
            </div>
            <div>
              <p className="font-serif-cinema text-base font-bold text-white tracking-wide">
                CINE<span className="text-[#f97316]">LUMINA</span>
              </p>
              <p className="text-[11px] text-[#64748b]">
                O ponto de encontro dos apaixonados pela sétima arte.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => setActiveView('feed')}
              className="hover:text-white transition-colors"
            >
              Feed Social
            </button>
            <button
              onClick={() => setActiveView('community')}
              className="hover:text-white transition-colors"
            >
              Explorar Cinéfilos
            </button>
            <button
              onClick={handleViewMyProfile}
              className="hover:text-white transition-colors"
            >
              Meu Perfil
            </button>
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="hover:text-[#ddb7ff] transition-colors"
            >
              Trocar de Perfil
            </button>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="hover:text-[#f43f5e] transition-colors"
            >
              Sair para Tela de Login
            </button>
          </div>

          <div className="flex items-center gap-1.5 text-[11px]">
            <span>Feito com</span>
            <Heart className="w-3.5 h-3.5 text-[#f43f5e] fill-[#f43f5e]" />
            <span>para amantes de cinema</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
