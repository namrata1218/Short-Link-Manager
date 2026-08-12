function CreateLinkForm({ form, message, createdShortUrl, onFormChange, onSubmit }) {
  return (
    <section className="panel">
      <h1>Short Link Manager</h1>
      <p>Create and track campaign links from one place.</p>

      {/* The form posts destination URL, optional slug, and optional cap to the API. */}
      <form onSubmit={onSubmit} className="form-card">
        <label>
          Destination URL
          <input
            value={form.destinationUrl}
            onChange={(event) => onFormChange({ ...form, destinationUrl: event.target.value })}
            required
          />
        </label>
        <label>
          Custom slug
          <input
            value={form.slug}
            onChange={(event) => onFormChange({ ...form, slug: event.target.value })}
            placeholder=""
          />
        </label>
        <label>
          Click cap
          <input
            type="number"
            min="1"
            value={form.cap}
            onChange={(event) => onFormChange({ ...form, cap: event.target.value })}
            placeholder=""
          />
        </label>
        <button type="submit">Create link</button>
      </form>

      {message ? <p className="message">{message}</p> : null}
      {createdShortUrl ? <a className="short-url" href={createdShortUrl} target="_blank" rel="noreferrer">{createdShortUrl}</a> : null}
    </section>
  );
}

export default CreateLinkForm;
