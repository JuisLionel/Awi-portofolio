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
  return profile;
}

export default profile;