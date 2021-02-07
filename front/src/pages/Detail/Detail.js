import React, { useState, useCallback, useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useHttp } from "~/hooks/http.hook";
import { AuthContext } from "~/context/AuthContext";
import Loader from '~/components/ui/Loader';

export default function() {
  const { jwt } = useContext(AuthContext);
  const { request, loading } = useHttp();
  const [ link, setLink ] = useState(null);
  const { id: linkId } = useParams();

  const getLink = useCallback(async () => {
    try {
      const fetched = await request(`/api/link/${linkId}`, 'GET', null, {
        Authorization: `Bearer ${jwt}`
      });
      setLink(fetched);
    } catch (err) {
      console.log(err);
    }
  }, [jwt, linkId, request]);

  useEffect(() => {
    getLink();
  }, [getLink]);

  if (loading) {
    return <Loader />
  }

  return (
    <>
      { !loading && link && '<LinkCard />' }
    </>
  )
};
