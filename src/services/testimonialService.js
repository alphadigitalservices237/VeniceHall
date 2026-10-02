import axios from 'axios';

const API_KEY = '$2a$10$ZN9CenkQtjxn9o55Y0JKa.9uKvk9INIHZs4pbrtBTnaVFVlZuh62G';
const BIN_ID = '69dcd76236566621a8aa7917';

const api = axios.create({
  baseURL: 'https://api.jsonbin.io/v3',
  headers: {
    'X-Master-Key': API_KEY,
    'Content-Type': 'application/json'
  }
});

// ============================================================
// RÉCUPÉRER TOUS LES AVIS
// ============================================================
export const getTestimonials = async () => {
  try {
    const response = await api.get(`/b/${BIN_ID}/latest`);

    return response.data.record.testimonials || [];

  } catch (error) {
    console.error('Erreur de chargement des avis :', error);
    throw error;
  }
};


// ============================================================
// AJOUTER UN AVIS
// ============================================================
export const addTestimonial = async (testimonial) => {
  try {
    const current = await getTestimonials();

    const updated = [testimonial, ...current];

    await api.put(`/b/${BIN_ID}`, {
      testimonials: updated
    });

    return testimonial;

  } catch (error) {
    console.error("Erreur d'ajout de l'avis :", error);
    throw error;
  }
};


// ============================================================
// MODIFIER UN AVIS
// ============================================================
export const updateTestimonial = async (id, data) => {
  try {
    const current = await getTestimonials();

    const updated = current.map((testimonial) =>
      testimonial.id === id
        ? { ...testimonial, ...data }
        : testimonial
    );

    await api.put(`/b/${BIN_ID}`, {
      testimonials: updated
    });

  } catch (error) {
    console.error("Erreur de mise à jour de l'avis :", error);
    throw error;
  }
};


// ============================================================
// SUPPRIMER UN AVIS
// ============================================================
export const deleteTestimonial = async (id) => {
  try {
    const current = await getTestimonials();

    const updated = current.filter(
      (testimonial) => testimonial.id !== id
    );

    await api.put(`/b/${BIN_ID}`, {
      testimonials: updated
    });

  } catch (error) {
    console.error("Erreur de suppression de l'avis :", error);
    throw error;
  }
};