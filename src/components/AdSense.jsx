import React, { useEffect } from 'react';

const AdSense = ({ slot, style, format = 'auto', responsive = 'true' }) => {
  useEffect(() => {
    try {
      if (window) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (err) {
      console.error('AdSense error:', err);
    }
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={style || { display: 'block' }}
      data-ad-client="ca-pub-2773109772362951"
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive={responsive}
    ></ins>
  );
};

export default AdSense;
