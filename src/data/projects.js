import { useEffect, useState } from "react";
import { useLocation } from "react-router";

import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/context/useLanguage";

export async function fetchProjects() {
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.warn("Supabase projects fetch failed:", error.message);
    return [];
  }

  return Array.isArray(data) ? data : [];
}

export function useProjects() {
  const location = useLocation();
  const { language } = useLanguage();
  const [projectList, setProjectList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    fetchProjects()
      .catch((error) => {
        console.error("Unable to load projects:", error);
        return [];
      })
      .then((nextProjects) => {
        if (active) {
          setProjectList(nextProjects);
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (loading) return;

    window.dispatchEvent(
      new CustomEvent("portfolio:route-ready", {
        detail: { path: window.location.pathname },
      })
    );
  }, [loading, location.pathname]);

  const localizedProjects = projectList.map((project) => {
    const translation = project.translations?.[language];
    if (!translation) return project;

    return {
      ...project,
      title: translation.title || project.title,
      description: translation.description || project.description,
      role: translation.role || project.role,
      highlights: translation.highlights || project.highlights,
      status: translation.status || project.status,
    };
  });

  return { projects: localizedProjects, loading };
}

export const projects = [];
export default projects;
