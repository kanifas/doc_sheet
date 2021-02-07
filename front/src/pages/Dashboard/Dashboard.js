import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { useHttp } from '~/hooks/http.hook';
import { AuthContext } from '~/context/AuthContext';

export default function () {
  /*const history = useHistory();
  const auth = useContext(AuthContext);
  const { request } = useHttp();
  const [link, setLink] = useState('');

  const handleDown = async e => {
    if (e.key === 'Enter') {
      try {
        const result = await request(
          '/api/links/gen',
          'POST',
          { from: link },
          { Authorization: `Bearer ${auth.token}` }
        );
        history.push(`/detail/${result.link._id}`);
      } catch (err) {
      }
    }
  };*/

  return (
    <div>
      =======================================
      <h2>Dashboard</h2>
      =======================================
    </div>
  )
};
