import * as React from 'react'
import * as styles from './Home.css'

import Hello from '../components/Hello'
import Header from '../components/Header'
import Footer from '../components/Footer'

export const Home = () => {
  return (
    <div className={styles.App}>
      <Header />
      <Hello name="TypeScript" enthusiasmLevel={10} />
      <Footer />
    </div>
  )
}

export default Home
