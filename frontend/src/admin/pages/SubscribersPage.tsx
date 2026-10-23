import { useEffect, useState } from 'react';
import { apiErrorMessage } from '../../lib/api';
import { adminApi, type Subscriber } from '../adminApi';

const date = new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium' });

export function SubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[] | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    adminApi
      .subscribers()
      .then(setSubscribers)
      .catch((err) => setError(apiErrorMessage(err)));
  }, []);

  const remove = async (subscriber: Subscriber) => {
    if (!window.confirm(`Remove ${subscriber.email}?`)) return;
    try {
      await adminApi.deleteSubscriber(subscriber._id);
      setSubscribers((list) => list?.filter((s) => s._id !== subscriber._id) ?? null);
    } catch (err) {
      setError(apiErrorMessage(err));
    }
  };

  return (
    <div className="a-page">
      <div className="a-page-head">
        <h1>Subscribers</h1>
        <button
          type="button"
          className="btn"
          onClick={() =>
            adminApi.downloadSubscribersCsv().catch((err) => setError(apiErrorMessage(err)))
          }
        >
          Export CSV
        </button>
      </div>
      {error && (
        <p className="field-error" role="alert">
          {error}
        </p>
      )}
      {!subscribers ? (
        <p>Loading…</p>
      ) : subscribers.length === 0 ? (
        <p className="a-note">No subscribers yet.</p>
      ) : (
        <table className="a-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Since</th>
              <th>
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {subscribers.map((subscriber) => (
              <tr key={subscriber._id}>
                <td>{subscriber.email}</td>
                <td>{date.format(new Date(subscriber.createdAt))}</td>
                <td className="a-actions">
                  <button type="button" className="a-danger" onClick={() => remove(subscriber)}>
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
