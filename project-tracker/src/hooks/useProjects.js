import { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, setDoc, deleteDoc, updateDoc, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { initialProjects } from '../data/mockData';

export const useProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const projectsRef = collection(db, 'projects');

    // Check if collection is empty, and seed it with mock data if it is
    const checkAndSeedData = async () => {
      try {
        const snapshot = await getDocs(projectsRef);
        if (snapshot.empty) {
          console.log("Projects collection is empty, seeding initial mock data...");
          for (const project of initialProjects) {
            // Use the project ID as the document ID for simplicity
            const docRef = doc(db, 'projects', project.id);
            await setDoc(docRef, project);
          }
        }
      } catch (error) {
        console.error("Error checking or seeding initial data:", error);
      }
    };

    checkAndSeedData();

    // Listen to real-time updates
    const unsubscribe = onSnapshot(projectsRef, (snapshot) => {
      const projectsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProjects(projectsData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching projects:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addProject = async (project) => {
    try {
      // Ensure we use the generated id or let firestore generate one.
      // If the project object has an ID, we use setDoc.
      // Project form modal typically generates an ID.
      if (project.id) {
        await setDoc(doc(db, 'projects', project.id), project);
      } else {
        // Fallback to let Firestore generate ID (though App should pass an id usually)
        const docRef = doc(collection(db, 'projects'));
        await setDoc(docRef, { ...project, id: docRef.id });
      }
    } catch (error) {
      console.error("Error adding project: ", error);
    }
  };

  const updateProject = async (updatedProject) => {
    try {
      const projectRef = doc(db, 'projects', updatedProject.id);
      await updateDoc(projectRef, updatedProject);
    } catch (error) {
      console.error("Error updating project: ", error);
    }
  };

  const deleteProject = async (id) => {
    try {
      await deleteDoc(doc(db, 'projects', id));
    } catch (error) {
      console.error("Error deleting project: ", error);
    }
  };

  return { projects, addProject, updateProject, deleteProject, loading };
};
