import * as React from 'react'
import * as styles from './Home.css'

import Hello from '../components/Hello'
import Header from '../components/Header'
import Footer from '../components/Footer'

export const Home = () => {
  return (
    <div className={styles.App}>
      <Footer />
      <Hello name="TypeScript" enthusiasmLevel={10} />
      <Header />
    </div>
  )
}

export default Home
