import { useState, useEffect } from 'react';
import { initialProjects } from '../data/mockData';

export const useProjects = () => {
  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem('projectTrackerData');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error parsing local storage data", e);
        return initialProjects;
      }
    }
    return initialProjects;
  });

  useEffect(() => {
    localStorage.setItem('projectTrackerData', JSON.stringify(projects));
  }, [projects]);

  const addProject = (project) => {
    setProjects(prev => [project, ...prev]);
  };

  const updateProject = (updatedProject) => {
    setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
  };

  const deleteProject = (id) => {
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  return { projects, addProject, updateProject, deleteProject };
};
