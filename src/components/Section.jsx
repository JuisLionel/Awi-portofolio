export default function Section({ id, className = "", children }) {
  return (
    <section id={id} className={`min-h-screen ${className}`}>
      {children}
    </section>
  );
}