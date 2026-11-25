import { useEffect, useMemo, useState } from "react";
import "./App.css";

const API = "http://localhost:5001/api/contacts";

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  company: "",
  address: "",
};

function App() {
  const [contacts, setContacts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadContacts() {
    try {
      setLoading(true);
      setError("");
      const response = await fetch(API);
      if (!response.ok) throw new Error("Could not load contacts.");
      setContacts(await response.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadContacts();
  }, []);

  const filteredContacts = useMemo(() => {
    const term = search.toLowerCase().trim();
    return contacts.filter((contact) =>
      [contact.name, contact.email, contact.phone, contact.company]
        .some((value) => value?.toLowerCase().includes(term))
    );
  }, [contacts, search]);

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  function startEdit(contact) {
    setEditing(contact._id);
    setForm({
      name: contact.name || "",
      email: contact.email || "",
      phone: contact.phone || "",
      company: contact.company || "",
      address: contact.address || "",
    });
    setError("");
    setSuccess("");
    document.getElementById("contact-form")?.scrollIntoView({
      behavior: "smooth",
    });
  }

  function resetForm() {
    setForm(emptyForm);
    setEditing(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        editing ? `${API}/${editing}` : API,
        {
          method: editing ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Something went wrong.");

      setSuccess(editing ? "Contact updated successfully." : "Contact added successfully.");
      resetForm();
      await loadContacts();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function deleteContact(id) {
    if (!window.confirm("Are you sure you want to delete this contact?")) return;

    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${API}/${id}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Could not delete contact.");

      setSuccess("Contact deleted successfully.");
      if (editing === id) resetForm();
      await loadContacts();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">C</div>
          <span>Contact<span className="brand-light">Hub</span></span>
        </div>

        <p className="nav-label">WORKSPACE</p>
        <div className="nav-item active">
          <span>?</span> All Contacts
        </div>
        <div className="sidebar-bottom">
          <div className="profile-avatar">A</div>
          <div>
            <strong>My Workspace</strong>
            <small>Personal account</small>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <span>Workspace / Contacts</span>
          <span className="online-status">? System online</span>
        </header>

        <section className="page-heading">
          <div>
            <p className="eyebrow">CONTACT MANAGEMENT</p>
            <h1>Contacts</h1>
            <p className="subtitle">Manage and organize all your important connections.</p>
          </div>
          <button
            className="primary-button"
            onClick={() => {
              resetForm();
              document.getElementById("contact-form")?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            + Add Contact
          </button>
        </section>

        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon purple">?</div>
            <p>Total Contacts</p>
            <h2>{contacts.length}</h2>
            <small>Saved contacts</small>
          </div>
          <div className="stat-card">
            <div className="stat-icon green">?</div>
            <p>Database</p>
            <h2 className="connected">Connected</h2>
            <small>MongoDB database</small>
          </div>
          <div className="stat-card">
            <div className="stat-icon orange">?</div>
            <p>Search Results</p>
            <h2>{filteredContacts.length}</h2>
            <small>Matching contacts</small>
          </div>
        </section>

        {error && <div className="message error">{error}</div>}
        {success && <div className="message success">{success}</div>}

        <section className="content-card">
          <div className="section-heading">
            <div>
              <h2>Your Contacts</h2>
              <p>All your saved connections in one place.</p>
            </div>
            <input
              className="search-input"
              type="search"
              placeholder="Search contacts..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          {loading ? (
            <div className="empty-state">Loading contacts...</div>
          ) : filteredContacts.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">?</div>
              <h3>{search ? "No matching contacts" : "No contacts yet"}</h3>
              <p>{search ? "Try another search." : "Add your first contact to get started."}</p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>NAME</th>
                    <th>EMAIL</th>
                    <th>PHONE</th>
                    <th>COMPANY</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredContacts.map((contact) => (
                    <tr key={contact._id}>
                      <td>
                        <div className="person-cell">
                          <div className="person-avatar">
                            {contact.name?.charAt(0).toUpperCase()}
                          </div>
                          <strong>{contact.name}</strong>
                        </div>
                      </td>
                      <td>{contact.email}</td>
                      <td>{contact.phone}</td>
                      <td>{contact.company || "—"}</td>
                      <td>
                        <div className="actions">
                          <button className="edit-button" onClick={() => startEdit(contact)}>
                            Edit
                          </button>
                          <button className="delete-button" onClick={() => deleteContact(contact._id)}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="content-card form-card" id="contact-form">
          <div className="section-heading">
            <div>
              <h2>{editing ? "Edit Contact" : "Add New Contact"}</h2>
              <p>Enter the contact information below.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <label>
                Full Name *
                <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. John Doe" required />
              </label>
              <label>
                Email Address *
                <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="john@example.com" required />
              </label>
              <label>
                Phone Number *
                <input name="phone" value={form.phone} onChange={handleChange} placeholder="+234..." required />
              </label>
              <label>
                Company
                <input name="company" value={form.company} onChange={handleChange} placeholder="Company name" />
              </label>
              <label className="full-width">
                Address
                <input name="address" value={form.address} onChange={handleChange} placeholder="Contact address" />
              </label>
            </div>
            <div className="form-actions">
              {editing && (
                <button type="button" className="secondary-button" onClick={resetForm}>
                  Cancel
                </button>
              )}
              <button type="submit" className="primary-button" disabled={saving}>
                {saving ? "Saving..." : editing ? "Update Contact" : "Save Contact"}
              </button>
            </div>
          </form>
        </section>

        <footer>ContactHub · Built with React, Express and MongoDB</footer>
      </main>
    </div>
  );
}

export default App;
