import { useEffect, useMemo, useState } from 'react';
import CreateLinkForm from './components/CreateLinkForm';
import LinksList from './components/LinksList';
import LinkDetails from './components/LinkDetails';

const API_BASE = 'http://localhost:3001/api';

function App() {
  const [links, setLinks] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedSlug, setSelectedSlug] = useState(null);
  const [selectedLink, setSelectedLink] = useState(null);
  const [form, setForm] = useState({ destinationUrl: '', slug: '', cap: '' });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const loadLinks = async () => {
    try {
      const response = await fetch(`${API_BASE}/links?search=${encodeURIComponent(search)}&page=${page}&limit=5`);
      if (!response.ok) throw new Error('Failed to fetch links');
      const data = await response.json();
      setLinks(data.items || []);
      setTotal(data.total || 0);
    } catch (error) {
      setMessage(`Error loading links: ${error.message}`);
      setLinks([]);
    }
  };

  useEffect(() => {
    loadLinks();
  }, [search, page]);

  const selectedSummary = useMemo(() => {
    return selectedLink ? [
      { label: 'Slug', value: selectedLink.slug },
      { label: 'Destination', value: selectedLink.destinationUrl },
      { label: 'Status', value: selectedLink.enabled ? 'Active' : 'Disabled' },
      { label: 'Click count', value: selectedLink.clickCount },
      { label: 'Cap', value: selectedLink.cap ?? 'No cap' },
    ] : [];
  }, [selectedLink]);

  const handleCreate = async (event) => {
    event.preventDefault();
    const payload = {
      destinationUrl: form.destinationUrl,
      slug: form.slug || undefined,
      cap: form.cap ? Number(form.cap) : undefined,
    };

    try {
      const response = await fetch(`${API_BASE}/links`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage(`Created ${data.slug}`);
        setForm({ destinationUrl: '', slug: '', cap: '' });
        setPage(1);
        loadLinks();
      } else {
        setMessage(data.error || 'Unable to create link');
      }
    } catch (error) {
      setMessage(`Error creating link: ${error.message}`);
    }
  };

  const handleSelect = async (slug) => {
    try {
      setSelectedSlug(slug);
      const response = await fetch(`${API_BASE}/links/${slug}`);
      if (!response.ok) throw new Error('Failed to fetch link');
      const data = await response.json();
      setSelectedLink(data);
    } catch (error) {
      setMessage(`Error loading link: ${error.message}`);
      setSelectedLink(null);
    }
  };

  const handleToggle = async () => {
    if (!selectedSlug || isLoading) return;
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE}/links/${selectedSlug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: !selectedLink.enabled }),
      });
      if (!response.ok) throw new Error('Failed to update link');
      const data = await response.json();
      setSelectedLink(data);
      setMessage(data.enabled ? 'Link enabled' : 'Link disabled');
      loadLinks();
    } catch (error) {
      setMessage(`Error updating link: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedSlug || isLoading) return;
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE}/links/${selectedSlug}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete link');
      setSelectedLink(null);
      setSelectedSlug(null);
      setMessage('Link deleted');
      loadLinks();
    } catch (error) {
      setMessage(`Error deleting link: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="app-shell">
      <CreateLinkForm
        form={form}
        message={message}
        onFormChange={setForm}
        onSubmit={handleCreate}
      />

      <LinksList
        links={links}
        total={total}
        page={page}
        search={search}
        selectedSlug={selectedSlug}
        onSearchChange={(newSearch) => {
          setSearch(newSearch);
          setPage(1);
        }}
        onPageChange={setPage}
        onSelectLink={handleSelect}
      />

      <LinkDetails
        selectedLink={selectedLink}
        selectedSummary={selectedSummary}
        isLoading={isLoading}
        onToggle={handleToggle}
        onDelete={handleDelete}
      />
    </main>
  );
}

export default App;
