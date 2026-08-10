/** Temaya göre değişen dekoratif zemin katmanları. Tamamı CSS ile sürülür. */
export function Background() {
  return (
    <div className="bg-layers" aria-hidden="true">
      <div className="bg-rules" />
      <div className="bg-scanlines" />
      <div className="bg-vignette" />
      <div className="bg-grain" />
    </div>
  );
}
