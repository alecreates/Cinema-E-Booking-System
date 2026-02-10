import React from 'react';
import styles from './HomePage.module.css'

function HomePage() {
  return (
    // This empty tag syntax is shorthand for <React.Fragment>
    <>
      <h1 className={styles.h1}>Home Page!!</h1>
    </>
  );
}

export default HomePage;