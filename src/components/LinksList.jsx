import { useState } from 'react';

function LinksList({ links, total, page, search, selectedSlug, onSearchChange, onPageChange, onSelectLink }) {
  const [showAll, setShowAll] = useState(false);

  const displayedLinks = showAll ? links : links.slice(0, 2);
  const hasMore = links.length > 2;

  return (
    <section className="panel">
      <div className="toolbar">
        <input
          value={search}
          onChange={(event) => {
            onSearchChange(event.target.value);
          }}
          placeholder="Search by slug or URL"
        />
        <span>{total} links</span>
      </div>

      <ul className="link-list">
        {displayedLinks.map((link) => (
          <li
            key={link.slug}
            className={selectedSlug === link.slug ? 'selected' : ''}
            onClick={() => onSelectLink(link.slug)}
          >
            <strong>{link.slug}</strong>
            <div>{link.destinationUrl}</div>
            <div>Status: {link.enabled ? 'Active' : 'Disabled'} · Clicks: {link.clickCount}</div>
          </li>
        ))}
      </ul>

      {hasMore && (
        <button className="show-more-btn" onClick={() => setShowAll(!showAll)}>
          {showAll ? 'Show Less' : `Show More (${links.length - 2} more)`}
        </button>
      )}

      <div className="pagination">
        <button disabled={page === 1} onClick={() => onPageChange(page - 1)}>
          Prev
        </button>
        <span>Page {page}</span>
        <button disabled={page * 5 >= total} onClick={() => onPageChange(page + 1)}>
          Next
        </button>
      </div>
    </section>
  );
}

export default LinksList;
