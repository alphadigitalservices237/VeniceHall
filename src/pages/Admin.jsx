import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  FaCheck,
  FaTimes,
  FaTrash,
  FaStar,
  FaUser,
  FaEnvelope,
  FaCalendar,
  FaEyeSlash,
  FaEye,
  FaBars,
  FaHome,
  FaComments,
  FaSignOutAlt,
  FaChartPie,
  FaClock
} from 'react-icons/fa';

import {
  getTestimonials,
  updateTestimonial,
  deleteTestimonial
} from '../services/testimonialService';

import ConfirmModal from '../components/ConfirmModal';

import '../styles/Admin.css';


const Admin = () => {

  const navigate = useNavigate();


  /* ============================================================
     AUTHENTIFICATION
  ============================================================ */

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [password, setPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState('');


  /* ============================================================
     AVIS
  ============================================================ */

  const [testimonials, setTestimonials] = useState([]);

  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState('pending');


  /* ============================================================
     ACTIONS
  ============================================================ */

  const [processingId, setProcessingId] = useState(null);

  const [actionError, setActionError] = useState('');


  /* ============================================================
     SIDEBAR MOBILE
  ============================================================ */

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);


  /* ============================================================
     MODALE CONFIRMATION
  ============================================================ */

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    id: null,
    action: null
  });


  /* ============================================================
     MOT DE PASSE ADMIN
  ============================================================ */

  const ADMIN_PASSWORD = 'Admin.venice-h@ll';


  /* ============================================================
     VERIFICATION SESSION
  ============================================================ */

  useEffect(() => {

    const auth = sessionStorage.getItem('adminAuth');

    if (auth === 'true') {

      setIsAuthenticated(true);

      loadTestimonials();

    } else {

      setLoading(false);

    }

  }, []);


  /* ============================================================
     CONNEXION
  ============================================================ */

  const handleLogin = (e) => {

    e.preventDefault();

    setError('');

    if (password === ADMIN_PASSWORD) {

      setIsAuthenticated(true);

      sessionStorage.setItem('adminAuth', 'true');

      setPassword('');

      loadTestimonials();

    } else {

      setError('Mot de passe incorrect. Veuillez réessayer.');

      setPassword('');

    }

  };


  /* ============================================================
     DECONNEXION
  ============================================================ */

  const handleLogout = () => {

    sessionStorage.removeItem('adminAuth');

    setIsAuthenticated(false);

    setPassword('');

    navigate('/');

  };


  /* ============================================================
     CHARGER LES AVIS
  ============================================================ */

  const loadTestimonials = async () => {

    setLoading(true);

    setActionError('');

    try {

      const data = await getTestimonials();

      setTestimonials(data);

    } catch (error) {

      console.error('Erreur:', error);

      setActionError(
        'Impossible de charger les avis. Veuillez réessayer.'
      );

    } finally {

      setLoading(false);

    }

  };


  /* ============================================================
     APPROUVER UN AVIS
  ============================================================ */

  const approveReview = async (id) => {

    setProcessingId(id);

    setActionError('');

    try {

      await updateTestimonial(id, {
        verified: true
      });

      await loadTestimonials();

    } catch (error) {

      console.error('Erreur:', error);

      setActionError(
        'Impossible d’approuver cet avis. Veuillez réessayer.'
      );

    } finally {

      setProcessingId(null);

    }

  };


  /* ============================================================
     OUVRIR LA MODALE
  ============================================================ */

  const openConfirmModal = (id, action) => {

    setConfirmModal({
      isOpen: true,
      id,
      action
    });

  };


  /* ============================================================
     FERMER LA MODALE
  ============================================================ */

  const closeConfirmModal = () => {

    setConfirmModal({
      isOpen: false,
      id: null,
      action: null
    });

  };


  /* ============================================================
     SUPPRIMER UN AVIS
  ============================================================ */

  const confirmDelete = async () => {

    if (!confirmModal.id) {
      return;
    }

    const id = confirmModal.id;

    setProcessingId(id);

    setActionError('');

    try {

      await deleteTestimonial(id);

      await loadTestimonials();

    } catch (error) {

      console.error('Erreur:', error);

      setActionError(
        'Impossible de supprimer cet avis. Veuillez réessayer.'
      );

    } finally {

      setProcessingId(null);

      closeConfirmModal();

    }

  };


  /* ============================================================
     REJETER UN AVIS
  ============================================================ */

  const rejectReview = (id) => {

    openConfirmModal(id, 'delete');

  };


  /* ============================================================
     ETOILES
  ============================================================ */

  const renderStars = (rating) => {

    return [...Array(5)].map((_, index) => (

      <FaStar
        key={index}
        className={
          index < rating
            ? 'star-filled'
            : 'star-empty'
        }
      />

    ));

  };


  /* ============================================================
     MENU MOBILE
  ============================================================ */

  const closeMobileMenu = () => {

    setMobileMenuOpen(false);

  };


  /* ============================================================
     STATISTIQUES
  ============================================================ */

  const pendingReviews =
    testimonials.filter(
      (testimonial) => !testimonial.verified
    );

  const approvedReviews =
    testimonials.filter(
      (testimonial) => testimonial.verified
    );


  /* ============================================================
     PAGE LOGIN
  ============================================================ */

  if (!isAuthenticated) {

    return (

      <div className="admin-login">

        <div className="admin-login-box">

          {/* Logo */}

          <div className="admin-login-logo">

            <div className="admin-logo-icon">
              VH
            </div>

            <span>
              VENICE HALL
            </span>

          </div>


          {/* Titre */}

          <h2 className="admin-title">

            <FaChartPie className="admin-icon" />

            Espace Administrateur

          </h2>


          <p>
            Veuillez entrer le mot de passe pour accéder
            au panneau d'administration.
          </p>


          {/* Erreur */}

          {error && (

            <div className="error-message">

              <FaTimes />

              <span>
                {error}
              </span>

            </div>

          )}


          {/* Formulaire */}

          <form onSubmit={handleLogin}>

            <div className="password-input-container">

              <input
                type={
                  showPassword
                    ? 'text'
                    : 'password'
                }

                placeholder="Mot de passe"

                value={password}

                onChange={(e) => {

                  setPassword(e.target.value);

                  if (error) {
                    setError('');
                  }

                }}

                className={
                  error
                    ? 'input-error'
                    : ''
                }

                autoComplete="current-password"

              />


              <span
                className="toggle-password"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
              >

                {showPassword
                  ? <FaEyeSlash />
                  : <FaEye />
                }

              </span>

            </div>


            <button
              type="submit"
              className="admin-login-button"
            >
              Se connecter
            </button>

          </form>

        </div>

      </div>

    );

  }


  /* ============================================================
     DASHBOARD
  ============================================================ */

  return (

    <div className="admin-layout">


      {/* ========================================================
          SIDEBAR
      ======================================================== */}

      {mobileMenuOpen && (

        <div
          className="admin-overlay"
          onClick={closeMobileMenu}
        />

      )}


      <aside
        className={`admin-sidebar ${
          mobileMenuOpen
            ? 'mobile-open'
            : ''
        }`}
      >

        {/* Brand */}

        <div className="admin-brand">

          <div className="admin-brand-icon">
            VH
          </div>

          <div>

            <strong>
              VENICE HALL
            </strong>

            <span>
              ADMINISTRATION
            </span>

          </div>

        </div>


        {/* Navigation */}

        <nav className="admin-navigation">

          <button
            className="admin-nav-item active"
            onClick={() => {

              setActiveTab('pending');

              closeMobileMenu();

            }}
          >

            <FaChartPie />

            <span>
              Tableau de bord
            </span>

          </button>


          <button
            className={`admin-nav-item ${
              activeTab === 'pending' ||
              activeTab === 'approved'
                ? 'active'
                : ''
            }`}
            onClick={() => {

              setActiveTab('pending');

              closeMobileMenu();

            }}
          >

            <FaComments />

            <span>
              Avis clients
            </span>

            {pendingReviews.length > 0 && (

              <span className="admin-nav-badge">
                {pendingReviews.length}
              </span>

            )}

          </button>


          <button
            className="admin-nav-item"
            onClick={() => navigate('/')}
          >

            <FaHome />

            <span>
              Voir le site
            </span>

          </button>

        </nav>


        {/* Déconnexion */}

        <div className="admin-sidebar-bottom">

          <button
            className="admin-logout"
            onClick={handleLogout}
          >

            <FaSignOutAlt />

            <span>
              Déconnexion
            </span>

          </button>

        </div>

      </aside>


      {/* ========================================================
          MAIN
      ======================================================== */}

      <main className="admin-main">


        {/* ======================================================
            TOPBAR
        ====================================================== */}

        <header className="admin-topbar">

          <button
            className="admin-menu-button"
            onClick={() =>
              setMobileMenuOpen(!mobileMenuOpen)
            }
          >

            <FaBars />

          </button>


          <div className="admin-topbar-title">

            <span>
              Espace sécurisé
            </span>

            <strong>
              Administration Venice Hall
            </strong>

          </div>


          <button
            className="admin-topbar-logout"
            onClick={handleLogout}
          >

            <FaSignOutAlt />

            <span>
              Déconnexion
            </span>

          </button>

        </header>


        {/* ======================================================
            CONTENU
        ====================================================== */}

        <div className="admin-content">


          {/* Welcome */}

          <section className="admin-welcome">

            <span className="admin-eyebrow">
              TABLEAU DE BORD
            </span>

            <h1>
              Bienvenue dans votre espace
              d'administration
            </h1>

            <p>
              Gérez les avis clients de Venice Hall
              depuis cet espace.
            </p>

          </section>


          {/* Erreur */}

          {actionError && (

            <div className="admin-action-error">

              <FaTimes />

              <span>
                {actionError}
              </span>

              <button
                onClick={() => setActionError('')}
              >
                Fermer
              </button>

            </div>

          )}


          {/* ====================================================
              STATISTIQUES
          ==================================================== */}

          <section className="admin-stats">


            {/* Total */}

            <div className="admin-stat-card total">

              <div className="admin-stat-icon">

                <FaComments />

              </div>

              <div>

                <span className="admin-stat-label">
                  Total des avis
                </span>

                <strong className="admin-stat-number">
                  {testimonials.length}
                </strong>

              </div>

            </div>


            {/* En attente */}

            <div className="admin-stat-card pending">

              <div className="admin-stat-icon">

                <FaClock />

              </div>

              <div>

                <span className="admin-stat-label">
                  En attente
                </span>

                <strong className="admin-stat-number">
                  {pendingReviews.length}
                </strong>

              </div>

            </div>


            {/* Approuvés */}

            <div className="admin-stat-card approved">

              <div className="admin-stat-icon">

                <FaCheck />

              </div>

              <div>

                <span className="admin-stat-label">
                  Avis approuvés
                </span>

                <strong className="admin-stat-number">
                  {approvedReviews.length}
                </strong>

              </div>

            </div>

          </section>


          {/* ====================================================
              AVIS CLIENTS
          ==================================================== */}

          <section className="admin-reviews-section">


            {/* Header */}

            <div className="admin-section-header">

              <h2>
                Avis clients
              </h2>

              <div className="admin-review-count">

                {testimonials.length}

                <span>
                  avis
                </span>

              </div>

            </div>


            {/* Tabs */}

            <div className="admin-tabs">

              <button
                className={`admin-tab ${
                  activeTab === 'pending'
                    ? 'active'
                    : ''
                }`}
                onClick={() =>
                  setActiveTab('pending')
                }
              >

                <FaClock />

                En attente

                <span>
                  {pendingReviews.length}
                </span>

              </button>


              <button
                className={`admin-tab ${
                  activeTab === 'approved'
                    ? 'active'
                    : ''
                }`}
                onClick={() =>
                  setActiveTab('approved')
                }
              >

                <FaCheck />

                Approuvés

                <span>
                  {approvedReviews.length}
                </span>

              </button>

            </div>


            {/* ==================================================
                LISTE
            ================================================== */}

            <div className="admin-reviews-list">


              {loading ? (

                <div className="admin-loading">

                  <div className="admin-spinner"></div>

                  <p>
                    Chargement des avis...
                  </p>

                </div>

              ) : (

                <>

                  {/* ============================================
                      AVIS EN ATTENTE
                  ============================================ */}

                  {activeTab === 'pending' && (

                    pendingReviews.length === 0 ? (

                      <div className="admin-empty">

                        <div className="admin-empty-icon">
                          <FaCheck />
                        </div>

                        <h3>
                          Aucun avis en attente
                        </h3>

                        <p>
                          Tous les avis clients ont
                          été traités.
                        </p>

                      </div>

                    ) : (

                      pendingReviews.map((review) => (

                        <div
                          key={review.id}
                          className="admin-review pending"
                        >

                          {/* Status */}

                          <div className="admin-review-status">

                            <span>
                              En attente
                            </span>

                          </div>


                          {/* Header */}

                          <div className="admin-review-header">

                            <div className="admin-review-user">

                              <div className="admin-user-avatar">

                                <FaUser />

                              </div>

                              <div>

                                <h3>
                                  {review.name}
                                </h3>

                                <div className="admin-review-stars">

                                  {renderStars(
                                    review.rating
                                  )}

                                </div>

                              </div>

                            </div>


                            <div className="admin-review-date">

                              <FaCalendar />

                              {new Date(
                                review.date
                              ).toLocaleDateString(
                                'fr-FR'
                              )}

                            </div>

                          </div>


                          {/* Email */}

                          <div className="admin-review-email">

                            <FaEnvelope />

                            {review.email ||
                              'Email non renseigné'}

                          </div>


                          {/* Commentaire */}

                          <p className="admin-review-comment">
                            {review.comment}
                          </p>


                          {/* Actions */}

                          <div className="admin-review-actions">

                            <button
                              className="admin-btn approve"
                              onClick={() =>
                                approveReview(
                                  review.id
                                )
                              }
                              disabled={
                                processingId ===
                                review.id
                              }
                            >

                              {processingId ===
                              review.id ? (

                                <>
                                  <span>
                                    Traitement...
                                  </span>
                                </>

                              ) : (

                                <>
                                  <FaCheck />
                                  Approuver
                                </>

                              )}

                            </button>


                            <button
                              className="admin-btn delete"
                              onClick={() =>
                                rejectReview(
                                  review.id
                                )
                              }
                              disabled={
                                processingId ===
                                review.id
                              }
                            >

                              <FaTimes />

                              Rejeter

                            </button>

                          </div>

                        </div>

                      ))

                    )

                  )}


                  {/* ============================================
                      AVIS APPROUVÉS
                  ============================================ */}

                  {activeTab === 'approved' && (

                    approvedReviews.length === 0 ? (

                      <div className="admin-empty">

                        <div className="admin-empty-icon">
                          <FaComments />
                        </div>

                        <h3>
                          Aucun avis approuvé
                        </h3>

                        <p>
                          Les avis approuvés apparaîtront
                          ici.
                        </p>

                      </div>

                    ) : (

                      approvedReviews.map((review) => (

                        <div
                          key={review.id}
                          className="admin-review approved"
                        >

                          {/* Status */}

                          <div className="admin-review-status">

                            <span>
                              Approuvé
                            </span>

                          </div>


                          {/* Header */}

                          <div className="admin-review-header">

                            <div className="admin-review-user">

                              <div className="admin-user-avatar">

                                <FaUser />

                              </div>

                              <div>

                                <h3>
                                  {review.name}
                                </h3>

                                <div className="admin-review-stars">

                                  {renderStars(
                                    review.rating
                                  )}

                                </div>

                              </div>

                            </div>


                            <div className="admin-review-date">

                              <FaCalendar />

                              {new Date(
                                review.date
                              ).toLocaleDateString(
                                'fr-FR'
                              )}

                            </div>

                          </div>


                          {/* Email */}

                          <div className="admin-review-email">

                            <FaEnvelope />

                            {review.email ||
                              'Email non renseigné'}

                          </div>


                          {/* Commentaire */}

                          <p className="admin-review-comment">
                            {review.comment}
                          </p>


                          {/* Action */}

                          <div className="admin-review-actions">

                            <button
                              className="admin-btn delete"
                              onClick={() =>
                                rejectReview(
                                  review.id
                                )
                              }
                              disabled={
                                processingId ===
                                review.id
                              }
                            >

                              <FaTrash />

                              Supprimer

                            </button>

                          </div>

                        </div>

                      ))

                    )

                  )}

                </>

              )}

            </div>

          </section>

        </div>

      </main>


      {/* ========================================================
          MODALE CONFIRMATION
      ======================================================== */}

      <ConfirmModal

        isOpen={
          confirmModal.isOpen
        }

        onClose={
          closeConfirmModal
        }

        onConfirm={
          confirmDelete
        }

        title="Supprimer l'avis ?"

        message="Cette action est irréversible. Êtes-vous sûr de vouloir supprimer cet avis définitivement ?"

        confirmText="Supprimer"

        cancelText="Annuler"

      />

    </div>

  );

};


export default Admin;