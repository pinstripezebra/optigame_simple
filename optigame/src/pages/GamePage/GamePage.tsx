import React from 'react'
import { useParams } from 'react-router-dom';

const GamePage = () => {
  const { asin } = useParams<{ asin: string }>();

  return (
    <div>
      GamePage for ASIN: {asin}
      {/* You can now fetch and display game details using the asin */}
    </div>
  );
}

export default GamePage;