import { useEffect, useState } from "react";

import { supabase } from "../src/lib/supabase";

export const profile = {
  available: true,
  labels: {
    badge: { on: "Available for work", off: "Not available" }, // Welcome badge
    card: { on: "Available", off: "Unavailable" }, // ID card
  },
};

export const available = profile.available;
export const labels = profile.labels;

export function useProfile() {
  const [profileData, setProfileData] = useState(profile);

  useEffect(() => {
    if (!supabase) return undefined;

    let active = true;

    supabase
      .from("profile")
      .select("available,email,phone,country,socials")
      .limit(1)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) {
          console.warn("Supabase profile fetch failed:", error.message);
          return;
        }

        if (active && data) {
          setProfileData((currentProfile) => ({
            ...currentProfile,
            ...data,
            available:
              typeof data.available === "boolean"
                ? data.available
                : currentProfile.available,
            socials: Array.isArray(data.socials) ? data.socials : [],
          }));
        }
      });

    return () => {
      active = false;
    };
  }, []);

  return profileData;
}

export default profile;